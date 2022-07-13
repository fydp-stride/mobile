import React from 'react';
import { Switch, View} from 'react-native';
import { Button, Text, Layout, Toggle} from '@ui-kitten/components';

import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';

const getCurrentLoc = async (enabled, setLocation) => {
  if (!enabled) {
    console.log('Not enabled');
    return;
  }
  console.log('Getting current pos');
  let loc = await BackgroundGeolocation.getCurrentPosition({
    timeout: 30, // 30 second timeout to fetch location
    maximumAge: 5000, // Accept the last-known-location if not older than 5000 ms.
    desiredAccuracy: 10, // Try to fetch a location with an accuracy of `10` meters.
    samples: 3, // How many location samples to attempt.
    extras: {
      // Custom meta-data.
      route_id: 123,
    },
  });
  console.log('[getLocation]', loc.coords);
  setLocation(JSON.stringify(loc, null, 2));
};

const GeoTest = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [location, setLocation] = React.useState('');

  React.useEffect(() => {
    /// 1.  Subscribe to events.
    // const onLocation: Subscription = BackgroundGeolocation.onLocation(loc => {
    //   console.log('[onLocation]', loc);
    //   setLocation(JSON.stringify(loc, null, 2));
    // });

    // const onMotionChange: Subscription = BackgroundGeolocation.onMotionChange(
    //   event => {
    //     console.log('[onMotionChange]', event);
    //   },
    // );

    // const onActivityChange: Subscription =
    //   BackgroundGeolocation.onActivityChange(event => {
    //     console.log('[onMotionChange]', event);
    //   });

    // const onProviderChange: Subscription =
    //   BackgroundGeolocation.onProviderChange(event => {
    //     console.log('[onProviderChange]', event);
    //   });

    /// 2. ready the plugin.
    BackgroundGeolocation.ready({
      // Geolocation Config
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 5,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false, // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: false, // <-- Auto start tracking when device is powered-up.
      // HTTP / SQLite config
      url: 'http://yourserver.com/locations',
      batchSync: false, // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      autoSync: true, // <-- [Default: true] Set true to sync each location to server as it arrives.
      headers: {
        // <-- Optional HTTP headers
        'X-FOO': 'bar',
      },
      params: {
        // <-- Optional HTTP params
        auth_token: 'maybe_your_server_authenticates_via_token_YES?',
      },
    }).then(state => {
      setEnabled(state.enabled);
      console.log(
        '- BackgroundGeolocation is configured and ready: ',
        state.enabled,
      );
    });

    return () => {
      // Remove BackgroundGeolocation event-subscribers when the View is removed or refreshed
      // during development live-reload.  Without this, event-listeners will accumulate with
      // each refresh during live-reload.
      // onLocation.remove();
      // onMotionChange.remove();
      // onActivityChange.remove();
      // onProviderChange.remove();
    };
  }, []);

  /// 3. start / stop BackgroundGeolocation
  React.useEffect(() => {
    if (enabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
      setLocation('');
    }
  }, [enabled]);

  return (
    <Layout style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text>Click to enable BackgroundGeolocation</Text>
      {/* <Toggle value={enabled} onChange={setEnabled}>
        {evaProps => <Text {...evaProps}>Place your Text</Text>}
      </Toggle> */}
      <Toggle checked={enabled} onChange={setEnabled}>
        {/* {evaProps => <Text {...evaProps}></Text>} */}
      </Toggle>
      <Button onPress={() => getCurrentLoc(enabled, setLocation)}>
        <Text>Click to get current location</Text>
      </Button>
      <Text style={{fontFamily: 'monospace', fontSize: 12}}>{location}</Text>
    </Layout>
  );
};

export default GeoTest;
