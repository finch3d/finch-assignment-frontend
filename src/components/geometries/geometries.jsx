import React, { useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Earcut } from "three/src/extras/Earcut";

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

function generateGeometriesFromBuildingPart(buildingPart) {
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
      const tLine = createPolyline(vertices, "lightgray");
      tBuildingPartGroup.add(tLine);
    });
  }

  return tBuildingPartGroup;
}

function generateBuildingGeometriesFromData(data) {
  // Iterate buildings, convert each building into a group of lines
  const buildingGeometries = data.map((building) => {
    const tBuildingGroup = new THREE.Group();
    // Iterate building parts (roof, walls, base, floors)
    building.items.forEach((buildingPart) => {
      const tBuildingPartGroup = generateGeometriesFromBuildingPart(
        buildingPart
      );
      tBuildingGroup.add(tBuildingPartGroup);
    });
    return tBuildingGroup;
  });

  return buildingGeometries;
}

function Geometries({ buildings, activeIndex, onSetActive }) {
  let [geometries, setGeometries] = useState(null);

  const setActiveColor = useCallback((activeBuilding) => {
    activeBuilding.children.forEach((geometry) => {
      geometry.children.forEach((part) => {
        if (part.type === "Mesh") {
          part.material.color.setHex(0x9c7cde);
        } else if (part.type === "Line") {
          part.material.color.setHex(0xcab9ed);
        }
      });
    });
  }, []);

  useEffect(() => {
    setGeometries(generateBuildingGeometriesFromData(buildings));
  }, [buildings]);

  useEffect(() => {
    if (activeIndex !== null && geometries[activeIndex]) {
      let activeBuilding = geometries[activeIndex];
      setActiveColor(activeBuilding);
    }
  }, [activeIndex, geometries, onSetActive, setActiveColor]);

  function handleActive(index) {
    if (activeIndex !== null) {
      geometries[activeIndex].children.forEach((geometry) => {
        geometry.children.forEach((part) => {
          if (part.type === "Mesh") {
            part.material.color.setHex(0x808080);
          } else if (part.type === "Line") {
            part.material.color.setHex(0xd3d3d3);
          }
        });
      });
    }

    if (index === activeIndex) {
      onSetActive(null);
      return;
    }
    onSetActive(index);
  }

  return (
    <>
      {geometries &&
        geometries.length > 0 &&
        geometries.map((geometry, index) => {
          return (
            <primitive
              scale={[1, 1, 1]}
              key={index}
              object={geometry}
              onClick={() => handleActive(index)}
            />
          );
        })}
    </>
  );
}

export default Geometries;
