/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

import SideMenu from 'react-native-side-menu';

import Picker from './picker.js';
import DatePicker from './datepicker.js';
import Camera from './camera.js';
import Realm from './realmSample.js';
import Latlng from './latlng.js'
import Menu from './sideMenu.js'

const window = React.Dimensions.get('window');

let valueArr = ["Value1", "Value2", "Value3", "Value4", "Value5"]
let fakeData = valueArr.map((val) => { return "A "+val })
fakeData = fakeData.concat(valueArr.map((val) => { return "B "+val }))

export default class testReact extends Component {
    // <DatePicker title="DatePicker" date={new Date()} />
    // <Camera style={styles.camera} idnum={2222}/>
    // <Picker title="Sample Display" pickerData={fakeData} />
    // <Realm />
    // <Latlng />
    constructor(props){
        super(props);
    }

    render() {

        const menu = <Menu navigator={navigator}/>

        return (
            <SideMenu menu={menu} openMenuOffset={window.width * (1/3)}>
                <View style={styles.container}>
                    <Text style={styles.welcome}>
                    Welcome to React Native!
                    </Text>
                </View>
            </SideMenu>
        );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    overflow: "visible"
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  camera: {
      flex: 1
  },
});
