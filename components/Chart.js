import { View, StyleSheet } from 'react-native';
import ChartBar from './ChartBar';
import React from 'react';

const Chart = props => {
  return (
    <View style={chart.chart}>
      {props.data.map(datapoint => (
        <ChartBar value={datapoint.value} />
      ))}
    </View>
  );
};

const chart = StyleSheet.create({
  chart: {
    padding: '1rem',
    borderRadius: '12px',
    backgroundColor: '#f8dfff',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-around',
    height: '10rem',
  },
});

const bar = StyleSheet.create({
  chart_bar: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chart_bar__inner: {
    height: '100%',
    width: '100%',
    border: '1px solid #313131',
    borderRadius: '12px',
    backgroundColor: '#c3b4f3',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  chart_bar__fill: {
    backgroundColor: '#4826b9',
    width: '100%',
    transition: 'all 0.3s ease-out',
  },
  chart_bar__label: {
    fontWeight: 'bold',
    fontSize: '0.5rem',
    textAlign: 'center',
  },
});

export default Chart;
