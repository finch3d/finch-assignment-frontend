import React, { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import debounce from "lodash/debounce";
import { createPolyline, createText, loadFont } from "./three-utils";
import { loadBuildingData } from "./building-data";
import CameraControls from "./CameraControls";
import { BuildingControls } from "./BuildingControls";
import { Hideable } from "./Hideable";
import { Building } from "./Building";

THREE.Object3D.DefaultUp.set(0, 0, 1);

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
  const [showBuildingControls, setShowBuildingControls] = useState(false);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);
  const [buildingParameters, setBuildingParameters] = useState([
    { width: 10000, height: 10000, roofAngle: 30 },
    { width: 10000, height: 10000, roofAngle: 30 },
    { width: 10000, height: 10000, roofAngle: 30 },
  ]);
  const [buildingData, setBuildingData] = useState();
  const [sampleGeometries, setSampleGeometries] = useState([]);
  const selectedBuildingParameters = buildingParameters[selectedBuildingIndex];
  const selectedBuildingData = buildingData && buildingData.items[selectedBuildingIndex];
  const setSelectedBuildingParameters = parameters => {
    const newBuildingParameters = buildingParameters.slice();
    newBuildingParameters[selectedBuildingIndex] = parameters;
    setBuildingParameters(newBuildingParameters);
  };

  const reloadBuildingData = useCallback(
    debounce(parameters => loadBuildingData(parameters).then(data => setBuildingData(data)), 500, {
      leading: false,
      trailing: true,
    }),
    [],
  );

  useEffect(() => {
    reloadBuildingData(buildingParameters);
  }, [reloadBuildingData, buildingParameters]);

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
    <>
      <Canvas
        style={{ height: 600 }}
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
        onPointerMissed={() => {
          setShowBuildingControls(false);
        }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight intensity={0.2} position={[1, 1, 1]} />
        <Group items={sampleGeometries} />
        {buildingData &&
          buildingData.items &&
          buildingData.items.length > 0 &&
          buildingData.items.map((data, index) => {
            return (
              <Building
                key={index}
                buildingData={data}
                onSelect={() => {
                  setSelectedBuildingIndex(index);
                  setShowBuildingControls(true);
                }}
              />
            );
          })}
        <CameraControls />
      </Canvas>

      <Hideable visible={showBuildingControls}>
        <BuildingControls
          buildingParameters={selectedBuildingParameters}
          setBuildingParameters={setSelectedBuildingParameters}
          buildingData={selectedBuildingData}
        />
      </Hideable>
    </>
  );
}
