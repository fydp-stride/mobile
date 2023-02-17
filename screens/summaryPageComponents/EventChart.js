import * as React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart, StackedBarChart } from 'react-native-chart-kit';

export default EventChart = props => {
  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    color: (opacity = 1) => '#5DB075',
    fillShadowGradient: '#5DB075',
    fillShadowGradientOpacity: 1,

    barPercentage: 0.6, // percentage of available width each bar should be
    propsForVerticalLabels: {
      fontSize: 16,
    },
    barRadius: 10,
  };
  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          Week of Feb 14-20
        </Text>
      </View>
      <BarChart
        data={props.dateData}
        width={Dimensions.get("window").width}
        height={240}
        chartConfig={chartConfig}
        showBarTops={false}
        fromZero={true}
        withInnerLines={false}
        style={{borderRadius: 16, paddingRight: 15, marginBottom: 10  }}
        withHorizontalLabels={false}
        xLabelsOffset={8}
        verticalLabelRotation={360 - 35}
        yAxisInterval={1}
      />
    </View>
  );
};
