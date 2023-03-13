export const setHeight = (payload) => (
  {
    type: 'SET_HEIGHT',
    payload: payload
  }
);

export const setWeight = (payload) => (
  {
    type: 'SET_WEIGHT',
    payload: payload
  }
);

export const setAge = (payload) => (
  {
    type: 'SET_AGE',
    payload: payload
  }
);

export const setForceThreshold = (payload) => (
  {
    type: 'SET_FORCE_THRESHOLD',
    payload: payload
  }
);

export const setImpulseThreshold = (payload) => (
  {
    type: 'SET_IMPULSE_THRESHOLD',
    payload: payload
  }
);

export const toggleEnabled = (payload) => (
  {
    type: 'TOGGLE_ENABLED',
    payload: payload
  }
);

export const setLastUsedDate = (payload) => (
  {
    type: 'SET_LAST_USED_DATE',
    payload: payload
  }
);

export const setDailyImpulse = (payload) => (
  {
    type: 'SET_DAILY_IMPULSE',
    payload: payload
  }
);

export const useImperialUnit = (payload) => (
  {
    type: 'USE_IMPERIAL_UNIT',
    payload: payload
  }
)

export const useMetricUnit = (payload) => (
  {
    type: 'USE_METRIC_UNIT',
    payload: payload
  }
)