import React,{ useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Button,Animated} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import MessageContext from '../ContextApi/MessageContext';
import { useContext } from 'react';
import AppContext from '../ContextApi/AppContext'
import { COLORS } from '../assets/Config/colors';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Notifications from "expo-notifications";
import { Asset } from 'expo-asset'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
  shouldShowAlert: true,
  shouldPlaySound:true,
  shouldSetBadge:true
})
})


export default function TopBar({title,gotoProfile,addPopup,button,execute }) {
  const [token,setToken] = useState(null)
  const { online } = useContext(AppContext)
  async function registerForPushNotificationsAsync() {
      let token;
    
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        setToken(token);
      } else {
        alert('Must use physical device for Push Notifications');
      }
    }
    useEffect(()=>{
      registerForPushNotificationsAsync()
    },[0])

  const products=()=>{
    if(button =="btn"){
      return(
        <TouchableOpacity onPress={()=>gotoProfile()} style={styles.iconButton}>
        <Feather name="user" size={24} color="#444" />
      </TouchableOpacity>
      )
    }else{
      return(
        <TouchableOpacity onPress={()=>execute()} style={styles.iconButtonx}>
        <Entypo name="camera" size={24} color="#444" />
      </TouchableOpacity>
      )
    }

  }
 
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>addPopup()} style={styles.iconButton}>
        <FontAwesome5 name="gifts" size={24} color="#444" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{online.length} online</Text>
      </View>
      {products()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 1,
    paddingHorizontal: 16,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  iconButton: {
    padding: 8,
  },
  iconButtonx:{
    paddingHorizontal: 8,
    paddingVertical:6,
    backgroundColor:"white",
    borderWidth:0.8,
    borderColor:"#444",
    borderRadius:15
  }
});
