import React, { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import debounce from "lodash/debounce";
import { loadFont } from "./three-utils";
import { loadBuildingData } from "./building-data";
import CameraControls from "./CameraControls";
import { BuildingControls } from "./BuildingControls";
import { Hideable } from "./Hideable";
import { Building } from "./Building";

THREE.Object3D.DefaultUp.set(0, 0, 1);

loadFont();

export default function App() {
  const [isBuildingSelected, setIsBuildingSelected] = useState(false);
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState(0);
  const [buildingParameters, setBuildingParameters] = useState([
    { width: 10000, height: 10000, roofAngle: 30 },
    { width: 10000, height: 10000, roofAngle: 30 },
    { width: 10000, height: 10000, roofAngle: 30 },
  ]);
  const [buildingData, setBuildingData] = useState();
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
          setIsBuildingSelected(false);
        }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight intensity={0.2} position={[1, 1, 1]} />
        {buildingData &&
          buildingData.items &&
          buildingData.items.length > 0 &&
          buildingData.items.map((data, index) => {
            return (
              <Building
                key={index}
                buildingData={data}
                isSelected={isBuildingSelected && selectedBuildingIndex === index}
                onSelect={() => {
                  setSelectedBuildingIndex(index);
                  setIsBuildingSelected(true);
                }}
              />
            );
          })}
        <CameraControls />
      </Canvas>

      <Hideable visible={isBuildingSelected}>
        <BuildingControls
          buildingParameters={selectedBuildingParameters}
          setBuildingParameters={setSelectedBuildingParameters}
          buildingData={selectedBuildingData}
        />
      </Hideable>
    </>
  );
}
