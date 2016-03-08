'use strict';

import React from 'react-native';

class LatLng extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            lat: '',
            lng: ''
        }
    }

    getPos(){
        navigator.geolocation.getCurrentPosition((pos) => {
            let lat = pos && pos.coords && pos.coords.latitude ? pos.coords.latitude.toFixed(5) : ''
            let lng = pos && pos.coords && pos.coords.longitude ? pos.coords.longitude.toFixed(5) : ''
            this.setState({
                lat: lat,
                lng: lng
            })
        })
    }

    render(){
        return (
            <React.View style={styles.container}>
                <React.View style={styles.textContainer}>
                    <React.Text style={styles.text}>Lat:</React.Text>
                    <React.Text style={styles.text}>Lng:</React.Text>
                </React.View>
                <React.View style={styles.latContainer}>
                    <React.Text style={styles.latlng}>{this.state.lat}</React.Text>
                    <React.Text style={styles.latlng}>{this.state.lng}</React.Text>
                </React.View>
                <React.TouchableHighlight style={styles.button} onPress={this.getPos.bind(this)}>
                    <React.Text style={styles.button}>Get</React.Text>
                </React.TouchableHighlight>
            </React.View>
        )
    }
}

let styles = React.StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'grey',
        width: 220,
        height: 40
    },
    textContainer: {
        flex: 1,
        marginLeft: 3,
        justifyContent: 'center',
    },
    latContainer: {
        flex: 3,
        marginRight: 3,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    button: {
        flex: 3,
        alignItems: 'center',
        backgroundColor: 'yellow',
        borderRadius: 4,
        margin: 6
    }
})

export default LatLng
