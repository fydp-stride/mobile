import { combineReducers } from 'redux';

export const initialState = {
  dateEvents: [],
  weekArrays: []
};

const summaryDataReducer = (state = initialState, action) => {
  console.log(state)
  switch (action.type) {
    case "SET_DATE_EVENT":
      return { ...state, dateEvents: action.payload };
    case "ADD_DATE_EVENT":
      dateEvents.push(action.payload);
      return { ...state, dateEvents };
    case "SET_WEEK_ARRAY":
      return { ...state, weekArrays: action.payload };
    case "ADD_WEEK_ARRAY":
      weekArrays.push(action.payload);
      return { ...state, weekArrays };
    default:
      return state;
  }
};

export default summaryDataReducer;