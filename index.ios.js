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
            <Navigator initialRoute={route} renderScene={this.renderScene} style={styles.background}/>
        );
    }
}

let styles = StyleSheet.create({
  background: {
      backgroundColor: '#bfd6f2',
  }
});


AppRegistry.registerComponent('testReact', () => testReact);
