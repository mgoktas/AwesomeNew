// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, useAuth } from '@realm/react';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { User, UserRealmContext } from '../../components/Storage/MongoDB';
import { Header, HeaderButton, Space, styles } from '../../components/Utilities/Utilities';
import { Input, TextButton } from '../../components/Utilities/Utilities2';
import { AppleButton } from '../../components/Utilities/Utilities3';
import uuid from 'react-native-uuid';
// import { AccessToken, LoginButton, LoginManager, Profile } from 'react-native-fbsdk-next';
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import validator from 'validator';
import { User, UserRealmContext } from '../../components/Storage/MongoDB';
import { getDataString } from '../../components/Storage/Data';
import Realm from "realm"
import { AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import { Settings } from 'react-native-fbsdk-next';
import { setPasswordToServer } from '../../components/Storage/Azure';

const Signup = ({route, navigation}) => {

    const {_dark} = route.params
    const [isDarkModeOn, setIsDarkModeOn] = useState(_dark)
    const [signinInProgress, setSigninInProgress] = useState(false);

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    const app = useApp();
    const {useRealm, useQuery, useObject} = UserRealmContext;
    const realm = useRealm()
    // const thisUser = useObject(User, email);
    const thisUser = useObject(User, email);
    
    const createAccount = async () => {

        if(name.split(' ').length < 2){ 
            Alert.alert('Security Error','Name should include your surname')
            return
        }

        if(email.length == 0){
            Alert.alert('Security Error','Please enter your email.')
            return
        }

        if(!validator.isEmail(email)){
            Alert.alert('Security Error','Your email seems to be incorrect. Please enter your email again.')
            return
        }

        if(password.length == 0 || password2.length == 0){
            Alert.alert('Security Error','Please enter your password.')
            return
        }

        if(password != password2){
            Alert.alert('Security Error','Passwords do not match')
            return
        }
        
        try {
            await app.emailPasswordAuth.registerUser({email, password});
            
            thisUser  == null ?  realm.write(() => {
                realm.create('User', {
                    _id: email,
                    useremail: email,
                    name: name,
                    username: name,
                    userpassword: password,
                    subId: getDataString('subId'),
                    premium: 1
                });
            }) : {}
        ;

        await navigation.navigate('Focus', {_dark : isDarkModeOn, email2 : email})
          } 
          catch (err) {
          }
    }

    const logingl = async () => {
      setSigninInProgress(true);
      GoogleSignin.configure({
        iosClientId: '<YOUR-CLIENT-ID>',
        webClientId: '<YOUR-CLIENT-ID>', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.

    });

    try {
    //   Sign into Google
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setEmail(userInfo.user.email)

      const password = '123456'
      const email = userInfo.user.familyName

    //   await app.emailPasswordAuth.registerUser({email: email, password: password});

    //   await setPasswordToServer(email, password)

        
        // thisUser  == null ?  realm.write(() => {
        //     realm.create('User', {
        //         _id: email,
        //         useremail: email,
        //         name: userInfo.user.givenName + ' ' + userInfo.user.familyName ,
        //         username:  userInfo.user.givenName + ' ' + userInfo.user.familyName ,
        //         userpassword: password,
        //         subId: getDataString('subId'),
        //         premium: 1
        //     });
        // }) : {}

        await navigation.navigate('Focus', {_dark : isDarkModeOn, email2 : email})


        
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    } finally {
      setSigninInProgress(false);
    }

// GoogleSignin.hasPlayServices().then((hasPlayService) => {
//         if (hasPlayService) {
//              GoogleSignin.signIn().then((userInfo) => {

//                        console.log(JSON.stringify(userInfo))
//              }).catch((e) => {
//              console.log("ERROR IS: " + JSON.stringify(e));
//              })
//         }
// }).catch((e) => {
//     console.log("ERROR IS: " + JSON.stringify(e));
// })


    }

    return (
        <SafeAreaView style={[styles.pageSign, {backgroundColor: isDarkModeOn ? '#1c1c1e' : '#f2f2f6'}]}>
        <Header
        isDarkModeOn={isDarkModeOn}
        onPress={() => {
                navigation.goBack()
            }} 
            color={1} opacity={1} isSubtle={undefined} isBorderOk={false}  />
                    <Space space={24}/>
        
        <Input isDarkModeOn={isDarkModeOn} autoCap={'words'} icon={'person'} placeholder={'Name'} onChangeText={(txt) => setName(txt)}/>
        <Space space={12}/>
        
        <Input isDarkModeOn={isDarkModeOn} autoCap={'none'} icon={'mail'} placeholder={'Email Address'} onChangeText={(txt) => setEmail(txt)}/>
        <Space space={12}/>
        
        <Input isDarkModeOn={isDarkModeOn} icon={'lock-closed'} placeholder={'Password'} isPassword={true} onChangeText={(txt) => setPassword(txt)}/>
        <Space space={12}/>
        
        <Input isDarkModeOn={isDarkModeOn} icon={'lock-closed'} placeholder={'Password Again'} isPassword={true} onChangeText={(txt) => setPassword2(txt)}/>
        <Space space={3}/>
        
        <TextButton margin={10} onPress={() => {navigation.goBack()}} txt={'Already registered?'}/>
        
        <AppleButton onPress={createAccount} txt={'Sign Up'} isPrimary={true} color={'#007AFF'}/>
   
        <TextButton margin={10} onPress={() => {navigation.goBack()}} txt={'or?'}/>
   

        <AppleButton 
        onPress={() => {logingl()}} 
        txt={'Sign Up with Google'} isPrimary={false} color={'#007AFF'}/>

        {/* <AppleButton onPress={onAppleButtonPress} txt={'Sign with Apple'} isPrimary={false} color={'#007AFF'}/> */}
   
    </SafeAreaView>
    )
}

export default Signup;


