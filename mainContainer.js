import * as React from 'react';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

// screens
import MapHomeView from './screens/MapHomeView';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import Visualization from './screens/Visualization';
import SummaryScreen from './screens/SummaryPage';

// router names
const HomeName = 'Home';
const VisualizationName = 'Visualization';
const MapName = 'Map';
const SettingsName = 'Settings';
const SummaryRoute = 'Summary';

const { Navigator, Screen } = createBottomTabNavigator();

export default function MainContainer() {
  return (
    <NavigationContainer theme={NavigationDarkTheme}>
      <Navigator
        initialRouteName={SummaryRoute}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let routeName = route.name;

            switch (routeName) {
              case HomeName:
                iconName = focused ? 'home' : 'home-outline';
                break;

              case SummaryRoute:
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                break;

              case VisualizationName:
                iconName = focused ? 'analytics' : 'analytics-outline';
                break;

              case MapName:
                iconName = focused ? 'map' : 'map-outline';
                break;

              case SettingsName:
                iconName = focused ? 'cog' : 'cog-outline';
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Screen name={HomeName} component={HomeScreen} />
        <Screen name={SummaryRoute} component={SummaryScreen} />
        <Screen name={VisualizationName} component={Visualization} />
        <Screen name={MapName} component={MapHomeView} />
        <Screen name={SettingsName} component={SettingsScreen} />
      </Navigator>
    </NavigationContainer>
  );
}
