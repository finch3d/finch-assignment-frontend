import React, { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { Earcut } from "three/src/extras/Earcut";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";

THREE.Object3D.DefaultUp.set(0, 0, 1);

async function loadData(settings) {
  const response = await fetch(`http://localhost:1337/data`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  const result = await response.json();
  return result;
}

let font;
async function loadFont() {
  if (!font) {
    return new Promise((resolve) => {
      new THREE.FontLoader().load("/OpenSans_Regular.json", resolve);
    }).then((loadedFont) => {
      font = loadedFont;

      return font;
    });
  } else {
    return font;
  }
}

function createText(text, color, font, position, size = 2000) {
  const tGeometry = new THREE.TextGeometry(text, {
    font: font,
    size,
    height: 10,
    bevelEnabled: false,
    curveSegments: 24,
  });
  const tMaterial = new THREE.MeshStandardMaterial({
    color,
    side: THREE.DoubleSide,
  });
  const tMesh = new THREE.Mesh(tGeometry, tMaterial);
  tMesh.position.set(...position);
  tMesh.rotateX(Math.PI / 2);
  return tMesh;
}

function createFloorText(floorMesh, tags) {
  const group = new THREE.Group();
  const vertex = new THREE.Vector3();
  const positionAttribute = floorMesh.geometry.getAttribute("position");

  Array(positionAttribute.count)
    .fill(null)
    .forEach((_, i) => {
      vertex.fromBufferAttribute(positionAttribute, i);
    });

  const area = `${Math.floor(tags.area / 1000)} kx2`;

  const levelText = createText(tags.level.toString(), "purple", font, [
    vertex.x,
    vertex.y,
    vertex.z,
  ]);
  const areaText = createText(
    area,
    "purple",
    font,
    [vertex.x + 2000, vertex.y, vertex.z],
    1000
  );

  group.add(levelText);
  group.add(areaText);

  return group;
}

function createMesh(vertices, color) {
  const tGeometry = new THREE.BufferGeometry();
  tGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3)
  );
  const tMaterial = new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.75,
    color: color,
    side: THREE.DoubleSide,
  });
  const tMesh = new THREE.Mesh(tGeometry, tMaterial);
  tMesh.geometry.computeVertexNormals();
  tMesh.geometry.computeFaceNormals();

  return tMesh;
}

function createPolyline(vertices, color) {
  const tGeometry = new THREE.BufferGeometry();
  tGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3)
  );

  const tLine = new THREE.Line(
    tGeometry,
    new THREE.LineBasicMaterial({ color })
  );
  return tLine;
}

function generateGeometriesFromBuildingPart(buildingPart, isActive) {
  const tBuildingPartGroup = new THREE.Group();
  if (buildingPart.tags.type === "floors") {
    // All floors are grouped
    buildingPart.items.forEach((floorGroup) => {
      // Each individual floor is a group of polylines
      floorGroup.items.forEach((floorPolygon) => {
        // Create mesh from closed polyline (easier to handle selection with a mesh)
        const vertices = floorPolygon.points.map((point) => [
          point.x,
          point.y,
          point.z,
        ]);
        const triangleIndices = Earcut.triangulate(
          vertices.flat(Infinity),
          undefined,
          3
        );
        const tMesh = createMesh(
          triangleIndices.map((index) => vertices[index]),
          "gray"
        );

        tBuildingPartGroup.add(tMesh);

        if (isActive) {
          const levelText = createFloorText(tMesh, floorGroup.tags);
          tBuildingPartGroup.add(levelText);
        }
      });
    });
  } else {
    buildingPart.items.forEach((polygon) => {
      // Create line
      const vertices = polygon.points.map((point) => [
        point.x,
        point.y,
        point.z,
      ]);
      const color = isActive ? "purple" : "lightgray";
      const tLine = createPolyline(vertices, color);
      tBuildingPartGroup.add(tLine);
    });
  }

  return tBuildingPartGroup;
}

function Controls(props) {
  const { setting, buildingNode } = props;

  const handleChange = (e) => {
    if (!e.target) {
      return;
    }
    const next = { ...setting, [e.target.name]: e.target.value };
    props.onChange(next);
  };

  return (
    <div className="controls">
      <div>
        <h3 style={{ marginTop: 0, marginBottom: "0.5em" }}>
          {buildingNode.tags.name}
        </h3>
        <div className="mb-1">
          <div>Area</div>
          <div>
            <small>{buildingNode.tags.area} x2</small>
          </div>
        </div>
        <div className="mb-1">
          <div>Height</div>
          <input
            type="text"
            name="height"
            value={setting.height}
            onChange={handleChange}
          />
        </div>
        <div className="mb-1">
          <div>Width</div>
          <input
            type="text"
            name="width"
            value={setting.width}
            onChange={handleChange}
          />
        </div>
        <div>
          <div>Roof Angle</div>
          <input
            type="text"
            name="roofAngle"
            value={setting.roofAngle}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

function generateBuildingGeometriesFromData(data, activeIdx) {
  // Iterate buildings, convert each building into a group of lines
  const buildingGeometries = data.items.map((building, idx) => {
    const isActive = idx === activeIdx;
    const tBuildingGroup = new THREE.Group();

    // Iterate building parts (roof, walls, base, floors)
    building.items.forEach((buildingPart) => {
      const tBuildingPartGroup = generateGeometriesFromBuildingPart(
        buildingPart,
        isActive
      );
      tBuildingGroup.add(tBuildingPartGroup);
    });

    return tBuildingGroup;
  });

  return buildingGeometries;
}

function useDebouncer() {
  const [currTimeout, setCurrTimeout] = useState(null);

  return (fn, offset) => {
    currTimeout && clearTimeout(currTimeout);
    const timeout = setTimeout(fn, offset);
    setCurrTimeout(timeout);
  };
}

function useBuildingNodes(settings) {
  const [buildingNodes, setBuildingNodes] = useState(null);
  const debounce = useDebouncer();

  useEffect(() => {
    debounce(() => loadData(settings).then(setBuildingNodes), 500);
  }, [settings]);

  return buildingNodes;
}

export function useBuildingGeometries(buildingNodes, activeIdx) {
  return useMemo(() => {
    if (!buildingNodes) {
      return;
    }
    return generateBuildingGeometriesFromData(buildingNodes, activeIdx);
  }, [buildingNodes, activeIdx]);
}

export default function App() {
  const [settings, setSettings] = useState(() => {
    return [
      {
        height: 10000,
        width: 10000,
        roofAngle: 50,
      },
      {
        height: 10000,
        width: 10000,
        roofAngle: 50,
      },
      {
        height: 10000,
        width: 10000,
        roofAngle: 50,
      },
    ];
  });
  const [active, setActive] = useState(null);
  const buildingNodes = useBuildingNodes(settings);
  const buildingGeometries = useBuildingGeometries(buildingNodes, active);

  useEffect(() => {
    loadFont().then((font) => {
      // Do nothing ..
    });
  }, []);

  const handleChangeSettings = (idx) => (setting) => {
    setSettings((current) => {
      const next = { ...current };
      next[idx] = setting;
      return next;
    });
  };

  return (
    <div>
      {typeof active === "number" && (
        <Controls
          setting={settings[active]}
          buildingNode={buildingNodes.items[active]}
          onChange={handleChangeSettings(active)}
        />
      )}
      <Canvas
        style={{ height: "100vh" }}
        camera={{
          up: [0, 0, 1],
          position: [20000, 20000, 20000],
          near: 1000,
          far: 400000,
          fov: 70,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#eeeeee");
        }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight intensity={0.2} position={[1, 1, 1]} />
        {buildingGeometries &&
          buildingGeometries.length > 0 &&
          buildingGeometries.map((buildingGeometry, index) => {
            return (
              <primitive
                key={index}
                object={buildingGeometry}
                onClick={() => setActive(index)}
              />
            );
          })}
        <CameraControls />
      </Canvas>
    </div>
  );
}
