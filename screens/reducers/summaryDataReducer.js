import { combineReducers } from 'redux';

export const initialState = {
  weekArrays: [{
    weekOf: 'Mar 6 - 12',
    weekDates: ['2023-03-06', '2023-03-12'],
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        dates: ['2023-03-06', '2023-03-07', '2023-03-08', '2023-03-09', '2023-03-10', '2023-03-11', '2023-03-12'],
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  }, {
    weekOf: 'Mar 13 - 19',
    weekDates: ['2023-03-13', '2023-03-19'],
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        dates: ['2023-03-13', '2023-03-14', '2023-03-15', '2023-03-16', '2023-03-17', '2023-03-18', '2023-03-19'],
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  }],
  dateEvents: [{
    date: '2023-03-13',
    time: '20:00',
    sessionName: 'Night Run',
    distance: 5000,
    duration: 40,
    impulse: 260000,
    maxForce: 9000
  }, {
    date: '2023-03-13',
    time: '15:00',
    sessionName: 'Afternoon Walk',
    distance: 3500,
    duration: 60,
    impulse: 150000,
    maxForce: 5500
  }, {
    date: '2023-03-12',
    time: '19:00',
    sessionName: 'Night Walk',
    distance: 3000,
    duration: 40,
    impulse: 180000,
    maxForce: 6000
  },
  {
    date: '2023-03-11',
    time: '14:00',
    sessionName: 'Afternoon Run',
    distance: 2000,
    duration: 20,
    impulse: 1000000,
    maxForce: 11000
  },
  {
    date: '2023-03-06',
    time: '07:00',
    sessionName: 'Morning Run',
    distance: 5000,
    duration: 30,
    impulse: 1000000,
    maxForce: 10000
  }]
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