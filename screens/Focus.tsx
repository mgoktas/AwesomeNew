import React, {
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  FocusButton,
  FocusButtonPause,
  FocusButtonTask,
  FocusSlide,
  FocusSlideTask,
  SCREEN_HEIGHT,
  SessionsLeft,
  SettingsCellwText,
  styles,
  TaskHead,
  TaskInput,
  TaskTitle,
} from '../components/Utilities/Utilities';
import {
  DefaultPickerSessionNumber,
  getRemaining,
} from '../components/Functions/Functions';
import {
  examples,
  getDataNumber,
  getDataString,
  pomodorosFree,
  pomodorosPremium,
  setData,
  songs,
} from '../components/Storage/Data';
import {FlatList, ImageBackground, Vibration, View} from 'react-native';
import {
  AppleButton,
  AppleButtonWithHighlight,
  CaretIcon,
  CaretIcon2,
} from '../components/Utilities/Utilities3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {
  Doro,
  Task,
  User,
  UserRealmContext,
} from '../components/Storage/MongoDB';
// import uuid from 'react-native-uuid';
import {ring, setAllData, vibrateFor} from '../components/Functions/Functions2';
import {TasksSheet, TasksSheetRefProps} from '../components/OfferSheet';
import {useColorScheme} from 'react-native';
import {useObject, useQuery, useRealm, useUser} from '@realm/react';
import TrackPlayer from 'react-native-track-player';
import { FlashList } from '@shopify/flash-list';
import { getUniqueId } from 'react-native-device-info';

const Focus = ({navigation, route}) => {

  //check url
  const {initialUrl2} = route.params
  useEffect(() => {
    initialUrl2 == 'yes' ? navigation.navigate('Settings', {success: 'yes'}) : {}
  },[])

  const [remainingInSecs, setRemainingInSecs] = useState(getDataNumber('pomodoroLength') * 60,);
  const [remainingSecs, setRemainingSecs] = useState(getDataNumber(1500))
  const [remainingBreakSecs, setRemainingBreakSecs] = useState(getDataNumber('breakShortLength') * 60,);
  const [remainingLongBreakSecs, setRemainingLongBreakSecs] = useState(getDataNumber('breakLongLength') * 60,);
  const [defaultDoroInt, setDefaultDoroInt] = useState(getDataNumber('defaultDoroInt'));
  const [hasTaskSessionEnded, setHasTaskSessionEnded] = useState(false);
  const [isChoosingTheTask, setIsChoosingTheTask] = useState(false);
  const [taskChosen, setTaskChosen] = useState(false);
  const [isWritingTaskInput, setIsWritingTaskInput] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [isTaskModeOn, setIsTaskModeOn] = useState(false);
  const [isDoroModeOn, setIsDoroModeOn] = useState(false);
  const [didClickWrite, setDidClickWrite] = useState(false);
  const [didClick, setDidClick] = useState(false);
  const [isVibrate, setIsVibrate] = useState(getDataString('vibrate') == 'true');
  const [consecutiveSession, setConsecutiveSession] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isBreakOn, setIsBreakOn] = useState(false);
  // const [isActive2, setIsActive2] = useState(false);
  // const [isActive3, setIsActive3] = useState(false);
  const [breakAfterLongLengthInt, setBreakAfterLongLengthInt] = useState(getDataNumber('breakAfterLongLength'),);
  const [breakAfterLongLength, setBreakAfterLongLength] = useState(getDataNumber('breakAfterLongLength'),);
  const {mins, secs} = getRemaining(remainingSecs);
  const [isLogged, setIsLogged] = useState(getDataString('isLogged') == 'true',);
  const [doroData, setDoroData] = useState(examples);
  const [autoNext, setAutoNext] = useState(getDataString('autoNext') === 'true',);
  const [autoBreak, setAutoBreak] = useState(getDataString('autoBreak') === 'true',);
  const [isPremium, setIsPremium] = useState(true)
  const [afterSessionLeft, setAfterSessionLeft] = useState(1)
  const email = getDataString('email');


  // const [remainingSecs, setRemainingSecs] = useState(1500);
  const count = useRef(1500)
  const [count2, setCount2] = useState(1500)
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  // const { mins, secs } = getRemaining(remainingSecs);
  const [selectedId, setSelectedId] = useState();
  const [imageSource, setImageSource] = useState(require('../components/images/monk.jpeg'))
  const [visibleItems, setVisibleItems] = useState([]);
  const [info, setInfo] = useState()
  // const [isLogged, setIsLogged] = useState(false)

  // const [doroData, setDoroData] = useState(examples)
  const [doroIndex, setDoroIndex] = useState(0)

  const getData = async () => {


      const value = await AsyncStorage.getItem('doroindex')
      if(value != null){

      const value2 = parseInt(value)
      setDoroIndex(value)
      let oneElement;
      for (let i= 0; i<examples.length; i++) {
          if (examples[i].index == value2 ) {
              oneElement = examples[i];
          }
      }
      let uniqueChars = [...new Set([oneElement, ...examples])];
      setDoroData(uniqueChars)
  }

  }

  const getUser = async () => {
      const user = await AsyncStorage.getItem('isLogged')
      // if(user == 'true'){
      //     setIsLogged(true)
      // }
  }

  useEffect(() => {
      getData()
      getUser()
  })

  useEffect(() => {
      let interval = null;
      if (isActive) {
      interval = setInterval(() => {
          setRemainingSecs(remainingSecs => remainingSecs - 1);
      }, 1000);
      } else if (!isActive && remainingSecs !== 0) {
      clearInterval(interval);
      }
      return () => clearInterval(interval);
  }, [isActive, remainingSecs]);

  //functions
  const Toggle = () => {
      if(isActive2){
          setIsActive3(true)
      }
      else if(isActive)
      {
          setIsActive2(true)
          setIsActive(!isActive)
      }
      else {
      setIsActive(!isActive)
      }
  }

  // const Reset = () => {
  //     setIsActive(false);
  //     setIsActive2(false);
  //     setIsActive3(false);
  //     setRemainingSecs(count2);
  // }

  // const Continue = () => {
  //     setIsActive(true)
  //     setIsActive2(false);
  //     setIsActive3(false);
  // }
  // const loaded = () => {
  //   setIsLoading2(true)
  // }

  const [taskOver, setTaskOver] = useState(false)

  // useEffect(() => {
  //   let interval = null;
  //   if (isActive) {
  //     if (breakAfterLongLength == 0 && remainingSecs == 0 && isTaskModeOn) {
  //       setIsAction3(true)
  //       taskSessionEnd();
  //       setTaskOver(true)
  //       ring(getDataNumber('alarmWork')-1, 1)
  //       setDefaultDoroInt(getDataNumber('defaultDoroInt'));

  //       return;
  //     } else if (isBreakOn && remainingSecs == 0 && isTaskModeOn) {
  //       setIsAction3(false)
  //       endTaskBreak();
  //       setTaskOver(false)
  //       ring(getDataNumber('alarmWork')-1, 1)
  //       vibrateFor(isVibrate, 2);
  //       setDefaultDoroInt(getDataNumber('defaultDoroInt'));
  //     } else if (isBreakOn && remainingSecs == 0) {
  //       endBreak();
  //       newDoro();
  //       ring(getDataNumber('alarmWork')-1, 1)
  //       vibrateFor(isVibrate, 2);
  //       setDefaultDoroInt(getDataNumber('defaultDoroInt'));
  //     } else if (remainingSecs == 0 && isTaskModeOn) {
  //       endTaskSession();
  //       ring(getDataNumber('alarmBreak')-1, 1)
  //       vibrateFor(isVibrate, 5);
  //       setDefaultDoroInt(1);
  //     } else if (hasStarted && remainingSecs == 0) {
  //       endSession();
  //       ring(getDataNumber('alarmBreak')-1, 1)
  //       vibrateFor(isVibrate, 5);
  //       setDefaultDoroInt(1);
  //     }

  //     interval = setInterval(() => {
  //       setRemainingSecs(remainingSecs => remainingSecs - 1);
  //     }, 1000);
  //   } else if (!hasStarted && remainingSecs !== 0) {
  //     clearInterval(interval);
  //   }
  //   return () => clearInterval(interval);
  // }, [hasStarted, remainingSecs]);

  useFocusEffect(() => {
    setIsLogged(getDataString('isLogged') == 'true')
      // setRemainingSecs(getDataNumber('pomodoroLength') * 60);
      setRemainingInSecs(getDataNumber('pomodoroLength') * 60);
      setRemainingBreakSecs(getDataNumber('breakShortLength') * 60);
      setRemainingLongBreakSecs(getDataNumber('breakLongLength') * 60);
      setBreakAfterLongLengthInt(getDataNumber('breakAfterLongLength'));
      setBreakAfterLongLength(getDataNumber('breakAfterLongLength'));
      setAutoNext(getDataString('darkMode') === 'true');
      setAutoBreak(getDataString('autoBreak') === 'true');
      setAutoNext(getDataString('autoNext') === 'true');
      setDefaultDoroInt(getDataNumber('defaultDoroInt'));
  })

  useFocusEffect(
    React.useCallback(() => {
      resetAll();
      ref?.current?.scrollTo(100);
    }, []),
  );

  const resetAll = () => {
    setDidClick(false)
    setIsTasking(false)
    setRemainingSecs(remainingInSecs);
    setHasTaskSessionEnded(false);
    setIsChoosingTheTask(false);
    setDidClickWrite(false);
    setTaskChosen(false);
    setIsWritingTaskInput(false);
    setDefaultDoroInt(getDataNumber('defaultDoroInt'));
    setTaskName('');
    // setIsTaskModeOn(true)
    setIsDoroModeOn(false);
    setBreakAfterLongLength(getDataNumber());
    setIsBreakOn(false);
    setIsActive2(false);
    setIsActive3(false);
    setConsecutiveSession(1);
  };

  const newDoro = async () => {
    // const newId = uuid.v4();
    // setDoroId(newId);

    const timestamp = new Date().getTime();
    const endtime = timestamp + remainingSecs * 1000;

    // realm.write(() => {
    //   realm.create('Doro', {
    //     _id: newId,
    //     startDate: new Date(),
    //     startTime: new Date(),
    //     endTime: new Date(endtime),
    //     length: remainingSecs / 60,
    //     breakLength: remainingBreakSecs / 60,
    //   });
    // });
  };

  const newTask = async () => {
    // const newId = uuid.v4();
    // setTaskId(newId);

    const timestamp = new Date().getTime();
    const endtime = timestamp + remainingSecs * 1000;

    // realm.write(() => {
    //   realm.create('Task', {
    //     _id: newId,
    //     taskName: taskName,
    //     startDate: new Date(),
    //     startTime: new Date(),
    //     endTime: new Date(endtime),
    //     length: remainingSecs / 60,
    //     breakLength: remainingBreakSecs / 60,
    //     sessionLength: breakAfterLongLength,
    //   });
    // });
  };

  const endSession = () => {
    // if (myDoro) {
    //   realm.write(() => {
    //     myDoro.didFinish = true;
    //   });
    // }
    setConsecutiveSession(consecutiveSession + 1);
    // console.log(consecutiveSession, breakAfterLongLength);
    // ring(alarmBreak, 3);
    setRemainingSecs(
      consecutiveSession == breakAfterLongLength
        ? remainingLongBreakSecs
        : remainingBreakSecs,
    );
    consecutiveSession == breakAfterLongLength ? setConsecutiveSession(1) : {};

    setHasStarted(false);
    setIsBreakOn(true);

    if (autoBreak) {
      setHasStarted(true);
    }
  };

  const endTaskSession = () => {
    if (!isLogged) {
      // if (myTask && breakAfterLongLength == 1) {
      //   realm.write(() => {
      //     myTask.didFinish = true;
      //   });
      // }
    } else {
    }

    setAfterSessionLeft(afterSessionLeft - 1)
    afterSessionLeft == 0 ? taskEnded() : {}


    setBreakAfterLongLength(breakAfterLongLength - 1);
    // ring(alarmBreak, 3);
    setRemainingSecs(
      consecutiveSession == breakAfterLongLengthInt &&
        breakAfterLongLengthInt != 1
        ? remainingLongBreakSecs
        : remainingBreakSecs,
    );
    setHasStarted(false);
    setIsBreakOn(true);

    if (autoBreak) {
      setHasStarted(true);
    }
  };

  const endBreak = () => {
    // ring(alarmWork, 3);
    setRemainingSecs(remainingInSecs);
    setIsBreakOn(false);
    afterSessionLeft == 0 ? taskEnded() : {}

    setHasStarted(false);

    if (autoNext) {
      setHasStarted(true);
    }

    // if (myDoro) {
    //   realm.write(() => {
    //     myDoro.didFinish = true;
    //     myDoro.didBreakEnd = true;
    //   });
    // }
  };

  const endTaskBreak = () => {
    afterSessionLeft == 0 ? taskEnded() : {}
    setRemainingSecs(remainingInSecs);
    setConsecutiveSession(consecutiveSession + 1);
    setIsBreakOn(false);
    setHasStarted(false);

    if (autoNext) {
      setHasStarted(true);
    }
  };

  const {useRealm, useQuery, useObject} = UserRealmContext;

  const realm = useRealm()

  const [taskId, setTaskId] = useState('0')

  const myTask = useObject(Task, taskId);

  const taskEnded = () => {

    setIsTaskModeOn(false)

    if (myTask) {
      realm.write(() => {
        myTask.didFinish = true;
      });
    }
  }

  const taskSessionEnd = () => {
    afterSessionLeft == 0 ? taskEnded() : {}

    setHasTaskSessionEnded(true);
    setIsTaskModeOn(false);
    setRemainingSecs(remainingInSecs);
    setIsBreakOn(false);
    setHasStarted(false);
  };

  // const Toggle = () => {
  //   // if(isBreakOn){
  //   //     setHasStarted(true)
  //   // }



  //   if (isActive2) {
  //     setIsActive3(true);
  //   } else if (hasStarted) {
  //     setIsActive2(true);
  //     setHasStarted(false);
  //   }

  //   // else if(isBreakOn && !hasStarted) {
  //   //     setHasStarted(true)
  //   // }
  //   else if (hasStarted == false && isTaskModeOn) {
  //     newTask();
  //     setHasStarted(true);
  //   } else if (hasStarted == false) {
  //     newDoro();
  //     setHasStarted(true);
  //   }

  //   taskChosen ? setIsTasking(true) : {}

  // };

  const Reset = () => {
    // setHasStarted(false);
    // setIsActive2(false);
    // setIsActive3(false);
    // setRemainingSecs(remainingInSecs);
    // setDidClick(false);
    // setDidClickWrite(false);
    // setIsTasking(false)

    setIsActive(false);
    setIsActive2(false);
    setIsActive3(false);
    setRemainingSecs(count2);

    // resetAll();
  };

  const Continue = () => {
    setHasStarted(true);
    setIsActive2(false);
    setIsActive3(false);
  };

  const openTaskMode = () => {

    if (!isTaskModeOn) {
      setIsTaskModeOn(true);
    } else {
      setIsTaskModeOn(false);
    }
  };

  const [isAction3, setIsAction3] = useState(false)

  const chooseTask = () => {
    setIsChoosingTheTask(true);
  };

  const setClickedFirst = value => {
    setDidClick(true); 

    if (breakAfterLongLength == 0) {
    }

    if (breakAfterLongLength == 1) {
      setDidClickWrite(true);
    }
  };
  
  const [isTasking, setIsTasking] = useState(false)

  const ref = useRef<TasksSheetRefProps>(null);
  const openSheet = useCallback(() => {
    // ref?.current?.reset();
    ref?.current?.scrollTo(-400);
  }, []);

  const clickedToPlay = item => {
    setClickedFirst(1);
    setTaskName(item);
    setIsChoosingTheTask(true);
  };

  const setStartedWriting = () => {
    setClickedFirst(1);
  };

  const viewabilityConfig = useRef({
    // minimumViewTime: 100,
    itemVisiblePercentThreshold: 90,
}).current;

const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setVisibleItems(viewableItems.map(({ item }) => setImageSource(item.source)));
    setVisibleItems(viewableItems.map(({ item }) => setRemainingSecs(1500)));
    setVisibleItems(viewableItems.map(({ item }) => setCount2(1500)));
}, []);


const configref = useRef(viewabilityConfig)
const itemschangedref = useRef(onViewableItemsChanged)

  return  isTaskModeOn && !isLoading ? (
    <SafeAreaView style={[styles.pageFocus]}>
      <CaretIcon
        isPremium={isPremium}
        isTaskModeOn={isTaskModeOn}
        mode={2}
        icon={'menu'}
        onPress={() => {
          navigation.navigate('Settings', {isLogged: isLogged, success: 'no'});
        }}
      />
      <CaretIcon2
      isPremium={isPremium}
        isTaskModeOn={isTaskModeOn}
        isDoroModeOn={isDoroModeOn}
        onPress={() => {
          openTaskMode();
            resetAll();
        }}
      />
      <ImageBackground
        style={styles.pageFocusImage}
        source={imageSource}>
        {/* source={examples[defaultDoroInt - 1].source}> */}
        <SessionsLeft
          hasTaskSessionEnded={hasTaskSessionEnded}
          taskChosen={taskChosen}
          value={afterSessionLeft}
        />
        <TaskHead
          isChoosingTheTask={isChoosingTheTask}
          txt={'How many sessions for?'}
                  />
        <DefaultPickerSessionNumber
          onPress={() => {
            setTaskChosen(true);
            setIsChoosingTheTask(false);
          }}
          onValueChange={val => {
            setBreakAfterLongLength(val);
            setBreakAfterLongLengthInt(val);
            setAfterSessionLeft(val)
          }}
          value={breakAfterLongLength}
          isChoosingTheTask={isChoosingTheTask}
          values={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
        />
        <TaskInput
          didClickWrite={didClick ? true : didClickWrite}
          isChoosingTheTask={isChoosingTheTask}
          taskChosen={taskChosen}
          onPress={() => {
            chooseTask();
          }}
          isWritingTaskInput={isWritingTaskInput}
          onChangeText={txt => {
            if (txt) {
              setIsWritingTaskInput(true);
              setTaskName(txt);
            } else {
              setIsWritingTaskInput(false);
            }
          }}
          title={'Write Down Here..'}
        />
        <View
          style={{
            position: 'relative',
            top: SCREEN_HEIGHT / 3,
            flexDirection: 'column',
            width: '100%',
            zIndex: 100,
          }}>
          <AppleButtonWithHighlight
            onPress={() => {
              openSheet();
            }}
            color={'#f48c06'}
            isPrimary={false}
            txt={'Choose a Task'}
            didClick={didClick}
          />
          <AppleButtonWithHighlight
            onPress={() => {
              setClickedFirst(1);
            }}
            isOnTask={false}
            color={'#f48c06'}
            isPrimary={false}
            didClick={didClick}
            txt={'Write Down A Task'}
          />
        </View>

        <View style={{display: didClickWrite || isTasking ? 'flex' : 'none'}}>
          <FocusSlideTask
            isChoosingTheTask={isChoosingTheTask}
            taskChosen={taskChosen}
            onPress={() => {
              alert(doroData[0].name);
              Reset();
            }}
            minute={mins}
            seconds={secs}
            mode={doroData[0].name}
          />
        </View>

        <TaskTitle taskChosen={taskChosen} txt={taskName} />

        <FocusButtonTask
          taskChosen={taskChosen}
          txt={!taskOver ? 'Start Break' : 'Start Tadasdsask'}
          onPress={Toggle}
          isAction3={isAction3}
          isAction2={hasStarted}
          isAction={isActive2}
        />
        <FocusButtonPause
          onPress1={Continue}
          onPress2={Reset}
          isAction2={isActive2}
          isAction={isActive3}
        />
        <TasksSheet
          email={email}
          isLog={isLogged}
          setStartedWriting={setStartedWriting}
          clickedToPlay={clickedToPlay}
          ref={ref}
          setTaskId={setTaskId}
        />
      </ImageBackground>
    </SafeAreaView>
  ) :  !isTaskModeOn && !isLoading ? (
<SafeAreaView style={styles.pageFocus}>
        <CaretIcon onPress={() => {navigation.navigate('Settings', {isLogged: isLogged})}}/>
        <ImageBackground style={styles.pageFocusImage} source={imageSource}>
        <FlatList
        viewabilityConfig={configref.current}
        onViewableItemsChanged={itemschangedref.current}        
        onScrollEndDrag={Reset} 
        estimatedItemSize={100} 
        pagingEnabled={true} 
        data={doroData} 
        renderItem={({item}) => 
        <View>
          <FocusSlide
              subMin={() => {if(remainingSecs>500) { setRemainingSecs(remainingSecs - 300); setCount2(count2-300)}}}
              addMin={() => {if(remainingSecs<3600) { setRemainingSecs(remainingSecs + 300); setCount2(count2+300)}}}
              onPress={() => {alert(item.name); Reset()}}
              minute={mins} 
              seconds = {secs}
              mode={item.name}
              />
        </View>
        }
        horizontal={true} 
        keyExtractor={(item, index) => index} 
        extraData={selectedId} 
        showsHorizontalScrollIndicator={false}>
            
        </FlatList>
        {/* <FocusSlide mode={'monk mode'} minute={mins} seconds = {secs} /> */}
        <FocusButton onPress={Toggle} isAction2={isActive} isAction={isActive2}/>
        <FocusButtonPause onPress1={Continue} onPress2={Reset} isAction2={isActive2} isAction={isActive3}/>
        </ImageBackground>
    </SafeAreaView>
  ) :
  (
    <SafeAreaView style={styles.pageFocus}>
      <CaretIcon
      isPremium={isPremium}
        isTaskModeOn={isTaskModeOn}
        isLeft={true}
        icon={'menu'}
        onPress={() => {
          navigation.navigate('Settings', {isLogged: isLogged});
        }}
      />
      <CaretIcon2
      isPremium={isPremium}
      isTaskModeOn={isTaskModeOn}
        isDoroModeOn={isDoroModeOn}
        onPress={() => {
            resetAll();
          setIsTaskModeOn(!isTaskModeOn);
        }}
      />
      <ImageBackground
        style={styles.pageFocusImage}
        source={pomodorosFree[0].source}>
        <FocusSlide
          hide={true}
          onPress={() => {
            alert(doroData[0].name);
            Reset();
          }}
          minute={mins}
          seconds={secs}
          mode={doroData[0].name}
        />
        <FocusButton
          isLoading={isLoading}
          onPress={Toggle}
          isAction2={hasStarted}
          isAction={isActive2}
        />
        <FocusButtonPause
          onPress1={Continue}
          onPress2={() => {
            Reset();
            resetAll();
          }}
          isAction2={isActive2}
          isAction={isActive3}
        />
      </ImageBackground>
      <TasksSheet ref={ref} />
    </SafeAreaView>
  ) 
};

export default Focus;
