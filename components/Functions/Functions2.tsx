import TrackPlayer, {State} from 'react-native-track-player';
import {Alert, Vibration} from 'react-native';
import {
  examples,
  getDataNumber,
  getDataString,
  pomodorosPremium,
  setData,
  songs,
} from '../Storage/Data';
import {useApp, useQuery} from '@realm/react';
import {User} from '../Storage/MongoDB';
import { Dispatch } from 'react';
import Realm from 'realm';

export const ring = async (index: number, sec: number) => {
  // await TrackPlayer.add(songs)
  const state = await TrackPlayer.getState();


  await TrackPlayer.skip(index);
  await TrackPlayer.play();

  setTimeout(() => {
    TrackPlayer.pause();
  }, sec * 1000);
};

export const vibrateFor = (isVibrate: boolean, sec: number) => {
  if (isVibrate) {
    Vibration.vibrate(sec * 1000);
  }
};

export const setAllData = () => {

  if (getDataNumber('isFirstTime') !== 1) {

  
    setData('isNotificationsEnabled', 0)

    getDataNumber('isPremium') !== 1 ?  setData('isPremium', 0) : {}

    setData('alarmWork', 1);
    setData('alarmBreak', 1);
    setData('workAlarm', 1);
    setData('breakAlarm', 1);
    setData('vibrate', 'false');
    setData('pomodoroLength', 25);
    setData('breakShortLength', 5);
    setData('breakLongLength', 20);
    setData('breakAfterLongLength', 4);
    setData('autoNext', 'false');
    setData('autoBreak', 'false');
    setData('darkMode', 'false');
    setData('subId', '');
    setData('dailyReminder', 'false');
    setData('defaultDoroInt', 1);
    setData('defaultDoroStr', examples[0].name);
    setData('isLogged', 'false');
    setData('firstname', 'Change');
    setData('lastname', 'Me');

    setData('isFirstTime', 1);

    
  }
};

export const setRealmData = (user: { alarmWork: any; alarmBreak: any; vibrate: any; pomodoroLength: any; breakShortLength: any; breakLongLength: any; breakAfterLongLength: any; autoNext: any; autoBreak: any; darkMode: any; dailyReminder: any; defaultDoroInt: any; defaultDoroStr: any; premium: any; avatarType: any; username: any; name: any; useremail: any; isFirstLogin: any }, realm) => {
  // export const setRealmData = (user) => {

  try{
    
    realm.write(() => {
      user.isFirstLogin = 'no';
    });

    
    
    setData('username', user.username);
      setData('alarmWork', user.alarmWork);
      setData('alarmBreak', user.alarmBreak);
      setData('vibrate', user.vibrate);
      setData('pomodoroLength', user.pomodoroLength);
      setData('breakShortLength', user.breakShortLength);
      setData('breakLongLength', user.breakLongLength);
      setData('breakAfterLongLength', user.breakAfterLongLength);
      setData('autoNext', user.autoNext);
      setData('autoBreak', user.autoBreak);
      setData('darkMode', user.darkMode);
      setData('dailyReminder', user.dailyReminder);
      setData('defaultDoroInt', user.defaultDoroInt);
      setData('defaultDoroStr', user.defaultDoroStr);
      setData('isPremium', user.premium);
      setData('avatarType', user.avatarType);
      setData('name', user.username);
      setData('username', user.username);
      setData('email', user.useremail);

  }
  catch(err){
  }


};

export const checkRealmData = async (users, email) => {
  
  const user = await users.findOne({ _id: email });

  setData('alarmWork', user.alarmWork);
  setData('alarmBreak', user.alarmBreak);
  setData('vibrate', user.vibrate);
  setData('pomodoroLength', user.pomodoroLength);
  setData('breakShortLength', user.breakShortLength);
  setData('breakLongLength', user.breakLongLength);
  setData('breakAfterLongLength', user.breakAfterLongLength);
  setData('autoNext', user.autoNext);
  setData('autoBreak', user.autoBreak);
  setData('darkMode', user.darkMode);
  setData('dailyReminder', user.dailyReminder);
  setData('defaultDoroInt', user.defaultDoroInt);
  setData('defaultDoroStr', user.defaultDoroStr);
  setData('isPremium', user.premium);
  setData('name', user.username);
  setData('email', user.useremail);
};

export const createRealmData = (realm, email, name) => {
 
}

export const overWriteDeviceToEmail = () => {

}

export const overWriteEmailToDevice = async (realm, email, users, thisUser) => { 
  
  // thisUser.isFirstLogin == 'yes' ? setRealmData(thisUser, realm) : {}

  setRealmData(thisUser, realm)

}

// export const login = async (em: string, pw: string, navigation: { navigate: (arg0: string) => void; }, app: Realm.App<Realm.DefaultFunctionsFactory>, num, realm) => {
  export const login = async (em, pw, navigation, app, num, realm, users, thisUser) => {
    setData('isLogged', 'true')

    const credentials = Realm.Credentials.emailPassword(em, pw);

  if(num == 0){
    try {
      await app.logIn(credentials);

      // console.log('myemail2: ', thisUser.useremail)

      
      setData('isLogged', 'true');
      
      overWriteEmailToDevice(realm, em, users, thisUser)
  
      await navigation.navigate('Focus');
    } catch (err) {
      Alert.alert('Security Error', err.message);
    }
  }

  else if(num == 1) {
    try {
      await app.logIn(credentials);
  
      // const oneuser = await users.findOne({ _id: em });
      // console.log("venusFlytrap", oneuser);
  
      // setRealmData(oneuser);
     
      overWriteDeviceToEmail()
  
      setData('isLogged', 'true');
      navigation.navigate('Focus');
    } catch (err) {
      Alert.alert('Security Error', err.message);
    }
  }

};



export const ChangeName = () => {};