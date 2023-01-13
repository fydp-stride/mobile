import { configureStore } from '@reduxjs/toolkit';
import bluetoothReducer from '../reducers/bluetoothSlice';
import geolocationReducer from '../reducers/geolocationReducer';

export default configureStore({
  reducer: {
    bluetoothData: bluetoothReducer,
    geolocationData: geolocationReducer
  },
});
