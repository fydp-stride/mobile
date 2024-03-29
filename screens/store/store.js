import { combineReducers, configureStore } from '@reduxjs/toolkit';
import bluetoothReducer from '../reducers/bluetoothSlice';
import geolocationReducer, { initialState as geo } from '../reducers/geolocationReducer';
import userDataReducer, { initialState as user } from '../reducers/userDataReducer';
import summaryDataReducer from '../reducers/summaryDataReducer';
import {
  createMigrate, persistStore, persistReducer, FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const migrations = {
  0: state => {
    return {
      geolocationData: geo,
      userData: user
    };
  },
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userData', 'summaryData'],
  // migrate: createMigrate(migrations, { debug: false }),
  stateReconciler: autoMergeLevel2
}

const reducers = combineReducers({
  bluetoothData: bluetoothReducer,
  geolocationData: geolocationReducer,
  userData: userDataReducer,
  summaryData: summaryDataReducer
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);