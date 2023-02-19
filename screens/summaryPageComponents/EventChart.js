import React, { useRef } from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart, StackedBarChart } from 'react-native-chart-kit';

export default EventChart = props => {
  const chartConfig = {
    backgroundGradientFrom: '#f0fceb',
    backgroundGradientTo: '#f0fceb',
    color: (opacity = 1) => '#5DB075',
    fillShadowGradient: '#5DB075',
    fillShadowGradientOpacity: 1,
    barPercentage: 0.6,
    propsForVerticalLabels: {
      fontSize: 16,
    },
    barRadius: 10,
  };

  const renderWeeklyChart = ({ item }) => {
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
              paddingVertical: 10,
            }}>
            Week of {item.weekOf}
          </Text>
        </View>
        <BarChart
          data={item}
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
  const chartWidth = Dimensions.get('window').width - 20; 

  const flatListRef = useRef(null);
  const onMomentumScrollEnd = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / chartWidth);
    // console.log(
    //   `dividing ${event.nativeEvent.contentOffset.x} by ${chartWidth}. Getting index: ${index}`,
    // );
    flatListRef.current.scrollToIndex({ index, animated: true, duration: 1 });
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={props.monthData}
        renderItem={renderWeeklyChart}
        keyExtractor={keyExtractor}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingLeft: 7 }}
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate={'fast'}
      />
    </View>
  );
};
