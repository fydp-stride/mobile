import { act } from 'react-test-renderer';
import { combineReducers } from 'redux';

export const initialState = {
  height: "",
  weight: "",
  age: "",
  forceThreshold: "3000",
  impulseThreshold: "3000000",
  geolocationEnabled: false,
  lastUsedDate: "2000-01-01",
  dailyImpulse: '0'
};

const userDataReducer = (state = initialState, action) => {
  //console.log(state)
  switch (action.type) {
    case "SET_HEIGHT":
      return { ...state, height: action.payload };
    case "SET_WEIGHT":
      return { ...state, weight: action.payload };
    case "SET_AGE":
      return { ...state, age: action.payload };
    case "SET_FORCE_THRESHOLD":
      return { ...state, forceThreshold: action.payload };
    case "SET_IMPULSE_THRESHOLD":
      return { ...state, impulseThreshold: action.payload };
    case "TOGGLE_ENABLED":
      return { ...state, geolocationEnabled: !state.geolocationEnabled };
    case "SET_LAST_USED_DATE":
      return { ...state, lastUsedDate: action.payload };
    case "SET_DAILY_IMPULSE":
      return { ...state, dailyImpulse: action.payload };
    default:
      return state;
  }
};

export default userDataReducer;