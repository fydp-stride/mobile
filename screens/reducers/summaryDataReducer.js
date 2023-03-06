import { combineReducers } from 'redux';

export const initialState = {
  weekArrays: [{
    weekOf: 'Jan 31 - Feb 6',
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [7, 6, 8, 5, 9, 7, 8],
      },
    ],
  }],
  dateEvents: [{
    date: '2023-02-16',
    sessionName: 'Morning Run',
    distance: '5km',
    duration: '30min',
  },
  {
    date: '2023-02-15',
    sessionName: 'Afternoon Walk',
    distance: '2km',
    duration: '20min',
  }],
};

const summaryDataReducer = (state = initialState, action) => {
  console.log(state)
  switch (action.type) {
    case "SET_DATE_EVENT":
      return { ...state, dateEvents: action.payload };
    case "ADD_DATE_EVENT":
      return { ...state, dateEvents: [action.payload, ...state.dateEvents] };
    case "SET_WEEK_ARRAY":
      return { ...state, weekArrays: action.payload };
    case "ADD_WEEK_ARRAY":
      return { ...state, weekArrays: [action.payload, ...state.weekArrays] };
    default:
      return state;
  }
};

export default summaryDataReducer;