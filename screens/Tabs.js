import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign,FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LikedProfile from "./LikedProfile";
import SwipeScreen from "./SwipeScreen";
import Messages from "./Messages";
import Profile from "./Profile";
import Moments from './Moments';
import LoginContext from '../ContextApi/AppContext';
import { useContext } from 'react'
import MessageContext from '../ContextApi/MessageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Omege from './Omege';
import MatchContext from '../ContextApi/MatchContext'
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { COLORS } from '../assets/Config/colors';
import Match from './Match';


const Tab = createBottomTabNavigator();
const Tabs = ({ navigation, route }) => {
  const { count,likes } = useContext(LoginContext)
  const { userMatches } = useContext(MessageContext)
  const [messageCount,setMessageCount] = useState(0)
  const { isLoading,getLikedData,handleRefresh,getData,refreshing,matches,change_post } = useContext(MatchContext)
  const [loaded,setLoaded] = useState(false)
  const isFocused = useIsFocused();
  const routeName = route.name;


  useEffect(()=>{
    async function setmessages(){
      let data = JSON.parse(await AsyncStorage.getItem("credentials"))
    let smscount = 0
    userMatches?.forEach(element => {
      let actualsms = element.messages.filter(sms=>sms.sender !== data.id)
      let final=actualsms.filter(sms=>sms.seen == false)
      smscount += final.length
    });
    setMessageCount(smscount)
    }
    setmessages()
  },[userMatches])
  
  return (
    <View style={{flex:1}}>
 
      <Tab.Navigator 
        initialRouteName="SwipeScreen" 
        screenOptions={{
           "tabBarActiveTintColor": "#e91e63",
           "headerShown":false,
            "tabBarInactiveTintColor": "gray",
            "tabBarShowLabel": true,
            "tabBarStyle": [
              {
                "display": "flex"
              },
             null
            ]
        }}
      >
        <Tab.Screen 
          name="SwipeScreen" 
          component={SwipeScreen} 
          options={{
            tabBarLabel: 'swipe',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="heart" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Likes" 
          component={Match} 
          options={({ route }) => ({
            tabBarLabel: 'matches',
            tabBarIcon: ({ color, size }) => (
              <View>
                <AntDesign name="like1" size={24} color={color} />
                {matches.length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {matches.length}
                    </Text>
                  </View>
                )}
              </View>
            ),
          })}
        />
     <Tab.Screen 
      name="chats" 
      component={Moments} 
      options={{
        tabBarLabel: 'moments',
        tabBarIcon: ({ color, size }) => (
          <AntDesign name='camera'color= "gray" size={24} />
        ),
        // tabBarButton: ({ accessibilityState,color}) => (
        //   <AntDesign name='camera'color= "gray" size={24} />
          // <TouchableOpacity
          //   onPress={()=>handlePostNew(accessibilityState.selected)}
          //   style={!accessibilityState.selected ? styles.btnActive:styles.btnInActive}
          // >
          //   {!accessibilityState.selected ? <AntDesign name='camera'color= "gray" size={24} />:<MaterialIcons name="add-a-photo" size={24} color="white" />}
              
          // </TouchableOpacity>
        // ),
      }}
    />
    <Tab.Screen 
          name="online" 
          component={Omege} 
          options={{
            tabBarLabel: 'Hourly Picks',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="online-prediction" color={color} size={30} />
            ),
          }}
        />
           <Tab.Screen 
          name="ChatList" 
          component={Messages} 
          options={({ route }) => ({
            tabBarLabel: 'messages',
            tabBarIcon: ({ color, size }) => (
              <View>
                <AntDesign name="message1" size={24} color={color} />
                {messageCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      { messageCount }
                    </Text>
                  </View>
                )}
              </View>
            ),
          })}
        />
      </Tab.Navigator>

    </View>
  )
}

export default Tabs

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 16,
    minHeight: 16,
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btnActive:{
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  btnInActive:{
   backgroundColor:COLORS.pink,
   height:45,
   width:45,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:25,
    marginHorizontal:'auto',
  }
});
