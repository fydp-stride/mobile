import { createSlice } from '@reduxjs/toolkit';

export const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState: {
    impulse: [0],
    maxForce: [0],
    angle: [0],
    battery: 0,
  },
  reducers: {
    addImpulse: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      //const temp = state.impulse;
      let accumulateImpulse = state.impulse[state.impulse.length - 1] + action.payload.payload;
      state.impulse = [...state.impulse, accumulateImpulse].slice(-100);
      // For impulse, we want to sum all the impulses.
      // var sumImpulse = state.impulse[state.impulse.length - 1] + action.payload.payload;
      // temp.push(sumImpulse);
      // state.impulse = temp;
    },
    addMaxForce: (state, action) => {
      state.maxForce = [...state.maxForce, action.payload.payload].slice(-100);
    },
    addAngle: (state, action) => {
      const temp = state.angle;
      temp.push(action.payload.payload);
      state.angle = temp;
    },
    clearImpulse: state => {
      state.impulse = [];
    },
    clearMaxForce: state => {
      state.maxForce = [];
    },
    clearAngle: state => {
      state.angle = [];
    },
    setImpulse: (state, action) => {
      state.impulse = action.payload;
    },
    setMaxForce: (state, action) => {
      state.maxForce = action.payload;
    },
    setBattery: (state, action) => {
      state.battery = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { addImpulse, addMaxForce, addAngle, clearImpulse, clearMaxForce, clearAngle, setImpulse, setMaxForce, setBattery} = bluetoothSlice.actions;

export default bluetoothSlice.reducer;
