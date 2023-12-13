import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { User, UserRealmContext } from '../../../components/Storage/MongoDB';
import { ChangeWText, Header, styles } from '../../../components/Utilities/Utilities';
import { User, UserRealmContext } from '../../../components/Storage/MongoDB';
import { setData } from '../../../components/Storage/Data';

const ChangeName = ({route, navigation}) => {

    const [isWriting, setIsWriting] = useState(false)
    
    const { name, isDarkModeOn, email } = route.params;
    const [newName, setNewName] = useState(name)
    
    const len = name.split(' ').length
    const firstname = len == 2 ? name.split(' ')[0] : name.split(' ')[0] + ' ' + name.split(' ')[1]
    const lastname = name.split(' ')[len - 1]
    
    const [firstName, setFirstName] = useState(firstname)
    const [lastName, setLastName] = useState(lastname)

    const handleText = (txt: string, num: number) => {
        if(num == 0){
            if(lastname != txt){
                setIsWriting(true)
                setLastName(txt)
            } else {
                setIsWriting(false)
            }
        }
        else if(num == 1){
            if(firstname != txt){
                setIsWriting(true)
                setFirstName(txt)
            } else {
                setIsWriting(false)
            }
        }
        else if(num == 2){
                // changeName(firstName + ' ' + lastName)
        }  
    }

    const changeNameHere = () => {
        const newName2 = firstName + ' ' + lastName
        setData('firstname', firstName)
        setData('lastname', lastName)

        navigation.goBack()
    }

    return  (
    <SafeAreaView style={[styles.pageProfile, {backgroundColor: isDarkModeOn ? 'black' : '#f2f2f6'}]}>
        
        <Header 
        onPress={() => {
            navigation.goBack()
        }} title={'Name'} color={1}  
        isOnChange={true}
        isWriting={isWriting}
        onPress2={() => {changeNameHere()}}
        />
        {/* <HeaderButtonRight onPress={isWriting ? () => {handleText('txt', 2)} : () => {}} isWriting={isWriting} /> */}
        <ScrollView>
            <ChangeWText 
            isDarkModeOn ={isDarkModeOn}
            txt1={'Last'}
            txt2={'First'}
            onChangeTextSurname={(txt) => {handleText(txt, 0)}}
            onChangeTextFirstname={(txt) => {handleText(txt, 1)}}
            iconArrow={'angle-right'} firstname={firstname} lastname={lastname}/>
        </ScrollView>
        

    </SafeAreaView>
)}

export default ChangeName;
