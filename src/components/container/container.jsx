import React from "react";
import Canvas from "../canvas/canvas";
import InfoArea from "../info-area/info-area";
import Panel from "../panel/panel";
import styles from "./container.module.css";

function Container() {
  return (
    <div className={styles.container}>
      <div className={styles.canvasArea}>
        <InfoArea />
        <Canvas />
      </div>
      <Panel />
    </div>
  );
}

export default Container;
