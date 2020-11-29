import React, { useCallback, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import debounce from "lodash/debounce";
import {
  createPolyline,
  createText,
  generateBuildingGeometriesFromData,
  loadFont,
} from "./three-utils";
import { loadBuildingData } from "./building-data";
import CameraControls from "./CameraControls";
import { BuildingControls } from "./BuildingControls";
import { Hideable } from "./Hideable";

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
  const [selectedBuildingIndex, setSelectedBuildingIndex] = useState();
  const [buildingParameters, setBuildingParameters] = useState([
    { width: 10000, height: 10000, roofAngle: 30 },
    { width: 10000, height: 10000, roofAngle: 30 },
    { width: 10000, height: 10000, roofAngle: 30 },
  ]);
  const [buildingGeometries, setBuildingGeometries] = useState();
  const [sampleGeometries, setSampleGeometries] = useState([]);
  const selectedBuildingParameters =
    selectedBuildingIndex === undefined ? undefined : buildingParameters[selectedBuildingIndex];
  const setSelectedBuildingParameters = parameters => {
    if (selectedBuildingIndex === undefined) {
      throw new Error("No building selected");
    }
    const newBuildingParameters = buildingParameters.slice();
    newBuildingParameters[selectedBuildingIndex] = parameters;
    setBuildingParameters(newBuildingParameters);
  };

  const loadBuildingGeometries = useCallback(
    debounce(
      parameters => {
        loadBuildingData(parameters)
          .then(data => generateBuildingGeometriesFromData(data))
          .then(geometries => setBuildingGeometries(geometries));
      },
      500,
      { leading: false, trailing: true },
    ),
    [],
  );

  useEffect(() => {
    loadBuildingGeometries(buildingParameters);
  }, [loadBuildingGeometries, buildingParameters]);

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
          setSelectedBuildingIndex(undefined);
        }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight intensity={0.2} position={[1, 1, 1]} />
        <Group items={sampleGeometries} />
        {buildingGeometries &&
          buildingGeometries.length > 0 &&
          buildingGeometries.map((buildingGeometry, index) => {
            return (
              <primitive
                key={index}
                object={buildingGeometry}
                onClick={() => {
                  setSelectedBuildingIndex(index);
                }}
                onPointerOver={e => console.log("onPointerOver")}
                onPointerOut={e => console.log("onPointerOut")}
              />
            );
          })}
        <CameraControls />
      </Canvas>

      <Hideable visible={!!selectedBuildingParameters}>
        <BuildingControls
          buildingParameters={selectedBuildingParameters}
          setBuildingParameters={setSelectedBuildingParameters}
        />
      </Hideable>
    </>
  );
}
