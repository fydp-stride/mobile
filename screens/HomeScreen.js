
import * as React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({navigation}) {
    

    return (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 30}}>
                This is homescreen
            </Text>
        </View>
    );
}