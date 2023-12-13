import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { User, UserRealmContext } from '../../../components/Storage/MongoDB';
import { AppleInput, CellUpperText, ChangeWText, Header, Space, styles } from '../../../components/Utilities/Utilities';
import { SubsBoxProfile } from '../../../components/Utilities/Utilities3';
import { ConfirmSheet, ConfirmSheetRefProps } from '../../../components/OfferSheet';
import { getDataNumber, getDataString, setData } from '../../../components/Storage/Data';
import { API_URL_CANCEL } from '../../../components/Data';

const Subs = ({route, navigation}) => {

    const [isWriting, setIsWriting] = useState(false)
    const [subId, setSubId] = useState(getDataString('subId'))
    const [isSubActive, setIsSubActive] = useState(getDataNumber('isSubActive') == 1)
    const [subStartDate, setSubStartDate] = useState(getDataString('subStartDate'))
    const {isDarkModeOn} = route.params
    
    const today = new Date().getTime()
    const tmr = today + 1000 * 60 * 60 * 24 * 28

    const nextMonth = new Date(tmr)

    const theEndDate = getDataNumber('isThis') == 1 ? new Date() : nextMonth
    const theEndDay = getDataNumber('endDateDay')

    
    const cancel = async () => {
        try{
            const response = await fetch(`${API_URL_CANCEL}?subId=${subId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', 
              },
            //   body: {
            //     subId: subId,
            //   },
            })
            const { result } = await response.json();

            
            if(await result == '200'){
                const subStartDate = getDataNumber('subStartDate')

                setData('isSubWillEnd')
                if(new Date(subStartDate).getDate() > new Date().getDate()) {
                    setData('endDateDay', new Date(subStartDate).getDate())
                    setData('isThis', 1)
                } else if(new Date(subStartDate).getDate() < new Date().getDate()) {
                    setData('endDateDay', new Date(subStartDate).getDate())
                    setData('isThis', 0)
                }

            }        
            else if(await result == '404'){
            }

          }
          catch(err)
          {
        }
    }
    
    const ref2 = useRef<ConfirmSheetRefProps>(null)
    const openLogoutSheet = useCallback(() => {
        ref2?.current?.scrollTo(-40)
    }, [])

    return  (
    <SafeAreaView style={[styles.pageProfile, {backgroundColor: isDarkModeOn ? 'black' : '#f2f2f6'}]}>
        
        <Header onPress={() => {
            navigation.goBack()
        }} title={'Subscriptions'} 
        isOnChange={true}
        isWriting={isWriting}
        isDarkModeOn={isDarkModeOn}
        />
       
        {/* <HeaderButtonRight onPress={isWriting ? () => {handleText('txt', 2)} : () => {}} isWriting={isWriting} /> */}
       
        <ScrollView>

            <CellUpperText isSubActive={getDataNumber('isStillOn') == 1} isDarkModeOn={isDarkModeOn} txt={'ACTIVE'} txt2={'NO SUBSCRIPTIONS FOUND'}/>

            <SubsBoxProfile
            isSubActive={isSubActive} 
            // isCanceled={false}
            isStillOn={getDataNumber('isSub') == 1} 
            onPress={() => {openLogoutSheet()}} 
            isDarkModeOn={isDarkModeOn} txt1={'WillDoro'} txt2={'Premium'} 
            txt3={`Expires on ${theEndDay} ${ theEndDate.toLocaleString('en-US', {
            month: 'long',
      })}`}/>            

            <Space space={20}/>

        </ScrollView>
        
        <ConfirmSheet cancelSub={cancel} logout={cancel} logordelete={4} isDarkModeOn={isDarkModeOn}  ref={ref2} closeSheet2={()=>{}}/>

    </SafeAreaView>
)}

export default Subs;
