import React from "react";
import classnames from "classnames";
import { useDispatch, useSelector as useReduxSelector } from "react-redux";
import * as UpdateBuildingsStar from "../../sagas-actions-reducers/updateBuildingsStar";
import Input from "../input/input";
import styles from "./panel.module.css";

function activeBuildingState(state) {
  return state.activeBuildingState;
}
function currentInfoState(state) {
  return state.currentInfoState;
}

function Panel() {
  const dispatch = useDispatch();
  let { activeIndex } = useReduxSelector(activeBuildingState);
  let { height } = useReduxSelector(currentInfoState);
  let isActive = activeIndex !== null;

  function handleSubmitHeight(height) {
    dispatch(UpdateBuildingsStar.updateBuildings({ height, activeIndex }));
  }

  return (
    <div
      className={classnames(styles.panel, {
        [styles.activePanel]: isActive,
      })}
    >
      <div
        className={classnames(styles.title, {
          [styles.activeTitle]: isActive,
        })}
      >
        Edit building
      </div>
      {!isActive ? (
        <p>Click on a building to view/edit</p>
      ) : (
        <div>
          <Input
            label={"Height"}
            placeholder={height}
            onSubmit={handleSubmitHeight}
          />
        </div>
      )}
    </div>
  );
}

export default Panel;
