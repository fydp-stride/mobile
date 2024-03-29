import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { TextInput, View, Animated } from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
  Toggle,
  Button
} from '@ui-kitten/components';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { connect, bindActionCreators } from 'react-redux';
import { toggleEnabled } from './actions/geolocationActions';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from '../colors';
import { useDevice } from '../src/connection/ConnectionContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// code for testing the notif
import { useToast } from "react-native-toast-notifications";

function HomeScreen(props) {
  const dispatch = useDispatch();
  const bluetoothData = useSelector(state => state.bluetoothData);
  let battery = bluetoothData.battery === 0 ? 0 : bluetoothData.battery;
  // battery = 49;
  const batteryPercentage = battery.toString() + "%";

  const toast = useToast();

  useEffect(() => {
    if (battery > 0 && battery <= 20) {
      toast.show(`Low Battery: ${battery}%`, {
        placement: "top", 
        duration: 4500
      });
    }
  }, [battery])

  const device = useDevice();
  let bgColor = device ? 'blue' : 'gray';

  return (
    <>
      <Text style={{ color: "black", textAlign: 'center', fontSize: 25, padding: 20, fontWeight: 'bold', backgroundColor: 'white' }}>Device Monitoring</Text>
      <Layout style={{ justifyContent: 'space-around', backgroundColor: 'white', flex: 1 }}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              backgroundColor: colors.mainGreen,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: colors.borderGreen,
              margin: 7,
              marginHorizontal: 10,
              justifyContent: 'center',
            }}>
            <View style={styles.progressBar}>
              <View style={{ backgroundColor: "#8BED4F", width: `${batteryPercentage}`, justifyContent: 'center', alignItems: 'center' }} />
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '35%' }}>
                <Text style={{ fontSize: 20 }}>{batteryPercentage}</Text>
              </View>
            </View>
            <View style={{
              backgroundColor: 'white',
              borderColor: '#000',
              borderWidth: 2,
              height: 30,
              width: 10,
              marginLeft: -2
            }}></View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 20,
              backgroundColor: colors.mainGreen,
              borderRadius: 10,
              margin: 7,
              marginHorizontal: 10,
              justifyContent: 'center',
              borderWidth: 0.5,
              borderColor: colors.borderGreen,
            }}>
              <View style={{flexDirection: "row"}}>
                <FontAwesome name={"bluetooth"} size={60} color={bgColor} />
                <Text style={{ fontSize: 40 }}> {device? "Connected": "Disconnected"}</Text>
              </View>
            </View>
        </View>
      </Layout>
    </>
  );
}

const styles = {
  progressBar: {
    height: 100,
    flexDirection: "row",
    width: '80%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5
  }
};

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(HomeScreen);
