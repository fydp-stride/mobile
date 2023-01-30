import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Button } from '@ui-kitten/components';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { useSelector, useDispatch } from 'react-redux';

import { selectBluetooth, setImpulse, setMaxForce, addImpulse, setImpulseAxis, addMaxForce ,setMaxForceAxis } from './reducers/bluetoothSlice';

export default function Visualization({ navigation }) {

  // data
  const bluetoothData = useSelector(state => state.bluetoothData);
  const dispatch = useDispatch();
  const MAX_FORCE_THRESHOLD = 200;

  // const [impulseData, setImpulseData] = useState([0]);
  const [forceData, setForceData] = useState([0]);
  const [impulseXaxis, setImpulseXaxis] = useState([]);
  const [forceXaxis, setforceXaxis] = useState([])

  const mockImpulseData = {
    labels: bluetoothData.impulseAxis,
    datasets: [
      {
        data: bluetoothData.impulse,
        color: (opacity = 1) => `rgba(251, 154, 153, ${opacity})`, // optional
        strokeWidth: 6, // optional
      },
      {
        data: [Math.min(...bluetoothData.impulse) * 0.8],
        withDots: false,
        color: (opacity = 1) => `rgba(251, 154, 153, ${opacity})`, // optional
        strokeWidth: 6, // optional
      },
      {
        data: [Math.max(...bluetoothData.impulse)],
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
        data: bluetoothData.maxForce,
        color: (opacity = 1) => `rgba(93, 176, 117, ${opacity})`, // optional
        colors: [
          (opacity = 1) => {
            return getForceColor(bluetoothData.maxForce[0])
          },
          (opacity = 1) => {
            return getForceColor(bluetoothData.maxForce[1])
          },
          (opacity = 1) => {
            return getForceColor(bluetoothData.maxForce[2])
          },
          (opacity = 1) => {
            return getForceColor(bluetoothData.maxForce[3])
          },
          (opacity = 1) => {
            return getForceColor(bluetoothData.maxForce[4])
          },
          (opacity = 1) => {
            return getForceColor(bluetoothData.maxForce[5])
          }
        ],
        strokeWidth: 6 // optional
      },
    ],
  };

  useEffect(() => {
    var curTime = getCurrentTime();
    setImpulseXaxis([curTime]);
    setforceXaxis([curTime]);
  }, []);

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
      <Button onPress={() => addImpulsePoint(datum)}>
        <Text>add data point</Text>
      </Button>
      <Text style={{ color: "black", textAlign: 'left', fontSize: 15, marginLeft: 20, fontWeight: 'bold' }}>Maximum Force</Text>
      {renderForceData}
      <Button onPress={() => addForcePoint(datum)}>
        <Text>add data point</Text>
      </Button>
    </Layout>
  );
}
