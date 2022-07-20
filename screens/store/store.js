import { configureStore } from '@reduxjs/toolkit';
import bluetoothReducer from '../bluetoothSlice';

export default configureStore({
  reducer: {
    bluetoothData: bluetoothReducer,
  },
});
