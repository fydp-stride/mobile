/// Renders the main view of the AdvancedApp.useState
///
/// - Calls BackgroundGeolocation.ready.
/// - Handles ON/OFF <Switch /> with BackgroundGeolocation.start / .stop()
/// - [^] getCurrentPosition button.
/// - [>] / [||] changePace button.
///
import React from 'react';
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

const HomeView = ({ route, navigation }) => {
  const [enabled, setEnabled] = React.useState(false);
  const [cannotStartVisible, setCannotStartVisible] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [location, setLocation] = React.useState<Location>(null);
  const [odometer, setOdometer] = React.useState(0);
  const [motionActivityEvent, setMotionActivityEvent] = React.useState<MotionActivityEvent>(null);
  const [testClicks, setTestClicks] = React.useState(0);
  const [trackInterval, setTrackInterval] = React.useState<any>(null);
  const [locationSubscriber, setLocationSubscriber] = React.useState<any>(null);

  /// Init BackgroundGeolocation when view renders.
  React.useEffect(() => {
    // Configure BackgroundGeolocation.ready().
    initBackgroundGeolocation();
    AppState.addEventListener('change', _handleAppStateChange);
  }, []);

  /// Add a toggle <Switch> to top-right toolbar.
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Switch onValueChange={onClickEnable} value={enabled} />
      ),
    });
  }, [enabled]);

  /// Location effect-handler
  React.useEffect(() => {
    if (!location) return;
    // setOdometer(location.odometer);

  }, [location]);

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
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    });

    setOdometer(state.odometer);
    setEnabled(state.enabled);
    setIsMoving(state.isMoving || false); // <-- TODO re-define @prop isMoving? as REQUIRED in State
  };

  /// <Switch> handler to toggle the plugin on/off.
  const onClickEnable = async (value: boolean) => {
    setEnabled(value);
    if (value) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      // Toggle the [ > ] / [ || ] button in bottom-toolbar back to [ > ]
      setIsMoving(false);
    }
  };

  const INTERVAL = 15000; // 10 s
  const startRecordingLoc = async () => {
    if (!enabled) {
      setCannotStartVisible(true);
      return;
    }
    const subscription = BackgroundGeolocation.onLocation((location) => {
      setLocation(location);
      console.log("[onLocation] success: ", location);
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
      // console.log(cur);
    }, INTERVAL);
    setTrackInterval(interval);

  };

  const stopRecordingLoc = () => {
    BackgroundGeolocation.changePace(false);
    locationSubscriber.remove();
    setLocationSubscriber(null);
    setIsMoving(false);
    clearInterval(trackInterval);
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
      <Text style={{ color: "black", textAlign: 'center', fontSize: 25, margin: 20 }}>Trip Planner</Text>
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
            <Button onPress={startRecordingLoc} style={{ backgroundColor: 'green' }}>Start</Button>
          ) : (
            <Button onPress={stopRecordingLoc} style={{ backgroundColor: COLORS.gold }}>Stop</Button>
          )}
        </View>
      </View>
      <View style={{ backgroundColor: COLORS.green, flexDirection: 'column', width: '80%', position: 'relative', left: "10%", borderRadius: 20 }}>
        <Text style={{ alignSelf: 'center', fontSize: 25 }}>25:11</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text>Avg. Angle</Text>
            <Text>34*</Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text>Avg. Force</Text>
            <Text>535N</Text>
          </View>
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Text>Distance</Text>
            <Text>3.4km</Text>
          </View>
        </View>
      </View>
      <List data={data} renderItem={renderRoutes} style={{ backgroundColor: COLORS.white, marginTop: 20}} />
    </SafeAreaView>
  );
};

export default HomeView;

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
