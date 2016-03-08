'use strict';

import React from 'react-native';
import NativeModules from 'NativeModules';
import uuid from 'uuid';

import Realmjs from './realm.js'

const Camera = NativeModules.ImagePickerManager


class Component extends React.Component {
    constructor(props){
        super(props);

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
                parentId: {type: 'int', default: null},
                data: 'string'
            }
        }

        this.realm = new Realmjs();
        this.realm.initSchema({schemas: [ImageSchema, Development], version: 9});
        this.realm.addRealmListener(() => {
            this.setState({
                realmImgs: this.realm.queryToArray('Development', `id == ${props.idnum}`)
            })
        });
        this.state = {
            dev: {idnum: props.idnum},
            realmImgs: this.realm.queryToArray('Development', `id == ${props.idnum}`)
        }


    }

    postPics() {
        // let options = {
        //     storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        //     skipBackup: true, // image will NOT be backed up to icloud
        //     path: 'images' // will save image at /Documents/images rather than the root
        //   }
        // }
        Camera.showImagePicker({}, (res) => {
            if(res.didCancel){ console.log("Cancelled"); }
            else {
                let dev = this.state.dev;
                let img = {imgId: `dev-${dev.idnum}-${uuid.v4()}`, data: res.data}
                let options = {
                    method: "POST",
                    body: JSON.stringify(img)
                }

                fetch(`http://192.168.30.222:8086/upload/${dev.idnum}`, options).then((uploadres) => {
                    this.realm.updateList('Development', dev.idnum, 'images', { id: img.imgId, parentId: dev.idnum, data: img.data })
                }).catch((fetcherr) => {
                    console.error(fetcherr);
                })
            }
        })
    }

    grabPics(){
        let dev = this.state.dev;
        fetch(`http://192.168.30.222:8086/get/${dev.idnum}`, {method: "POST"}).then((getres) => {
            let body = getres._bodyText ? JSON.parse(getres._bodyText) : '';
            let imgs = body ? body.imgs : '';

            imgs.length && imgs.forEach((img) => {
                let realmImg = { devId: dev.idnum, imgId: img.id, data: img.data }
                this.realm.updateList('Development', realmImg.devId, 'images', { id: realmImg.imgId, parentId: realmImg.devId, data: realmImg.data })
            })
        }).catch((geterr) => {
            console.error(geterr);
        })
    }

    deleteStoragePics(){
        this.realm.delete('Development', `id == ${this.state.dev.idnum}`)
    }

    deleteAllStorage(){
        this.realm.deleteAll()
    }

    render() {

        let realmImgs = this.state.realmImgs.map((realmObj) => {
            return this.realm.listToArray(realmObj, 'images').map((imgObj) => {
                return <React.Image key={imgObj.id} style={styles.image}
                        source={{uri: "data:image/jpeg;base64,"+imgObj.data}} />
            })
        })


        return (
            <React.View style={styles.container}>

                <React.TouchableHighlight style={styles.highlight} onPress={this.postPics.bind(this)}>
                    <React.Text style={styles.innerText}>Take a Pic</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.grabPics.bind(this)}>
                    <React.Text style={styles.innerText}>Grab Pics</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteAllStorage.bind(this)}>
                    <React.Text style={styles.innerText}>Delete All Storage</React.Text>
                </React.TouchableHighlight>
                <React.TouchableHighlight style={styles.highlight} onPress={this.deleteStoragePics.bind(this)}>
                    <React.Text style={styles.innerText}>Delete Storage Pics</React.Text>
                </React.TouchableHighlight>
                <React.ScrollView
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={styles.imgScrollContainer}
                    style={styles.imgContainer}>

                    {realmImgs}

                </React.ScrollView>

            </React.View>
        )
    }
}

export default Component

let styles = React.StyleSheet.create({
    container: {
        backgroundColor: "green",
        flexDirection: "column",
        width: 750
    },
    image: {
        height: 140,
        width: 150,
    },

    imgScrollContainer: {
        flexDirection: "row",
        flexWrap: "wrap"
    },

    imgContainer: {
        flexDirection: "column",
        flexWrap: "wrap",
        flex: 2,
    },
    highlight: {
        flexDirection: "column",
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
        backgroundColor: "white",
        flex: 1
    },
    innerText: {
        textAlign: 'center',
        margin: 5,
    }

})


// getPhotos(){
//     React.CameraRoll.getPhotos({first: 100}, (success) => {
//         console.log(success)
//         let imgArr = []
//         success.edges.forEach((img) => {
//             imgArr.push(img.node.image.uri)
//         })
//         this.setState({
//             images: imgArr
//         })
//         console.log("Success")
//     }, (err) => {
//
//     })
// }
