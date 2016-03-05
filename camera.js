'use strict';

import React from 'react-native';
import NativeModules from 'NativeModules'
import uuid from 'uuid';

import Realmjs from './realmWrapper.js'

const Camera = NativeModules.ImagePickerManager


class Component extends React.Component {
    constructor(props){
        super(props);
        this.realm = new Realmjs();
        this.realm.initSchema();
        this.realm.addReactListener(() => {
            this.setState({
                realmImgs: this.realm.realmQueryToArray('Development', `id == ${props.idnum}`)
            })
        });
        this.state = {
            dev: {idnum: props.idnum},
            realmImgs: this.realm.realmQueryToArray('Development', `id == ${props.idnum}`)
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
                    this.realm.updateList('Development', dev.idnum, 'images', { id: img.imgId, data: img.data })
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
                console.log(img);
                let realmImg = { devId: dev.idnum, imgId: img.id, data: img.data }
                this.realm.updateList('Development', realmImg.devId, 'images', { id: realmImg.imgId, data: realmImg.data })
            })
        }).catch((geterr) => {
            console.error(geterr);
        })
    }

    render() {

        let realmImgs = this.state.realmImgs.map((realmObj) => {
            return this.realm.realmListToArray(realmObj, 'images').map((imgObj) => {
                return <React.Image key={imgObj.id} style={styles.image}
                        source={{uri: "data:image/jpeg;base64,"+imgObj.data}} />
            })
        })

        return (
            <React.View style={styles.container}>

                <React.TouchableOpacity onPress={this.postPics.bind(this)}>
                    <React.Text>Take a Pic</React.Text>
                </React.TouchableOpacity>
                <React.TouchableOpacity onPress={this.grabPics.bind(this)}>
                    <React.Text>Grab Pics</React.Text>
                </React.TouchableOpacity>
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
        flexDirection: "row",
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

})


//
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
//
// takePicture(){
//     this.camera.capture()
//     .then((data) => {
//         this.getPhotos();
//         console.log(data)
//     })
//     .catch((err) => {console.error(err);})
// }
// <Camera style={styles.camera}
//     ref={(cam) => { this.camera = cam }}
//     aspect={Camera.constants.Aspect.Fill}>
//     <React.Text onPress={this.takePicture.bind(this)}>Take Pic</React.Text>
// </Camera>
