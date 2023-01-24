import { Layout, Text, Button } from '@ui-kitten/components';
import * as React from 'react';
import { View, Image, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <Layout style={{ alignItems: 'center', flex: 1, backgroundColor: 'white' }}>
      <View style={{ backgroundColor: 'lightgreen', height: '35%', width: '100%', position: 'absolute' }} ></View>
      <Text style={{ fontSize: 30, color: 'black', margin: 20, paddingBottom: 15 }}>
        Profile
      </Text>
      <View style={{ borderWidth: 0, borderRadius: 100, height: 155, width: 155, backgroundColor: 'black', justifyContent: 'center' }}></View>
      <Text style={{ fontSize: 30, color: 'black', marginTop: 20 }}>Welcome Back, Bob</Text>
      <Text style={{ fontSize: 18, color: 'black', marginTop: 10, marginBottom: 30}}>You are doing great today!</Text>
      <Button onPress={() => {console.log("1")}} style={{ backgroundColor: 'green', borderWidth: 0, borderRadius: 100, width: '60%', marginBottom: 20 }}>Modify Biometrics</Button>
      <Button onPress={() => {console.log("2")}} style={{ backgroundColor: 'green', borderWidth: 0, borderRadius: 100, width: '60%', marginBottom: 20 }}>Bluetooth Connection</Button>
      <Button onPress={() => {console.log("3")}} style={{ backgroundColor: 'green', borderWidth: 0, borderRadius: 100, width: '60%', marginBottom: 20 }}>Logout</Button>
    </Layout>
  );
}
