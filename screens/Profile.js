import { StyleSheet, Text, View,ImageBackground,Image, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { EvilIcons } from '@expo/vector-icons';
import { ProfileImage } from "../components"
import { COLORS } from '../assets/Config/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useContext } from 'react';
import LoginContext from '../ContextApi/AppContext';
import PersonalPosts from './ProfilePosts';


const Profile = () => {
  const navigation = useNavigation();
  const [data,setData]=useState({})
  const [like,setLiked]=useState()
  const {getCurrentUser,loggedUser } = useContext(LoginContext)
  const [user,setUser] = useState(null)
  const logout = async() => {
    // Clear user session data or tokens here
    try{
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    } catch (e) {
    }
  };
  useEffect(()=>{
    async function getLocalData(){
      const jsondata = JSON.parse(await AsyncStorage.getItem('credentials'));
      console.log("..............................................................")
      console.log("..............................................................")
      console.log("..............................................................")
      console.log(jsondata)
      setData(jsondata);
    }
    getLocalData()
    getCurrentUser()
  },[0])

  useEffect(()=>{

    setUser(loggedUser)
  },[loggedUser])


  const Like=()=>{

  }

  return (
    <ScrollView>
  <View style={{display:'flex',alignItems:'center',justifyContent:'flex-start',flexDirection:'row',marginHorizontal:15}}>
        <TouchableOpacity onPress={()=>navigation.pop()} style={{marginTop:10}}>
        <AntDesign name="arrowleft" size={24} color="grey" />
        </TouchableOpacity>
      <Text style={{fontWeight:600,color:'grey',top:5,left:20,fontSize:25}}>Profile</Text>
      <TouchableOpacity onPress={()=>logout()} style={{marginTop:10,marginLeft:"auto"}}>
      <Text style={{fontWeight:600,color:'red',fontSize:25}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Image style={{height:140,width:140,left:'30%',top:50,borderRadius:75,borderWidth:1,borderColor:'dodgerblue'}} source={{uri:loggedUser?.Profilepic}} />
      <EvilIcons name="pencil" size={30} color="black" style={{left:220,top:-80,borderWidth:2,backgroundColor:'white',margin:0,height:30,width:30,display:'flex', alignItems:'center',justifyContent:'center',borderRadius:15,borderColor:'dodgerblue'}} />
   <View style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
   <View style={styles.details}>
     <Text style={{fontWeight:800,fontSize:20}}>{loggedUser?.firstname} {loggedUser?.LastName}, 22</Text>
     <Image style={{height:18,width:18,marginHorizontal:15}} source={{uri:"https://img.icons8.com/color/48/null/verified-badge.png"}} />
     </View>
   </View>
   
     <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate("Editcreds")}>
  <Text style={{color:"gray"}}>Edit My Profile</Text>
  </TouchableOpacity>
  </View>
    <View style={{flex:1,backgroundColor:COLORS.faintbg,top:40,height:'100%'}}>
    
    <View style={{paddingHorizontal:10}}>
  <Text style={{color:COLORS.faint}}>Looking for {loggedUser?.hopes}</Text>
  <View style={{display:'flex',flexDirection:'column'}}>
  <View style={{display:'flex',flexDirection:'row',margin:5,alignItems:'center'}}>
  <Text style={{fontWeight:700,fontSize:20,marginBottom:10}}>Contact Info</Text>
  </View>
  <View style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
  <View style={{display:'flex',flexDirection:'row',margin:5,alignItems:'center'}}>
  <Entypo name="phone" size={24} color="black" />
  <Text style={{color:COLORS.faint,marginHorizontal:5}}>{loggedUser?.contact}</Text>
  </View>
  <View style={{display:'flex',flexDirection:'row',margin:5,alignItems:'center'}}>
  <FontAwesome name="twitter" size={24} color="black" />
  <Text style={{color:COLORS.faint,marginHorizontal:5}}>@{loggedUser?.twitter}</Text>
  </View>
  <View style={{display:'flex',flexDirection:'row',margin:5,alignItems:'center'}}>
  <FontAwesome name="instagram" size={24} color="black" />
  <Text style={{color:COLORS.faint,marginHorizontal:5}}>@{loggedUser?.instagram}</Text>
  </View>
  <View style={{display:'flex',flexDirection:'row',margin:10,alignItems:'center'}}>
  <FontAwesome name="facebook" size={24} color="black" />
  <Text style={{color:COLORS.faint,marginHorizontal:5}}>@{loggedUser?.facebook}</Text>
  </View>
  <View style={{display:'flex',flexDirection:'row',margin:5,alignItems:'center'}}>
  <MaterialIcons name="email" size={24} color="black" />
  <Text style={{color:COLORS.faint,marginHorizontal:5}}>{loggedUser?.email}</Text>
  </View>
  </View>
  </View>
  </View>
  <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',marginBottom:150}}>
    <ProfileImage data={loggedUser?.imgx}/>
    <ProfileImage data={loggedUser?.imgxx}/>
    <ProfileImage data={loggedUser?.img}/>
    <ProfileImage data={loggedUser?.Profilepic}/>
  </View>
    </View>
    <Text>Your Posts</Text>   
    {loggedUser && <PersonalPosts userid={loggedUser?.id} navigation={navigation} FirstName={loggedUser?.FirstName} LastName={loggedUser?.LastName} />}
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
    details:{
        display:'flex',
        alignItems:'center',
        flexDirection:'row',
        left:'20%',
        top:25
    },
    loginBtn: {
      width: '80%',
      backgroundColor: '#e91e63',
      borderRadius: 25,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 40,
      marginBottom: 10,
      elevation:10
    },
    loginText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    buttonContainer:{
      marginVertical:20,
      display:'flex',
      alignItems: 'center',
      display:'flex',
      flexDirection: 'row',
      alignItems:'center',
      justifyContent: 'center',
      paddingHorizontal:10,
      paddingVertical:10
    },
    button: {
      borderColor: "#858585",
      alignItems: 'center',
      borderWidth:1,
      justifyContent: 'center',
      paddingHorizontal:10,
      paddingVertical:10,
      marginHorizontal:10,
      borderRadius:5
    },
})