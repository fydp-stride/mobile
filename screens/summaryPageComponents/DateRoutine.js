import { View, Text } from 'react-native';
import * as React from 'react';


export default DateRoutine = ({ event }) => {

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0fceb',
        borderRadius: 10,
        margin: 7,
        marginHorizontal: 10,
        justifyContent: 'space-between',
      }}>
      <Text style={{ fontSize: 40, marginRight: 5 }}>
        {event.sessionName.includes('Walk') ? '🚶🏻‍♂️' : '🏃'}
      </Text>
      <View style={{ flex: 0.9 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
          {event.sessionName}
        </Text>
        <Text style={{ color: 'black', fontSize: 14 }}>
          ⧟ {event.distance}m | 🕘 {event.duration}min
        </Text>
        <Text style={{ color: 'black', fontSize: 14 }}>🚀 {event.impulse}Ns</Text>
        <Text style={{ color: 'black', fontSize: 14 }}>🦵 {event.maxForce}N</Text>
      </View>
      <View
        style={{
          backgroundColor: '#BEBEBE',
          borderRadius: 9,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}>
        <Text>{event.date}</Text>
      </View>
    </View>
  );
};
