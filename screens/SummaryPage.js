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
import { useSelector, useDispatch, batch } from 'react-redux';

// import Chart from '../components/Chart';

import { View, ScrollView } from 'react-native';
import RoutinesList from './summaryPageComponents/RoutinesList';
import { setDateEvent, setWeekArray } from './actions/summaryDataActions';
import { setDailyImpulse, setLastUsedDate } from './actions/userDataActions';

function SummaryPage(props) {
  let [startTime, durationMillis] = props.geolocationData.time;
  let DATE_EVENTS = props.summaryData.dateEvents;
  let WEEK_ARRAY = props.summaryData.weekArrays;

  let lastUsedDate = new Date(props.userData.lastUsedDate).toLocaleDateString();
  let dailyImpulse = props.userData.dailyImpulse;

  let today = new Date().toLocaleDateString();
  React.useEffect(() => {
    if (lastUsedDate === today) {
      // Date equals today's date
      // do nothing
    } else {
      // calculate the total impulse
      batch(() => {
        dispatch(setLastUsedDate(today));
        dispatch(setDailyImpulse(0));
      });
    }
  }, []);

  React.useEffect(() => {
    // calculate total impulse, go through date events first to create a dictionary
    // console.log(DATE_EVENTS);
    if (DATE_EVENTS) {
      datesToImpulse = {}
      for (let i = 0; i < DATE_EVENTS.length; i++) {
        let item = DATE_EVENTS[i];
        let curDate = item.date;
        let curImpulse = item.impulse;
        if (Object.keys(datesToImpulse).includes(curDate)) {
          datesToImpulse[curDate] += curImpulse;
        } else {
          datesToImpulse[curDate] = curImpulse;
        }
      }
      console.log(datesToImpulse);

      // go through dictionary to populate WEEK_ARRAY
      let WEEK_ARRAY_copy = JSON.parse(JSON.stringify(WEEK_ARRAY));
      // console.log(WEEK_ARRAY_copy);
      for (const date in datesToImpulse) {
        let impulseValue = datesToImpulse[date]; // date: impulse
        for (let i = 0; i < WEEK_ARRAY_copy.length; i++) {
          let week = WEEK_ARRAY_copy[i]; // one of week array
          // console.log(week);
          // console.log(week.datasets);
          // console.log(week.datasets[0].dates);
          for (let j = 0; j < week.datasets[0].dates.length; j++) {
            let day = week.datasets[0].dates[j]; // the date of the week, check if it is the same as date
            // console.log(day, date)
            if (date === day) {
              WEEK_ARRAY_copy[i].datasets[0].data[j] = impulseValue;
              console.log(WEEK_ARRAY_copy[i].datasets)
            }
          }
        }
      }
      // console.log(WEEK_ARRAY_copy);
      dispatch(setWeekArray(WEEK_ARRAY_copy));
    }
  }, [DATE_EVENTS]);

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
          fontSize: 25  ,
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
          Running History
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