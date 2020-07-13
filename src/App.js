import React from "react";
import * as THREE from "three";
import { Canvas } from "react-three-fiber";
import CameraControls from "./CameraControls";

function Group(props) {
  return (
    <group {...props}>
      {props.items &&
        props.items.map((tMesh, index) => {
          return <primitive key={index} object={tMesh} />;
        })}
    </group>
  );
}

function createMesh(vertices, color) {
  const tGeometry = new THREE.BufferGeometry();
  tGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3)
  );
  const tMaterial = new THREE.MeshStandardMaterial({
    color: color,
    side: THREE.DoubleSide
  });
  const tMesh = new THREE.Mesh(tGeometry, tMaterial);
  tMesh.geometry.computeVertexNormals();
  tMesh.geometry.computeFaceNormals();

  return tMesh;
}

export default function App() {
  const mesh1 = createMesh(
    [[0, 0, 0], [10000, 0, 10000], [10000, 0, 0]],
    "orange"
  );
  const mesh2 = createMesh(
    [[0, 0, 0], [0, 0, 10000], [10000, 0, 10000]],
    "green"
  );
  const mesh3 = createMesh(
    [
      [0, 10000, 0],
      [10000, 10000, 10000],
      [10000, 10000, 0],
      [0, 10000, 0],
      [0, 10000, 10000],
      [10000, 10000, 10000]
    ],
    "hotpink"
  );
  const meshes = [mesh1, mesh2, mesh3];

  return (
    <Canvas
      style={{ height: 600 }}
      camera={{
        up: [0, 0, 1],
        position: [20000, 20000, 20000],
        near: 1000,
        far: 100000,
        fov: 70
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#eeeeee");
      }}
    >
      <ambientLight intensity={1.0} />
      <Group
        onClick={e => console.log("onClick")}
        onPointerOver={e => console.log("onPointerOver")}
        onPointerOut={e => console.log("onPointerOut")}
        items={meshes}
      />
      <CameraControls />
    </Canvas>
  );
}
