import React from 'react';
import { createContext, useContext, useReducer } from 'react';

export const DeviceContext = createContext(null);
export const DeviceDispatchContext = createContext(null);

export function ConnectionProvider({ children }) {
	// Initial Device is null
	const [device, dispatch] = useReducer(deviceReducer, null);
  
	return (
	 <DeviceContext.Provider value={device}>
	  <DeviceDispatchContext.Provider value={dispatch}>
	  	{ children }
	  </DeviceDispatchContext.Provider>
	 </DeviceContext.Provider>
	);
  }

export function useDevice() {
  return useContext(DeviceContext);
}

export function useDeviceDispatch() {
  return useContext(DeviceDispatchContext);
}

function deviceReducer(device, action) {
	switch (action.type) {
		case 'connect': {
			console.log("device is connected through ConnectionContext");
			return action.device;
		}
		case 'disconnect': {
			return null;
		}
	}
}