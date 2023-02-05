import { Layout, Text, Button, Modal, Card, Input } from '@ui-kitten/components';
import * as React from 'react';
import { View, Image, ImageBackground } from 'react-native';
import { StyleSheet } from 'react-native';
import BluetoothClassic from './BluetoothClassic';

export default function HomeScreen({ navigation }) {
  const [biometricsVisible, setBiometricsVisible] = React.useState(false);
  const [bluetoothVisible, setBluetoothVisible] = React.useState(false);
  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [age, setAge] = React.useState('');

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
                  setHeight(nextValue);
                }
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <Text>Weight</Text>
            <Input
              placeholder='Weight'
              value={weight}
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  setWeight(nextValue);
                }
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
            <Text>Age</Text>
            <Input
              placeholder='Age'
              value={age}
              onChangeText={nextValue => {
                if (nextValue === '' || re.test(nextValue)) {
                  setAge(nextValue);
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

    </Layout>
  );
}

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
  }
});
