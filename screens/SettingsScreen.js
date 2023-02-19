import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
  Toggle,
  Button
} from '@ui-kitten/components';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { connect, bindActionCreators } from 'react-redux';
import { toggleEnabled } from './actions/geolocationActions';
import { useSelector, useDispatch } from 'react-redux';

// code for testing the notif
import { useToast } from "react-native-toast-notifications";

function HomeScreen(props) {
  // const [locationTrackingenabled, setLocationTrackingEnabled] = React.useState(false);

  const [maxThreshold, changeMaxThreshold] = useState("");

  const dispatch = useDispatch();
  let geolocationEnabled = props.geolocationData.enabled;

  useEffect(() => {
    if (geolocationEnabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }
  }, [geolocationEnabled]);

  const onKeyPress = text => {
    // need to send this to the Redux store
    changeMaxThreshold(text);
  };

  const toast = useToast();


  const launchNotif = () => {
    console.log('notif is launched')
    toast.show("Hello World");
  }

  return (
    <Layout
      style={{
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 20,
        flex: 1,
        borderRadius: 20,
        flexDirection: 'column',
      }}>
      <Layout style={{ flexDirection: 'row', padding: 5 }}>
        <Text style={{ marginRight: 10, fontSize: 18 }}>Location Tracking</Text>
        <Toggle
          checked={geolocationEnabled}
          onChange={() => dispatch(toggleEnabled())}
        />
      </Layout>
      <Layout
        style={{ flexDirection: 'row', paddingTop: 20, alignItems: 'center' }}>
        <Text style={{ marginRight: 10, fontSize: 18 }}>
          Maximum force threshold
        </Text>
        <TextInput
          style={{
            color: 'black',
            underlineColorAndroid: 'black',
            backgroundColor: '#d5f2dd',
            borderRadius: 16,
            height: 'auto',
            width: 60,
            textAlign: 'center',
            fontSize: 20,
          }}
          editable
          blurOnSubmit
          keyboardType="numeric"
          numberOfLines={1}
          maxLength={3}
          onChangeText={text => onKeyPress(text)}
          value={maxThreshold}
        />
        <Text style={{ marginLeft:5 ,fontSize: 18 }}>
          N
        </Text>
      </Layout>
      <Layout style={{ flexDirection: 'row', paddingTop: 30, alignItems: 'center' }}>
        <Text style={{ marginRight: 10, fontSize: 18 }}>
          Test notification
        </Text>
        <Button onPress={launchNotif}>Launch</Button>
      </Layout>
    </Layout>
  );
}

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(HomeScreen);
