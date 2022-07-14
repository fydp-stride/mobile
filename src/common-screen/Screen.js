import React from 'react';
import { StatusBar, View, Header } from 'react-native';

export default props => (
    <View>
        <StatusBar translucent />
        <Header iosBarStyle="light-content">
            {props.headerLeft && props.headerLeft}
            {props.headerBody && props.headerBody}
            {props.headerRight && props.headerRight}
        </Header>
        { props.children}
    </View>
);
