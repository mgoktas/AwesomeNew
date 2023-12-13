// import 'react-native-gesture-handler'
//native
import React, { useEffect, useState } from 'react';
import {  Linking, Text } from 'react-native';

//icons
import Icon from 'react-native-vector-icons/Ionicons'

//navigators
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { UserRealmContext} from './components/Storage/MongoDB';
const {RealmProvider} = UserRealmContext;    

//database
import { AppProvider, UserProvider } from '@realm/react';

//navigators
const Stack  = createNativeStackNavigator()
const Tab = createBottomTabNavigator();

//screens
import Focus from './screens/Focus';
import Settings from './screens/Settings';  

import AlarmBreak from './screens/Settings/AlarmBreak';
import AlarmWork from './screens/Settings/AlarmWork';
import Forget from './screens/Auth/Forget';
import ForgetNew from './screens/Auth/ForgetNew';
import Change from './screens/Settings/Profile/Change';
import Profile from './screens/Settings/Profile';
import Sign from './screens/Auth/Sign';
import Signup from './screens/Auth/Signup';
import Tasks from './screens/Settings/Tasks';
import FBLogin from './screens/Auth/FBLogin';
import { GoogleLogin } from './screens/Auth/GoogleLogin';
import { Platform } from 'react-native';

const Tabs = ({route}: { route: any}) => {

  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle:{backgroundColor: 'transparent',position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0},
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {

            if (route.name === 'Focus') {
              return <Icon name='home-outline' size={size} color={
                focused
                  ? 'white'
                  : '#6C6A66'
              } />;
            } 
            else if (route.name === 'Settings') {
              return <Icon name='settings-outline' size={size} color={
                focused
                  ? 'black'
                  : '#6C6A66'
              } />;}
          },
          // tabBarStyle:{backgroundColor: route.name === 'Home' || 'Settings' ? 'white' : 'white'},

        })}
      >
    
    <Tab.Screen  name='Focus' component={Focus}
      options={{
      tabBarLabel: 'Focus', 
      tabBarStyle:{backgroundColor: 'transparent',position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0},
      headerShown:false, 
      headerStyle:{backgroundColor: 'white'}, 
      headerTitleStyle:{color:'black'},
      tabBarLabelStyle:{fontWeight: '800', fontSize: 10}}}
      />
    
    <Tab.Screen  name='Settings' component={Settings}
      options={{
      tabBarStyle:{backgroundColor: '#212121',position: 'absolute'},
      tabBarLabel: 'Settings', 
      headerShown:false, 
      headerStyle:{backgroundColor: 'white'}, 
      headerTitleStyle:{color:'black'},
      tabBarLabelStyle:{fontWeight: '800', fontSize: 10}}}
      />

    
  </Tab.Navigator>
  )
}


const linking = {

    prefixes: ['willdoro://'],
    config: {
      initialRouteName: 'Settings',
      screens: {
        Home: {
          path: 'settings/:email'
        },
        Details: {
          path: 'details/:personId'
        }
      }
    }
}

// import {Settings as Settings2} from 'react-native-fbsdk-next';
import Guide from './screens/Settings/Guide';
import Aa1 from './screens/Settings/Guide/Aa1';
import Bb1 from './screens/Settings/Guide/Bb1';
import Cc1 from './screens/Settings/Guide/Cc1';
import Dd1 from './screens/Settings/Guide/Dd1';
import Ee1 from './screens/Settings/Guide/Ee1';
import Ff1 from './screens/Settings/Guide/Ff1';
import Gg1 from './screens/Settings/Guide/Gg1';
import PaymentScreen from './screens/Stripe';
import SplashScreen from './components/SplashScreen';
// import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { navigationRef, isReadyRef } from './components/RootNavigation';
import * as RootNavigation from './components/RootNavigation';
import ChangeName from './screens/Settings/Profile/ChangeName';
import Subs from './screens/Settings/Profile/Subs';
import { LogBox } from 'react-native';
import ChangePassword from './screens/Settings/Profile/ChangePassword';
import ChangePasswordChange from './screens/Settings/Profile/ChangePasswordChange';

function App(): JSX.Element {

  useEffect(() => {
    // Settings2.setAdvertiserTrackingEnabled(true);
    // Settings2.initializeSDK();

    const purchase = async () => {
      // Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

      // if (Platform.OS === 'ios') {
      //   Purchases.configure({ apiKey: 'appl_FnomgowtKOPwOnmlRQyXjUzsSJW' });
      // } 

      // purchase()


    }


    
    {/* else if (Platform.OS === 'android') {
    	await Purchases.configure({ apiKey: <public_google_api_key> });

      OR: if building for Amazon, be sure to follow the installation instructions then:
    	await Purchases.configure({ apiKey: <public_amazon_api_key>, useAmazon: true });
    } */}

    
  }, []);

  const [initialUrl, setInitialUrl] = useState('')

  useEffect(() => {
    Linking.getInitialURL()
    .then((url) => {
      if (url) {
        const a = url.split('.com/')[1].split('?')[0]
        
        if(a == 'success') {
          setInitialUrl('yes')
        }

      }
    })
    .catch((e) => {})
})

useEffect(() => {
  Linking.addEventListener('url', ({url}) =>{
    if (url) {
      const a = url.split('.com/')[1].split('?')[0]
      
      if(a == 'success') {
        setInitialUrl('yes')
          RootNavigation.navigate('Settings', {success: 'yes'})
      }

    }
  })
})

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreLogs(['Sending']); // Ignore log notification by message
LogBox.ignoreAllLogs(true);

useEffect(() => {
  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreLogs(['Sending']); // Ignore log notification by message
LogBox.ignoreAllLogs(true);

},[])

useEffect(() => {
  
  return () => {
      isReadyRef.current = false
    };
  },[]);

  return (
    <NavigationContainer onReady={() => {
      isReadyRef.current = true;
}} ref={navigationRef} linking={linking}>
      <AppProvider id={'<YOUR-APP-ID>'}>
      <RealmProvider>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown: false}}>
        <Stack.Screen initialParams={{initialUrl2: initialUrl}} name='Focus' component={Focus}  />
        <Stack.Screen name='Settings' component={Settings}/>
        <Stack.Screen name='Profile' component={Profile}/>
        <Stack.Screen name='Sign' component={Sign} /> 
        <Stack.Screen name='Signup' component={Signup} />
        <Stack.Screen name='Forget' component={Forget} />
        <Stack.Screen name='ForgetNew' component={ForgetNew} />
        <Stack.Screen name='AlarmWork' component={AlarmWork} />
        <Stack.Screen name='AlarmBreak' component={AlarmBreak} />
        <Stack.Screen name='Change' component={Change}/>
        <Stack.Screen name='Stripe' component={PaymentScreen}/>
        <Stack.Screen name='Tasks' component={Tasks}/>
        <Stack.Screen name='Guide' component={Guide}/>
        <Stack.Screen name='Aa1' component={Aa1}/>
        <Stack.Screen name='Bb1' component={Bb1}/>
        <Stack.Screen name='Cc1' component={Cc1}/>
        <Stack.Screen name='Dd1' component={Dd1}/>
        <Stack.Screen name='Ee1' component={Ee1}/>
        <Stack.Screen name='Ff1' component={Ff1}/>
        <Stack.Screen name='Gg1' component={Gg1}/>
        <Stack.Screen name='FBLogin' component={FBLogin}/>
        <Stack.Screen name='GoogleLogin' component={GoogleLogin}/>
        <Stack.Screen name='SplashScreen' component={SplashScreen}/>
        <Stack.Screen name='ChangeName' component={ChangeName}/>
        <Stack.Screen name='ChangePasswordChange' component={ChangePasswordChange}/>
        <Stack.Screen name='ChangePassword' component={ChangePassword}/>
        <Stack.Screen name='Subs' component={Subs}/>
      </Stack.Navigator>
      </RealmProvider>
      </AppProvider>
    </NavigationContainer>
    );
}





export default App;

