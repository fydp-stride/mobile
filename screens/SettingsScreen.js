import * as React from 'react';
import { BottomNavigation, BottomNavigationTab, Layout, Text, Toggle } from '@ui-kitten/components';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { connect, bindActionCreators } from 'react-redux';
import { toggleEnabled } from './actions/geolocationActions';
import { useSelector, useDispatch } from 'react-redux';

function HomeScreen(props) {
  // const [locationTrackingenabled, setLocationTrackingEnabled] = React.useState(false);

  const dispatch = useDispatch();
  let geolocationEnabled = props.geolocationData.enabled;

  React.useEffect(() => {
    if (geolocationEnabled) {
      BackgroundGeolocation.start();
    } else {
      BackgroundGeolocation.stop();
    }
  }, [geolocationEnabled]);

  return (
    <Layout style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <Layout style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Text style={{ marginRight: 10, fontSize: 18 }}>Location Tracking</Text>
        <Toggle checked={geolocationEnabled} onChange={() => dispatch(toggleEnabled())} />
      </Layout>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(HomeScreen);