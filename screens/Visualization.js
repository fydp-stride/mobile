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

  // const [impulseData, setImpulseData] = useState([0]);
  const [forceData, setForceData] = useState([0]);
  const [impulseXaxis, setImpulseXaxis] = useState([]);
  const [forceXaxis, setforceXaxis] = useState([])

  const mockImpulseData = {
    labels: bluetoothData.impulseAxis,
    datasets: [
      {
        data: bluetoothData.impulse,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      },
      {
        data: [Math.min(...bluetoothData.impulse) * 0.8],
        withDots: false,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      },
      {
        data: [Math.max(...bluetoothData.impulse)],
        withDots: false,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      }
    ],
    legend: ["Average impulse"] // optional
  };

  const mockForceData = {
    labels: bluetoothData.maxForceAxis,
    datasets: [
      {
        data: bluetoothData.maxForce,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
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
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const renderImpulseData =
    bluetoothData.impulse && <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <LineChart data={mockImpulseData}
        width={Dimensions.get("window").width}
        height={300}
        chartConfig={chartConfig}
        bezier
      />
    </Layout>

  const renderForceData =
    bluetoothData.maxForce && <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <BarChart data={mockForceData}
        width={Dimensions.get("window").width}
        height={300}
        chartConfig={chartConfig}
        fromNumber={100}
        fromZero={true}
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
    dispatch(setImpulseAxis());
    // if (bluetoothData.impulse.length < 6) {
    //   tempImpulseData = bluetoothData.impulse.slice();
    // } else {
    //   tempImpulseData = bluetoothData.impulse.slice(1);
    // }
    // tempImpulseData.push(Math.random() * 300);
    // dispatch(setImpulse(tempImpulseData));

    // setImpulseXaxis(prev => {
    //   let tempAxis;
    //   if (prev.length < 6) {
    //     tempAxis = prev.slice();
    //   } else {
    //     tempAxis = prev.slice(1);
    //   }
    //   tempAxis.push(curTime);
    //   return tempAxis;
    // });
  }

  const addForcePoint = (datum) => {
    var curTime = getCurrentTime();
    const addMaxForceAction = {
      type: 'bluetooth/addMaxForce',
      payload: Math.random() * 300
    };
    dispatch(addMaxForce(addMaxForceAction));
    dispatch(setMaxForceAxis());
    
    // if (bluetoothData.impulse.length < 6) {
    //   tempMaxForceData = bluetoothData.maxForce.slice();
    // } else {
    //   tempMaxForceData = bluetoothData.maxForce.slice(1);
    // }
    // tempMaxForceData.push(Math.random() * 300);
    // dispatch(setMaxForce(tempMaxForceData));

    // setforceXaxis(prev => {
    //   let tempAxis;
    //   if (prev.length < 6) {
    //     tempAxis = prev.slice();
    //   } else {
    //     tempAxis = prev.slice(1);
    //   }
    //   tempAxis.push(curTime);
    //   return tempAxis;
    // });
  }

  let datum = 30;
  return (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      {renderImpulseData}
      <Button onPress={() => addImpulsePoint(datum)}>
        <Text>add data point</Text>
      </Button>
      {renderForceData}
      <Button onPress={() => addForcePoint(datum)}>
        <Text>add data point</Text>
      </Button>
    </Layout>
  );
}
