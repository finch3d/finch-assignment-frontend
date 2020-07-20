export const actions = {
  SET_CURRENT_INFO: "@currentInfo/SET_CURRENT_INFO",
};

export function setInfo(payload) {
  return {
    type: actions.SET_CURRENT_INFO,
    payload: payload,
  };
}

const initialState = {
  height: 0,
  name: "",
  area: 0,
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_CURRENT_INFO:
      return {
        ...state,
        height: action.payload.height,
        name: action.payload.name,
        area: action.payload.area,
      };
    default:
      return state;
  }
}
