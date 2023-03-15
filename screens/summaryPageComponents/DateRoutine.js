import { View, Text } from 'react-native';
import * as React from 'react';
import { useSelector } from 'react-redux';


export default DateRoutine = ({ event }) => {
  const useMetric = useSelector(state => state.userData.useMetric);

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
          ⧟ {useMetric? event.distance : Math.floor(event.distance * 3.28)} {useMetric ? 'm' : 'ft'} | 🕘 {event.duration} min
        </Text>
        <Text style={{ color: 'black', fontSize: 14 }}>🚀 {event.impulse} Ns</Text>
        <Text style={{ color: 'black', fontSize: 14 }}>🦵 {event.maxForce} N</Text>
      </View>
      <View
        style={{
          backgroundColor: '#BEBEBE',
          borderRadius: 9,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}>
        <Text>{event.date}</Text>
        <Text style={{textAlign: 'center'}}>{event.time}</Text>
      </View>
    </View>
  );
};
