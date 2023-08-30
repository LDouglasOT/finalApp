import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import { COLORS } from '../assets/Config/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { useContext } from 'react'
import MessageContext from '../ContextApi/MessageContext';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';



const SpotlightShowcase = ({promoted,showSnackbar,navigation,localdata }) => {
  const { fetchData, fetchConversations,userMatches } = useContext(MessageContext)
  const scrollX = useRef(new Animated.Value(0)).current;
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
          const data = JSON.parse(await AsyncStorage.getItem("credentials"));
          const authToken = data.token; // Replace this with your actual authorization token
          const headers = {
            Authorization: `${authToken}`,
            'Content-Type': 'application/json',
          };
          const response = await axios.post("http://192.168.18.5:3001/api/conversation",convo,{headers:headers})
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

  const renderProfileCard = ({ item }) => {
    
    return(
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
  )};

  useEffect(() => {
    // Configure the animation to automatically scroll the FlatList horizontally
    const scrollAnimation = Animated.timing(scrollX, {
      toValue: promoted.length * 120, // Width of a profile card (adjust as needed)
      duration: 5000, // Total animation duration (adjust as needed)
      useNativeDriver: true,
    });

    // Loop the animation
    const loopAnimation = Animated.loop(scrollAnimation);

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, [promoted.length, scrollX]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}><Entypo name="star" size={24} color="white" /> <Entypo name="star" size={24} color="white" /> Spotlight <Entypo name="star" size={24} color="white" /><Entypo name="star" size={24} color="white" /></Text>
      <Animated.FlatList
        data={promoted}
        renderItem={renderProfileCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.profileListContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute', bottom:0,right:0,margin:5
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

export default SpotlightShowcase;
