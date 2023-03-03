import { combineReducers } from 'redux';

export const initialState = {
  height: "",
  weight: "",
  age: "",
  threshold: "",
  geolocationEnabled: false
};

const userDataReducer = (state = initialState, action) => {
  console.log(state)
  switch (action.type) {
    case "SET_HEIGHT":
      return { ...state, height: action.payload };
    case "SET_WEIGHT":
      return { ...state, weight: action.payload };
    case "SET_AGE":
      return { ...state, age: action.payload };
    case "SET_THRESHOLD":
      return { ...state, threshold: action.payload };
    case "TOGGLE_ENABLED":
      return { ...state, geolocationEnabled: !state.geolocationEnabled };
    default:
      return state;
  }
};

export default userDataReducer;