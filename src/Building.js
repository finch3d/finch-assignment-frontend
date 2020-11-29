import React, { useEffect, useState } from "react";
import { generateBuildingGeometryFromData } from "./three-utils";

export function Building({ buildingData, onSelect }) {
  const [geometry, setGeometry] = useState();

  useEffect(() => {
    setGeometry(generateBuildingGeometryFromData(buildingData));
  }, [buildingData]);

  if (!geometry) {
    return null;
  }

  return <primitive object={geometry} onClick={onSelect} />;
}
