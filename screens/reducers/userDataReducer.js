import { combineReducers } from 'redux';

export const initialState = {
  height: "",
  weight: "",
  age: ""
};

const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_HEIGHT":
      console.log(state)
      return { ...state, height: action.payload };
    case "SET_WEIGHT":
      console.log(state)
      return { ...state, weight: action.payload };
    case "SET_AGE":
      console.log(state)
      return { ...state, age: action.payload };
    default:
      return state;
  }
};

export default userDataReducer;