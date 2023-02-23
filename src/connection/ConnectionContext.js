import React from 'react';
import { createContext, useContext, useReducer } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { addImpulse, addMaxForce, addAngle, clearImpulse, clearMaxForce, 
	clearAngle, setImpulse, setMaxForce, setBattery, setImpulseAxis, setMaxForceAxis } from '../../screens/reducers/bluetoothSlice';
import { useDispatch } from 'react-redux';

export const DeviceContext = createContext(null);
export const DeviceDispatchContext = createContext(null);

export function ConnectionProvider({ children }) {
	const SYNC_BYTE = 0xFF;
	const IMPULSE_CMD = 0x01;
	const MAX_FORCE_CMD = 0x02;
	const ANGLE_CMD = 0x03;
	const BATT_CMD = 0x04;
	const WEIGHT_CMD = 0x05;
	const RESPONSE_CMD = 0x06;
	const CALIBRATE_CMD = 0x07;
	// variable device will hold a device information that is bluetooth CONNECTED.
	// device is initially null
	const [device, dispatch] = useReducer(deviceReducer, null);
	const dispatchGlobal = useDispatch();

	let accumulateImpulse = 0;
	let diffImpulse = 0;
	let currentMaxForce = 0;

	let graphInterval = null;
	let readSubscription = null;

	let cmd = undefined;
	let sync = undefined;
	let length = 0;
	let buffer = undefined;

	function deviceReducer(device, action) {
		switch (action.type) {
			case 'connect': {	
				connect(action);		
				return action.device;
			}
			case 'disconnect': {
				disconnect(action);
				return null;
			}
			case 'write_weight': {
				writeWeight(device, action.weight);
				return device;
			}
			case 'write_calibrate': {
				writeCalibrate(device);
				return device;
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
				initializeRead();
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
			console.log("Disconnected Bluetooth");
		} catch (error) {
			console.log("Disconnection failed: ", error.message);
		}
	
		uninitializeRead();
	}
	
	function initializeRead() {
		//disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => disconnect(true));
		const INTERVAL = 5000; //5 seconds
		let graphInt = setInterval(() => {
		  if (diffImpulse > 0){
			const addImpulseAction = {
			  type: 'bluetooth/addImpulse',
			  payload: accumulateImpulse
			}
			// add to global dispatcher
			//console.log("addImpulse dispatcher");
			dispatchGlobal(addImpulse(addImpulseAction));
		  }
		  
		  if (currentMaxForce > 0){
			const addMaxForceAction = {
			  type: 'bluetooth/addMaxForce',
			  payload: currentMaxForce
			}
			// add to global dispatcher
			//console.log("add max force dispatcher");
			dispatchGlobal(addMaxForce(addMaxForceAction));
		  }
	
		  accumulateImpulse = 0;
		  diffImpulse = 0;
		  currentMaxForce = 0;
	
		}, INTERVAL);
	
		let readSub = device.onDataReceived(event =>
			onReceivedData(event)
		);
		
		graphInterval = graphInt;
		readSubscription = readSub;
	}
	
	function uninitializeRead() {
		if (readSubscription) {
			readSubscription.remove();
		}
		if (graphInterval) {
		  clearInterval(graphInterval);
		}
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
			case ANGLE_CMD:
				// OUT OF DATE! STILL USING dispatch DIRECTLY!
				  let angle_list = buffer.split(",");
				  let angle_float_list = [];
				for (let i = 0; i < angle_list.length;i++){
				  if (angle_list[i]){
					let angle_float = parseFloat(angle_list[i]);
					angle_float_list.push(angle_float)
				  }
				}
				// add to global dispatcher
				dispatchGlobal(addAngle(angle_float_list));
				//console.log("added " + angle_float_list + " to the angle dispatcher.");
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

	async function addImpulseLocal(impulse){
		accumulateImpulse = accumulateImpulse + impulse;
		diffImpulse = diffImpulse + impulse;
	}
	
	async function addForceLocal(force){
		currentMaxForce = Math.max(currentMaxForce, force);
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
				device.address,
				String.fromCharCode(SYNC_BYTE),
				"ascii",
			);
			await RNBluetoothClassic.writeToDevice(
				device.address,
				String.fromCharCode(RESPONSE_CMD),
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
			console.log("Successfully write response command to bluetooth");
		} catch (error){
			console.log("Writing to bluetooth error: ", error);
		  }
	}

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