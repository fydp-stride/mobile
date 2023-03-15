import {
  Layout,
  Text,
  Button,
  Modal,
  Card,
  Toggle,
  Input,
} from '@ui-kitten/components';
import * as React from 'react';
import { useEffect } from 'react';
import { View, Image, ImageBackground, TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import BluetoothClassic from './BluetoothClassic';
import SettingsScreen from './SettingsScreen';
import { connect, bindActionCreators } from 'react-redux';
import { colors } from '../colors'
import { useSelector, useDispatch } from 'react-redux';
import {
  setAge,
  setHeight,
  setWeight,
  useImperialUnit,
  useMetricUnit,
} from './actions/userDataActions';

import {
  useDevice,
  useDeviceDispatch,
} from '../src/connection/ConnectionContext';

function HomeScreen(props) {
  const [biometricsVisible, setBiometricsVisible] = React.useState(false);
  const [bluetoothVisible, setBluetoothVisible] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const dispatch = useDispatch();
  let height = props.userData.height;
  let weight = props.userData.weight;
  let useMetric = props.userData.useMetric;
  let age = props.userData.age;

  const [heightFeets, setHeightFeets] = React.useState('');
  const [heightInches, setHeightInches] = React.useState('');
  const [weightLb, setWeightLb] = React.useState('');

  useEffect(() => {
    if (heightFeets == '' || heightInches == '') {
      return;
    }
    const h =
      parseFloat(heightFeets == '' ? 0 : heightFeets) * 30.48 +
      parseFloat(heightInches == '' ? 0 : heightInches) * 2.54;
    dispatch(setHeight(h.toString()));
  }, [heightFeets, heightInches]);

  useEffect(() => {
    if (weightLb == '') {
      return;
    }
    const w = parseFloat(weightLb == '' ? 0 : weightLb) * 0.45;
    dispatch(setWeight(w.toString()));
  }, [weightLb]);

  const re = /^[0-9\b]+$/;

  // Hacky way to use useContext under a functional component that can then be "imported" to a class component.
  const device = useDevice();
  const deviceDispatch = useDeviceDispatch();

  var profilePic = require ('../profile.jpeg');

  return (
    <Layout style={{ alignItems: 'center', flex: 1, backgroundColor: colors.mainGreen }}>
      <Text
        style={{ fontSize: 45, color: 'black', margin: 20, paddingBottom: 15, fontWeight: 'bold' }}>
        Profile
      </Text>
      <View
        style={{
          borderWidth: 0,
          borderRadius: 100,
          borderWidth: 0.5,
          borderColor: colors.borderGreen,
          height: 155,
          width: 155,
          backgroundColor: 'black',
          justifyContent: 'center',

        }}>
        <Image source={profilePic}
          style={{ height: '100%', width: '100%', borderRadius: 100 }}></Image>
      </View>

      <View style={{
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: colors.borderGreen,
        alignItems: 'center', 
        flex: 0.95,
        width: '94%',
        borderRadius: 35,
        marginTop: 30,
      }}>
        <Text style={{ fontSize: 30, color: 'black', marginTop: '20%' }}>
          Welcome Back, Bob
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            marginTop: 10,
            marginBottom: '10%',
          }}>
          You are doing great today!
        </Text>
        <Button
          onPress={() => setBiometricsVisible(true)}
          style={styles.button}>
          Modify Biometrics
        </Button>
        <Button onPress={() => setBluetoothVisible(true)} style={styles.button}>
          Bluetooth Connection
        </Button>
        <Button onPress={() => setSettingsVisible(true)} style={styles.button}>
          Settings
        </Button>
      </View>

      <Modal
        visible={biometricsVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setBiometricsVisible(false)}
        style={styles.modal}>
        <Card disabled={true}>
          <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Text>{useMetric ? 'Metric' : 'Imperial'}</Text>
            <Toggle
              checked={useMetric}
              status='basic'
              onChange={() =>
                useMetric ? dispatch(useImperialUnit()) : dispatch(useMetricUnit())
              }
              style={{ flex: 6 }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Text>Height</Text>
            {useMetric ? (
              <>
                <TextInput
                  style={{
                    color: 'black',
                    underlineColorAndroid: 'black',
                    borderRadius: 16,
                    height: 'auto',
                    width: 60,
                    textAlign: 'center',
                    fontSize: 16,
                  }}
                  editable
                  blurOnSubmit
                  keyboardType="numeric"
                  numberOfLines={1}
                  maxLength={3}
                  placeholder="cm"
                  onChangeText={nextValue => {
                    if (nextValue === '' || re.test(nextValue)) {
                      dispatch(setHeight(nextValue));
                    }
                  }}
                  value={height}
                />
                <Text>cm</Text>
              </>
            ) : (
              <>
                <TextInput
                  style={{
                    color: 'black',
                    underlineColorAndroid: 'black',
                    borderRadius: 16,
                    height: 'auto',
                    width: 60,
                    textAlign: 'center',
                    fontSize: 16,
                  }}
                  editable
                  blurOnSubmit
                  keyboardType="numeric"
                  numberOfLines={1}
                  maxLength={3}
                  placeholder="feet"
                  onChangeText={nextValue => {
                    if (nextValue === '' || re.test(nextValue)) {
                      setHeightFeets(nextValue);
                    }
                  }}
                  value={heightFeets}
                />
                <Text>feet</Text>
                <TextInput
                  style={{
                    color: 'black',
                    underlineColorAndroid: 'black',
                    borderRadius: 16,
                    height: 'auto',
                    width: 60,
                    textAlign: 'center',
                    fontSize: 16,
                  }}
                  editable
                  blurOnSubmit
                  keyboardType="numeric"
                  numberOfLines={1}
                  maxLength={3}
                  placeholder="inch"
                  onChangeText={nextValue => {
                    if (nextValue === '' || re.test(nextValue)) {
                      setHeightInches(nextValue);
                    }
                  }}
                  value={heightInches}
                />
                <Text>inches</Text>
              </>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Text>Weight</Text>
            <TextInput
              style={{
                color: 'black',
                underlineColorAndroid: 'black',
                borderRadius: 16,
                height: 'auto',
                width: 60,
                textAlign: 'center',
                fontSize: 16,
              }}
              editable
              blurOnSubmit
              keyboardType="numeric"
              numberOfLines={1}
              maxLength={3}
              placeholder="weight"
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  if (useMetric) {
                    dispatch(setWeight(nextValue));
                  } else {
                    setWeightLb(nextValue);
                  }
                }
              }}
              value={useMetric ? weight : weightLb}
            />
            <Text>{useMetric ? 'kg' : 'lb'}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              display: 'flex',
              alignItems: 'center',
            }}>
            <Text>Age</Text>
            <TextInput
              style={{
                color: 'black',
                underlineColorAndroid: 'black',
                borderRadius: 16,
                height: 'auto',
                width: 60,
                textAlign: 'center',
                fontSize: 16,
              }}
              editable
              blurOnSubmit
              keyboardType="numeric"
              numberOfLines={1}
              maxLength={3}
              placeholder="age"
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  dispatch(setAge(nextValue));
                }
              }}
              value={age}
            />
          </View>
          <Button onPress={() => setBiometricsVisible(false)}>OK</Button>
        </Card>
      </Modal>

      <Modal
        visible={bluetoothVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setBluetoothVisible(false)}
        style={styles.bluetooth}>
        <BluetoothClassic device={device} deviceDispatch={deviceDispatch} />
      </Modal>

      <Modal
        visible={settingsVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setSettingsVisible(false)}
        style={styles.settings}>
        <SettingsScreen />
      </Modal>
    </Layout>
  );
}

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(HomeScreen);

var styles = StyleSheet.create({
  button: {
    backgroundColor: 'green',
    borderWidth: 0,
    borderRadius: 100,
    width: '60%',
    marginBottom: '6%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    flexDirection: 'column',
  },
  bluetooth: {
    height: '70%',
    width: '80%',
  },
  settings: {
    height: '70%',
    width: '80%',
  },
});
