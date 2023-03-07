import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Button } from '@ui-kitten/components';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { useSelector, useDispatch } from 'react-redux';

import { selectBluetooth, setImpulse, setMaxForce, addImpulse, setImpulseAxis, addMaxForce ,setMaxForceAxis } from './reducers/bluetoothSlice';

import { useToast } from "react-native-toast-notifications";

export default function Visualization({ navigation }) {

  // data
  const bluetoothData = useSelector(state => state.bluetoothData);
  const maxForce = bluetoothData.maxForce.slice(-6);
  const impulse = bluetoothData.impulse.slice(-6);
  const dispatch = useDispatch();
  // const MAX_FORCE_THRESHOLD = Number(useSelector(state => state.userData.threshold));
  const MAX_FORCE_THRESHOLD = 7000;
  const MAX_IMPULSE_THRESHOLD = 30000;
  const MAX_ANGLE_THRESHOLD = [5, 35];


  const disguised_toast = useToast();

  const mockImpulseData = {
    labels: bluetoothData.impulseAxis,
    datasets: [
      {
        data: impulse,
        color: (opacity = 1) => `rgba(251, 154, 153, ${opacity})`, // optional
        strokeWidth: 6, // optional
      },
      {
        data: [Math.min(...impulse)],
        withDots: false,
        color: (opacity = 1) => `rgba(251, 154, 153, ${opacity})`, // optional
        strokeWidth: 6, // optional
      },
      {
        data: [Math.max(...impulse)],
        withDots: false,
        color: (opacity = 1) => `rgba(251, 154, 153, ${opacity})`, // optional
        strokeWidth: 6, // optional
      }
    ],
    //legend: ["Average impulse"] // optional
  };

  const mockForceData = {
    labels: bluetoothData.maxForceAxis,
    datasets: [
      {
        data: maxForce,
        color: (opacity = 1) => `rgba(93, 176, 117, ${opacity})`, // optional
        colors: [
          (opacity = 1) => {
            return getForceColor(maxForce[0])
          },
          (opacity = 1) => {
            return getForceColor(maxForce[1])
          },
          (opacity = 1) => {
            return getForceColor(maxForce[2])
          },
          (opacity = 1) => {
            return getForceColor(maxForce[3])
          },
          (opacity = 1) => {
            return getForceColor(maxForce[4])
          },
          (opacity = 1) => {
            return getForceColor(maxForce[5])
          }
        ],
        strokeWidth: 6 // optional
      },
    ],
  };

  useEffect(() => {
    // Currently None of these variables are used
    // var curTime = getCurrentTime();
    // setImpulseXaxis([curTime]);
    // setforceXaxis([curTime]);
    console.log("maxForce: ", bluetoothData.maxForce[bluetoothData.maxForce.length - 1])
    if (MAX_FORCE_THRESHOLD <= bluetoothData.maxForce[bluetoothData.maxForce.length - 1]){
      disguised_toast.show(`Force Exceeded: ${bluetoothData.maxForce[bluetoothData.maxForce.length - 1]} N`, {
        type: "warning",
        placement: "top", 
        duration: 3000
      });
    }
  }, [bluetoothData.maxForce]);

  useEffect(() => {
    // Currently None of these variables are used
    // var curTime = getCurrentTime();
    // setImpulseXaxis([curTime]);
    // setforceXaxis([curTime]);
    console.log("impulse: ", bluetoothData.impulse[bluetoothData.impulse.length - 1])
    if (MAX_IMPULSE_THRESHOLD <= bluetoothData.impulse[bluetoothData.impulse.length - 1]){
      disguised_toast.show(`Impulse Exceeded: ${bluetoothData.impulse[bluetoothData.impulse.length - 1]} N s`, {
        type: "warning",
        placement: "top", 
        duration: 3000
      });
    }
  }, [bluetoothData.impulse]);

  useEffect(() => {
    // Currently None of these variables are used
    // var curTime = getCurrentTime();
    // setImpulseXaxis([curTime]);
    // setforceXaxis([curTime]);
    console.log("angle: ", bluetoothData.angle[bluetoothData.angle.length - 1])
    if (MAX_ANGLE_THRESHOLD[0] > bluetoothData.angle[bluetoothData.angle.length - 1] && bluetoothData.angle[bluetoothData.angle.length - 1] > MAX_ANGLE_THRESHOLD[1]){
      disguised_toast.show(`Angle Exceeded: ${bluetoothData.angle[bluetoothData.angle.length - 1]}°`, {
        type: "warning",
        placement: "top", 
        duration: 3000
      });
    }
  }, [bluetoothData.angle]);

  // style
  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(74, 148, 96, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };

  const renderImpulseData =
    <Layout style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 }}>
      <LineChart data={mockImpulseData}
        width={Dimensions.get("window").width}
        height={250}
        chartConfig={chartConfig}
        bezier
        withShadow={false}
      />
    </Layout>

  const renderForceData =
    <Layout style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 }}>
      <BarChart data={mockForceData}
        width={Dimensions.get("window").width}
        height={250}
        chartConfig={chartConfig}
        fromNumber={100}
        fromZero={true}
        flatColor={true}
        withCustomBarColorFromData={true}
        showBarTops={false}
      />
    </Layout>

  const getCurrentTime = () => {
    var date = new Date();
    var dateStr =
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
    return dateStr;
  }

  const addImpulsePoint = (datum) => {
    var curTime = getCurrentTime();
    const addImpulseAction = {
      type: 'bluetooth/addImpulse',
      payload: Math.random() * 300
    };
    dispatch(addImpulse(addImpulseAction));
  }

  const addForcePoint = (datum) => {
    var curTime = getCurrentTime();
    const addMaxForceAction = {
      type: 'bluetooth/addMaxForce',
      payload: Math.random() * 300
    };
    dispatch(addMaxForce(addMaxForceAction));
  }

  const getForceColor = (force) => {
    if (force <= MAX_FORCE_THRESHOLD){
      return `#5DB075`
    }
    return `#FF8A00`
  }

  let datum = 30;
  return (
    <Layout style={{ justifyContent: 'center', backgroundColor: 'white', flex: 1 }}>
      <Text style={{ color: "black", textAlign: 'center', fontSize: 25, margin: 20, fontWeight: 'bold' }}>Metrics</Text>
      <Text style={{ color: "black", textAlign: 'left', fontSize: 15, marginLeft: 20, fontWeight: 'bold' }}>Total Impulse</Text>
      {renderImpulseData}
      {/* <Button onPress={() => addImpulsePoint(datum)}>
        <Text>add data point</Text>
      </Button> */}
      <Text style={{ color: "black", textAlign: 'left', fontSize: 15, marginLeft: 20, fontWeight: 'bold' }}>Maximum Force</Text>
      {renderForceData}
      {/* <Button onPress={() => addForcePoint(datum)}>
        <Text>add data point</Text>
      </Button> */}
    </Layout>
  );
}
