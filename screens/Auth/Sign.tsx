import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, useUser } from '@realm/react';
import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { User, UserRealmContext } from '../../components/Storage/MongoDB';
import {
  Header,
  HeaderButton,
  Space,
  styles,
} from '../../components/Utilities/Utilities';
import {
  BottomText,
  Input,
  Logo,
  TextButton,
} from '../../components/Utilities/Utilities2';
import { AppleButton } from '../../components/Utilities/Utilities3';
import { setData } from '../../components/Storage/Data';
import { login } from '../../components/Functions/Functions2';
import { User, UserRealmContext } from '../../components/Storage/MongoDB';
import Dialog from "react-native-dialog";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Sign = ({ route, navigation }) => {
  const { _dark, email2 } = route.params;
  const [isDarkModeOn, setIsDarkModeOn] = useState(_dark);
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [putAccData, setPutAccData] = useState(false)
  const [putDeviceData, setPutDeviceData] = useState(false)


  // console.log(isDarkModeOn, 'isDarkModeOn');

  const app = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { useRealm, useQuery, useObject } = UserRealmContext;
  const realm = useRealm()
  const users = useQuery(User)

  const thisUser = useObject(User, email);

  const handleAccount = () => {
    setVisible(false);

    if(typeof email2 == 'string'){
      setEmail(email2)
    }

    login(email, password, navigation, app, 0, realm, users, thisUser);
  };

  const handleDevice = () => {
    setVisible(false);
    setPutDeviceData(true);
    login(email, password, navigation, app, 1, realm);
  };


  useEffect(() => {
    typeof email2 == 'string' ? setIsVisible(true) : {}
  },[])

  const [isVisible, setIsVisible] = useState(false)

  const logingl = async () => {
    GoogleSignin.configure({
      iosClientId: '<YOUR-CLIENT-ID>',
      webClientId: '<YOUR-CLIENT-ID>', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.

  });

  try {
  //   Sign into Google
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    setVisible(true)

    setEmail(userInfo.user.email)
    // setPassword(getPassword(userInfo.user.email))

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
    // setSigninInProgress(false);
  }

  }

  return (
    <SafeAreaView
      style={[
        styles.pageSign,
        { backgroundColor: isDarkModeOn ? '#1c1c1e' : '#f2f2f6' },
      ]}>
         <Dialog.Container visible={isVisible}>
        <Dialog.Title>Congratulations!</Dialog.Title>
        <Dialog.Description>
         Your password is set as 123456.
          {'\n'}
          Please change it after login.
        </Dialog.Description>
        <Dialog.Button label="Okay" onPress={() => {setIsVisible(false)}} />
      </Dialog.Container>
      <Header
        isDarkModeOn={isDarkModeOn}
        onPress={() => {
          navigation.goBack();
        }}
        color={1}
        opacity={1}
        isSubtle={undefined}
        isBorderOk={false}
      />

      <Space space={24} />
      <Logo />
      <Space space={24} />

      <Input
        isDarkModeOn={isDarkModeOn}
        onChangeText={txt => {
          setEmail(txt);
        }}
        icon={'mail'}
        autoCap={'none'}
        placeholder={'Email address'}
        defaultValue={typeof email2 == 'string' ? email2 : {}}
      />
      <Space space={6} />
      <Input
        isDarkModeOn={isDarkModeOn}
        onChangeText={txt => {
          setPassword(txt);
        }}
        isPassword={true}
        autoCap={'none'}
        icon={'lock-closed'}
        placeholder={'Password'}
      />
      <Space space={4} />

      <Space space={5} />
      <TextButton
        isDarkModeOn={isDarkModeOn}
        onPress={() => {
          navigation.navigate('Forget', { _dark: isDarkModeOn });
        }}
        txt={'Forget password?'}
      />
      <Space space={5} />
      <AppleButton
        // onPress={login}
        onPress={() => {
          setVisible(true)
        }}
        txt={'Sign In'}
        isPrimary={true}
        color={'#007AFF'}
      />

      {/* <TextButton margin={0} onPress={() => { navigation.goBack() }} txt={'or?'} /> */}

      {/* <AppleButton
        onPress={() => { logingl() }}
        txt={'Sign In with Google'} isPrimary={false} color={'#007AFF'} /> */}

      <BottomText isDarkModeOn={isDarkModeOn} txt={'Not registered yet?'} />
      <AppleButton
        mode={2}
        onPress={() => {
          navigation.navigate('Signup', { _dark: isDarkModeOn });
        }}
        txt={'Sign Up'}
        isPrimary={false}
        color={'#007AFF'}
      />
      <Space space={5} />
      <Dialog.Container visible={visible}>
        <Dialog.Title>Account delete</Dialog.Title>
        <Dialog.Description>
          Do you want to save this account's data? Or overwrite device's data? You cannot undo this action.
        </Dialog.Description>
        <Dialog.Button onPress={handleAccount} label="Account Data" />
        <Dialog.Button onPress={handleDevice} label="Device Data" />
      </Dialog.Container>
    </SafeAreaView>
  );
};

export default Sign;
