import { View, Text } from 'react-native';
import * as React from 'react';


export default DateRoutine = ({ event }) => {
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
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black'}}>
          {event.sessionName}
        </Text>
        <Text style={{color: 'black'}}>
          {event.distance} | {event.duration}
        </Text>
      </View>
      <View style={{ backgroundColor: '#BEBEBE', borderRadius: 5, padding: 5 }}>
        <Text>{event.date}</Text>
      </View>
    </View>
  );
};
