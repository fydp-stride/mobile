import React from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { addImpulse, addMaxForce, clearImpulse, clearMaxForce, 
  clearAngle, setImpulse, setMaxForce, setBattery } from '../../screens/reducers/bluetoothSlice';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch, connect } from 'react-redux'
import { Button, Text, Layout, Toggle} from '@ui-kitten/components';
import {
  Container,
  Header,
  Left,
  Icon,
  Body,
  Title,
  Subtitle,
  Right,
} from 'native-base';
import { Buffer } from 'buffer';
import Ionicons from 'react-native-vector-icons/Ionicons';



const SYNC_BYTE = 0xFF;
const IMPULSE_CMD = 0x01;
const MAX_FORCE_CMD = 0x02;
const ANGLE_CMD = 0x03;
const BATT_CMD = 0x04;
const WEIGHT_CMD = 0x05;
const RESPONSE_CMD = 0x06;

/**
 * Manages a selected device connection.  The selected Device should
 * be provided as {@code props.device}, the device will be connected
 * to and processed as such.
 *
 */
class ConnectionScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: undefined,
      data: [],
      accumulateImpulse: 0,
      diffImpulse: 0,
      currentMaxForce: 0,
      polling: false,
      connection: false,
      connectionOptions: {
        //CONNECTION_TYPE: 'binary',
        READ_SIZE: 512,
        DELIMITER: '',
        DEVICE_CHARSET: "ISO-8859-1",
      },
    };

  }
  /**
   * Removes the current subscriptions and disconnects the specified
   * device.  It could be possible to maintain the connection across
   * the application, but for now the connection is within the context
   * of this screen.
   */
  async componentWillUnmount() {
    if (this.state.connection) {
      // try {
      //   await this.props.device.disconnect();
      // } catch (error) {
      //   // Unable to disconnect from device
      // }
    }
  }

  /**
   * Attempts to connect to the provided device.  Once a connection is
   * made the screen will either start listening or polling for
   * data based on the configuration.
   */
  componentDidMount() {
    // if(this.props.device) {
    //   setTimeout(() => this.connect(), 0);
    // }
  }

  async connect() {
    this.props.deviceDispatch({
      type: 'connect',
      device: this.props.device
    });
    //this.setState({ connection: true });
  }

  async disconnect(disconnected) {
    if (!disconnected) {
      this.props.deviceDispatch({
        type: 'disconnect',
        device: this.props.device
      });
      //this.setState({ connection: false });
    }
  }

  async toggleConnection() {
    if (this.props.deviceConnected) {
      this.disconnect();
    } else {
      this.connect();
    }
  }
  
  render() {
    let toggleIcon = this.props.deviceConnected
      ? 'radio-button-on'
      : 'radio-button-off';

    return (
      <View>
        <View iosBarStyle="light-content">
          <View>
            <Button transparent onPress={this.props.onBack}>
              <Ionicons name="chevron-back" size={20} color='black' />
              <Text> Back</Text>
            </Button>
          </View>
          <View>
            <Text>{this.props.device.name}</Text>
            <Text>{this.props.device.address}</Text>
          </View>
          <View>
            <Button transparent onPress={() => this.toggleConnection()}>
              <Ionicons name={toggleIcon} size={20} color='black' />
              <Text> {this.props.deviceConnected ?"Disconnect":"Connect"}</Text>
            </Button>
          </View>
          <View>
            <Button onPress={() => {
              this.props.deviceDispatch({
                type: 'write_weight',
                weight: weight ? parseFloat(this.props.userData.weight) : 80});
            }
              }>
              <Text> Send Weight Info </Text>
            </Button>
          </View>
          <View>
            <Button onPress={() => this.props.deviceDispatch({
                type: 'write_calibrate'})
              }>
              <Text> Calibrate </Text>
            </Button>
          </View>
        </View>
        <View style={styles.connectionScreenWrapper}>
          <FlatList
            style={styles.connectionScreenOutput}
            contentContainerStyle={{ justifyContent: 'flex-end' }}
            inverted
            ref="scannedDataList"
            data={this.state.data}
            keyExtractor={(item) => item.timestamp.toISOString()}
            renderItem={({ item }) => (
              <View
                id={item.timestamp.toISOString()}
                flexDirection={'row'} justifyContent={'flex-start'}>
                <Text>{item.timestamp.toLocaleDateString()}</Text>
                <Text>{item.type === 'sent' ? ' < ' : ' > '}</Text>
                <Text flexShrink={1}>{item.data.trim()}</Text>
              </View>
            )}
          />
          {/* <InputArea
            text={this.state.text}
            onChangeText={text => this.setState({ text })}
            onSend={() => this.sendData()}
            disabled={!this.props.deviceConnected}
          /> */}
        </View>
      </View>
    );
  }
}

const InputArea = ({ text, onChangeText, onSend, disabled }) => {
  let style = disabled ? styles.inputArea : styles.inputAreaConnected;
  return (
    <View style={style}>
      <TextInput
        style={styles.inputAreaTextInput}
        placeholder={'Command/Text'}
        value={text}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={onSend}
        returnKeyType="send"
        disabled={disabled}
      />
      <TouchableOpacity
        style={styles.inputAreaSendButton}
        onPress={onSend}
        disabled={disabled}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addImpulse: (impulse) => dispatch(addImpulse(impulse)),
    addMaxForce: (maxForce) => dispatch(addMaxForce(maxForce)),
    setBattery: (battery) => dispatch(setBattery(battery)),
  }
};

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionScreen);

/**
 * TextInput and Button for sending
 */
const styles = StyleSheet.create({
  connectionScreenWrapper: {
    flex: 1,
  },
  connectionScreenOutput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  inputArea: {
    flexDirection: 'row',
    alignContent: 'stretch',
    backgroundColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inputAreaConnected: {
    flexDirection: 'row',
    alignContent: 'stretch',
    backgroundColor: '#90EE90',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  inputAreaTextInput: {
    flex: 1,
    height: 40,
  },
  inputAreaSendButton: {
    justifyContent: 'center',
    flexShrink: 1,
  },
});
