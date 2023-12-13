import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {
  Header,
  ProfileRow,
  Space,
  styles,
  SettingsCell,
  SettingsCellwSwitch,
  SettingsCellwText,
  SettingsCellGold,
  SCREEN_HEIGHT,
  SettingsCellwSwitch2,
  SettingsCellLogout,
  LineBwCell,
  Textt,
  AppleButtonWithHighlight,
  DText,
} from '../../../components/Utilities/Utilities';
import {
  DefaultPicker,
  LongBreakAfterPicker,
  LongBreakPicker,
  OpenURLButton,
  OpenURLButtonRefProps,
  PomodoroPicker,
  ShortBreakPicker,
  StorageAsync,
  StorageAsyncProps,
} from '../../../components/Functions/Functions';
// import { OpenURLButton} from '../components/Functions/Functions';
// import { StorageRealm} from '../components/Functions/Functions';
// import { StorageRefProps } from '../components/Functions/Functions';
import {
  examples,
  getData,
  getDataBoolean,
  getDataNumber,
  getDataString,
  merchantIdentifier,
  publishableKey,
  setData,
  urlAppStore,
  urlAppWeb,
  urlSite,
  urlSiteSupport,
} from '../../../components/Storage/Data';
// import { User, UserRealmContext } from '../components/Storage/MongoDB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StripeProvider} from '@stripe/stripe-react-native';
// import { useApp } from '@realm/react';
import {OfferSheet, OfferSheetRefProps} from '../../../components/OfferSheet';
import {scrollTo} from 'react-native-reanimated';
import {useApp} from '@realm/react';
// import PaymentScreen from '../components/Functions/Stripe/Stripe';
import {
  BottomSheet,
  BottomSheetRefProps,
} from '../../../components/BottomSheetPayment';
import {useColorScheme} from 'react-native';
// import Purchases from 'react-native-purchases';

const Cc1 = ({route, navigation}) => {
 
  const {darkMode} = route.params;
  const [isDarkModeOn, setIsDarkModeOn] = useState(darkMode)
  const [isSheetOn, setIsSheetOn] = useState(false)
  

  return (
    <SafeAreaView
      style={[
        styles.pageSettings,
        {
          backgroundColor:
            isSheetOn && isDarkModeOn
              ? '#212121'
              : isDarkModeOn
              ? 'black'
              : '#F2F2F6',
          zIndex: isSheetOn ? 0 : 1,
        },
      ]}>
      <Header
        isSheetOn={isSheetOn}
        opacity={isSheetOn ? 0.4 : 1}
        onPress={() => {
          if (!isSheetOn) {
            navigation.goBack();
          }
        }}
        color={
          isSheetOn && !isDarkModeOn
            ? '#F9F9FB'
            : isSheetOn
            ? '#212121'
            : isDarkModeOn
            ? 'black'
            : '#f2f2f6'
        }
        opacity={isSheetOn ? 0.7 : 1}
        isSubtle={undefined}
        isBorderOk={undefined}
        isWriting={undefined}
        isOnChange={undefined}
        isDarkModeOn={undefined}
        onPress2={undefined}
        isOnTask={undefined}
        isAddOn={undefined}
        isAddOn0={undefined}
        title={'Creating a New Task'}
        mode={2}
      />

        <Space space={10}/>


      <DText text={'The Pomodoro Technique is a simple way to manage time and help you focus. Choose a task, set the timer for 25 minutes, and start timing! Resist all distractions during the 25 minute period, and once the timer is up, you can take a 5 minute break.'}/>
        

    </SafeAreaView>
  );
};

export default Cc1;
