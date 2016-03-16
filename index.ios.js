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

import Main from './main.js'

class testReact extends Component {

    renderScene(route, navigator) {
        let page = void(0);
        console.log("route.name ", route.name);
        route.name === "Menu" && (page = <Main navigator={navigator} />);
        return page;
    }

    render() {

        const route = {name: "Menu"}

        return (
            <Navigator initialRoute={route} renderScene={this.renderScene} style={styles.menu}/>
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  camera: {
      flex: 1
  },
  menu: {
      backgroundColor: '#bfd6f2',
  }
});


AppRegistry.registerComponent('testReact', () => testReact);
