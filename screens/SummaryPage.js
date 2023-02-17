import {
  Layout,
  Text,
  Button,
  Modal,
  Card,
  Input,
} from '@ui-kitten/components';
import * as React from 'react';
import DateRoutine from './summaryPageComponents/DateRoutine';
import EventChart from './summaryPageComponents/EventChart';
import { Dimensions } from 'react-native';

// import Chart from '../components/Chart';

import { View, ScrollView } from 'react-native';
import RoutinesList from './summaryPageComponents/RoutinesList';

export default function SummaryScreen({ navigation }) {
  const dateData = {
    barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"],
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
  // some event dates:
  return (
    <View style={{backgroundColor: 'white', height: Dimensions.get("window").height}}>
      <EventChart dateData={dateData}/>
      <RoutinesList eventData={DATE_EVENTS} />
    </View>
  );
}
