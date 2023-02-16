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
// import Chart from '../components/Chart';

import { View, ScrollView } from 'react-native';

export default function SummaryScreen({ navigation }) {
  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.6, // percentage of available width each bar should be
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
    propsForVerticalLabels: {
      fontSize: 12,
    },
    decimalPlaces: 0, // optional, defaults to 2dp
    fillShadowGradient: '#e6e6e6', // add a shadow effect to the bars
    fillShadowGradientOpacity: 1, // shadow opacity
    strokeWidth: 0, // remove the line at the top of each bar
    useShadowColorFromDataset: false, // prevent the shadow color from being the same as the bar color
    propsForDots: {
      r: '0', // set the dot size to 0 to remove the dotted lines
    },
  };

  const dateData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [7, 6, 8, 5, 9, 7, 8],
      },
    ],
  };

  const DATE_EVENTS = [
    {
      date: '2023-02-16',
      sessionName: 'Morning Run',
      distance: '5km',
      duration: '30min',
    },
    {
      date: '2023-02-15',
      sessionName: 'Afternoon Walk',
      distance: '2km',
      duration: '20min',
    },
    {
      date: '2023-02-14',
      sessionName: 'Evening Jog',
      distance: '7km',
      duration: '45min',
    },
    {
      date: '2023-02-16',
      sessionName: 'Morning Run',
      distance: '5km',
      duration: '30min',
    },
    {
      date: '2023-02-15',
      sessionName: 'Afternoon Walk',
      distance: '2km',
      duration: '20min',
    },
    {
      date: '2023-02-14',
      sessionName: 'Evening Jog',
      distance: '7km',
      duration: '45min',
    },
  ];

  const BarChartComponent = () => {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            Week of Feb 14-20
          </Text>
          {/* <Text style={{ fontWeight: 'bold', fontSize: 20 }}>7d</Text> */}
        </View>
        <BarChart
          data={dateData}
          width={400}
          height={220}
          chartConfig={chartConfig}
        />
      </View>
    );
  };

  const DateEvent = ({ event }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#F5F5F5',
          borderRadius: 10,
          margin: 5,
        }}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>🏃</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            {event.sessionName}
          </Text>
          <Text>
            {event.distance} | {event.duration}
          </Text>
        </View>
        <View
          style={{ backgroundColor: '#BEBEBE', borderRadius: 5, padding: 5 }}>
          <Text>{event.date}</Text>
        </View>
      </View>
    );
  };

  const DateEventsList = () => {
    return (
      <ScrollView>
        {DATE_EVENTS.map(event => (
          <DateEvent key={event.date} event={event} />
        ))}
      </ScrollView>
    );
  };

  // some event dates:

  return (
    <View>
      <BarChartComponent />
      <DateEventsList />
    </View>
  );
}
