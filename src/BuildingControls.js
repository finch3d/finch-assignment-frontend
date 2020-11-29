import React from "react";
import "./BuildingControls.css";

export function BuildingControls({ buildingParameters, setBuildingParameters, buildingData }) {
  const buildingName = buildingData ? buildingData.tags.name : "";

  return (
    <div className="BuildingControls">
      <h2 className="BuildingControls__heading">Building "{buildingName}"</h2>
      <label className="BuildingControls__label">
        Width:
        <input
          type="range"
          min={1000}
          max={100000}
          value={buildingParameters.width}
          onChange={e =>
            setBuildingParameters({
              ...buildingParameters,
              width: e.target.value,
            })
          }
        />
      </label>

      <label className="BuildingControls__label">
        Height:
        <input
          type="range"
          min={1000}
          max={100000}
          value={buildingParameters.height}
          onChange={e =>
            setBuildingParameters({
              ...buildingParameters,
              height: e.target.value,
            })
          }
        />
      </label>

      <label className="BuildingControls__label">
        Roof angle:
        <input
          type="range"
          min={0}
          max={180}
          value={buildingParameters.roofAngle}
          onChange={e =>
            setBuildingParameters({
              ...buildingParameters,
              roofAngle: e.target.value,
            })
          }
        />
      </label>

      {buildingData && (
        <div className="BuildingControls__data">
          Total area: {new Intl.NumberFormat().format(buildingData.tags.area / 1000000)} m
          <sup>2</sup>
        </div>
      )}
    </div>
  );
}

BuildingControls.defaultProps = {
  buildingParameters: {},
};
