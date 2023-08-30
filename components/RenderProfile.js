import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import { COLORS } from '../assets/Config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useContext } from 'react'
import MessageContext from '../ContextApi/MessageContext';

const RenderProfile = ({item,navigation,showSnackbar,localdata}) => {
    const onProfilePress=()=>{

    }
    const gotoProfile = (datanow) =>{
      console.log(datanow)
      navigation.navigate("LikedProfile",{"data":datanow})
    }
    function calculateAge(birthdate) {
      const birthDate = new Date(birthdate);
      const currentDate = new Date();
    
      let age = currentDate.getFullYear() - birthDate.getFullYear();
    
      const currentMonth = currentDate.getMonth();
      const birthMonth = birthDate.getMonth();
    
      if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
        age--;
      }
    
      return age;
    }
    const {userMatches } = useContext(MessageContext)
    const SelectedUser=async(data,id)=>{  
      // setTimeout(()=>{
      //   showSnackbar()
      // },1000)
      console.log(data.id)
      const conversation = userMatches.filter(obj => obj.chatUser.some(user => user?.id === data.id));
      const convo = {
            "user1":parseInt(data.id),
            "user2":parseInt(localdata.id),
        }
        try{
          if(conversation.length == 0){
            const user = JSON.parse(await AsyncStorage.getItem("credentials"))
            const authToken = user.token; // Replace this with your actual authorization token
          
            const headers = {
              Authorization: `${authToken}`,
              'Content-Type': 'application/json',
            };
            const response = await axios.post("http://192.168.18.5:3001/api/conversation",convo,{headers})
          if(response.status == 201 || response.status == 200){
            showSnackbar("Message sent successfully")
          }
          }else{
            navigation.navigate("Chatting",{"conversationId":conversation[0],"credentials":localdata})
          }
        }catch(err){
          console.log(err.message)
          console.log("snack") 
        }
    }
  return (
    <TouchableOpacity
        onPress={() => gotoProfile(item)}
        activeOpacity={0.7}
        style={styles.profileCard}
      >
        <Image resizeMode='cover' source={{ uri: item.imgx }} style={styles.profilePicture} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,1,0.4)']}
          style={styles.gradientOverlay}
        >
            <View style={{ position: 'absolute', display: 'flex', bottom: 0,justifyContent:'space-between',width:'100%' }}>
                  <View style={{ display: 'flex', bottom: 0, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.profileName}>{item.FirstName}</Text>
                  <Text style={styles.profileInfo}>{calculateAge(item.day)}yrs</Text>
                  </View>
                  <View style={{display: 'flex', bottom: 0, flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="md-location" size={18} color="white" />
                  <Text style={styles.profileNamex}>{item.District}</Text>
                  </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>{
              showSnackbar(`Opening chat with ${item.FirstName}`)
              SelectedUser(item)
              }}>
                    <Text style={styles.buttonText}><AntDesign name="message1" size={38} color="white" /></Text>
            </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
  )
}

export default RenderProfile

const styles = StyleSheet.create({
    button: {
      width: 50,
      height:40,
      alignItems: 'center',
      justifyContent: 'center',
      position:'absolute', bottom:0,right:0,margin:5,bottom:5
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    container: {
      padding: 16,
      backgroundColor: COLORS.pink,
      borderRadius: 8,
      elevation: 2,
      height:300
    },
    header: {
      fontSize: 25,
      fontWeight: 'bold',
      color:'white'
    },
    profileListContainer: {
      alignItems: 'center',
    },
    profileCard: {
      width: 200,
      borderRadius: 8,
      marginHorizontal: 4,
      height:220
    },
    profilePicture: {
      width: "100%",
      height: "100%",
      alignSelf: 'center',
      marginBottom: 8,
    },
    profileName: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 4,
      marginHorizontal:5,
      color:'white'
    },
    profileNamex: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 4,
      marginHorizontal:2,
      color:'white'
    },
    profileInfo: {
      fontSize: 14,
      textAlign: 'center',
      color:'white'
    },
    profilePicture: {
      width: "100%",
      height: "100%",
      borderRadius: 8,
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '100%',
      borderRadius: 8,
    },
  });

