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
            <React.View>
                <React.Text style={styles.title}>{this.props.title}</React.Text>
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
                        <React.Text style={styles.buttonText}>Get</React.Text>
                    </React.TouchableHighlight>
                </React.View>
            </React.View>
        )
    }
}

let styles = React.StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'grey',
        backgroundColor: '#F8F8F9',
        borderColor: 'gray',
        borderWidth: 1,
        height: 40
    },
    title: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10
    },
    textContainer: {
        flex: 2,
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
        flex: 2,
        backgroundColor: 'yellow',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        margin: 4,
        justifyContent: 'center',
    },
    buttonText: {
        backgroundColor: 'yellow',
        alignSelf: 'center'
    }
})

export default LatLng
