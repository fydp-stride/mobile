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
  Text,
  View,
  SafeAreaView,
  Switch,
  TouchableHighlight,
  AppState,
  Button,
} from 'react-native';

import BackgroundGeolocation, {
  Location,
  State,
  MotionActivityEvent,
} from 'react-native-background-geolocation';

import BackgroundFetch from 'react-native-background-fetch';

import Map, { COLORS } from './Map';

const HomeView = ({ route, navigation }) => {
  const [enabled, setEnabled] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [location, setLocation] = React.useState<Location>(null);
  const [odometer, setOdometer] = React.useState(0);
  const [motionActivityEvent, setMotionActivityEvent] = React.useState<MotionActivityEvent>(null);
  const [testClicks, setTestClicks] = React.useState(0);
  const [trackInterval, setTrackInterval] = React.useState<any>(null);

  /// Init BackgroundGeolocation when view renders.
  React.useEffect(() => {
    // Register BackgroundGeolocation event-listeners.

    // For printing odometer in bottom toolbar.
    const locationSubscriber: any = BackgroundGeolocation.onLocation(setLocation, error => {
      console.warn('[onLocation] ERROR: ', error);
    });
    // Auto-toggle [ play ] / [ pause ] button in bottom toolbar on motionchange events.
    const motionChangeSubscriber: any = BackgroundGeolocation.onMotionChange(location => {
      setIsMoving(location.isMoving);
    });
    // For printing the motion-activity in bottom toolbar.
    const activityChangeSubscriber: any = BackgroundGeolocation.onActivityChange(setMotionActivityEvent);

    // Configure BackgroundGeolocation.ready().
    initBackgroundGeolocation();

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      // When view is destroyed (or refreshed with dev live-reload),
      // Remove BackgroundGeolocation event-listeners.
      locationSubscriber.remove();
      motionChangeSubscriber.remove();
      activityChangeSubscriber.remove();
    }
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
    setOdometer(location.odometer);
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

  /// changePace handler.
  // const onClickChangePace = () => {
  //   BackgroundGeolocation.changePace(!isMoving);
  //   setIsMoving(!isMoving);
  // };

  const INTERVAL = 15000; // 10 s
  const startRecordingLoc = async () => {
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
      console.log(cur);
    }, INTERVAL);
    setTrackInterval(interval);
  };

  const stopRecordingLoc = () => {
    BackgroundGeolocation.changePace(false);
    setIsMoving(false);
    clearInterval(trackInterval);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Map style={styles.map} navigation={navigation} />
      <View
        style={{
          backgroundColor: COLORS.gold,
          height: 56,
          flexDirection: 'row',
        }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableHighlight
            onPress={() => setTestClicks(testClicks + 1)}
            underlayColor="transparent">
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={styles.statusBar}>
                {motionActivityEvent ? motionActivityEvent.activity : 'unknown'}
              </Text>
              <Text style={{ color: '#000' }}>&nbsp;•&nbsp;</Text>
              <Text style={styles.statusBar}>
                {(odometer / 1000).toFixed(1)}km
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={{ justifyContent: 'center', padding: 5 }}>
          {!isMoving ? (
            <Button title="Start" onPress={startRecordingLoc} />
          ) : (
            <Button title="Stop" onPress={stopRecordingLoc} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeView;

var styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gold,
    flexDirection: 'column',
    flex: 1,
  },
  map: {
    flex: 1,
  },
  statusBar: {
    fontSize: 16,
    color: '#000',
  },
});
