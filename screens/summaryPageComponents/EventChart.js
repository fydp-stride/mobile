import React, { useRef } from 'react';
import { FlatList, View, Text, Dimensions } from 'react-native';
import { LineChart, BarChart, StackedBarChart } from 'react-native-chart-kit';
import { colors } from '../../colors'

export default EventChart = props => {
  const chartConfig = {
    backgroundGradientFrom: colors.lightGreen,
    backgroundGradientTo: colors.lightGreen,
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
              fontSize: 15,
              color: 'gray',
              textAlign: 'left',
              paddingTop: 10 ,
              paddingBottom: 20,
              marginLeft: 5
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
          yAxisInterval={1}
          verticalLabelRotation={360 - 35}
          backgroundColor={'#F5F5F5'}
          showValuesOnTopOfBars={true}
        />
      </View>
    );
  };

  const keyExtractor = (item, index) => index.toString();
  const chartWidth = Dimensions.get('window').width - 20; 
  const leftMargin = (Dimensions.get('window').width - chartWidth) / 2;

  const flatListRef = useRef(null);
  const onMomentumScrollEnd = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / chartWidth);
    // this is also the index we use to filter components
    // console.log(
    //   `dividing ${event.nativeEvent.contentOffset.x} by ${chartWidth}. Getting index: ${index}`,
    // );
    flatListRef.current.scrollToIndex({ index, animated: true });
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
        contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', marginLeft: 7}} // IDFK why
        onMomentumScrollEnd={onMomentumScrollEnd}
        decelerationRate={'fast'}
      />
    </View>
  );
};
