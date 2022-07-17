import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  Button,
} from 'react-native';
import { Layout, Text } from '@ui-kitten/components';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import BackgroundGeolocation, {
  Location,
  Subscription,
} from 'react-native-background-geolocation';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const Map = ({ navigation }) => {
  const [location, setLocation] = React.useState('');
  const [locArr, setLocArr] = React.useState([]);
  const [tracking, setTracking] = React.useState(false);
  const [trackInterval, setTrackInterval] = React.useState(null);

  React.useEffect(() => {
    const getLocation = async () => {
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
      setLocation(loc);
    };

    getLocation().catch(e => console.error(e));
  }, []);

  const INTERVAL = 15000; // 10 s
  const startRecordingLoc = async () => {
    setTracking(true);
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
      }).catch(e => console.log(e));

      const latlng = {
        latitude: cur.coords.latitude,
        longitude: cur.coords.longitude
      };
      locArr.push(latlng);
      setLocArr(locArr);
      console.log(locArr);
    }, INTERVAL);
    setTrackInterval(interval);
  };

  const stopRecordingLoc = () => {
    setTracking(false);
    clearInterval(trackInterval);
    console.log(locArr);
    setLocArr([]);
  };

  return (
    <Layout
      style={{
        ...StyleSheet.absoluteFillObject,
        height: 600,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      {location && (
        <>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            showsUserLocation={true}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {locArr.length !== 0 && (
              <Polyline
                coordinates={locArr}
              />
            )}
          </MapView>
          {!tracking ? (
            <Button
              title="Click to start recording"
              onPress={startRecordingLoc}
            />
          ) : (
            <Button
              title="Click to stop recording"
              onPress={stopRecordingLoc}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default Map;
