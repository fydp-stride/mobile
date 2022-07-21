import { createSlice } from '@reduxjs/toolkit';

export const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState: {
    impulse: [0],
    maxForce: [0],
    angle: [0],
  },
  reducers: {
    addImpulse: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const temp = state.impulse;
      temp.push(action.payload);
      state.impulse = temp;
    },
    addMaxForce: (state, action) => {
      const temp = state.maxForce;
      temp.push(action.payload);
      state.maxForce = temp;
    },
    addAngle: (state, action) => {
      const temp = state.angle;
      temp.push(action.payload);
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
  },
});

// Action creators are generated for each case reducer function
export const { addImpulse, addMaxForce, addAngle, clearImpulse, clearMaxForce, clearAngle, setImpulse } = bluetoothSlice.actions;

export default bluetoothSlice.reducer;
