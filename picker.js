'use strict';

import React from 'react-native';

export default class PickerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.pickerData[0],
            fields: props.pickerData
        }
    }

    renderPickerItems() {
        return this.state.fields.map((field) => {
            return <React.Picker.Item key={field} label={field} value={field} />
        })
    }

    render() {
        return (
            <React.View>
                <React.Text>{this.props.title}</React.Text>
                <React.Picker style={styles.picker}
                    itemStyle={styles.pickerItems}
                    selectedValue={this.state.value}
                    onValueChange={(val) => { this.setState({value: val}) }}>
                    {this.renderPickerItems()}
                </React.Picker>
            </React.View>
        );
    }
}

const styles = React.StyleSheet.create({
    picker: {
        width: 100
    },
    pickerItems: {
        color: 'green',
        height: 80,
        fontSize: 18
    }
})
