import { Layout, Text, Button, Modal, Card, Input } from '@ui-kitten/components';
import * as React from 'react';
import { View, Image, ImageBackground } from 'react-native';
import { StyleSheet } from 'react-native';
import BluetoothClassic from './BluetoothClassic';
import SettingsScreen from './SettingsScreen';
import { connect, bindActionCreators } from 'react-redux';

import { useSelector, useDispatch } from 'react-redux';
import { setAge, setHeight, setWeight } from './actions/userDataActions';

function HomeScreen(props) {
  const [biometricsVisible, setBiometricsVisible] = React.useState(false);
  const [bluetoothVisible, setBluetoothVisible] = React.useState(false);
  const [settingsVisible, setSettingsVisible] = React.useState(false);

  const dispatch = useDispatch();
  let height = props.userData.height;
  let weight = props.userData.weight;
  let age = props.userData.age;

  const re = /^[0-9\b]+$/;

  return (
    <Layout style={{ alignItems: 'center', flex: 1, backgroundColor: 'white' }}>
      <View style={{ backgroundColor: 'lightgreen', height: '35%', width: '100%', position: 'absolute' }} ></View>
      <Text style={{ fontSize: 30, color: 'black', margin: 20, paddingBottom: 15 }}>
        Profile
      </Text>
      <View style={{ borderWidth: 0, borderRadius: 100, height: 155, width: 155, backgroundColor: 'black', justifyContent: 'center' }}></View>
      <Text style={{ fontSize: 30, color: 'black', marginTop: 20 }}>Welcome Back, Bob</Text>
      <Text style={{ fontSize: 18, color: 'black', marginTop: 10, marginBottom: 30 }}>You are doing great today!</Text>
      <Button onPress={() => setBiometricsVisible(true)} style={styles.button}>Modify Biometrics</Button>
      <Button onPress={() => setBluetoothVisible(true)} style={styles.button}>Bluetooth Connection</Button>
      <Button onPress={() => setSettingsVisible(true)} style={styles.button}>Settings</Button>
      <Button onPress={() => { console.log("3") }} style={styles.button}>Logout</Button>

      <Modal
        visible={biometricsVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setBiometricsVisible(false)}
        style={styles.modal}>
        <Card disabled={true} >
          <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <Text>Height</Text>
            <Input
              placeholder='Height'
              value={height}
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  dispatch(setHeight(nextValue));
                  // setHeight(nextValue);
                }
              }}
            />
            <Text>cm</Text>
          </View>
          <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <Text>Weight</Text>
            <Input
              placeholder='Weight'
              value={weight}
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  dispatch(setWeight(nextValue));
                  // setWeight(nextValue);
                }
              }}
            />
            <Text>kg</Text>
          </View>
          <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <Text>Age</Text>
            <Input
              placeholder='Age'
              value={age}
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  dispatch(setAge(nextValue));
                  // setAge(nextValue);
                }
              }}
            />
          </View>
          <Button onPress={() => setBiometricsVisible(false)}>
            OK
          </Button>
        </Card>
      </Modal>

      <Modal
        visible={bluetoothVisible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setBluetoothVisible(false)}
        style={styles.bluetooth}>
        <BluetoothClassic />
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

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(HomeScreen);

var styles = StyleSheet.create({
  button: {
    backgroundColor: 'green', borderWidth: 0, borderRadius: 100, width: '60%', marginBottom: 20
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    flexDirection: 'column'
  },
  bluetooth: {
    height: '70%',
    width: '80%'
  },
  settings: {
    height: '70%',
    width: '80%'
  }
});
