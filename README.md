# Testing grounds for React-Native components

Take the project for face-value, it provides examples but doesn't have any utility.

You'll need to install react-native using their comprehensive how-to
https://facebook.github.io/react-native/

In order for some components to work, the below packages have to be configured in your Xcode project.
Each package has a quick how-to to get them working (fairly universal as well).


## For Image-Picker
https://github.com/marcshilling/react-native-image-picker

## For Realm
https://realm.io/docs/react-native/latest/


## File Sharing/editing with iTunes
https://stackoverflow.com/questions/6029916/how-to-enable-file-sharing-for-my-app

Open your project in Xcode  
Enter the folder with the name of your Xcode project  
Click Info.plist  
Right click an empty area under the other keys and add the below rows  

Depending on how your Info.plist displays the keys it will either be:  
`Application supports iTunes file sharing`  
or  
`UIFileSharingEnabled`  
and set the value to YES

Also add `Bundle display name` or `CFBundleDisplayName` (again depending on key view)  
Set to whatever you want, this is what will show in iTunes

Now once rebuilt and with your device plugged in, click on your device in the iTunes menu (right below the play buttons)  
Click Apps  
Scroll down to see your app under whatever name you put in the `Bundle display name` field
