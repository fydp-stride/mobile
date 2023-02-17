import DateRoutine from './DateRoutine';
import * as React from 'react';
import { ScrollView } from 'react-native';

export default DateEventsList = ( props ) => {
  return (
    <ScrollView>
      {props.eventData.map((event, i) => (
        <DateRoutine key={i} event={event} />
      ))}
    </ScrollView>
  );
};
