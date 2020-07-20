export const actions = {
  SET_ACTIVE_BUILDING: "@activeBuilding/SET_ACTIVE_BUILDING",
  REMOVE_ACTIVE_BUILDING: "@activeBuilding/REMOVE_ACTIVE_BUILDING",
};

export function setActive(payload) {
  return {
    type: actions.SET_ACTIVE_BUILDING,
    payload: payload,
  };
}

export function RemoveActive() {
  return {
    type: actions.REMOVE_ACTIVE_BUILDING,
  };
}

const initialState = {
  activeIndex: null,
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_ACTIVE_BUILDING:
      return {
        ...state,
        activeIndex: action.payload.index,
      };
    case actions.REMOVE_ACTIVE_BUILDING:
      return { ...state, activeIndex: null };
    default:
      return state;
  }
}
