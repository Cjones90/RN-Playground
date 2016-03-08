'use strict';

import Realm from 'realm';

class RealmWrapper {

    schemas: [];

    initSchema(config) {
        if(!config.schemas.length) {
            console.error("Please enter one or more Realm schemas in the first argument as an array");
        }
        if(!config.version) {
            console.error("Please enter a version number as the second argument");
        }
        this.schemas = config.schemas;
        this.realm = new Realm({
            schema: config.schemas,
            // Increment version when schema changes
            schemaVersion: config.version
        })

    }

    addRealmListener(cb) {
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
            let filteredProps = realmList.filtered(`id == '${realmListProps.id}'`);
            !filteredProps.length && realmList.push(realmListProps)
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
        let listChildren = this.deconstruct(object, query)
        let results = this.query(object, query);
        this.realm.write(() => {
            listChildren.forEach((child) => { this.realm.delete(child) })
            this.realm.delete(results);

        })
    }

    deconstruct(object, query) {
        let results = this.queryToArray(object, query)
        let children = [];
        this.schemas.forEach((schemaConstruct) => {
            if(schemaConstruct.schema.name !== object) { return; }
            let props = schemaConstruct.schema.properties;
            for(let prop in props) {
                if(typeof props[prop] === 'object' && props[prop].type === 'list') {
                    let listType = props[prop].objectType
                    children = results.map((obj) => {
                        return this.query(listType, `parentId == ${obj.id}`)
                    })
                }
            }
        })
        return children;
    }

    queryToArray(object, query) {
        let queryResults = this.query(object, query);
        let objectArr = [];
        for(let obj in queryResults) {
            objectArr.push(queryResults[obj])
        }
        return objectArr;
    }

    listToArray(object, listName){
        let listArray = [];
        for(let arrItem in object[listName]) {
            listArray.push(object[listName][arrItem])
        }
        return listArray;
    }

}

export default RealmWrapper
