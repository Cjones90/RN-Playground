'use strict';

import React from 'react-native';
const window = React.Dimensions.get('window');


export default class SideMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    logHi() {
        console.log("Hi")
    }

    logBye(){
        console.log("Bye")
    }

    render() {

        const menuArray = [{text: "Hi", fn: this.logHi}, {text: "Bye", fn: this.logBye}]

        const menuButtons = menuArray.map((btn, i) => {
            return (<React.TouchableOpacity key={btn.text+i} activeOpacity={0.4}
                    style={styles.button} onPress={btn.fn}>
                        <React.Text style={styles.text}>{btn.text}</React.Text>
                    </React.TouchableOpacity>
                )
        })

        return (
            <React.View style={styles.container}>
                <React.View style={styles.menu}>
                    {menuButtons}
                </React.View>
            </React.View>
        )
    }
}

const styles = React.StyleSheet.create({
  container: {
    width: window.width * (1/3),
  },
  menu: {
    left: window.width * (1/3) * (1/6),
    width: window.width * (1/3) * (2/3),
    marginTop: React.Dimensions.get('window').height * 0.15,
  },
  button: {
      borderColor: "black",
      borderWidth: 1,
      borderRadius: 4,
      marginTop: 10,
      padding: 5
  },
  text: {
      textAlign: 'center',
      fontSize: 22
  }

});
