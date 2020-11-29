import * as THREE from "three";
import { Earcut } from "three/src/extras/Earcut";
import { formatArea } from "./format-number";

const NEUTRAL_LINE_COLOR = "lightgray";
const SELECTION_COLOR = "hotpink";
const TEXT_COLOR = "purple";
const TEXT_SIZE = 700;

let openSans;
export async function loadFont() {
  if (!openSans) {
    return new Promise(resolve => {
      new THREE.FontLoader().load("/OpenSans_Regular.json", resolve);
    }).then(loadedFont => {
      openSans = loadedFont;

      return openSans;
    });
  } else {
    return openSans;
  }
}

export function createText(
  text,
  position,
  { font = openSans, color = TEXT_COLOR, size = TEXT_SIZE } = {},
) {
  const tGeometry = new THREE.TextGeometry(text, {
    font,
    size,
    height: 10,
    bevelEnabled: false,
    curveSegments: 24,
  });
  const tMaterial = new THREE.MeshStandardMaterial({ color, side: THREE.DoubleSide });
  const tMesh = new THREE.Mesh(tGeometry, tMaterial);
  tMesh.position.set(...position);
  tMesh.rotateX(Math.PI / 2);
  return tMesh;
}

export function createMesh(vertices, color) {
  const tGeometry = new THREE.BufferGeometry();
  tGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3),
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

export function createPolyline(vertices, color) {
  const tGeometry = new THREE.BufferGeometry();
  tGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertices.flat()), 3),
  );

  const tLine = new THREE.Line(tGeometry, new THREE.LineBasicMaterial({ color }));
  return tLine;
}

export function generateGeometriesFromBuildingPart(buildingPart, isSelected) {
  const tBuildingPartGroup = new THREE.Group();
  if (buildingPart.tags.type === "floors") {
    // All floors are grouped
    buildingPart.items.forEach(floorGroup => {
      // Each individual floor is a group of polylines
      floorGroup.items.forEach(floorPolygon => {
        // Create mesh from closed polyline (easier to handle selection with a mesh)
        const vertices = floorPolygon.points.map(point => [point.x, point.y, point.z]);
        const triangleIndices = Earcut.triangulate(vertices.flat(Infinity), undefined, 3);
        const tMesh = createMesh(
          triangleIndices.map(index => vertices[index]),
          "gray",
        );
        tBuildingPartGroup.add(tMesh);

        if (isSelected) {
          const maxPointX = Math.max(...floorPolygon.points.map(point => point.x));
          const textAnchor = floorPolygon.points.find(point => point.x === maxPointX);
          const textPosition = [textAnchor.x + 300, textAnchor.y, textAnchor.z];
          const levelText = `Level ${floorGroup.tags.level} (${formatArea(floorGroup.tags.area)})`;
          const text = createText(levelText, textPosition);
          tBuildingPartGroup.add(text);
        }
      });
    });
  } else {
    buildingPart.items.forEach(polygon => {
      // Create line
      const vertices = polygon.points.map(point => [point.x, point.y, point.z]);
      const tLine = createPolyline(vertices, isSelected ? SELECTION_COLOR : NEUTRAL_LINE_COLOR);
      tBuildingPartGroup.add(tLine);
    });
  }

  return tBuildingPartGroup;
}

export function generateBuildingGeometryFromData(building, isSelected) {
  const tBuildingGroup = new THREE.Group();
  // Iterate building parts (roof, walls, base, floors)
  building.items.forEach(buildingPart => {
    const tBuildingPartGroup = generateGeometriesFromBuildingPart(buildingPart, isSelected);
    tBuildingGroup.add(tBuildingPartGroup);
  });

  return tBuildingGroup;
}
