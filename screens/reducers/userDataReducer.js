import { combineReducers } from 'redux';

export const initialState = {
  height: "",
  weight: "",
  age: ""
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
    default:
      return state;
  }
};

export default userDataReducer;