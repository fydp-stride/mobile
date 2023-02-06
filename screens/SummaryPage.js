import {
  Layout,
  Text,
  Button,
  Modal,
  Card,
  Input,
} from '@ui-kitten/components';
import * as React from 'react';
import { Dimensions } from 'react-native';
import { LineChart, BarChart, StackedBarChart } from 'react-native-chart-kit';
import Chart from '../components/Chart';

export default function SummaryScreen({ navigation }) {
  const chartConfig = {
    // backgroundGradientFrom: '#1E2923',
    // backgroundGradientFromOpacity: 0,
    // backgroundGradientTo: '#08130D',
    // backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };
  const data = {
    labels: ['Test1', 'Test2'],
    legend: ['L1', 'L2', 'L3'],
    data: [
      [60, 60, 60],
      [30, 30, 60],
    ],
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
  };
  return (
    <Layout style={{ alignItems: 'center', flex: 1, backgroundColor: 'white' }}>
      <Text
        style={{ fontSize: 30, color: 'black', margin: 20, paddingBottom: 15 }}>
        Summary Page
      </Text>
      {/* <Chart>
      </Chart> */}
      {/* <StackedBarChart
        // style={graphStyle}
        data={data}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={chartConfig}
      /> */}
    </Layout>
  );
}
