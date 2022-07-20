import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Button } from '@ui-kitten/components';
import { LineChart, BarChart } from 'react-native-chart-kit';

export default function Visualization({ navigation }) {

  // data
  const [impulseData, setImpulseData] = useState(null);
  const [forceData, setForceData] = useState(null);

  const mockImpulseData = {
    labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      }
    ],
    legend: ["Average impulse"] // optional
  };

  const mockForceData = {
    labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 6 // optional
      }
    ],
  };
  useEffect(() => {
    setImpulseData(mockImpulseData);
    setForceData(mockForceData);
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
      <LineChart data={impulseData}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </Layout>

  const renderForceData =
    forceData && <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <BarChart data={forceData}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={chartConfig}
      />
    </Layout>



  const [x, setX] = useState(["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun."]);


  const addTestPoint = () => {

    var date = new Date();
    var dateStr =
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);

    let tempAxis = x.slice(1);
    tempAxis.push(dateStr)
    setX(tempAxis);

    const temp = {
      labels: x,
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ],


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
          data: [100],
          withDots: false,
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 6 // optional
        }

      ],
      legend: ["Average impulse"] // optional
    };

    setImpulseData(temp);
  }
  return (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      {/* <Text style={{ fontSize: 30 }}>Graph</Text> */}
      {renderImpulseData}
      <Button onPress={() => addTestPoint()}>
        <Text>rand test data</Text>
      </Button>
      {renderForceData}
    </Layout>
  );
}
