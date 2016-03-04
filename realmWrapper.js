'use strict';

import Realm from 'realm';

class Component {

    initSchema(that) {
        class Development {}
        Development.schema = {
            name: 'Development',
            primaryKey: 'id',
            properties: {
                id: 'int',
                images: {type: 'list', objectType: 'Image'}
            }
        }

        class Image {}
        Image.schema = {
            name: "Image",
            primaryKey: "id",
            properties: {
                id: 'string',
                data: 'data'
            }
        }

        this.realm = new Realm({
            schema: [Development, Image],
            schemaVersion: 2
        })

        this.addReactListener(that);

    }

    addReactListener(that) {
        this.realm.addListener('change', () => {
          that.setState({});
        });
    }

    write(object, properties) {
        this.realm.write(() => {
            this.realm.create(object, properties);
        })
    }

    update(object, properties) {
        // TODO Detect if the property being updated is a list
        // Push if its new, slice/replace if updating
        // Otherwise assign the new value

        this.realm.write(() => {
            this.realm.create(object, properties, true);
        })

        // How to access a specific object in Realm, "create" one with the id you wish to update
        //   with the update flag set to true

        this.realm.write(() => {
            let dev = this.realm.create(object, {id: 1111}, true); // Not updating, we're getting here
            let list = dev.images // <-  Now we have our list  -- TODO Detect what list we're attempting to access
            let numListItems = list.length // <- Our example idnumber

            let properties = {
                id: `id-${numListItems}`,
                data: "String of Data"
            }

            list.push(properties)
        })
    }

    query(object, query) {
        if(!query) { return this.realm.objects(object) }
        return this.realm.objects(object).filtered(query);
    }

    deleteAll() {
        this.realm.write(() => {
            this.realm.deleteAll();
        })
    }

    delete(object, query) {
        let results = !query ? this.realm.objects(object) : this.realm.objects(object).filtered(query);
        this.realm.write(() => {
            this.realm.delete(results);
        })
    }

    initialQuery() {
        let queryResults = this.queryRealm('Development');
        let objectArr = [];
        for(let obj in queryResults) {
            objectArr.push(queryResults[obj])
        }
        return objectArr;
    }

}

export default Component
