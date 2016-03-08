'use strict';


import React, { PropTypes } from 'react-native'
import Realm from 'realm';

class RealmComponent extends React.Component {

    constructor(props){
        super(props)
        this.initSchema()

        this.state = {
            developments: this.realmQueryToArray('Development')
        }

        // Observe Realm Change Events
        this.realm.addListener('change', () => {
          // Update UI
          //   When "deleting all", it was throwing an error as the state
          //   was referencing objects that were deleted from the Realm instance,
          //   so I decided to just re-query on change
            this.setState({
              developments: this.realmQueryToArray('Development')
            });

        });

        // Unregister all listeners
        // this.realm.removeAllListeners();

    }

    initSchema() {
        class Development {}
        Development.schema = {
            name: 'Development',
            primaryKey: 'id',
            properties: {
                id: 'int',
                images: {type: 'list', objectType: 'Image'}
            }
        }

        class ImageSchema {}
        ImageSchema.schema = {
            name: "Image",
            primaryKey: "id",
            properties: {
                id: 'string',
                data: 'string'
            }
        }

        this.realm = new Realm({
            schema: [ImageSchema, Development],
            // Increment version when schema changes
            schemaVersion: 7
        })
        // let realmAtAnotherPath = new Realm({
        //   path: 'anotherRealm.realm',
        //   schema: [CarSchema]
        // });

    }

    writeRealm() {

        let object = 'Development';
        let properties = {
            id: 1111,
            images: []
        };

        this.realm.write(() => {
            this.realm.create(object, properties);
        })

        // let dogNames = ["Rex", "Rover", "Spot", "Champ", "Buster", "Bill", "Baxter", "Charlie"];
        // let dogAge = 3;
        // let numDogs = this.realm.objects('Dog').length;

        // this.realm.write(() => {
        //     this.realm.create('Dog', {
        //         id: numDogs,
        //         name: dogNames[numDogs]
        //     }, true);
        // })
    }

    updateProp(object, properties) {
        return;
        this.realm.write(() => {
            this.realm.create(object, properties, true);
        })

        // this.realm.write(() => {
        //     this.realm.create('Dog', {
        //         id: 1,
        //         age: 30
        //     }, true);
        // })
    }

    updateList(object, objId, listName, realmListProps) {
        return;
        this.realm.write(() => {
            // How to access a specific object in Realm, "create" one with the id you wish to update
            //   with the update flag set to true
            let obj = this.realm.objects(object).filtered(`id == ${objId}`);
            if(!obj.length) {
                console.log("Creating...");
                let newObjProperties = {id: objId}
                newObjProperties[listName] = [];
                this.realm.create(object, newObjProperties)
            }
            let realmObj = this.realm.create(object, {id: objId}, true); // Not updating, we're getting here
            let realmList = realmObj[listName] // <-  Now we have our list

            realmList.push(realmListProps)
        })
    }

    queryRealm(object, query) {
        // Example AND and indexOf
        // dogs.filtered('color = "tan" AND name BEGINSWITH "B"');

        // Example LIMIT
        //     get first 5 Car objects
        // let firstCars = Array.prototype.slice.call(cars, 0, 5);

        if(!query) { return this.realm.objects(object) }
        return this.realm.objects(object).filtered(query);
    }

    deleteAllRealm() {
        this.realm.write(() => {
            this.realm.deleteAll();
        })
    }

    deleteRealm(object, query) {
        return;
        let results = !query ? this.realm.objects(object) : this.realm.objects(object).filtered(query);
        this.realm.write(() => {
            this.realm.delete(results);
        })
    }

    realmListToArray(object, listName){
        let listArray = [];
        for(let arrItem in object[listName]) {
            listArray.push(object[listName][arrItem])
        }
        return listArray;
    }

    realmQueryToArray(object, query) {
        let queryResults = this.queryRealm(object, query);
        let objectArr = [];
        for(let obj in queryResults) {
            objectArr.push(queryResults[obj])
        }
        return objectArr
    }

    render () {

        let developments = this.state.developments.map((obj) => {

            let imgArr = this.realmListToArray(obj, 'images').map((img) => {
                return <React.Text key={img.id}>imgID: {img.id}, imgData: {img.data}</React.Text>
            })
            return <React.Text style={styles.realmObj} key={obj.id}>{obj.id} images: {imgArr}</React.Text>
        })

        return (
            <React.View>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteAllRealm.bind(this)}>
                    <React.Text>DELETE ALL</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.writeRealm.bind(this)}>
                    <React.Text>Create</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.updateList.bind(this)}>
                    <React.Text>Push</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.updateProp.bind(this)}>
                    <React.Text>Update</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteRealm.bind(this)}>
                    <React.Text>Delete</React.Text>
                </React.TouchableHighlight>


            </React.View>
        )
    }
}

export default RealmComponent

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
