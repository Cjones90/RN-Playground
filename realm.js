'use strict';


import React, { PropTypes } from 'react-native'
import Realm from 'realm';

class Component extends React.Component {

    constructor(props){
        super(props)
        this.initSchema()

        // Observe Realm Change Events
        this.realm.addListener('change', () => {
          // Update UI
          this.setState({});
        });

        // Unregister all listeners
        // this.realm.removeAllListeners();

    }

    initSchema() {

        this.realm = new Realm({
            schema: [
                {
                    name: 'Dog',
                    primaryKey: 'id',
                    properties: {
                        id: 'int',
                        name: 'string',
                        age: {type: 'int', default: 1}
                    }
                }
            ],
            // Increment version when schema changes
            schemaVersion: 1
        })

        // let realmAtAnotherPath = new Realm({
        //   path: 'anotherRealm.realm',
        //   schema: [CarSchema]
        // });

    }

    writeRealm() {

        let dogNames = ["Rex", "Rover", "Spot", "Champ", "Buster", "Bill", "Baxter", "Charlie"];
        let dogAge = 3;
        let numDogs = this.realm.objects('Dog').length;
        this.realm.write(() => {
            this.realm.create('Dog', {
                id: numDogs,
                name: dogNames[numDogs]
            }, true);
        })
    }

    updateRealm() {
        this.realm.write(() => {
            this.realm.create('Dog', {
                id: 1,
                age: 30
            }, true);
        })
    }

    readRealm(query, object) {
        // Example AND and indexOf
        // dogs.filtered('color = "tan" AND name BEGINSWITH "B"');

        // Example LIMIT
        //     get first 5 Car objects
        // let firstCars = Array.prototype.slice.call(cars, 0, 5);

        if(!query) {return this.realm.objects(object) }
        return this.realm.objects(object).filtered(query);
    }

    deleteAllRealm() {
        this.realm.write(() => {
            this.realm.deleteAll();
        })
    }

    deleteRealm() {
        let results = this.realm.objects('Dog').filtered('name != "Rex"')
        this.realm.write(() => {
            this.realm.delete(results);
        })
    }

    render () {
        let display = [];
        let results = this.readRealm('', 'Dog')
        for(let obj in results) {
            display.push(results[obj])
        }
        let show = display.map((obj) => {
            return <React.Text style={styles.realmObj} key={obj.name+obj.age}>{obj.name} is {obj.age}</React.Text>
        })


        return (
            <React.View>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteAllRealm.bind(this)}>
                    <React.Text>DELETE ALL</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.writeRealm.bind(this)}>
                    <React.Text>Create</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.updateRealm.bind(this)}>
                    <React.Text>Update</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteRealm.bind(this)}>
                    <React.Text>Delete</React.Text>
                </React.TouchableHighlight>

                {show}
            </React.View>
        )
    }
}

export default Component

let styles = React.StyleSheet.create({
    highlight: {
        backgroundColor: 'yellow',
        margin: 10
    },
    realmObj: {
        fontSize: 35,
        color: "green"
    }
})
