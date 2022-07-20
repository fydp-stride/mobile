import { Layout, Text } from '@ui-kitten/components';
import * as React from 'react';
// import { View, Text, Image, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 30 }}>
        This is homescreen
      </Text>
    </Layout>
  );
}
