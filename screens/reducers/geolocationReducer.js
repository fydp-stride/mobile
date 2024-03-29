import { combineReducers } from 'redux';

export const initialState = {
  odometer: 0,
  markers: [],
  coordinates: [],
  time: [0, 0],
};

const geolocationReducer = (state = initialState, action) => {
  // console.log(state)
  switch (action.type) {
    case "SET_STATE":
      return { ...state, geolocationState: action.payload };
    case "SET_ODOMETER":
      return { ...state, odometer: action.payload };
    case "SET_MARKERS":
      return { ...state, markers: action.payload };
    case "SET_COORDINATES":
      return { ...state, coordinates: action.payload };
    case "SET_TIME":
      return { ...state, time: action.payload };
    default:
      return state;
  }
};

export default geolocationReducer;