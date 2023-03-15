import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { TextInput } from 'react-native';
import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
  Toggle,
  Button,
  View
} from '@ui-kitten/components';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { connect, bindActionCreators } from 'react-redux';
import { toggleEnabled } from './actions/userDataActions';
import { setForceThreshold, setImpulseThreshold } from './actions/userDataActions';
import { useSelector, useDispatch } from 'react-redux';

// code for testing the notif
import { useToast } from "react-native-toast-notifications";

function HomeScreen(props) {
  // const [locationTrackingenabled, setLocationTrackingEnabled] = React.useState(false);

  // const [maxThreshold, changeMaxThreshold] = useState("");

  const dispatch = useDispatch();
  let geolocationEnabled = props.userData.geolocationEnabled;
  let maxForceThreshold = props.userData.forceThreshold;
  let maxImpulseThreshold = props.userData.impulseThreshold;

  useEffect(() => {
    if (geolocationEnabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }
  }, [geolocationEnabled]);

  const onKeyPressForce = text => {
    dispatch(setForceThreshold(text));
  };

  const onKeyPressImpulse = text => {
    dispatch(setImpulseThreshold(text));
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
      <Layout style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
        <Text style={{ marginRight: 10, fontSize: 18, maxWidth: '50%', flex: 5 }}>
          Location Tracking
        </Text>
        <Toggle
          checked={geolocationEnabled}
          onChange={() => dispatch(toggleEnabled())}
          style={{ flex: 6 }}
        />
      </Layout>
      <Layout
        style={{ flexDirection: 'row', paddingTop: 20, alignItems: 'center', width: '100%' }}>
        <Text style={{ marginRight: 10, fontSize: 18, maxWidth: '50%', flex: 5 }}>
          Maximum force threshold
        </Text>
        <Layout style={{ flexDirection: 'row', alignItems: 'center', flex: 6 }}>
          <TextInput
            style={{
              color: 'black',
              underlineColorAndroid: 'black',
              backgroundColor: '#d5f2dd',
              borderRadius: 16,
              height: 'auto',
              width: 70,
              textAlign: 'center',
              fontSize: 16,
            }}
            editable
            blurOnSubmit
            keyboardType="numeric"
            numberOfLines={1}
            maxLength={5}
            onChangeText={text => onKeyPressForce(text)}
            value={maxForceThreshold}
          />
          <Text style={{ marginLeft: 5, fontSize: 18 }}>
            N
          </Text>
        </Layout>
      </Layout>
      <Layout
        style={{ flexDirection: 'row', paddingTop: 20, alignItems: 'center', width: '100%' }}>
        <Text style={{ marginRight: 10, fontSize: 18, maxWidth: '50%', flex: 5 }}>
          Daily impulse threshold
        </Text>
        <Layout style={{ flexDirection: 'row', alignItems: 'center', flex: 6 }}>
          <TextInput
            style={{
              color: 'black',
              underlineColorAndroid: 'black',
              backgroundColor: '#d5f2dd',
              borderRadius: 16,
              height: 'auto',
              width: 90,
              textAlign: 'center',
              fontSize: 16,
            }}
            editable
            blurOnSubmit
            keyboardType="numeric"
            numberOfLines={1}
            maxLength={9}
            onChangeText={text => onKeyPressImpulse(text)}
            value={maxImpulseThreshold}
          />
          <Text style={{ marginLeft: 5, fontSize: 18 }}>
            Ns
          </Text>
        </Layout>
      </Layout>
      {/* <Layout style={{ flexDirection: 'row', paddingTop: 30, alignItems: 'center' }}>
        <Text style={{ marginRight: 10, fontSize: 18 }}>
          Test notification
        </Text>
        <Button onPress={launchNotif}>Launch</Button>
      </Layout> */}
    </Layout >
  );
}

const mapStateToProps = state => {
  return state;
};

export default connect(mapStateToProps)(HomeScreen);
