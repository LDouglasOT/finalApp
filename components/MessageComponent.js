import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React, {useState,useEffect} from 'react'
import { COLORS } from '../assets/Config/colors'
import TimeAgo from 'react-native-timeago';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const MessageComponent = ({message,own}) => {
  const [fish,setFish] = useState(false)
  const [tapped,setTapped] = useState(false)
  
  useEffect(()=>{
  async function seenmsg(){
    if(message.gift){
      setFish(true)
    }
    const user = JSON.parse(
      await AsyncStorage.getItem('credentials')
    );
    const authToken = user.token; // Replace this with your actual authorization token

    const headers = {
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    };
    const creds = JSON.parse(await AsyncStorage.getItem("credentials"))
    if(!message.seen && message.sender !== creds.id){
    try{
      const response = await axios.put("http://192.168.18.5:3001/api/messages/status",{id:message.id},{headers})
      if(response.status==200){  
      }
    }catch(err){
      console.log("err.message")
    }  
    }
  }
  seenmsg()
console.log(message)

  },[0])


if(tapped){
  return(
    <View style={!own ? styles.messageContainerxx:styles.messageContainerxxx}>
      <Image source={{ uri: message.giftImage}} style={{height:100,width:100,borderRadius:20}}/>
     <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
     <Text style={{marginHorizontal:5}}>{message.sms}</Text>
      <Text>{message.quantity*message.price}</Text>
     </View>
   
    </View>
  )
}

if(fish){
  return(
    <TouchableOpacity onPress={()=>{
      setTapped(true)
      setFish(false)
    }} style={!own ? styles.messageContainerxx:styles.messageContainerxxx}>
    <View style={{
      backgroundColor:COLORS.faint,
      maxWidth:'100%',
      borderRadius:15,
      paddingHorizontal:20,
      paddingVertical:5,
      margin:5,
      display:'flex',
      flexDirection:'row',
      width:150,
      height:100
    }}>
    <LottieView
      source={require('../assets/Lottie/animation_ll6wewg2.json')}
      autoPlay
    />
   </View>
   </TouchableOpacity>
  )
}

  return (
   <View style={!own ? styles.messageContainerx:styles.messageContainer}>
    <View style={!own ? styles.messagex:styles.message}>
    <Text style={styles.Texts}>{message?.sms}</Text>
    </View>
    <View style={{marginLeft:10}}>
    <TimeAgo time={message.createAt} /> 
    </View> 
    </View>
  )
}

export default MessageComponent

const styles = StyleSheet.create({
    message:{
     backgroundColor:COLORS.pink,
     maxWidth:'80%',
     borderRadius:15,
     paddingHorizontal:10,
     paddingVertical:10,
     margin:5,
     display:'flex',
     flexDirection:'row',
     alignItems:'flex-end',
     justifyContent:'space-between'
    },
    messagex:{
     backgroundColor:COLORS.faint,
     maxWidth:'80%',
     borderRadius:15,
     paddingHorizontal:20,
     paddingVertical:5,
     margin:5,
     display:'flex',
     flexDirection:'row',
     alignItems:'flex-end',
     justifyContent:'space-between'
    },
      message:{
     backgroundColor:COLORS.pink,
     maxWidth:'80%',
     borderRadius:15,
     paddingHorizontal:10,
     paddingVertical:10,
     margin:5,
     display:'flex',
     flexDirection:'row',
     alignItems:'flex-end',
     justifyContent:'space-between'
    },
    messagex:{
     backgroundColor:COLORS.faint,
     maxWidth:'80%',
     borderRadius:15,
     paddingHorizontal:20,
     paddingVertical:5,
     margin:5,
     display:'flex',
     flexDirection:'row',
     alignItems:'flex-end',
     justifyContent:'space-between'
    },
  
    Texts:{
     color:'white',
    },
    time:{
     marginLeft:'auto',
     fontSize:8,
     color:'white',
     marginLeft:15
    },
    messageContainerx:{
     display:'flex',
     justifyContent:'flex-start',
     alignItems:'flex-start',
     width:'100%',
    },
    messageContainer:{
      display:'flex',
      justifyContent:'flex-end',
      alignItems:'flex-end',
      width:'100%',
     },
     messageContainerxx:{
      display:'flex',
      justifyContent:'flex-start',
      alignItems:'flex-start',
      width:'100%',
      marginHorizontal:20
     },
     messageContainerxxx:{
       display:'flex',
       justifyContent:'flex-end',
       alignItems:'flex-end',
       width:'100%'
      },
 })