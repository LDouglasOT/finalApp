import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  SafeAreaView,
  useColorScheme,
  StatusBar,
  SafeAreaProvider
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { PofileDetails,Messages,Profile,Chatting,LikedProfile,SwipeScreen} from "./screens"
import Tabs from './screens/Tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useEffect,useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/Splashscreen';
import SampleLogin from './screens/SampleLogin';
import SignupProcess from './screens/Process';
import { LoginProvider } from './ContextApi/AppContext';
import { MessageProvider } from './ContextApi/MessageContext';
const Stack = createNativeStackNavigator();
import { MatchProvider } from './ContextApi/MatchContext';
import Match from './screens/Match';
import DetailsPage from './screens/DetailsPage';
import Social from './screens/Social';
import Editcreds from './screens/Editcreds';
import { Picker } from './components';
import Gifts from './screens/Gifts'
import registerNNPushToken from 'native-notify';
import { SplashScreens } from './screens/SplashScreens';
import WithdrawPage from './screens/WithdrawPage'


export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isAuthenticated,setAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  registerNNPushToken(10140, 'drpVcF7TNyQVJ8WceIm3ou');
  
  useEffect(()=>{
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
    checkUser()

  },[0])
  const checkUser=async()=>{
    console.log("Checking user")
    let data = await AsyncStorage.getItem("credentials")
    if(data !== null){
      setAuthenticated(true)
    }
  }
  if (isLoading) {
    return <SplashScreens />;
  }
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex:1
  };
  return (
    <MatchProvider>
    <MessageProvider>
    <LoginProvider>
    <SafeAreaView style={backgroundStyle}>
    <SplashScreens />
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
      <Stack.Navigator  screenOptions={{
    headerShown: false
  }}>
      <Stack.Group
    screenOptions={({ navigation }) => ({
      presentation: 'modal',
      headerLeft: () => <MaterialIcons name="cancel" size={24} color="black" />,
    })}
  >     
  {isAuthenticated ?
       <>
    
        <Stack.Screen
         name="MainScreen"
         component={Tabs}
         options={{title: ''}}
       />
       <Stack.Screen
         name="Messages"
         component={Messages}
         options={{title: ''}}
       />
      <Stack.Screen
         name="WithdrawPage"
         component={WithdrawPage}
         options={{title: ''}}
       />
      <Stack.Screen
         name="Gifts"
         component={Gifts}
         options={{title: ''}}
       />
        <Stack.Screen
         name="ProfileDetails"
         component={PofileDetails}
         options={{title: ''}}
       />
        <Stack.Screen
         name="Editcreds"
         component={Editcreds}
         options={{title: ''}}
       />
       <Stack.Screen
         name="Chatting"
         component={Chatting}
         options={{title: ''}}
       />  
       <Stack.Screen
       name="Match"
       component={Match}
       options={{title: ''}}
       />
       <Stack.Screen
         name="SwipeScreen"
         component={SwipeScreen}
         options={{title: ''}}
       />
       <Stack.Screen
         name="Profiling"
         component={Profile}
         options={{title: ''}}
       />
        
        <Stack.Screen
         name="LikedProfile"
         component={LikedProfile}
         options={{title: ''}}
       />
        <Stack.Screen
          name="Login"
          component={SampleLogin}
          options={{title: ''}}
        />
         <Stack.Screen
          name="Register"
          component={SignupProcess}
          options={{title: ''}}
        />
        <Stack.Screen
          name="details"
          component={DetailsPage}
          options={{title: ''}}
        />
        
       </>
        : 
        <>
        <Stack.Screen
          name="Login"
          component={SampleLogin}
          options={{title: ''}}
        />
         <Stack.Screen
          name="Register"
          component={SignupProcess}
          options={{title: ''}}
        />
         <Stack.Screen
         name="ProfileDetails"
         component={PofileDetails}
         options={{title: ''}}
       />
        <Stack.Screen
         name="Messages"
         component={Messages}
         options={{title: ''}}
        />
        <Stack.Screen
         name="Chatting"
         component={Chatting}
         options={{title: ''}}
        />  
        <Stack.Screen
         name="MainScreen"
         component={Tabs}
         options={{title: ''}}
        />
        <Stack.Screen
        name="Match"
        component={Match}
        options={{title: ''}}
        />
        <Stack.Screen
         name="SwipeScreen"
         component={SwipeScreen}
         options={{title: ''}}
        />
        <Stack.Screen
         name="Profiling"
         component={Profile}
         options={{title: ''}}
        />
        <Stack.Screen
          name="details"
          component={DetailsPage}
          options={{title: ''}}
        />
        <Stack.Screen
         name="LikedProfile"
         component={LikedProfile}
         options={{title: ''}}
        />
         <Stack.Screen
         name="Gifts"
         component={Gifts}
         options={{title: ''}}
       />
        <Stack.Screen
         name="Editcreds"
         component={Editcreds}
         options={{title: ''}}
       />
        </>
        }
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  </LoginProvider>
  </MessageProvider>
  </MatchProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
