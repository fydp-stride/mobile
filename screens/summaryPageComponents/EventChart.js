
import React, { useRef } from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart, StackedBarChart } from 'react-native-chart-kit';

export default EventChart = props => {
  const chartConfig = {
    // backgroundGradientFrom: '#FFFFFF',
    // backgroundGradientTo: '#FFFFFF',
    backgroundGradientFrom: '#f0fceb',
    backgroundGradientTo: '#f0fceb',
    color: (opacity = 1) => '#5DB075',
    fillShadowGradient: '#5DB075',
    fillShadowGradientOpacity: 1,
    barPercentage: 0.6, // percentage of available width each bar should be
    propsForVerticalLabels: {
      fontSize: 16,
    },
    barRadius: 10,
  };

  const weeklyCharts = [];

  const renderWeeklyChart = () => {
    return (
      <View
        style={{ backgroundColor: '#FFFFFF', borderRadius: 16, padding: 3 }}>
        <View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'black',
              textAlign: 'center',
              paddingVertical: 10
            }}>
            Week of {props.dateData.weekOf}
          </Text>
        </View>
        <BarChart
          data={props.dateData}
          width={Dimensions.get('window').width - 20}
          height={240}
          chartConfig={chartConfig}
          showBarTops={false}
          fromZero={true}
          withInnerLines={false}
          style={{
            borderRadius: 16,
            alignSelf: 'center',
            paddingRight: 20,
            paddingLeft: 0,
            paddingBottom: 10,
          }}
          withHorizontalLabels={false}
          xLabelsOffset={8}
          verticalLabelRotation={360 - 35}
          yAxisInterval={1}
          backgroundColor={'#F5F5F5'}
        />
      </View>
    );
  };

  const keyExtractor = (item, index) => index.toString();
  const numWeeks = 5;
  const chartWidth = Dimensions.get('window').width - 20; // Set the width of the chart
  
  const flatListRef = useRef(null);
  const onMomentumScrollEnd = (event) => {

    // TODO: need some serious logic handling here for out of bound
    const index = Math.round(event.nativeEvent.contentOffset.x / chartWidth);
    flatListRef.current.scrollToIndex({ index, animated: true, duration: 1,  });
  };

  return (    
    <View>
       <FlatList
       ref={flatListRef}
        data={new Array(numWeeks)}
        renderItem={renderWeeklyChart}
        keyExtractor={keyExtractor}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingLeft: 7}} // LMAOOOOO
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate={'fast'}
      />
    </View>
  );
};
