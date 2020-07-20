import React, { useRef, useEffect } from "react";
import { useFrame, extend, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

const CameraControls = () => {
  const {
    camera,
    gl: { domElement },
    invalidate
  } = useThree();

  function onChange() {
    invalidate();
  }

  const controls = useRef();
  useEffect(() => {
    if (!controls.current) return;

    controls.current.addEventListener("change", onChange);
  }, [controls, onChange]);

  // Ref to the controls, so that we can update them on every frame using useFrame

  useFrame(() => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableZoom={true}
      onChange={onChange}
      onCreated={onChange}
      autoRotate={false}
    />
  );
};

export default CameraControls;
