/// Renders the main view of the AdvancedApp.useState
///
/// - Calls BackgroundGeolocation.ready.
/// - Handles ON/OFF <Switch /> with BackgroundGeolocation.start / .stop()
/// - [^] getCurrentPosition button.
/// - [>] / [||] changePace button.
///
import React from 'react';
import { useSelector, useDispatch, batch } from 'react-redux';
import { connect } from 'react-redux';
import { setState, setOdometer, setMarkers, setCoordinates, setTime } from './actions/geolocationActions';
import { clearImpulse, clearMaxForce, clearAngle } from './reducers/bluetoothSlice';

import {
  StyleSheet,
  View,
  SafeAreaView,
  Switch,
  TouchableHighlight,
  AppState,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  State,
  MotionActivityEvent,
} from 'react-native-background-geolocation';

import BackgroundFetch from 'react-native-background-fetch';

import Map, { COLORS } from './Map';

import { Button, Card, Icon, Layout, List, Modal, Text } from '@ui-kitten/components';
import { addDateEvent } from './actions/summaryDataActions';

import { useDeviceDispatch } from '../src/connection/ConnectionContext';

const HomeView = (props, { route, navigation }) => {
  let geolocationEnabled = props.userData.geolocationEnabled;
  let odometer = props.geolocationData.odometer;

  let maxForces = props.bluetoothData.maxForce;
  let impulses = props.bluetoothData.impulse;
  let angles = props.bluetoothData.angleRoll;

  let deviceDispatch = useDeviceDispatch();

  // let geoState = props.geolocationData.geoState;
  const [cannotStartVisible, setCannotStartVisible] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [location, setLocation] = React.useState<Location>(null);
  // const [odometer, setOdometer] = React.useState(0);
  const [motionActivityEvent, setMotionActivityEvent] = React.useState<MotionActivityEvent>(null);
  const [testClicks, setTestClicks] = React.useState(0);
  const [trackInterval, setTrackInterval] = React.useState<any>(null);
  const [locationSubscriber, setLocationSubscriber] = React.useState<any>(null);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [startTime, setStartTime] = React.useState(1);
  const [endTime, setEndTime] = React.useState(0);

  const timesOfDay = {
    'Morning': [4, 12],
    'Afternoon': [13, 18],
    'Night': [19, 3]
  };

  const MILLI = 1000;

  const dispatch = useDispatch();

  const getTime = () => {
    const time = Date.now();

    if (!isMoving) {
      // hasnt started yet
    } else {
      const display = time - startTime;
      // console.log(display);
      setMinutes(Math.floor((display / 1000 / 60)));
      setSeconds(Math.floor((display / 1000) % 60));
    }

  };

  /// Init BackgroundGeolocation when view renders.
  React.useEffect(() => {
    // Configure BackgroundGeolocation.ready().
    initBackgroundGeolocation();
    AppState.addEventListener('change', _handleAppStateChange);

    // const interval = setInterval(() => getTime(), 1000);

    // return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, [isMoving]);

  const _handleAppStateChange = async nextAppState => {
    console.log('[_handleAppStateChange]', nextAppState);
    if (nextAppState === 'background') {
      // App entered background.
    }
  };

  /// Configure BackgroundGeolocation.ready
  const initBackgroundGeolocation = async () => {
    // Ready the SDK and fetch the current state.
    const state: State = await BackgroundGeolocation.ready({
      // Debug
      reset: false,
      debug: true,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      // Geolocation
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,
      // Permissions
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title:
          "Allow {applicationName} to access this device's location even when closed or not in use.",
        message:
          'This app collects location data to enable recording your trips to work and calculate distance-travelled.',
        positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
        negativeAction: 'Cancel',
      },
      // HTTP & Persistence
      autoSync: true,
      maxDaysToPersist: 14,
      // Application
      stopOnTerminate: true,
      startOnBoot: true,
      enableHeadless: true,
    });

    // dispatch(setState(state));
    BackgroundGeolocation.setOdometer(0);
    dispatch(setOdometer(0));
    setIsMoving(state.isMoving || false); // <-- TODO re-define @prop isMoving? as REQUIRED in State
  };

  const INTERVAL = 10000; // 10 s
  const startRecordingLoc = async () => {
    if (!geolocationEnabled) {
      setCannotStartVisible(true);
      return;
    }
    batch(() => {
      dispatch(setOdometer(0));
      dispatch(setMarkers([]));
      dispatch(setCoordinates([]));
      if (deviceDispatch){
        deviceDispatch({
          type: 'start_run'
        })
      }
      dispatch(clearImpulse());
      dispatch(clearMaxForce());
      dispatch(clearAngle());

    })
    
    BackgroundGeolocation.setOdometer(0);
    const subscription = BackgroundGeolocation.onLocation((location) => {
      setLocation(location);
      //console.log("[onLocation] success: ", location.coords);
    }, (error) => {
      console.log("[onLocation] ERROR: ", error);
    });
    setLocationSubscriber(subscription);
    BackgroundGeolocation.changePace(true);
    setIsMoving(true);

    const interval = setInterval(async () => {
      let cur = await BackgroundGeolocation.getCurrentPosition({
        timeout: 15, // 30 second timeout to fetch location
        maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
        desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
        samples: 3, // How many location samples to attempt.
        extras: {
          // Custom meta-data.
          route_id: 123,
        },
      });
      dispatch(setOdometer(cur.odometer));
      // console.log(cur);
    }, INTERVAL);
    setTrackInterval(interval);
    setStartTime(Date.now());
  };

  const recordRoute = () => {
    const startDate = new Date(startTime);
    const hour = startDate.getHours();
    let time = '';
    if (hour > timesOfDay.Morning[0] && hour < timesOfDay.Afternoon[0]) {
      time = 'Morning';
    } else if (hour > timesOfDay.Afternoon[0] && hour < timesOfDay.Night[0]) {
      time = 'Afternoon';
    } else {
      time = 'Night';
    }

    if ((maxForces.reduce((partialSum, a) => partialSum + a, 0) / maxForces.length) < 1000) {
      time += ' Walk';
    } else {
      time += ' Run';
    }

    let newEvent = {
      date: startDate.toISOString().split('T')[0],
      sessionName: time,
      distance: odometer.toString() + 'm',
      duration: minutes.toString() + 'min'
    };
    console.log('newEvent', newEvent);

    dispatch(addDateEvent(newEvent));
  }

  const stopRecordingLoc = () => {
    BackgroundGeolocation.changePace(false);
    // if (!locationSubscriber) return;
    locationSubscriber.remove();
    setLocationSubscriber(null);
    setIsMoving(false);
    clearInterval(trackInterval);
    const endTimeNow = Date.now();
    setEndTime(endTimeNow);
    if (deviceDispatch) {
      deviceDispatch({
        type: 'stop_run'
      })
    }
    // console.log(endTimeNow, startTime, new Date(endTimeNow), new Date(startTime));
    if (endTimeNow - startTime > 60 * MILLI) { // dont record run unless its over 1 minute
      console.log(endTimeNow - startTime);
      dispatch(setTime([startTime, endTimeNow - startTime]));
      recordRoute();
    }

  };

  const data = [0, 1, 2]
  const renderRoutes = () => {
    return <View style={{ backgroundColor: 'green', flexDirection: 'row', width: '80%', borderRadius: 30, alignSelf: 'center', padding: 15, marginBottom: '5%' }}>
      <Icon name='flag-outline' style={styles.icon} />
      <View>
        <Text style={{ color: "black" }}>Route Name</Text>
        <Text style={{ color: "black" }}>Today, 6:00 PM</Text>
      </View>
    </View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: "black", textAlign: 'center', fontSize: 25, margin: 20, fontWeight: 'bold' }}>Route Tracker</Text>
      <Map style={styles.map} navigation={navigation} location={location} />
      <View
        style={{
          // backgroundColor: COLORS.grey,
          // height: 56,
          flexDirection: 'row',
          // position: 'absolute',
          // right: '50%', bottom: '50%', left: '50%', top: '50%'
          justifyContent: 'center', alignItems: 'center',
          // right: 0, bottom: '40%', left: 0, top: 0
        }}>
        <View style={{ justifyContent: 'center', padding: 5 }}>
          <Modal visible={cannotStartVisible}>
            <Card disabled={true}>
              <Text>Location tracking is not enabled, please enable it in Settings</Text>
              <Button onPress={() => setCannotStartVisible(false)}>
                OK
              </Button>
            </Card>
          </Modal>
          {!isMoving ? (
            <Button onPress={startRecordingLoc} style={{ backgroundColor: 'green', marginTop: -40, marginBottom: -40, zIndex: 999, borderWidth: 0, borderRadius: 100, height: 75, width: 75 }}>Start</Button>
          ) : (
            <Button onPress={stopRecordingLoc} style={{ backgroundColor: COLORS.gold, marginTop: -40, marginBottom: -40, zIndex: 999, borderWidth: 0, borderRadius: 100, height: 75, width: 75 }}>Stop</Button>
          )}
        </View>
      </View>
      <View style={{ backgroundColor: COLORS.green, flexDirection: 'column', width: '80%', position: 'relative', left: "10%", borderRadius: 20, paddingTop: 40, paddingBottom: 10 }}>
        <Text style={{ alignSelf: 'center', fontSize: 25 }}>{minutes}:{("0" + seconds).slice(-2)}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 10 }}>
            <Text>Total Impulse</Text>
            <Text>{impulses[impulses.length - 1]}Ns</Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text>Avg. Force</Text>
            <Text>{maxForces.length == 1 ? 0 : ((maxForces.reduce((partialSum, a) => partialSum + a, 0)) / (maxForces.length - 1)).toFixed(2)}N</Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 10 }}>
            <Text>Distance</Text>
            <Text>{parseInt(odometer)}m</Text>
          </View>
        </View>
      </View>
      {/* <List data={data} renderItem={renderRoutes} style={{ backgroundColor: COLORS.white, marginTop: 15}} /> */}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(HomeView);

var styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexDirection: 'column',
    flex: 1,
  },
  map: {
    // flex: 1,
    // borderRadius: 100
  },
  statusBar: {
    fontSize: 16,
    color: '#000',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
});
