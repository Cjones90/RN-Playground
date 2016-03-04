'use strict';

import React from 'react-native';

// Component "working as intented"
// nicklockwood commented on Jan 14
//  @marcshilling you can safely ignore this warning. It's because we convert to
//  a number to send to the underlying component prop, which uses the same validation.
//  We'll fix it at some point.

export default class Component extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: props.date,
            pickerState: false,
            visible: true,
            transparent: true,
            animated: true,
            lastY: 0
        }
    }

    togglePicker() {
        this.setState({pickerState: !this.state.pickerState})
    }

    closeModal(event) {
        if(event.nativeEvent.layout.y !== this.state.lastY) {
            this.setState({pickerState: false})
        }
        this.setState({
            lastY: event.nativeEvent.layout.y
        })
    }

    render () {

        return (
            <React.View style={styles.container} onLayout={this.closeModal.bind(this)}>

                <React.Text style={styles.title}>{this.props.title}</React.Text>
                <React.Text style={styles.dateButton} onPress={this.togglePicker.bind(this)}>
                    <React.Text>{this.state.date.toDateString()}</React.Text>
                </React.Text>

                    <React.Modal
                        visible={this.state.pickerState}
                        transparent={this.state.transparent}
                        animated={this.state.animated} >

                        <React.View style={styles.innerDateModal}>
                            <React.DatePickerIOS
                            style={styles.datePicker}
                            date={this.state.date}
                            mode="date"
                            onDateChange={ (date) => { this.setState({date: date})} }
                            />
                            <React.Text style={styles.dateClose} onPress={this.togglePicker.bind(this)}>Close</React.Text>
                        </React.View>

                    </React.Modal>

            </React.View>
        )
    }
}

let styles = React.StyleSheet.create({
    container: {
        backgroundColor: "blue",
        flex: 1,
    },
    title: {
        marginTop: 20,
        textAlign: "center",
    },
    dateButton: {
        backgroundColor: "white",
        textAlign: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        height: 40,
        padding: 2,
        shadowOpacity: 0.4,
        shadowOffset: {height: 1, width: 1},
        flex: 1
    },
    innerDateModal: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        flex: 1
    },
    datePicker: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        top: React.Dimensions.get('window').height * 0.20
    },
    dateClose: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: 4,
        backgroundColor: "#CCE6FF",
        color: "black",
        paddingLeft: 3,
        paddingRight: 1,
        position: "absolute",
        overflow: "hidden",
        right: 3,
        top: React.Dimensions.get('window').height * 0.08,
    },

})
