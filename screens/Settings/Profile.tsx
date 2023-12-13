import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@realm/react';
// import { useApp } from '@realm/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonSheet, ButtonSheetRefProps, ConfirmSheet, ConfirmSheetRefProps } from '../../components/OfferSheet';
// import { User, UserRealmContext } from '../../components/Storage/MongoDB';
import { CellUpperText, Header, HeaderButton, LineBwCell, ProfileWText, SCREEN_HEIGHT, SettingsCell, SettingsCellProfile, SettingsCellwText, Space, styles } from '../../components/Utilities/Utilities';
import { AvatarLogo } from '../../components/Utilities/Utilities3';
import { azureConstant, setData } from '../../components/Storage/Data';
import RNFetchBlob from 'rn-fetch-blob'
import {useFocusEffect} from '@react-navigation/native';
import {
    examples,
    getDataNumber,
    getDataString,
    pomodorosFree,
    pomodorosPremium,
    songs,
  } from '../../components/Storage/Data';
import { setAllData } from '../../components/Functions/Functions2';
import { getUniqueId, getManufacturer } from 'react-native-device-info';

const Profile = ({route, navigation}) => {

    const { selectedName, email, isDarkModeOn } = route.params;
    const [newName, setNewName] = useState(selectedName)
    const [isSheetOn, setIsSheetOn] = useState(false)
    const [logordelete, setLogordelete] = useState(0)

    const avatarUrl = azureConstant + email

    const app = useApp()
    
    const logout = async () => {

        try {
            await app.currentUser?.logOut();
            setData('isLogged', 'false')
            navigation.navigate('Focus')
        }
        catch (err) {
            // console.log(err)
        }

    }

    const deleteAccount = async () => {

        try{
            setData('isFirstTimee', 0)
            setAllData()
            await navigation.navigate('Focus')
        }catch(err){
            // console.log(err)
        }
    }
 
    StatusBar.setBarStyle('light-content', true);


    useFocusEffect(
        React.useCallback(() => {
            setNewName(getDataString('firstname') + " " + getDataString('lastname'))
        }, []),
      );



    const ref = useRef<ButtonSheetRefProps>(null)
    const ref2 = useRef<ConfirmSheetRefProps>(null)

    const openSheet = useCallback(() => {
        ref?.current?.scrollTo(-300, isDarkModeOn)
    }, [])

    const closeSheet =async ()=>{
 
        setTimeout(function(){
     
          //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
          setIsSheetOn(false)

        }, 200);

    }

    const closeSheet2 =async ()=>{
 
        setTimeout(function(){
     
          //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
          setIsSheetOn(false)

        }, 200);

    }

    const openLogoutSheet = useCallback(() => {
        ref2?.current?.scrollTo(-40)
    }, [])

    const closeLogoutSheet =async ()=>{
 
        setTimeout(function(){
     
          //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
          setIsSheetOn(false)

        }, 200);

    }
    // console.log(isDarkModeOn, 'isDarkModeOn') 

    return  (
    <SafeAreaView style={[styles.pageProfile, {backgroundColor: isDarkModeOn ? 'black' : '#f2f2f6'}]}>
              <StatusBar
        animated={true}
        backgroundColor="white"
        // barStyle={{color: 'white'}}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />
        <Header 
        opacity={isSheetOn ? .7 : 1}
        isDarkModeOn={isDarkModeOn}
        isSheetOn={isSheetOn}
            onPress={() => {
            navigation.goBack()
            }} title={'Profile'} 
            color={isDarkModeOn ? 'black' : '#f2f2f6'}
            />
            
            <ScrollView contentContainerStyle={{justifyContent: 'space-between', flex: 1}}>

                    <View>

                        <AvatarLogo imageSource={avatarUrl} isDarkModeOn={isDarkModeOn} isSheetOn={isSheetOn} fullname={newName} email={''} avatar={'#A0A6BE'} onPress={() => {openSheet(); setIsSheetOn(true)}} /> 

                        <ProfileWText isDarkModeOn={isDarkModeOn} isSheetOn={isSheetOn}  onPress={() => {navigation.navigate('ChangeName', {name: selectedName, changeName: setNewName, isDarkModeOn: isDarkModeOn, email: '' })}} iconArrow={'angle-right'} value={newName} title={'Name'} isLast={getDataNumber('isPremium') == 1 ? false : true} isFirst={true}/>
                        <LineBwCell />
                        <ProfileWText isPremium2={getDataNumber('isPremium') == 1 ? 'true2' : 'false'} isPremium={'true'} isDarkModeOn={isDarkModeOn} isSheetOn={isSheetOn}  onPress={() => {navigation.navigate('Signup',{_dark: isDarkModeOn})}} iconArrow={'angle-right'} value={''} title={'Create Account'} isLast={true} isFirst={false}/>
                        <LineBwCell />
                        
                        <Space space={5}/>
  
                    </View>

                    <View>
                        {/* <SettingsCellProfile isDarkModeOn={isDarkModeOn} onPress={() => {; setIsSheetOn(true); openLogoutSheet(); setLogordelete(0)}} isSheetOn={isSheetOn} type={'red'} isLogout={true} isLogged={true} isFirst={true} isLast={true}
                        title={'Sign out'} center={true}/> */}
                        <Space space={5}/>
                        <SettingsCellProfile isDarkModeOn={isDarkModeOn} isSheetOn={isSheetOn} type={'red'}isLogged={true} isFirst={true} isLast={true} onPress={()=>{setIsSheetOn(true); openLogoutSheet(); setLogordelete(1)}} isLogout={true} title={'Delete All Data'} />
                        <Space space={SCREEN_HEIGHT/10}/>
                    </View>
 
            </ScrollView>

            <ButtonSheet userEmail={email} isDarkModeOn={isDarkModeOn} ref={ref} closeSheet={closeSheet} />
            <ConfirmSheet logout={logout} deleteAccount={deleteAccount} logordelete={logordelete} isDarkModeOn={isDarkModeOn}  ref={ref2} closeSheet2={closeSheet2} />
        

    </SafeAreaView>
)}

export default Profile;
