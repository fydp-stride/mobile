import React from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import {
  PermissionsAndroid,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Button, Text, Layout, Toggle } from '@ui-kitten/components';
import {
  Body,
  Container,
  Content,
  Icon,
  Right,
  Toast,
  Header,
  Title,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * See https://reactnative.dev/docs/permissionsandroid for more information
 * on why this is required (dangerous permissions).
 */
const requestAccessFineLocationPermission = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Access fine location required for discovery',
      message:
        'In order to perform discovery, you must enable/allow ' +
        'fine location access.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

/**
 * Displays the device list and manages user interaction.  Initially
 * the NativeDevice[] contains a list of the bonded devices.  By using
 * the Discover Devices action the list will be updated with unpaired
 * devices.
 *
 * From here:
 * - unpaired devices can be paired
 * - paired devices can be connected
 *
 * @author kendavidson
 */
export default class DeviceListScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      accepting: false,
      discovering: false,
    };
  }

  componentDidMount() {
    //this.getBondedDevices();
  }

  componentWillUnmount() {
    if (this.state.discovering) {
      this.cancelDiscovery(false);
    }
  }

  /**
   * Gets the currently bonded devices.
   */
  getBondedDevices = async unloading => {
    console.log('DeviceListScreen::getBondedDevices');
    try {
      let bonded = await RNBluetoothClassic.getBondedDevices();
      //console.log('DeviceListScreen::getBondedDevices found', bonded);
      this.setState({ devices: bonded });
    } catch (error) {
      this.setState({ devices: [] });

      Toast.show({
        text: error.message,
        duration: 5000,
      });
    }
  };

  /**
   * Starts attempting to accept a connection.  If a device was accepted it will
   * be passed to the application context as the current device.
   */

  startDiscovery = async () => {
    try {
      let granted = await requestAccessFineLocationPermission();

      if (!granted) {
        throw new Error('Access fine location was not granted');
      }

      this.setState({ discovering: true });

      let devices = [...this.state.devices];

      try {
        let unpaired = await RNBluetoothClassic.startDiscovery();

        let index = devices.findIndex(d => !d.bonded);
        if (index >= 0) {
          devices.splice(index, devices.length - index, ...unpaired);
        } else {
          devices.push(...unpaired);
        }

        Toast.show({
          text: `Found ${unpaired.length} unpaired devices.`,
          duration: 2000,
        });
      } finally {
        this.setState({ devices, discovering: false });
      }
    } catch (err) {
      Toast.show({
        text: err.message,
        duration: 2000,
      });
    }
  };

  cancelDiscovery = async () => {
    try {
    } catch (error) {
      Toast.show({
        text: 'Error occurred while attempting to cancel discover devices',
        duration: 2000,
      });
    }
  };

  requestEnabled = async () => {
    try {
      this.props.bluetoothEnabled =
        await RNBluetoothClassic.requestBluetoothEnabled();
      this.componentDidMount();
    } catch (error) {
      Toast.show({
        text: `Error occurred while enabling bluetooth: ${error.message}`,
        duration: 200,
      });
    }
  };

  render() {
    // let toggleAccept = this.state.accepting
    //   ? () => this.cancelAcceptConnections()
    //   : () => this.acceptConnections();

    let toggleDiscovery = this.state.discovering
      ? () => this.cancelDiscovery()
      : () => this.startDiscovery();

    return (
      <Layout
        style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <View iosBarStyle="light-content">
          {this.props.bluetoothEnabled ? (
            <View>
              <Button onPress={this.getBondedDevices}>
                <Text>Get Bonded Devices</Text>
              </Button>
            </View>
          ) : undefined}
        </View>
        {this.props.bluetoothEnabled ? (
          <>
            {Platform.OS !== 'ios' ? (
              <View>
                <Button onPress={toggleDiscovery}>
                  <Text>
                    {this.state.discovering
                      ? 'Discovering (cancel)...'
                      : 'Discover Devices'}
                  </Text>
                </Button>
              </View>
            ) : undefined}
            <View style={styles.body}>
              <Text style={styles.titleText}>Devices</Text>
            </View>
            <DeviceList
              devices={this.state.devices}
              onPress={this.props.selectDevice}
            />
          </>
        ) : (
          <View style={styles.center}>
            <Text>Bluetooth is OFF</Text>
            <Button onPress={() => this.requestEnabled()}>
              <Text>Enable Bluetooth</Text>
            </Button>
          </View>
        )}
      </Layout>
    );
  }
}

/**
 * Displays a list of Bluetooth devices.
 *
 * @param {NativeDevice[]} devices
 * @param {function} onPress
 */
export const DeviceList = ({ devices, onPress }) => {
  const renderItem = ({ item }) => {
    return (
      <DeviceListItem
        device={item}
        onPress={onPress}
      />
    );
  };

  return (
    <FlatList
      data={devices}
      renderItem={renderItem}
      keyExtractor={item => item.address}
    />
  );
};

export const DeviceListItem = ({ device, onPress }) => {
  let bgColor = device.connected ? 'blue' : 'gray';
  let icon = device.bonded ? 'bluetooth' : 'cellular';

  return (
    <TouchableOpacity
      onPress={() => onPress(device)}
      style={styles.deviceListItem}>
      <View style={styles.deviceListItemIcon}>
        <Ionicons name={icon} size={20} color={bgColor} />
      </View>
      <View>
        <Text>{device.name}</Text>
        <Text note>{device.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deviceListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  deviceListItemIcon: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
