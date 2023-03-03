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
import { connect, bindActionCreators } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';

// import Chart from '../components/Chart';

import { View, ScrollView } from 'react-native';
import RoutinesList from './summaryPageComponents/RoutinesList';
import { setDateEvent, setWeekArray } from './actions/summaryDataActions';

function SummaryPage(props) {
  // const dateData = {
  //   weekOf: "Feb 14-20",
  //   barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"],
  //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  //   datasets: [
  //     {
  //       data: [7, 6, 8, 5, 9, 7, 8],
  //     },
  //   ],
  // };

  let [startTime, durationMillis] = props.geolocationData.time;
  let DATE_EVENTS = props.summaryData.dateEvents;
  let WEEK_ARRAY = props.summaryData.weekArrays;

  const dispatch = useDispatch();

  const mockWeekArrays = [
    {
      weekOf: 'Jan 31 - Feb 6',
      barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [7, 6, 8, 5, 9, 7, 8],
        },
      ],
    },
    {
      weekOf: 'Feb 7-13',
      barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [3, 10, 7, 1, 1, 4, 7],
        },
      ],
    },
    {
      weekOf: 'Feb 14-20',
      barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [10, 11, 1, 6, 9, 2, 13],
        },
      ],
    },
  ];

  console.log(props)

  const mockDateEvents = [
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

  // React.useEffect(() => {
  //   dispatch(setDateEvent(mockDateEvents));
  //   dispatch(setWeekArray(mockWeekArrays));
  // }, []);

  // some event dates:
  
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: Dimensions.get('window').height,
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          color: 'black',
          textAlign: 'left',
          marginLeft: 14,
          marginTop: 25,
        }}>
        Weekly Summary
      </Text>
      <EventChart monthData={WEEK_ARRAY} />
      <View
        style={{
          borderRadius: 10,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: 'gray',
            textAlign: 'left',
            paddingTop: 10,
            paddingBottom: 5,
            marginLeft: 15,
          }}>
          Running Historty
        </Text>
      </View>
      <RoutinesList eventData={DATE_EVENTS} />
    </View>
  );
}

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(SummaryPage);