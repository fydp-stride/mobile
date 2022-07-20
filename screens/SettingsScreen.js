import * as React from 'react';
import { BottomNavigation, BottomNavigationTab, Layout, Text } from '@ui-kitten/components';

export default function HomeScreen({ navigation }) {
  return (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Text style={{ fontSize: 30 }}>
        This is Settings Screen
      </Text>
    </Layout>
  );
}