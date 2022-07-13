import * as React from 'react';
import { View, Text } from 'react-native';

import { NavigationContainer, 
    DarkTheme as NavigationDarkTheme 
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';

// screens
import GeoTest from './screens/GeoTest';
import Map from './screens/Map';
import BluetoothTest from './screens/BluetoothTest';
import HomeScreen from './screens/HomeScreen';


// names
const HomeName = 'Home';
const BluetoothName = 'Bluetooth';
const MapName = 'Map';
const GeoName = 'Geo';

const Tab = createBottomTabNavigator();


export default function MainContainer() {

    // const iconSelector = ({focused, colour, size}) => {
        
    // }
    

    return (
        <NavigationContainer theme={NavigationDarkTheme}>
            <Tab.Navigator
                initialRouteName={HomeName}
                screenOptions={({ route }) => ({
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
                        }
                        return <Ionicons name={iconName} size={size} color={color} />;
                    },

                })}>

            <Tab.Screen name={HomeName} component={HomeScreen}/>
            <Tab.Screen name={BluetoothName} component={BluetoothTest}/>
            <Tab.Screen name={MapName} component={Map}/>
            <Tab.Screen name={GeoName} component={GeoTest}/>


            </Tab.Navigator>
        </NavigationContainer>
    );
}