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
} from '../components/Utilities/Utilities';
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
  regNotifs,
  removeAllNotificationstifs,
  setNotifications,
} from '../components/Functions/Functions';
// import { OpenURLButton} from '../components/Functions/Functions';
// import { StorageRealm} from '../components/Functions/Functions';
// import { StorageRefProps } from '../components/Functions/Functions';
import {
  azureConstant,
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
  urlScheme,
  urlSite,
  urlSiteSupport,
} from '../components/Storage/Data';
// import { User, UserRealmContext } from '../components/Storage/MongoDB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StripeProvider} from '@stripe/stripe-react-native';
// import { useApp } from '@realm/react';
import {OfferSheet, OfferSheetRefProps} from '../components/OfferSheet';
import {scrollTo} from 'react-native-reanimated';
import {useApp, useObject} from '@realm/react';
// import PaymentScreen from '../components/Functions/Stripe/Stripe';
import {  
  BottomSheet,
  BottomSheetRefProps,
} from '../components/BottomSheetPayment';
import {useColorScheme} from 'react-native';
// import Purchases from 'react-native-purchases';
import Dialog from "react-native-dialog";
import { User, UserRealmContext } from '../components/Storage/MongoDB';
import PaymentScreen from './Stripe';
import { API_URL, officialWebsite, publishableKeyLive, publishableKeyTest } from '../components/Data';
import CheckoutScreen from './Stripe';
import {useFocusEffect} from '@react-navigation/native';
import { Notifications } from 'react-native-notifications';
import { getPasswordFromServer, setPasswordToServer, updatePasswordToServer } from '../components/Storage/Azure';
import { getUniqueId } from 'react-native-device-info';
import { InAppPurchase, SubscriptionPurchase, clearProductsIOS, finishTransaction, getProducts, requestPurchase, requestSubscription } from 'react-native-iap';
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
  flushFailedPurchasesCachedAsPendingAndroid,
} from 'react-native-iap';
const Settings = ({route, navigation}) => {
  const {success} = route.params;

  const [uniqueId, setUniqueId] = useState()

  useEffect(() => {
    getUniqueId().then((id) => {
    setUniqueId(id)
    })
  },[])

  
  useEffect(() => {
    setTimeout(() => {
      // checkUrl();
      }, 1000);  },[])

  const checkUrl = () => {

   

      setTimeout(() => {
      success == 'yes' ?  openPremiumConfirmedDialog() : {}
      }, 1000);


  }

  const [isLog, setIsLog] = useState(true);
  const [isSheetOn, setIsSheetOn] = useState(false);

  const [isPremium, setIsPremium] = useState(true)
  const [email, setEmail] = useState(getDataString('email'))

  const [isDarkModeOn, setIsDarkModeOn] = useState(getDataString('darkMode') === 'true');
  const [isPomodoroSelected, setIsPomodoroSelected] = useState(false);
  const [isShortBreakSelected, setIsShortBreakSelected] = useState(false);
  const [isLongBreakSelected, setIsLongBreakSelected] = useState(false);
  const [isAfterLongBreakSelected, setIsAfterLongBreakSelected] = useState(false);
  const [isDefaultDoroSelected, setIsDefaultDoroSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(getDataNumber('isNotificationsEnabled') == 1);
  const [workAlarm, setWorkAlarm] = useState(getDataNumber('alarmWork'));
  const [breakAlarm, setBreakAlarm] = useState(getDataNumber('alarmBreak'));
  const [vibrate, setVibrate] = useState(getDataString('vibrate') === 'true');

  const avatarUrl = azureConstant + uniqueId
  const [autoNext, setAutoNext] = useState(getDataString('autoNext') === 'true',);
  const [autoBreak, setAutoBreak] = useState(getDataString('autoBreak') === 'true',);
  const [darkMode, setDarkMode] = useState(getDataString('darkMode') === 'true',);
  const [dailyReminder, setDailyReminder] = useState(getDataString('dailyReminder') === 'true',);
  const [isPremiumSheetOn, setIsPremiumSheetOn] = useState(false)
  const [isPremiumCanceledSheetOn, setIsPremiumCanceledSheetOn] = useState(false)
  
  useEffect(() => {
    ref3?.current?.scrollTo(60);
  }, []);

  const ref = useRef<OpenURLButtonRefProps>(null);
  const goTo = useCallback((urlSite: string) => {
    ref?.current?.handlePress(urlSite);
  }, []);

  const ref2 = useRef<StorageAsyncProps>(null);

  const ref3 = useRef<OfferSheetRefProps>(null);
  const openSheet = useCallback(() => {
    ref3?.current?.scrollTo(-SCREEN_HEIGHT / 1.1 - 30);
  }, []);

  const { useRealm, useQuery, useObject } = UserRealmContext;
  const realm = useRealm()
  
  const closeSheet = async () => {
    setTimeout(function () {
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      setIsSheetOn(false);
    }, 200);

    const myItem: any = await getItem2('dailyReminderr');
  };

  const openSheet2 = () => {
    setTimeout(function () {
      //Put All Your Code Here, Which You Want To Execute After Some Delay Time.
      setIsSheetOn(true);
    }, 50);
  };

  const fetchPaymentSheetParams = async () => {
    await fetch(`${API_URL}/payment-sheet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
            },
            })
            .then(response => response.json())
            .then(json => {
              const { paymentIntent, ephemeralKey, customer} =  json
              
                return {
                  paymentIntent,
                  ephemeralKey,
                  customer,
                };
            })


  };


  fetchPaymentSheetParams()

  const ResetPickers = () => {
    setIsPomodoroSelected(false);
    setIsShortBreakSelected(false);
    setIsLongBreakSelected(false);
    setIsAfterLongBreakSelected(false);
    setIsDefaultDoroSelected(false);
  };

  const choosePomodoro = () => {
    ResetPickers();
    setIsPomodoroSelected(!isPomodoroSelected);
  };

  const chooseShortBreak = () => {
    ResetPickers();
    setIsShortBreakSelected(!isShortBreakSelected);
  };

  const chooseLongBreak = () => {
    ResetPickers();
    setIsLongBreakSelected(!isLongBreakSelected);
  };
  
  const chooseAfterLongBreak = () => {
    ResetPickers();
    setIsAfterLongBreakSelected(!isAfterLongBreakSelected);
  };

  const chooseDefaultDoro = () => {
    ResetPickers();
    setIsDefaultDoroSelected(!isDefaultDoroSelected);
  };

  const onSelectWork = async data => {
    setData('alarmWork', data);

    const hasPermissions: boolean = await Notifications.isRegisteredForRemoteNotifications();

    isLog ? () => {
      if (thisUser) {
        realm.write(() => {
          thisUser.alarmWork! = data;
        });
    }} : {}

    setWorkAlarm(data);
  }

  const onSelectBreak = async data => {
    setData('alarmBreak', data);
    setBreakAlarm(data);
  };

  const onSelectName = (x, y) => {
  };

  const getItem2 = async (item: any) => {
    return await AsyncStorage.getItem(item);
  };

  const setLength = async (value, index) => {
    if (index == 1) {
      setData('pomodoroLength', value);
      setIsPomodoroSelected(false);
    } else if (index == 2) {
      setData('breakShortLength', value);
      setIsShortBreakSelected(false);
    } else if (index == 3) {
      setData('breakLongLength', value);
      setIsLongBreakSelected(false);
    } else if (index == 4) {
      // await setItem('breakAfterLongLength', value.toString())
      setData('breakAfterLongLength', value);
      setIsAfterLongBreakSelected(false);
    } else if (index == 5 && isPremium) {
      const value2 = examples.filter(item => item.index == value)[0].name;

      setData('defaultDoroInt', value);
  setData('defaultDoroStr', value2);

      setIsDefaultDoroSelected(false);
    } 
  };

  useEffect(() => {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground((notification: Notification, completion) => {
      completion({alert: false, sound: false, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification: Notification, completion) => {
      completion();
    });
  })

  useEffect(() => {
    // Product IDs for in-app purchases
    // const productIds = ['com.willdoro.premium'];
    // Fetch product information from the app store

    const productIds = ['com.willdoro.premium20'];

    getProducts({skus: productIds}).then((products) => {
      console.log('Products:', products);
    }).catch((error) => {
      console.log('Error fetching products:', error);
});
  },[])

      let purchaseUpdateSubscription = null;
      let purchaseErrorSubscription = null;
    
      useEffect(() => {
        initConnection().then(() => {
          // we make sure that "ghost" pending payment are removed
          // (ghost = failed pending payment that are still marked as pending in Google's native Vending module cache)
          clearProductsIOS()
            .catch(() => {
              // exception can happen here if:
              // - there are pending purchases that are still pending (we can't consume a pending purchase)
              // in any case, you might not want to do anything special with the error
            })
            .then(() => {
              const purchaseUpdateSubscription = purchaseUpdatedListener(
                async (purchase: SubscriptionPurchase | ProductPurchase) => {
                  console.log('purchaseUpdatedListener', purchase);


                  const receipt = purchase.transactionReceipt;
                  if (receipt) {
                    await finishTransaction({purchase, isConsumable: false});
                    await openPremiumConfirmedDialog()
                  } else {
                    await openPremiumCanceledDialog()
                  }
                },
              );
    
              const purchaseErrorSubscription = purchaseErrorListener(
                (error: PurchaseError) => {
                  console.warn('purchaseErrorListener', error);
                },
              );
            });
        });
      },[])


      useEffect(() => {
        return () => {
          if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
          }
      
          if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
          }
        }
    }, [])

      const subscribe = async (sku: string, offerToken: string) => {
        try {
          await requestSubscription({
            sku,
            ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
          });

        } catch (err) {
          console.warn('erre',err.code, err.message);
          await openPremiumCanceledDialog()
        }
      };

  const setSwitch = async (value, index) => {
    if (index == 1) {
      setData('vibrate', value.toString());
    } else if (index == 2) {
      setData('autoNext', value.toString());
    } else if (index == 3) {
      setData('autoBreak', value.toString());
    } else if (index == 4) {
      setIsDarkModeOn(value);
      setData('darkMode', value.toString());
    } else if (index == 5) {
      setData('ranking', value.toString());
    } else if (index == 6) {
      
      if(isNotificationsEnabled) {
        setData('isNotificationsEnabled', 0)
        setIsNotificationsEnabled(false)}
      else {
        const value2 =  await regNotifs()
        if (value2){
          setData('isNotificationsEnabled', 1); setIsNotificationsEnabled(true);
          setNotifications()

        } else {
          setData('isNotificationsEnabled', 0)
          removeAllNotificationstifs()
        }

      }
      

    }
  };

  const pay = async () => {
    try {

      await ref3?.current?.scrollTo(60);

      await closeSheet()
      
      await subscribe('com.willdoro.premium20', null)

      

    } catch (e) {
      // if (!e.userCancelled) {
      //   // showError(e);
      // }
      console.log(e)
    }
  };

  const openPremiumConfirmedDialog = async () => {
    setData('isPremium', 1)
    setIsPremiumSheetOn(true)
  }

  const openPremiumCanceledDialog = async () => {
    setIsPremiumCanceledSheetOn(true)
  }

  const handleYes = () => {
    setIsPremiumSheetOn(false)
    navigation.navigate('Signup', {_dark: isDarkModeOn})
  }

  const handleNo = () => {
    setIsPremiumSheetOn(false)

  }

  const handleYesC = () => {
    setIsPremiumCanceledSheetOn(false)
  }

  const [newName, setNewName] = useState(getDataString('firstname') + " " + getDataString('lastname'))

  useFocusEffect(
    React.useCallback(() => {
        setNewName(getDataString('firstname') + " " + getDataString('lastname'))
    }, []),
  );

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
      // isPremium={isPremium}
      isSettings={true}
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
      />
      <ScrollView>

      <Dialog.Container visible={isPremiumSheetOn}>
        <Dialog.Title>Congratulations!</Dialog.Title>
        <Dialog.Description>
          Do you want to create a new account so you can save your data? 
          {'\n'}
          You can also later create an account.
        </Dialog.Description>
        <Dialog.Button label="Yes" onPress={handleYes} />
        <Dialog.Button label="No" onPress={handleNo} />
      </Dialog.Container>

      <Dialog.Container visible={isPremiumCanceledSheetOn}>
        <Dialog.Title>Failed!</Dialog.Title>
        <Dialog.Description>
          The payment failed.
          {'\n'}
          Please try again.
        </Dialog.Description>
        <Dialog.Button label="OK" onPress={handleYesC} />
      </Dialog.Container>

        <ProfileRow
        imageSource={isPremium ? avatarUrl : {}}
          isSheetOn={isSheetOn}
          avatar={'#A0A6BE'}
          opacity={isSheetOn ? 0.9 : 1}
          txt={newName}
          // txt={'John M'}
          onPress={

            isPremium && isLog && !isSheetOn
              ? () => {
                  navigation.navigate('Profile', {
                    selectedName: getDataString('firstname') + " " + getDataString('lastname'),
                    email: uniqueId,
                    isDarkModeOn: isDarkModeOn,
                  });
                }
              : isPremium ? () => {
                  if (!isSheetOn) {
                    navigation.navigate('Sign', {_dark: isDarkModeOn});
                  }
                }
                :
                () => {
                  openSheet();
                  openSheet2();
                }
                

                
          }
          isDarkModeOn={isDarkModeOn}
        />

        <Space space={12} isDate={undefined} />

        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isPremium={getDataNumber('isPremium') == 1}
          type={'p'}
          isFirst={true}
          isLast={true}
          onPress={() => {
            openSheet();
            openSheet2();
          }}
          title={'Get Premium'}
          iconArrow={isSheetOn ? 'angle-down' : 'angle-right'}
          isProfile={undefined}
          value={undefined}
          isTasksOn={undefined}
          isSelected={undefined}
          isAddOn={undefined}
          isTasks={undefined}
          isSheetOn={undefined}
          isTaskDone={undefined}
        />

        <Space space={12} isDate={undefined} />

        <SettingsCellwText
          isTask={true}
          isPremium={isPremium}
          isDarkModeOn={isDarkModeOn}
          isFirst={true}
          onPress={() => {


            isPremium ?  navigation.navigate('Tasks', {isDarkModeOn}) : 
            ()=>{openSheet(); openSheet2();}
            
          
          }}
          title={'Tasks'}
          iconArrow={'angle-right'}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
        />
        
        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

<LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isFirst={false}
          onPress={() => {
            navigation.navigate('AlarmWork', {
              onSelectWork: onSelectWork,
              selectedWork: workAlarm,
              isDarkModeOn,
            });
          }}
          title={'Study Alarm'}
          value={`Buzz ${getDataNumber('alarmWork')}`}
          iconArrow={'angle-right'}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
        />
        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
                <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          onPress={() => {
            navigation.navigate('AlarmBreak', {
              onSelectBreak: onSelectBreak,
              selectedBreak: breakAlarm,
              isDarkModeOn,
            });
          }}
          title={'Break Alarm'}
          value={`Buzz ${getDataNumber('alarmBreak')}`}
          iconArrow={'angle-right'}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isFirst={undefined}
        />
        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwSwitch
          isDarkModeOn={isDarkModeOn}
          isLast={true}
          title={'Vibrate'}
          value={vibrate}
          onValueChange={val => {
            setSwitch(val, 1);
            setVibrate(val);
          }}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          onPress={undefined}
          isFirst={undefined}
        />

        <Space space={12} isDate={undefined} />

        {/* <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isFirst={true}
          onPress={() => {
            choosePomodoro();
          }}
          title={'Pomodoro Length'}
          value={`${getDataNumber('pomodoroLength')} Minutes`}
          iconArrow={isPomodoroSelected ? 'angle-down' : 'angle-right'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
        /> */}
        {/* <PomodoroPicker
          isDarkModeOn={isDarkModeOn}
          display={isPomodoroSelected ? 'flex' : 'none'}
          isClicked={isPomodoroSelected}
          margin={isPomodoroSelected ? 20 : 0}
          opacity={isPomodoroSelected ? 1 : 0}
          zIndex={isPomodoroSelected ? 2 : 0}
          value={getDataNumber('pomodoroLength')}
          onValueChange={val => {
            setLength(val, 1);
          }}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          onPress={() => {
            chooseShortBreak();
          }}
          title={'Short Break Length'}
          value={`${getDataNumber('breakShortLength')} Minutes`}
          iconArrow={isShortBreakSelected ? 'angle-down' : 'angle-right'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isFirst={undefined}
        />
        <ShortBreakPicker
          isDarkModeOn={isDarkModeOn}
          display={isShortBreakSelected ? 'flex' : 'none'}
          height={isShortBreakSelected ? 48 : 0}
          margin={isShortBreakSelected ? 20 : 0}
          opacity={isShortBreakSelected ? 1 : 0}
          zIndex={isShortBreakSelected ? 2 : 0}
          value={getDataNumber('breakShortLength')}
          onValueChange={val => {
            setLength(val, 2);
          }}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
                <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        /> */}
        {/* <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          onPress={() => {
            chooseLongBreak();
          }}
          title={'Long Break Length'}
          value={`${getDataNumber('breakLongLength')} Minutes`}
          iconArrow={isLongBreakSelected ? 'angle-down' : 'angle-right'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isFirst={undefined}
        />
        <LongBreakPicker
          isDarkModeOn={isDarkModeOn}
          display={isLongBreakSelected ? 'flex' : 'none'}
          height={isLongBreakSelected ? 48 : 0}
          margin={isLongBreakSelected ? 20 : 0}
          opacity={isLongBreakSelected ? 1 : 0}
          zIndex={isLongBreakSelected ? 2 : 0}
          value={getDataNumber('breakLongLength')}
          onValueChange={val => {
            setLength(val, 3);
          }}
        />
                <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          onPress={() => {
            chooseAfterLongBreak();
          }}
          title={'Long Break After'}
          value={`${getDataNumber('breakAfterLongLength')} Pomodoros`}
          iconArrow={isAfterLongBreakSelected ? 'angle-down' : 'angle-right'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isFirst={undefined}
        /> */}
        {/* <LongBreakAfterPicker
          isDarkModeOn={isDarkModeOn}
          display={isAfterLongBreakSelected ? 'flex' : 'none'}
          height={isAfterLongBreakSelected ? 48 : 0}
          margin={isAfterLongBreakSelected ? 20 : 0}
          opacity={isAfterLongBreakSelected ? 1 : 0}
          zIndex={isAfterLongBreakSelected ? 2 : 0}
          value={getDataNumber('breakAfterLongLength')}
          onValueChange={val => {
            setLength(val, 4);
          }}
        />
                <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwSwitch
          isDarkModeOn={isDarkModeOn}
          value={autoNext}
          onValueChange={val => {
            setSwitch(val, 2);
            setAutoNext(val);
          }}
          title={'Auto Start Next Pomodoro'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          onPress={undefined}
          isLast={undefined}
          isFirst={undefined}
        /> */}

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        {/* <SettingsCellwSwitch
          isDarkModeOn={isDarkModeOn}
          isLast={true}
          value={autoBreak}
          onValueChange={val => {
            setSwitch(val, 3);
            setAutoBreak(val);
          }}
          title={'Auto Start of Break'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          onPress={undefined}
          isFirst={undefined}
        /> */}

        <Space space={12} isDate={undefined} />
{/* 
        <SettingsCellwText
          isFirst={true}
          isDarkModeOn={isDarkModeOn} 
          onPress={() => {
            chooseDefaultDoro();
          }}
          title={'Default Pomodoro'}
          value={getDataString('defaultDoroStr')}
          iconArrow={isDefaultDoroSelected ? 'angle-down' : 'angle-right'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
        />
        <DefaultPicker
          isDarkModeOn={isDarkModeOn} 
          display={isDefaultDoroSelected ? 'flex' : 'none'}
          values={examples }
          isClicked={isDefaultDoroSelected}
          margin={isDefaultDoroSelected ? 20 : 0}
          opacity={isDefaultDoroSelected ? 1 : 0}
          zIndex={isDefaultDoroSelected ? 2 : 0}
          value={getDataNumber('defaultDoroInt')}
          onValueChange={val => {
            setLength(val, 5);
          }}
        />
                <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        /> */}

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwSwitch
          isDarkModeOn={isDarkModeOn}
          isFirst={true}
          value={darkMode}
          onValueChange={val => {
            setSwitch(val, 4);
            setDarkMode(val);
          }}
          title={'Dark Mode'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          onPress={undefined}
          isLast={undefined}
        />

        {/* <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
                <SettingsCellwSwitch
          isDarkModeOn={isDarkModeOn}
          isFirst={true}
          value={darkMode}
          onValueChange={val => {
            setSwitch(val, 4);
          }}
          title={'Task Mode'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          onPress={undefined}
          isLast={undefined}
        /> */}

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwSwitch
          isDarkModeOn={isDarkModeOn}
          isLast={true}
          value={isNotificationsEnabled}
          onValueChange={val => {
            setSwitch(val, 6);
          }}
          title={'Daily Reminder'}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          onPress={undefined}
          isFirst={undefined} 
        />

        <Space space={12} isDate={undefined} />

        {/* <SettingsCell title={'Rate Now'}  onPress={() => {goTo(urlAppStore)}} /> */}
        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isFirst={true}
          title={'Use Guide'}
          onPress={() => {
            navigation.navigate('Guide', {darkMode: darkMode})
          }}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isLogout={undefined}
          isLogged={undefined}
        />
                <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isFirst={false}
          title={'Help & Feedback'}
          onPress={() => {
            goTo('https://resetwill.netlify.app/support');
          }}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isLogout={undefined}
          isLogged={undefined}
        />

{/* <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
                <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isFirst={false}
          title={'Subscriptions'}
          onPress={() => {
            navigation.navigate('Subs', {isDarkModeOn: isDarkModeOn})
          }}
          icon={undefined}
          backColor={undefined}
          style={undefined}
          isLast={undefined}
          isLogout={undefined}
          isLogged={undefined}
        /> */}

<LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />

        <LineBwCell
          isDarkModeOn={isDarkModeOn}
          isFull={undefined}
          isOnTask={undefined}
        />
        {/* <SettingsCell title={'Share The App'} onPress={() => {goTo(urlAppWeb)}}/> */}
        <SettingsCellwText
          isDarkModeOn={isDarkModeOn}
          isLast={true}
          title={'Official Website'}
          onPress={() => {
            goTo(officialWebsite);
          }}
          isPremium={undefined}
          isProfile={undefined}
          iconArrow={undefined}
          value={undefined}
          isTasksOn={undefined}
          isFirst={undefined}
          isSelected={undefined}
          isAddOn={undefined}
          isTasks={undefined}
          isSheetOn={undefined}
          isTaskDone={undefined}
        />

        <Space space={10} isDate={undefined} />

        <OpenURLButton ref={ref} />

        <StorageAsync ref={ref2} />
      </ScrollView>
{/* 
      <StripeProvider
  publishableKey={publishableKeyLive}
  merchantIdentifier={merchantIdentifier} // required for Apple Pay
  urlScheme={urlScheme} // required for 3D Secure and bank redirects
  > */}

      <OfferSheet
        pay={pay}
        isDarkModeOn={isDarkModeOn}
        ref={ref3}
        closeSheet={closeSheet}
        canceled={openPremiumCanceledDialog} 
        confirmed={openPremiumConfirmedDialog} 
      />

      {/* <CheckoutScreen /> */}
{/* </StripeProvider> */}
    </SafeAreaView>
  );
};

export default Settings;
