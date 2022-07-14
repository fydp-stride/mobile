import * as React from 'react';
import { Component } from 'react';

import { NavigationContainer, 
    DarkTheme as NavigationDarkTheme 
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Layout, Text } from '@ui-kitten/components';

import Ionicons from 'react-native-vector-icons/Ionicons';

// screens
import GeoTest from './screens/GeoTest';
import Map from './screens/Map';
import BluetoothTest from './screens/BluetoothTest';
import BluetoothClassic from './screens/BluetoothClassic';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen'

// names
const HomeName = 'Home';
const BluetoothName = 'Bluetooth';
const MapName = 'Map';
const GeoName = 'Geolocation';
const SettingsName = 'Settings';

const { Navigator, Screen } = createBottomTabNavigator();


const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='Homepage'/>
      <BottomNavigationTab title='Bluetooth'/>
      <BottomNavigationTab title='Map'/>
      <BottomNavigationTab title='Geolocation'/>
      <BottomNavigationTab title='Settings'/>
    </BottomNavigation>
  );

export default function MainContainer() {

    return (
        //theme={NavigationDarkTheme}
        <NavigationContainer>
            <Navigator 
                tabBar={props => <BottomTabBar {...props} />}
                initialRouteName={HomeName}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let routeName = route.name;
                        if (routeName === HomeName){
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (routeName === BluetoothName){
                            iconName = focused ? 'bluetooth' : 'bluetooth-outline';
                        } else if (routeName === MapName){
                            iconName = focused ? 'map' : 'map-outline';
                        } else if (routeName === GeoName){
                            iconName = focused ? 'earth' : 'earth-outline'
                        } else if (routeName === SettingsName){
                            iconName = focused ? 'cog' : 'cog-outline'
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}>
                <Screen name={HomeName} component={HomeScreen}/>
                <Screen name={BluetoothName} component={BluetoothClassic}/>
                <Screen name={MapName} component={Map}/>
                <Screen name={GeoName} component={GeoTest}/>
                <Screen name={SettingsName} component={SettingsScreen}/>
            </Navigator>
        </NavigationContainer>
    );
}