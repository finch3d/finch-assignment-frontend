import { call, put, takeLatest } from "redux-saga/effects";
import { getBuildingsDataFromApi } from "../api.js";

export const actions = {
  BUILDINGS_DATA_UPDATE: "@buildingsData/BUILDINGS_DATA_UPDATE",
  BUILDINGS_DATA_SUCCESS: "@buildingsData/BUILDINGS_DATA_SUCCESS",
  BUILDINGS_DATA_FAIL: "@buildingsData/BUILDINGS_DATA_FAIL",
};

export function updateBuildings(payload) {
  let data = [null, null, null];

  if (payload) {
    data[payload.activeIndex] = { height: payload.height };
  }

  return { type: actions.BUILDINGS_DATA_UPDATE, payload: data };
}

function* requestUpdateBuildings({ payload }) {
  try {
    const response = yield call(getBuildingsDataFromApi, payload);
    yield put({
      type: actions.BUILDINGS_DATA_SUCCESS,
      response,
    });
  } catch (error) {
    yield put({
      type: actions.BUILDINGS_DATA_FAIL,
      error,
    });
  }
}

export function* watchUpdateBuildings() {
  yield takeLatest(actions.BUILDINGS_DATA_UPDATE, requestUpdateBuildings);
}

const initialState = {
  getBuildingsInProgress: false,
  getBuildingsError: null,
  buildings: [],
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.BUILDINGS_DATA_GET:
      return { ...state, getBuildingsInProgress: true };
    case actions.BUILDINGS_DATA_UPDATE:
      return { ...state, getBuildingsInProgress: true };
    case actions.BUILDINGS_DATA_SUCCESS:
      return {
        ...state,
        getBuildingsInProgress: false,
        buildings: action.response.items,
        getBuildingsError: null,
      };
    case actions.BUILDINGS_DATA_FAIL:
      return {
        ...state,
        getBuildingsInProgress: false,
        getBuildingsError: "Something went wrong, please try again later",
      };
    default:
      return state;
  }
}
