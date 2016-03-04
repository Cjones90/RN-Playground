'use strict';

import React from 'react-native';
import NativeModules from 'NativeModules'

const Camera = NativeModules.ImagePickerManager


class Component extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
            avatar: ''
        }
    }

    grabPics() {
        // let options = {
        //     storageOptions: { // if this key is provided, the image will get saved in the documents/pictures directory (rather than a temporary directory)
        //     skipBackup: true, // image will NOT be backed up to icloud
        //     path: 'images' // will save image at /Documents/images rather than the root
        //   }
        // }
        Camera.showImagePicker({}, (res) => {
            if(res.didCancel){
                console.log("Cancelled")
            }
            else {
                let options = {
                    method: "POST",
                    body: JSON.stringify({dev: 1111, data: res.data})
                }
                fetch('http://yourip/upload/1111', options).then((uploadres) => {
                    this.setState({
                        picStatus: uploadres._bodyText,
                        // avatar: {uri: res.uri.replace('file://', ''), isStatic: true}
                        avatar: {uri: 'data:image/jpeg;base64,' + res.data, isStatic: true}
                    }, () => {
                        fetch('http://yourip/get/1111', {method: "POST"}).then((getres) => {
                            console.log(getres._bodyText)
                            let imgs = JSON.parse(getres._bodyText).imgs
                            this.setState({
                                images: imgs
                            })
                        }).catch((geterr) => {
                            console.error(geterr);
                        })
                    })

                }).catch((fetcherr) => {
                    console.error(fetcherr);
                })


            }
        })
    }

    render() {

        let returnedImgs = this.state.images.map((img, i) => {
            return <React.Image key={i+img} style={styles.image}
                source={{uri: "data:image/jpeg;base64,"+img}} />
        })

        return (
            <React.View style={styles.container}>

                <React.TouchableOpacity onPress={this.grabPics.bind(this)}>
                    <React.Text>Take a Pic</React.Text>
                </React.TouchableOpacity>
                <React.ScrollView
                    automaticallyAdjustContentInsets={false}
                    contentContainerStyle={styles.imgScrollContainer}
                    style={styles.imgContainer}>

                    {returnedImgs}

                </React.ScrollView>

                <React.Text>{this.state.picStatus}</React.Text>



            </React.View>
        )
    }
}

export default Component

let styles = React.StyleSheet.create({
    container: {
        backgroundColor: "green",
        flexDirection: "row",
        width: 460,
        height: 160
    },
    camera: {
        backgroundColor: "magenta",
        flex: 1
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
