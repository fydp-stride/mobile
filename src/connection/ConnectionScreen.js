import React from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { addImpulse, addMaxForce, addAngle, clearImpulse, clearMaxForce, 
  clearAngle, setImpulse, setMaxForce, setBattery, setImpulseAxis, setMaxForceAxis } from '../../screens/reducers/bluetoothSlice';
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
      polling: false,
      connection: false,
      connectionOptions: {
        //CONNECTION_TYPE: 'binary',
        READ_SIZE: 512,
        DELIMITER: '',
        DEVICE_CHARSET: "ISO-8859-1",
      },
    };

    this.sync = 0x00;
  }
  /**
   * Removes the current subscriptions and disconnects the specified
   * device.  It could be possible to maintain the connection across
   * the application, but for now the connection is within the context
   * of this screen.
   */
  async componentWillUnmount() {
    if (this.state.connection) {
      try {
        await this.props.device.disconnect();
      } catch (error) {
        // Unable to disconnect from device
      }
    }

    this.uninitializeRead();
  }

  /**
   * Attempts to connect to the provided device.  Once a connection is
   * made the screen will either start listening or polling for
   * data based on the configuration.
   */
  componentDidMount() {
    setTimeout(() => this.connect(), 0);
  }

  async connect() {
    try {
      let connection = await this.props.device.isConnected();
      if (!connection) {
        this.addData({
          data: `Attempting connection to ${this.props.device.address}`,
          timestamp: new Date(),
          type: 'error',
        });

        //console.log(this.state.connectionOptions);
        connection = await this.props.device.connect(this.state.connectionOptions);

        this.addData({
          data: 'Connection successful',
          timestamp: new Date(),
          type: 'info',
        });
      } else {
        this.addData({
          data: `Connected to ${this.props.device.address}`,
          timestamp: new Date(),
          type: 'error',
        });
      }

      this.setState({ connection });
      this.initializeRead();
    } catch (error) {
      this.addData({
        data: `Connection failed: ${error.message}`,
        timestamp: new Date(),
        type: 'error',
      });
    }
  }

  async disconnect(disconnected) {
    try {
      if (!disconnected) {
        disconnected = await this.props.device.disconnect();
      }

      this.addData({
        data: 'Disconnected',
        timestamp: new Date(),
        type: 'info',
      });

      this.setState({ connection: !disconnected });
    } catch (error) {
      this.addData({
        data: `Disconnect failed: ${error.message}`,
        timestamp: new Date(),
        type: 'error',
      });
    }

    // Clear the reads, so that they don't get duplicated
    this.uninitializeRead();
  }

  initializeRead() {
    this.disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(() => this.disconnect(true));

    if (this.state.polling) {
      this.readInterval = setInterval(() => this.performRead(), 5000);
    } else {
      this.readSubscription = this.props.device.onDataReceived(data =>
        this.onReceivedData(data)
      );
    }
  }

  /**
   * Clear the reading functionality.
   */
  uninitializeRead() {
    if (this.readInterval) {
      clearInterval(this.readInterval);
    }
    if (this.readSubscription) {
      this.readSubscription.remove();
    }
  }

  async performRead() {
    try {
      console.log('Polling for available messages');
      let available = await this.props.device.available();
      console.log(`There is data available [${available}], attempting read`);

      if (available > 0) {
        for (let i = 0; i < available; i++) {
          //console.log(`reading ${i}th time`);
          let data = await this.props.device.read();

          console.log(`Read data ${data}`);
          //console.log(data);
          this.onReceivedData({ data });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Handles the ReadEvent by adding a timestamp and applying it to
   * list of received data.
   *
   * @param {ReadEvent} event
   */
  async onReceivedData(event) {
    //console.log("Start onReceivedData");
    event.timestamp = new Date();
    this.addData({
      ...event,
      timestamp: new Date(),
      type: 'receive',
    });
    //console.log(event);
    
    var message = event.data;
    //console.log("message.length: " + message.length);
    //console.log("message: " + message);
    // for (let ij = 0; ij < message.length; ij++){
    //  console.log("message["+ ij + "]: " + message.charCodeAt(ij));
    // }
    
    let i = 0
    while(true){
      if(!this.sync || !this.cmd){
        while (true) {
          while (i < message.length && this.sync != SYNC_BYTE){
            this.sync = message.charCodeAt(i);
            //console.log("sync: " + this.sync);
            i++;
          }
          // Done with this message
          if (i >= message.length){
            break;
          }
          this.cmd = message.charCodeAt(i);
          //console.log("cmd: " + this.cmd);
          i++;
          if (this.cmd != SYNC_BYTE){
            break;
          }
        }
      }
      // Done with this message
      if (i >= message.length){
        break;
      }

      if (!this.length) {
        this.length = message.charCodeAt(i)
        i++;
        //console.log(`Received packet (${this.cmd}, ${this.length})`);
      }

      // Done with this message
      if (i >= message.length){
        break;
      }

      if (!this.buffer){
        this.buffer = new String();
      }

      // This may create a buffer greater than the length.
      for (x = i; x < message.length; x++){
        this.buffer += message.charAt(x);
        i++;
        // Ensures buffer is of length (max) this.length
        if (this.buffer.length >= this.length){
          break;
        }
      }
      //this.buffer.push(message.substring(i));

      // More messages incoming!
      if (this.buffer.length < this.length){
        break;
      }

      // At this point, no more message incoming for THIS message.
      //console.log("buffer: " + this.buffer);

      // var r_data = Array.from(new Uint8Array());
      // //console.log("this.length: " + this.length);
      // is_escaped = false;
      // // var counter = 1;
      // for (j = 0; j < this.buffer.length; j++){
      //   if (!is_escaped && this.buffer[j] === SYNC_BYTE){
      //     is_escaped = true;
      //   }
      //   else{
      //     r_data.push(this.buffer[j]);
      //     // console.log("buffer[j]: " + this.buffer[j]);
      //     // console.log("counter: " + counter);
      //     // counter += 1;
      //     is_escaped = false;
      //   }
      // }
      
      //console.log("read data received: " + r_data);

      switch(this.cmd){
        case IMPULSE_CMD:
            // 45.20, 12.40,
            let impulse_list = this.buffer.split(",");
            //console.log("impulse_list " + impulse_list)
            for (let i = 0; i < impulse_list.length;i++){
              if (impulse_list[i]){
                let impulse_float = parseFloat(impulse_list[i]);
                const addImpulseAction = {
                  type: 'bluetooth/addImpulse',
                  payload: impulse_float
                }
                // add to global dispatcher
                this.props.addImpulse(addImpulseAction);
                //this.props.setImpulseAxis();
                
                //console.log("added " + impulse_float + " to the impulse dispatcher.");
              }
            }
            // Send this impulse somewhere (Redux or some state management).
          break;
        case MAX_FORCE_CMD:
            let max_force_list = this.buffer.split(",");
            let max_force_highest = Math.max(parseFloat(max_force_list));
            //console.log("max_force_list: " + max_force_list)
            //console.log("max_force_highest: " + max_force_highest)
            const addMaxForceAction = {
              type: 'bluetooth/addMaxForce',
              payload: max_force_highest
            }
            // add to global dispatcher
            this.props.addMaxForce(addMaxForceAction);
            //this.props.setMaxForceAxis();
            // for (let i = 0; i < max_force_list.length;i++){
            //   if (max_force_list[i]){
            //     let max_force_float = parseFloat(max_force_list[i]);
            //     const addMaxForceAction = {
            //       type: 'bluetooth/addMaxForce',
            //       payload: max_force_float
            //     }
            //     //add to global dispatcher
            //     this.props.addMaxForce(addMaxForceAction);
            //     this.props.setMaxForceAxis();
            //     console.log("added " + max_force_float + " to the maxForce dispatcher.");

            //   }
            // }
          break;
        case ANGLE_CMD:
          let angle_list = this.buffer.split(",");
          let angle_float_list = [];
            for (let i = 0; i < angle_list.length;i++){
              if (angle_list[i]){
                let angle_float = parseFloat(angle_list[i]);
                angle_float_list.push(angle_float)
              }
            }
            // add to global dispatcher
            this.props.addAngle(angle_float_list);
            //console.log("added " + angle_float_list + " to the angle dispatcher.");
          break;
        case BATT_CMD:
          // Convert 4 bytes into Float Data
          var battPerc = parseFloat(this.buffer.split(",")[0]);
          console.log("Battery Charge: " + battPerc + "%");
          // Add this to global dispatcher
          this.props.setBattery(battPerc);
          //console.log("set battery " + battPerc + " to the battery dispatcher.");
          break;
        default:
          console.log(`Invalid Packet`);
      }
      // Reset this current message for next message
      this.cmd = undefined;
      this.sync = undefined;
      this.length = 0;
      this.buffer = undefined;
      if (i >= message.length){
        break;
      }
    }
    //console.log("onReceivedData Ends");
    // Send w_data
    // let response = "";
    // if (this.cmd === IMPULSE_CMD || this.cmd === MAX_FORCE_CMD || this.cmd === ANGLE_CMD || this.cmd === BATT_CMD){
    //   console.log(`Valid Packet`);
    //   response = "OK";
    // }
    // else{
    //   console.log(`Invalid Packet`);
    //   response = "FAIL";
    // }

    // response += '\0';
    // console.log("response: " + response);
    // var w_data = Array.from(new Uint8Array());     
    // for(j = 0; j < response.length; j++){
    //   if (response[j].charCodeAt(0) === SYNC_BYTE){
    //     w_data.push(SYNC_BYTE);
    //     w_data.push(SYNC_BYTE);
    //   }
    //   else{
    //     w_data.push(response[j].charCodeAt(0));
    //   }
    // }

    // let response_len = w_data.length;
    // console.log("response_length: " + response_len);
    // console.log("w_data being send: " + w_data);
    // console.log("SYNC_BYTE: " + String.fromCharCode(SYNC_BYTE));
    // try{
    //   await RNBluetoothClassic.writeToDevice(
    //     this.props.device.address,
    //     String.fromCharCode(SYNC_BYTE),
    //     "ascii",
    //   );
    //   await RNBluetoothClassic.writeToDevice(
    //     this.props.device.address,
    //     String.fromCharCode(RESPONSE_CMD),
    //     "ascii",
    //   );
    //   await RNBluetoothClassic.writeToDevice(
    //     this.props.device.address,
    //     String.fromCharCode(response_len),
    //     "ascii",
    //   );
    //   await RNBluetoothClassic.writeToDevice(
    //     this.props.device.address,
    //     String.fromCharCode(...w_data),
    //     "ascii",
    //   );
    // } catch (error){
    //   console.log(error);
    // }
  }

  async addData(message) {
    this.setState({ data: [message, ...this.state.data] });
  }

  /**
   * Attempts to send data to the connected Device.  The input text is
   * padded with a NEWLINE (which is required for most commands)
   */
  async sendData() {
    try {
      console.log(`Attempting to send data ${this.state.text}`);
      let message = this.state.text + '\r';
      await RNBluetoothClassic.writeToDevice(
        this.props.device.address,
        message
      );

      this.addData({
        timestamp: new Date(),
        data: this.state.text,
        type: 'sent',
      });

      // let data = Buffer.alloc(10, 0xEF);
      // await this.props.device.write(data);

      // this.addData({
      //   timestamp: new Date(),
      //   data: `Byte array: ${data.toString()}`,
      //   type: 'sent',
      // });

      this.setState({ text: undefined });
    } catch (error) {
      console.log(error);
    }
  }

  async toggleConnection() {
    if (this.state.connection) {
      this.disconnect();
    } else {
      this.connect();
    }
  }

  async writeWeight(){
    let weight = 65.0;
    var farr = new Float32Array(1);
    farr[0] = weight;
    var barr = new Int8Array(farr.buffer); 
    try{
        await RNBluetoothClassic.writeToDevice(
          this.props.device.address,
          String.fromCharCode(SYNC_BYTE),
          "ascii",
        );
        await RNBluetoothClassic.writeToDevice(
          this.props.device.address,
          String.fromCharCode(WEIGHT_CMD),
          "ascii",
        );
        await RNBluetoothClassic.writeToDevice(
          this.props.device.address,
          String.fromCharCode(barr.length),
          "ascii",
        );
        await RNBluetoothClassic.writeToDevice(
          this.props.device.address,
          String.fromCharCode(...barr),
          "ascii",
        );
      } catch (error){
        console.log(error);
      }
  }
  
  render() {
    let toggleIcon = this.state.connection
      ? 'radio-button-on'
      : 'radio-button-off';

    return (
      <View>
        <View iosBarStyle="light-content">
          <View>
            <Button transparent onPress={this.props.onBack}>
              <Icon type="Ionicons" name="arrow-back" />
              <Text> Back</Text>
            </Button>
          </View>
          <View>
            <Text>{this.props.device.name}</Text>
            <Text>{this.props.device.address}</Text>
          </View>
          <View>
            <Button transparent onPress={() => this.toggleConnection()}>
              <Icon type="Ionicons" name={toggleIcon} />
              <Text> {this.state.connection?"Disconnect":"Connect"}</Text>
            </Button>
          </View>
          <View>
            <Button onPress={() => this.writeWeight()}>
              <Text> Send Weight Info </Text>
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
          <InputArea
            text={this.state.text}
            onChangeText={text => this.setState({ text })}
            onSend={() => this.sendData()}
            disabled={!this.state.connection}
          />
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
    addAngle: (angle) => dispatch(addAngle(angle)),
    setBattery: (battery) => dispatch(setBattery(battery)),
    setImpulseAxis: () => dispatch(setImpulseAxis()),
    setMaxForceAxis: () => dispatch(setMaxForceAxis()),
  }
};

export default connect(null, mapDispatchToProps)(ConnectionScreen);

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
