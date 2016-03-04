'use strict';


import React, { PropTypes } from 'react-native'
import Realm from 'realm';
// import uuid from 'uuid';

class Component extends React.Component {

    constructor(props){
        super(props)
        this.initSchema()

        // Observe Realm Change Events
        this.realm.addListener('change', () => {
          // Update UI
          this.setState({});
        });

        this.state = {
            realmArr: this.initialQuery()
        }

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
            schemaVersion: 4
        })

        // let realmAtAnotherPath = new Realm({
        //   path: 'anotherRealm.realm',
        //   schema: [CarSchema]
        // });

    }

    initialQuery() {
        let queryResults = this.queryRealm('Development');
        let objectArr = [];
        for(let obj in queryResults) {
            objectArr.push(queryResults[obj])
        }
        return objectArr;
    }

    pushRealm() {


        /*
        // Dumb hackish way which I believe is unreliable, since their documentation isnt clear
        //   on HOW to access a list, or even a specific object,
        //   just `person.car.name` <- WHERE did `person` come from?!?

        let numImgs = this.realm.objects('Development').filtered('id == 1111')[0].images.length
        let list = this.realm.objects('Development').filtered('id == 1111')[0].images;

        let properties = {
            id: `String${numImgs}`,
            data: "Some NEW String of Data"
        }

        this.realm.write(() => {
            list.push(properties)
        })


        */

        // A better way is using a primay key and using the method below
        this.realm.write(() => {
            let dev = this.realm.create('Development', {id: 1111}, true); // Not updating, we're getting here
            let images = dev.images // <-  Now we have our list
            let numImgs = images.length // <- Our example idnumber

            let properties = {
                id: `id-${numImgs}`,
                data: "String of Data"
            }

            images.push(properties)
        })


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

    updateRealm(object, properties) {
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

    render () {

        let realmArr = this.state.realmArr.map((obj) => {
            let images = [];
            for(let img in obj.images) {
                images.push(obj.images[img])
            }
            console.log(images)
            let imgArr = images.map((img) => {
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
                <React.TouchableHighlight style={styles.highlight} onPress={this.pushRealm.bind(this)}>
                    <React.Text>Push</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.updateRealm.bind(this)}>
                    <React.Text>Update</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteRealm.bind(this)}>
                    <React.Text>Delete</React.Text>
                </React.TouchableHighlight>

                {realmArr}
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
