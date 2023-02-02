export const toggleEnabled = () => (
  {
    type: 'TOGGLE_ENABLED',
  }
);

export const setState = (payload) => (
  {
    type: 'SET_STATE',
    payload: payload
  }
);

export const setOdometer = (payload) => (
  {
    type: 'SET_ODOMETER',
    payload: payload
  }
);

export const setMarkers = (payload) => (
  {
    type: 'SET_MARKERS',
    payload: payload
  }
);

export const setCoordinates = (payload) => (
  {
    type: 'SET_COORDINATES',
    payload: payload
  }
);

export const setTime = (payload) => (
  {
    type: 'SET_TIME',
    payload: payload
  }
);