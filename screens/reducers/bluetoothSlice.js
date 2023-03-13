import { createSlice } from '@reduxjs/toolkit';
import { Notifications } from 'react-native-notifications';

const getCurrentTime = () => {
  var date = new Date();
  var dateStr =
    ("00" + date.getHours()).slice(-2) + ":" +
    ("00" + date.getMinutes()).slice(-2) + ":" +
    ("00" + date.getSeconds()).slice(-2);
  return dateStr;
}

export const bluetoothSlice = createSlice({
  name: 'bluetooth',
  initialState: {
    impulse: [0],
    maxForce: [0],
    totalMaxForce: 0,
    angleRoll: [0],
    anglePitch: [0],
    battery: 0,
    impulseTime: [getCurrentTime()],
    maxForceTime: [getCurrentTime()],
  },
  reducers: {
    addImpulse: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      //const temp = state.impulse;
      // For impulse, we want to accumulate all the impulses.
      const accumulateImpulse = state.impulse[state.impulse.length - 1] + action.payload.payload;
      state.impulse = [...state.impulse, accumulateImpulse];
      state.impulseTime = [...state.impulseTime, getCurrentTime()];
      // var sumImpulse = state.impulse[state.impulse.length - 1] + action.payload.payload;
      // temp.push(sumImpulse);
      // state.impulse = temp;
      // if (accumulateImpulse > 1000) {
      //   Notifications.postLocalNotification({
      //     title: "Local notification",
      //     body: "This notification was generated by the app!",
      //     extra: "data"
      // });
      //}
    },
    addMaxForce: (state, action) => {
      state.maxForce = [...state.maxForce, action.payload.payload];
      state.maxForceTime = [...state.maxForceTime, getCurrentTime()];
      state.totalMaxForce += action.payload.payload;
    },
    addAngleRoll: (state, action) => {
      state.angleRoll = [...state.angleRoll, action.payload.payload];
      //console.log("roll: ", state.angleRoll[state.angleRoll.length - 1]);
    },
    addAnglePitch: (state, action) => {
      state.anglePitch = [...state.anglePitch, action.payload.payload];
      //console.log("pitch: ", state.anglePitch[state.anglePitch.length - 1]);
    },
    clearImpulse: state => {
      state.impulse = [0];
      state.impulseTime = [getCurrentTime()];
    },
    clearMaxForce: state => {
      state.maxForce = [0];
      state.maxForceTime = [getCurrentTime()];
      state.totalMaxForce = 0;
    },
    clearAngle: state => {
      state.angleRoll = [0];
      state.anglePitch = [0];
    },
    setImpulse: (state, action) => {
      state.impulse = action.payload;
    },
    setMaxForce: (state, action) => {
      state.maxForce = action.payload;
    },
    setBattery: (state, action) => {
      state.battery = action.payload;
    },
    setImpulseAxis: state => {
      state.impulseTime = [...state.impulseTime, getCurrentTime()].slice(-6);
    },
    setMaxForceAxis: state => {
      state.maxForceTime = [...state.maxForceTime, getCurrentTime()].slice(-6);
    }
  },
});

// Action creators are generated for each case reducer function
export const { addImpulse, addMaxForce, addAngleRoll, addAnglePitch, clearImpulse, clearMaxForce,
  clearAngle, setImpulse, setMaxForce, setBattery, setImpulseAxis, setMaxForceAxis } = bluetoothSlice.actions;

export default bluetoothSlice.reducer;
