import React from "react";
import { useSelector as useReduxSelector } from "react-redux";
import styles from "./info-area.module.css";

function updateBuildingsState(state) {
  return state.updateBuildingsState;
}

function activeBuildingState(state) {
  return state.activeBuildingState;
}

function currentInfoState(state) {
  return state.currentInfoState;
}

function InfoArea() {
  let { getBuildingsInProgress, getBuildingsError } = useReduxSelector(
    updateBuildingsState
  );

  let { activeIndex } = useReduxSelector(activeBuildingState);

  let { name, height, area } = useReduxSelector(currentInfoState);

  let error = getBuildingsError;
  let loading = getBuildingsInProgress;

  return (
    <div className={styles.wrapper}>
      {loading || error ? (
        <div className={styles.info}>
          {loading && <div>Loading</div>}
          {error && <div className={styles.error}>{error}</div>}
        </div>
      ) : (
        <div>
          {activeIndex !== null && (
            <div className={styles.info}>
              <div>
                <span className={styles.label}>Name:</span> {name}
              </div>
              <div>
                <span className={styles.label}>Area:</span> {area}
              </div>
              <div>
                <span className={styles.label}>Height:</span> {height}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InfoArea;
