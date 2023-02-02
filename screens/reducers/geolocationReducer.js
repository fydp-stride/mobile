import { combineReducers } from 'redux';

const initialState = {
  enabled: false,
  // geolocationState: null,
  odometer: 0,
  markers: [],
  coordinates: [],
  time: 0
};

const geolocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_ENABLED":
      console.log(state)
      return { ...state, enabled: !state.enabled };
    case "SET_STATE":
      console.log(state)
      return { ...state, geolocationState: action.payload };
    case "SET_ODOMETER":
      console.log(state)
      return { ...state, odometer: action.payload };
    case "SET_MARKERS":
      console.log(state)
      return { ...state, markers: action.payload };
    case "SET_COORDINATES":
      console.log(state)
      return { ...state, coordinates: action.payload };
    case "SET_TIME":
      console.log(state)
      return { ...state, time: action.payload };
    default:
      return state;
  }
};

export default geolocationReducer;