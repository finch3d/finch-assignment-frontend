import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import { useDispatch, useSelector as useReduxSelector } from "react-redux";
import * as ActiveBuildingStar from "../../sagas-actions-reducers/activeBuildingStar";
import * as UpdateBuildingsStar from "../../sagas-actions-reducers/updateBuildingsStar";
import * as CurrentInfoStar from "../../sagas-actions-reducers/currentInfoStar";
import Geometries from "../geometries/geometries";
import CameraControls from "../../controls/CameraControls";
import styles from "./canvas.module.css";

THREE.Object3D.DefaultUp.set(0, 0, 1);

function updateBuildingsState(state) {
  return state.updateBuildingsState;
}

function activeBuildingState(state) {
  return state.activeBuildingState;
}

function CanvasWrapper() {
  const dispatch = useDispatch();
  let { buildings } = useReduxSelector(updateBuildingsState);
  let { activeIndex } = useReduxSelector(activeBuildingState);

  useEffect(() => {
    dispatch(UpdateBuildingsStar.updateBuildings());
  }, [dispatch]);

  useEffect(() => {
    if (activeIndex !== null) {
      let activeBuildingData = buildings[activeIndex];
      if (activeBuildingData) {
        let roofData = activeBuildingData.items.find((item) => {
          return item.tags.type === "roof";
        });

        let height = roofData.items[0].points.reduce((prev, current) => {
          return prev.z > current.z ? prev : current;
        }).z;

        let name = activeBuildingData.tags.name;
        let area = activeBuildingData.tags.area;

        dispatch(CurrentInfoStar.setInfo({ height, name, area }));
      }
    }
  }, [buildings, activeIndex, dispatch]);

  function handleSetActive(index) {
    if (index === null) {
      dispatch(ActiveBuildingStar.RemoveActive());
    } else {
      dispatch(ActiveBuildingStar.setActive({ index }));
    }
  }
  return (
    <Canvas
      className={styles.canvas}
      camera={{
        up: [0, 0, 1],
        position: [20000, 0, 20000],
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
      <Geometries
        buildings={buildings}
        activeIndex={activeIndex}
        onSetActive={handleSetActive}
      />
      <CameraControls />
    </Canvas>
  );
}

export default CanvasWrapper;
