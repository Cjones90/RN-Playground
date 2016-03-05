'use strict';

import Realm from 'realm';

class RealmWrapper {

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
            schemaVersion: 5
        })

    }

    addReactListener(cb) {
        this.realm.addListener('change', cb);
    }

    write(object, properties) {
        this.realm.write(() => {
            this.realm.create(object, properties);
        })
    }

    updateProp(object, properties) {
        this.realm.write(() => {
            this.realm.create(object, properties, true);
        })
    }

    updateList(object, objId, listName, realmListProps) {

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

    realmQueryToArray(object, query) {
        let queryResults = this.query(object, query);
        let objectArr = [];
        for(let obj in queryResults) {
            objectArr.push(queryResults[obj])
        }
        return objectArr;
    }

    realmListToArray(object, listName){
        let listArray = [];
        for(let arrItem in object[listName]) {
            listArray.push(object[listName][arrItem])
        }
        return listArray;
    }

}

export default RealmWrapper
