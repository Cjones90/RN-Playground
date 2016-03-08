'use strict';

import React from 'react-native';

export default class PickerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            initial: props.pickerData[0],
            value: props.pickerData[0],
            fields: props.pickerData,
            pickerState: false,
            visible: true,
            transparent: true,
            animated: true,
            lastY: 0
        }
    }

    togglePicker(e) {
        this.setState({
            pickerState: !this.state.pickerState,
            value: e === "close" ? this.state.initial : this.state.value,
            initial: e === "close" ? this.state.initial : this.state.value
        })
    }

    closeModal(event) {
        if(event.nativeEvent.layout.y !== this.state.lastY) {
            this.setState({pickerState: false})
        }
        this.setState({
            lastY: event.nativeEvent.layout.y
        })
    }

    renderPickerItems() {
        return this.state.fields.map((field) => {
            return <React.Picker.Item key={field} label={field} value={field} />
        })
    }

    render() {

        return (
            <React.View style={styles.container}>
                <React.Text style={styles.title}>{this.props.title}</React.Text>
                <React.Text style={styles.pickerButton} onPress={this.togglePicker.bind(this)}>
                    <React.Text>{this.state.value}</React.Text>
                </React.Text>

                <React.Modal
                    visible={this.state.pickerState}
                    transparent={this.state.transparent}
                    animated={this.state.animated} >

                    <React.View style={styles.innerPickerModal}>
                        <React.Picker style={styles.picker}
                            itemStyle={styles.pickerItems}
                            selectedValue={this.state.value}
                            onValueChange={(val) => { this.setState({value: val}) }}>
                            {this.renderPickerItems()}
                        </React.Picker>
                        <React.Text style={styles.pickerSave} onPress={this.togglePicker.bind(this, 'save')}>Save</React.Text>
                        <React.Text style={styles.pickerClose} onPress={this.togglePicker.bind(this, 'close')}>Close</React.Text>
                    </React.View>

                </React.Modal>

            </React.View>
        );
    }
}

// Just testing out ideas for classes in react-native
let cssCombine = function(...args) {
    let len = args.length;
    let start = {}
    for(let i = 0; i < len; i += 1){
        for(let p in args[i]) {
            start[p] = args[i][p]
        }
    }
    return start;
}

let css = {
    pickerBox: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: 4,
        backgroundColor: "#CCE6FF",
        color: "black",
        fontSize: 30,
        paddingLeft: 25,
        paddingRight: 21,
        position: "absolute",
        overflow: "hidden",
        top: React.Dimensions.get('window').height * 0.08,
    },
    pickerSave: {
        right: 150
    },
    pickerClose: {
        right: 3
    },
}

const styles = React.StyleSheet.create({
    container: {
        justifyContent: 'flex-end'
    },
    title: {
        textAlign: 'center'
    },
    picker: {
        width: 600,
        height: 210,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        top: React.Dimensions.get('window').height * 0.20
    },
    pickerItems: {
        fontSize: 40
    },
    // pickerItems: {
    //     color: 'green',
    //     height: 70,
    //     fontSize: 16,
    //     marginTop: -12
    // },
    pickerButton: {
        backgroundColor: '#F8F8F9',
        textAlign: "center",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: 'gray',
        height: 30,
        fontSize: 14,
        padding: 3,
        flex: 1,
    },
    innerPickerModal: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        flex: 1
    },
    pickerSave: cssCombine(css.pickerBox, css.pickerSave),
    pickerClose: cssCombine(css.pickerBox, css.pickerClose)

})
