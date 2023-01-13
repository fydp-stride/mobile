/////
/// TSMapView Component
/// Renders a MapView from react-native-maps.
/// - renders a marker for each recorded location
/// - renders currently monitored geofences
/// - renders markers showing geofence events (enter, exit, dwell)
/// - renders a PolyLine where the plugin has tracked the device.
///
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import MapView, { Marker, Polyline } from 'react-native-maps';

import BackgroundGeolocation, {
  State,
  Location,
  MotionChangeEvent,
  Geofence,
  GeofencesChangeEvent,
  GeofenceEvent,
} from 'react-native-background-geolocation';

/// Zoom values for the MapView
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

/// Color consts for MapView markers.
const GEOFENCE_STROKE_COLOR = 'rgba(17,183,0,0.5)';
const GEOFENCE_FILL_COLOR = 'rgba(17,183,0,0.2)';

export const COLORS = {
  gold: 'rgba(254,221,30,1)',//#fedd1e',
  light_gold: '#FFEB73',
  dark_gold: '#D5B601',
  white: '#fff',
  black: '#000',
  light_blue: '#2677FF',
  blue: '#337AB7',
  grey: '#404040',
  red: '#FE381E',
  green: '#16BE42',
  dark: '#272727',
  polyline_color: 'rgba(0,179,253, 0.6)', //'#00B3FD'
};

const Map = props => {
  /// MapView State.
  const [markers, setMarkers] = React.useState<any[]>([]);
  const [showsUserLocation, setShowsUserLocation] = React.useState(false);
  const [tracksViewChanges, setTracksViewChanges] = React.useState(false);
  const [followsUserLocation, setFollowUserLocation] = React.useState(false);
  const [mapScrollEnabled, setMapScrollEnabled] = React.useState(false);
  const [coordinates, setCoordinates] = React.useState<any[]>([]);

  /// BackgroundGeolocation Events.
  // const [location, setLocation] = React.useState<Location>(null);
  const [enabled, setEnabled] = React.useState(false);
  const [center, setCenter] = React.useState<any>(null);

  /// Register BackgroundGeolocation event-listeners.
  React.useEffect(() => {
    BackgroundGeolocation.getState().then((state: State) => {
      setEnabled(state.enabled);
    });

    const enabledSubscriber = BackgroundGeolocation.onEnabledChange(setEnabled);

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
      setCenter(loc);
    };

    getLocation().catch(e => console.error(e));

    return () => {
      // Important for with live-reload to remove BackgroundGeolocation event subscriptions.
      enabledSubscriber.remove();
      clearMarkers();
    };
  }, []);

  /// onEnabledChange effect.
  ///
  React.useEffect(() => {
    onEnabledChange();
  }, [enabled]);

  /// onLocation effect.
  ///
  React.useEffect(() => {
    if (!props.location) return;
    onLocation();
  }, [props.location]);

  /// onLocation effect-handler
  /// Adds a location Marker to MapView
  ///
  const onLocation = () => {
    console.log('[location] - ', props.location);
    if (!props.location.sample) {
      addMarker(props.location);
    }
    // setCenter(location);
  };

  /// EnabledChange effect-handler.
  /// Removes all MapView Markers when plugin is disabled.
  ///
  const onEnabledChange = () => {
    console.log('[onEnabledChange]', enabled);
    setShowsUserLocation(enabled);
    if (!enabled) {
      clearMarkers();
    }
  };

  /// MapView Location marker-renderer.
  const renderMarkers = () => {
    let rs: any = [];
    markers.map((marker: any) => {
      rs.push((
        <Marker
          key={marker.key}
          tracksViewChanges={tracksViewChanges}
          coordinate={marker.coordinate}
          // anchor={{ x: 0, y: 0.1 }}
          title={marker.title}
          rotation={marker.heading}
        >
          <View style={[styles.markerIcon]}></View>
        </Marker>
      ));
    });
    return rs;
  };

  /// Add a location Marker to map.
  const addMarker = (location: Location) => {
    const timestamp = new Date();
    const marker = {
      key: `${location.uuid}:${timestamp.getTime()}`,
      title: location.timestamp,
      heading: location.coords.heading,
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    };

    setMarkers(previous => [...previous, marker]);
    setCoordinates(previous => [...previous, {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }]);
  };

  /// Map pan/drag handler.
  const onMapPanDrag = () => {
    setFollowUserLocation(false);
    setMapScrollEnabled(true);
  };

  /// Clear all markers from the map when plugin is toggled off.
  const clearMarkers = () => {
    setCoordinates([]);
    setMarkers([]);
  };

  return (
    <MapView
      showsUserLocation={showsUserLocation}
      followsUserLocation={false}
      onPanDrag={onMapPanDrag}
      scrollEnabled={mapScrollEnabled}
      showsMyLocationButton={true}
      showsPointsOfInterest={false}
      showsScale={false}
      showsTraffic={false}
      style={styles.map}
      toolbarEnabled={false}>
      <Polyline
        key="polyline"
        coordinates={coordinates}
        geodesic={true}
        strokeColor="rgba(0,179,253, 0.6)"
        strokeWidth={6}
        zIndex={0}
      />
      {renderMarkers()}
      {/* {renderActiveGeofences()}
      {renderGeofencesHit()}
      {renderGeofencesHitEvents()} */}
    </MapView>
  );
};

export default Map;

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#272727',
  },
  map: {
    flex: 1,
  },
  stopZoneMarker: {
    borderWidth: 1,
    borderColor: 'red',
    backgroundColor: COLORS.red,
    opacity: 0.2,
    borderRadius: 15,
    zIndex: 0,
    width: 30,
    height: 30,
  },
  geofenceHitMarker: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 6,
    zIndex: 10,
    width: 12,
    height: 12,
  },
  markerIcon: {
    // borderWidth: 1,
    // borderColor: '#000000',
    // backgroundColor: COLORS.polyline_color,
    //backgroundColor: 'rgba(0,179,253, 0.6)',
    // width: 10,
    // height: 10,
    // borderRadius: 5,
    // width: 0,
    // height: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 3.5,
    borderBottomWidth: 9.0,
    borderLeftWidth: 3.5,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'blue',
    borderLeftColor: 'transparent',
  },
});
