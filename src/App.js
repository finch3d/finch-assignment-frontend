import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { Earcut } from "three/src/extras/Earcut";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";

THREE.Object3D.DefaultUp.set(0, 0, 1);

async function loadData() {
  const response = await fetch(
    `/buildings.json`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      }
    },
  );

  const result = await response.json();
  return result;
}

let font;
async function loadFont() {
  if (!font) {
    return new Promise(resolve => {
      new THREE.FontLoader().load('/OpenSans_Regular.json', resolve);
    })
    .then(loadedFont => {
      font = loadedFont;

      return font;
    });
  } else {
    return font;
  }
}

function createText(text, color, font, position) {
  const tGeometry = new THREE.TextGeometry(
    text,
    {
      font: font,
      size: 2000,
      height: 10,
      bevelEnabled: false,
      curveSegments: 24
    }
  );
  const tMaterial = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
  const tMesh = new THREE.Mesh(tGeometry, tMaterial);
  tMesh.position.set(...position);
  tMesh.rotateX( Math.PI / 2 );
  return tMesh;
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
    side: THREE.DoubleSide
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

  const tLine = new THREE.Line(tGeometry, new THREE.LineBasicMaterial({ color }));
  return tLine;
}

function generateGeometriesFromBuildingPart(buildingPart) {
  const tBuildingPartGroup = new THREE.Group();
  if (buildingPart.tags.type === 'floors') {
    // All floors are grouped
    buildingPart.items.forEach(floorGroup => {
      // Each individual floor is a group of polylines
      floorGroup.items.forEach(floorPolygon => {
        // Create mesh from closed polyline (easier to handle selection with a mesh)
        const vertices = floorPolygon.points.map(point => [point.x, point.y, point.z]);
        const triangleIndices = Earcut.triangulate(vertices.flat(Infinity), undefined, 3);
        const tMesh = createMesh(triangleIndices.map(index => vertices[index]), 'gray');
        tBuildingPartGroup.add(tMesh);
      });
    });
  } else {
    buildingPart.items.forEach(polygon => {
      // Create line
      const vertices = polygon.points.map(point => [point.x, point.y, point.z]);
      const tLine = createPolyline(vertices, 'lightgray');
      tBuildingPartGroup.add(tLine);
    });
  }

  return tBuildingPartGroup;
}

function generateBuildingGeometriesFromData(data) {
  // Iterate buildings, convert each building into a group of lines
  const buildingGeometries = data.items.map(building => {
    const tBuildingGroup = new THREE.Group();
    // Iterate building parts (roof, walls, base, floors)
    building.items.forEach(buildingPart => {
      const tBuildingPartGroup = generateGeometriesFromBuildingPart(buildingPart);
      tBuildingGroup.add(tBuildingPartGroup);
    });

    return tBuildingGroup;
  });

  return buildingGeometries;
}

function Group(props) {
  return (
    <group {...props}>
      { props.items &&
        props.items.map((tObject, index) => {
          return <primitive key={ index } object={ tObject } />;
        })
      }
    </group>
  );
}

export default function App() {

  const [buildingGeometries, setBuildingGeometries] = useState();
  const [sampleGeometries, setSampleGeometries] = useState([]);

  useEffect(() => {
    loadData()
      .then(data => generateBuildingGeometriesFromData(data))
      .then(geometries => setBuildingGeometries(geometries));
  }, []);

  useEffect(() => {
    loadFont()
      .then(font => {
        // Sample threejs objects
        setSampleGeometries([
          createPolyline(
            [
              [0, 10000, 0],
              [10000, 10000, 0],
              [10000, 10000, 10000],
              [0, 10000, 10000],
              [0, 10000, 0]
            ],
            "hotpink"
          ),
          createText("sample", "purple", font, [0, 10000, 10000])
        ]);
      });
  }, []);

  return (
    <Canvas style = {{ height: 600 }}
    camera = {{
      up: [0, 0, 1],
      position: [20000, 20000, 20000],
      near: 1000,
      far: 400000,
      fov: 70
    }}
    onCreated = {({ gl }) => {
      gl.setClearColor("#eeeeee");
    }}>
      <ambientLight intensity={ 1.0 } />
      <directionalLight intensity={ 0.2 } position = { [1, 1, 1] } />
      <Group
        items={ sampleGeometries }
      />
      { buildingGeometries && buildingGeometries.length > 0 &&
        buildingGeometries.map((buildingGeometry, index) => {
          return <primitive
            key={ index }
            object={ buildingGeometry }
            onClick={ e => console.log("onClick") }
            onPointerOver={ e => console.log("onPointerOver") }
            onPointerOut={ e => console.log("onPointerOut") } />;
        })
      }
      <CameraControls / >
    </Canvas>
  );
}
