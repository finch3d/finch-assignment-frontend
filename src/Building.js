import React, { useEffect, useState } from "react";
import { generateBuildingGeometryFromData } from "./three-utils";

export function Building({ buildingData, onSelect, isSelected }) {
  const [geometry, setGeometry] = useState();

  useEffect(() => {
    setGeometry(generateBuildingGeometryFromData(buildingData, isSelected));
  }, [buildingData, isSelected]);

  if (!geometry) {
    return null;
  }

  return <primitive object={geometry} onClick={onSelect} />;
}
