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
  View
} from 'react-native';

import Picker from './picker.js';
import DatePicker from './datepicker.js';
import Camera from './camera.js';
import Realm from './realmSample.js';
import Latlng from './latlng.js'

let valueArr = ["Value1", "Value2", "Value3", "Value4", "Value5"]
let fakeData = valueArr.map((val) => { return "A "+val })
fakeData = fakeData.concat(valueArr.map((val) => { return "B "+val }))

class testReact extends Component {
    // <DatePicker title="DatePicker" date={new Date()} />

  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Picker title="Sample Display" pickerData={fakeData} />
        <Camera style={styles.camera} idnum={2222}/>

        <Realm />
        <Latlng />

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  camera: {
      flex: 1
  }
});

AppRegistry.registerComponent('testReact', () => testReact);
