import { combineReducers } from 'redux';

const initialState = {
  enabled: false,
};

const geolocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_ENABLED":
      console.log(state)
      return { ...state, enabled: !state.enabled };
    default:
      return state;
  }
};

export default geolocationReducer;