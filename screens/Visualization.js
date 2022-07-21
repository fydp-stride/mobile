import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Button } from '@ui-kitten/components';
import { LineChart, BarChart } from 'react-native-chart-kit';

import { useSelector, useDispatch } from 'react-redux';
import { setImpulse } from './bluetoothSlice';

export default function Visualization({ navigation }) {

  // data
  // const impulseData = useSelector(state => state.impulse);
  const dispatch = useDispatch();

  const [impulseData, setImpulseData] = useState([0]);
  const [forceData, setForceData] = useState([0]);

  const [impulseXaxis, setImpulseXaxis] = useState([]);
  const [forceXaxis, setforceXaxis] = useState([])

  const mockImpulseData = {
    labels: impulseXaxis,
    datasets: [
      {
        data: impulseData,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      },
      {
        data: [0],
        withDots: false,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      },
      {
        data: [500],
        withDots: false,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      }
    ],
    legend: ["Average impulse"] // optional
  };

  const mockForceData = {
    labels: forceXaxis,
    datasets: [
      {
        data: forceData,
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
    impulseData && <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <LineChart data={mockImpulseData}
        width={Dimensions.get("window").width}
        height={300}
        chartConfig={chartConfig}
        bezier
      />
    </Layout>

  const renderForceData =
    forceData && <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
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
    setImpulseData(prev => {
      let tempImpulseData;
      if (prev.length < 6) {
        tempImpulseData = prev.slice();
      } else {
        tempImpulseData = prev.slice(1);
      }
      tempImpulseData.push(Math.random() * 300);
      return tempImpulseData;
    });

    setImpulseXaxis(prev => {
      let tempAxis;
      if (prev.length < 6) {
        tempAxis = prev.slice();
      } else {
        tempAxis = prev.slice(1);
      }
      tempAxis.push(curTime);
      return tempAxis;
    });
  }

  const addForcePoint = (datum) => {
    var curTime = getCurrentTime();
    setForceData(prev => {
      let tempImpulseData;
      if (prev.length < 6) {
        tempImpulseData = prev.slice();
      } else {
        tempImpulseData = prev.slice(1);
      }
      tempImpulseData.push(Math.random() * 100);
      return tempImpulseData;
    });

    setforceXaxis(prev => {
      let tempAxis;
      if (prev.length < 6) {
        tempAxis = prev.slice();
      } else {
        tempAxis = prev.slice(1);
      }
      tempAxis.push(curTime);
      return tempAxis;
    });
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
