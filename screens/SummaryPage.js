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
  let [startTime, durationMillis] = props.geolocationData.time;
  let DATE_EVENTS = props.summaryData.dateEvents;
  let WEEK_ARRAY = props.summaryData.weekArrays;

  const dispatch = useDispatch();
  
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