import React from 'react';
import { createContext, useContext, useReducer, useRef, useEffect, useState } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { addImpulse, addMaxForce, addAngleRoll, addAnglePitch, setBattery } from '../../screens/reducers/bluetoothSlice';
import { useDispatch, batch } from 'react-redux';

export const DeviceContext = createContext(null);
export const DeviceDispatchContext = createContext(null);

export function ConnectionProvider({ children }) {
	const SYNC_BYTE = 0xFF;
	const IMPULSE_CMD = 0x01;
	const MAX_FORCE_CMD = 0x02;
	const ANGLE_ROLL_CMD = 0x03;
	const BATT_CMD = 0x04;
	const WEIGHT_CMD = 0x05;
	const RESPONSE_CMD = 0x06;
	const CALIBRATE_CMD = 0x07;
	const ANGLE_PITCH_CMD = 0x08;
	// variable device will hold a device information that is bluetooth CONNECTED.
	// device is initially null
	const [state, dispatch] = useReducer(deviceReducer, {
		device: null,
		graphInterval: null,
		readSubscription: null,
		run_started: false
	});
	const dispatchGlobal = useDispatch();

	let accumulateImpulse = 0;
	let diffImpulse = 0;
	let currentMaxForce = 0;
	let currentAngleRoll = 0;
	let currentAnglePitch = 0;
	

	let cmd = undefined;
	let sync = undefined;
	let length = 0;
	let buffer = undefined;

	// Should solve stale state issue
	const runRef = useRef(state);
	useEffect(() => {
		runRef.current = state.run_started
	}, [state.run_started])

	function deviceReducer(state, action) {
		//console.log(action.type);
		//console.log(state);
		switch (action.type) {
			case 'connect': {	
				connect(action);
				// Don't return device action.device yet since connection may fail		
				return state;
			}
			case 'disconnect': {
				disconnect(action);
				// Don't return null device yet since disconnection may fail
				return state;
			}
			case 'write_weight': {
				if (state.device) {
					writeWeight(state.device, action.weight);
				}
				return state;
			}
			case 'write_calibrate': {
				if (state.device) {
					writeCalibrate(state.device);
				}
				return state;
			}
			case 'connected': {
				return {...state, device: action.device };
			}
			case 'disconnected': {
				return {...state, device: null};
			}
			case 'initialize': {
				return {...state, graphInterval: action.graphInterval, readSubscription: action.readSubscription }
			}
			case 'uninitialize': {
				return {...state, graphInterval: null, readSubscription: null }
			}
			case 'start_run': {
				return {...state, run_started: true }
			}
			case 'stop_run': {
				return {...state, run_started: false }
			}
			default: {
				return state
			}
		}
	}
	
	async function connect(action) {
		let connectionOptions = {
			//CONNECTION_TYPE: 'binary',
			READ_SIZE: 512,
			DELIMITER: '',
			DEVICE_CHARSET: "ISO-8859-1",
		};
		try {
			let connection = await action.device.isConnected();
			if (!connection) {
				console.log("Attempting connection to ", action.device.address);
				connection = await action.device.connect(connectionOptions);
				console.log("Connection Successful");
				dispatch({
					type: 'connected',
					device: action.device
				})
				initializeRead(action.device);
			} else {
				console.log(action.device.address, " was already connected");
			}
		} catch (error) {
			console.log("Connection failed: ", error.message);
		}
	}
	
	async function disconnect(action) {
		try {
			let disconnect = await action.device.disconnect();
			if (disconnect) {
				
			}
			console.log("Disconnected Bluetooth");
		} catch (error) {
			console.log("Disconnection failed: ", error.message);
		}
		// Assume that device is disconnected if button is pressed.
		dispatch({
			type: 'disconnected'
		})
	
		uninitializeRead();
	}
	
	async function initializeRead(device) {
		//disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => disconnect(true));
		const INTERVAL = 5000; //5 seconds
		const graphInterval = setInterval(() => {
		  //const startTime = new Date();
		  batch(() => {
			if (diffImpulse > 0){
				const addImpulseAction = {
					type: 'bluetooth/addImpulse',
					payload: Math.round(accumulateImpulse)
				};
				// add to global dispatcher
				//console.log("addImpulse dispatcher");
				dispatchGlobal(addImpulse(addImpulseAction));
			}
			
			if (currentMaxForce > 0){
				const addMaxForceAction = {
					type: 'bluetooth/addMaxForce',
					payload: Math.round(currentMaxForce)
				};
				// add to global dispatcher
				//console.log("add max force dispatcher");
				dispatchGlobal(addMaxForce(addMaxForceAction));
			}

			if (currentAngleRoll != 0){
				const addAngleRollAction = {
					type: 'bluetooth/addAngleRoll',
					payload: currentAngleRoll
				};
				dispatchGlobal(addAngleRoll(addAngleRollAction));
			}

			if(currentAnglePitch != 0){
				const addAnglePitchAction = {
					type: 'bluetooth/addAnglePitch',
					payload: currentAnglePitch
				};
				dispatchGlobal(addAnglePitch(addAnglePitchAction));
			}
		  })
		  //const endTime = new Date();
		  //console.log(endTime.getTime() - startTime.getTime());
	
		  accumulateImpulse = 0;
		  diffImpulse = 0;
		  currentMaxForce = 0;
		  currentAngleRoll = 0;
		  currentAnglePitch = 0;
	
		}, INTERVAL);
	
		const readSubscription = device.onDataReceived(event => {
			//console.log(runRef.current);
			if (runRef.current){
				// This parses the event (event.data is the message)
				onReceivedData(event)
			}
		});	

		dispatch({
			type: 'initialize',
			graphInterval: graphInterval,
			readSubscription: readSubscription
		})
	}
	
	async function uninitializeRead() {
		if (state.readSubscription) {
			state.readSubscription.remove();
		}
		if (state.graphInterval) {
		  clearInterval(state.graphInterval);
		}

		dispatch({
			type: 'uninitialize'
		})
	}
		
	// CURRENT LIMITATION: Might Receive a large buffer size (such as 180), and nothing will be done until I receive exactly
	// 180 bytes of data. Because of this, the bluetooth side might send less than 180 even though it's intended to send 180,
	// and this causes the program to hang (or not function as intended)
	async function onReceivedData(event) {
		event.timestamp = new Date();
		
		var message = event.data;
		
		let i = 0
		while(true){
		  if(!sync || !cmd){
			while (true) {
			  while (i < message.length && sync != SYNC_BYTE){
				sync = message.charCodeAt(i);
				//console.log("sync: " + sync);
				i++;
			  }
			  // Done with this message
			  if (i >= message.length){
				break;
			  }
			  cmd = message.charCodeAt(i);
			  //console.log("cmd: " + cmd);
			  i++;
			  if (cmd != SYNC_BYTE){
				break;
			  }
			}
		  }
		  // Done with this message
		  if (i >= message.length){
			break;
		  }
	
		  if (!length) {
			length = message.charCodeAt(i)
			i++;
			//console.log(`Received packet (${cmd}, ${length})`);
		  }
	
		  // Done with this message
		  if (i >= message.length){
			break;
		  }
	
		  if (!buffer){
			buffer = new String();
		  }
	
		  // This may create a buffer greater than the length.
		  for (let x = i; x < message.length; x++){
			buffer += message.charAt(x);
			i++;
			// Ensures buffer is of length (max) length
			if (buffer.length >= length){
			  break;
			}
		  }
		  //buffer.push(message.substring(i));
	
		  // More messages incoming!
		  //console.log("Buffer length: ", buffer.length);
		  //console.log("Expected length: ", length);
		  if (buffer.length < length){
			break;
		  }
	
		  switch(cmd){
			case IMPULSE_CMD:
				// 45.20, 12.40,
				let impulse_list = buffer.split(",");
				//console.log("impulse_list " + impulse_list)
				for (let i = 0; i < impulse_list.length;i++){
				  if (impulse_list[i]){
					let impulse_float = parseFloat(impulse_list[i]);
					if (impulse_float && impulse_float != 0) {
					  addImpulseLocal(impulse_float);
					}
				  }
				}
				// Send this impulse somewhere (Redux or some state management).
			  break;
			case MAX_FORCE_CMD:
				let max_force_list = buffer.split(",");
				let max_force_highest = Math.max(parseFloat(max_force_list));
				//console.log("max_force_list: " + max_force_list)
				//console.log("max_force_highest: " + max_force_highest)
				if (max_force_highest && max_force_highest > 0){
				  addForceLocal(max_force_highest);
				}
			  break;
			case ANGLE_ROLL_CMD:
				// OUT OF DATE! STILL USING dispatch DIRECTLY!
				let angle_list_roll = buffer.split(",");
				for (let i = 0; i < angle_list_roll.length;i++){
					if (angle_list_roll[i]){
						let angle_float = parseFloat(angle_list_roll[i]);
						addAngleLocalRoll(angle_float);
					}
				}
				//console.log("added " + angle_float_list + " to the angle dispatcher.");
			  break;
			case ANGLE_PITCH_CMD:
				// OUT OF DATE! STILL USING dispatch DIRECTLY!
				let angle_list_pitch = buffer.split(",");
				for (let i = 0; i < angle_list_pitch.length;i++){
					if (angle_list_pitch[i]){
						let angle_float = parseFloat(angle_list_pitch[i]);
						addAngleLocalPitch(angle_float)
					}
				}
				break;
			case BATT_CMD:
				// OUT OF DATE!
				// Convert 4 bytes into Float Data
				var battPerc = parseFloat(buffer.split(",")[0]);
				console.log("Battery Charge: " + battPerc + "%");
				// Add this to global dispatcher
				dispatchGlobal(setBattery(battPerc));
				//console.log("set battery " + battPerc + " to the battery dispatcher.");
				break;
			case RESPONSE_CMD:
				//console.log("buffer: ", buffer);
				//console.log("buffer size: ", buffer.length);
				bluetoothLatencyTest(buffer);
				break;
			default:
			  console.log(`Invalid Packet: ${cmd}`);
		  }
		  // Reset this current message for next message
		  cmd = undefined;
		  sync = undefined;
		  length = 0;
		  buffer = undefined;
		  if (i >= message.length){
			break;
		  }
		}
	}

	function addImpulseLocal(impulse){
		accumulateImpulse = accumulateImpulse + impulse;
		diffImpulse = diffImpulse + impulse;
	}
	
	function addForceLocal(force){
		currentMaxForce = Math.max(currentMaxForce, force);
	}

	function addAngleLocalRoll(angle){
		//console.log("Incoming angle roll ", angle);
		if (Math.abs(currentAngleRoll) < Math.abs(angle)){
			currentAngleRoll = angle;
		}
	}

	function addAngleLocalPitch(angle){
		//console.log("Incoming angle pitch ", angle);
		if (Math.abs(currentAnglePitch) < Math.abs(angle)){
			currentAnglePitch = angle;
		}
	}


	async function writeWeight(device, weight){
		var float_arr = new Float32Array(1);
		float_arr[0] = weight;
		var binary_arr = new Int8Array(float_arr.buffer); 
		try{
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(SYNC_BYTE),
			  "ascii",
			);
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(WEIGHT_CMD),
			  "ascii",
			);
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(binary_arr.length),
			  "ascii",
			);
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(...binary_arr),
			  "ascii",
			);
			console.log("Successfully write weight to bluetooth");
		  } catch (error){
			console.log("Writing to bluetooth error: ", error);
		  }
	}

	async function writeCalibrate(device){
		try{
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(SYNC_BYTE),
			  "ascii",
			);
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(CALIBRATE_CMD),
			  "ascii",
			);
			await RNBluetoothClassic.writeToDevice(
			  device.address,
			  String.fromCharCode(0),
			  "ascii",
			);
			console.log("Successfully write calibration command to bluetooth");
		  } catch (error){
			console.log("Writing to bluetooth error: ", error);
		  }
	}

	async function bluetoothLatencyTest(buffer){
		var binary_arr = Int8Array.from(buffer);
		//console.log(binary_arr);
		try {
			await RNBluetoothClassic.writeToDevice(
				state.device.address,
				String.fromCharCode(SYNC_BYTE),
				"ascii",
			);
			await RNBluetoothClassic.writeToDevice(
				state.device.address,
				String.fromCharCode(RESPONSE_CMD),
				"ascii",
			);
			await RNBluetoothClassic.writeToDevice(
				state.device.address,
				String.fromCharCode(binary_arr.length),
				"ascii",
			);
			await RNBluetoothClassic.writeToDevice(
				state.device.address,
				String.fromCharCode(...binary_arr),
				"ascii",
			);
			console.log("Successfully write response command to bluetooth");
		} catch (error){
			console.log("Writing to bluetooth error: ", error);
		  }
	}

	return (
	 <DeviceContext.Provider value={state.device}>
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