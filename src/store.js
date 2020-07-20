import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import * as UpdateBuildingsStar from "./sagas-actions-reducers/updateBuildingsStar";
import * as ActiveBuildingStar from "./sagas-actions-reducers/activeBuildingStar";
import * as CurrentInfoStar from "./sagas-actions-reducers/currentInfoStar";

const rootReducer = combineReducers({
  updateBuildingsState: UpdateBuildingsStar.reducer,
  activeBuildingState: ActiveBuildingStar.reducer,
  currentInfoState: CurrentInfoStar.reducer,
});

const sagaMiddleware = createSagaMiddleware();

let store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

function* rootSaga() {
  yield all([UpdateBuildingsStar.watchUpdateBuildings()]);
}

sagaMiddleware.run(rootSaga);

export default store;
