import { combineReducers } from 'redux';

export const initialState = {
  weekArrays: [{
    weekOf: 'Mar 6 - 12',
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [20, 30, 45, 15, 25, 10, 20],
      },
    ],
  }, {
    weekOf: 'Mar 13 - 19',
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [7, 6, 8, 0, 0, 0, 0],
      },
    ],
  }],
  dateEvents: [{
    date: '2023-02-16',
    sessionName: 'Morning Run',
    distance: 5000,
    duration: 30,
    impulse: 1000000,
    maxForce: 10000
  },
  {
    date: '2023-02-15',
    sessionName: 'Afternoon Walk',
    distance: 2000,
    duration: 20,
    impulse: 2000000,
    maxForce: 20000
  }],
};

const summaryDataReducer = (state = initialState, action) => {
  //console.log(state)
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