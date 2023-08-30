import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoginPopup from '../components/LoginPopup';
import IncorrectLoginModal from '../components/IncorrectLoginModal';
import { ToastAndroid } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginContext from '../ContextApi/AppContext';
import { useContext } from 'react';
import { registerIndieID } from 'native-notify';


import { COLORS } from '../assets/Config/colors';

const SampleLogin = ({navigation}) => {
    const [ phoneNumber, setPhoneNumber ] = useState("")
    const [ Password, setPassword ] = useState("")
    const [visible,setVisible] = useState(false)
    const [error,setError] = useState(false)
    const { initSocket } = useContext(LoginContext)
    const [location,setLocation] = useState(null)
    useEffect(()=>{
      async function getLocation(){
        try{
          const response = await axios.get("https://ipinfo.io?token=e7e1fce8238076")
          setLocation(response.data.country)
        }catch(err){
          console.log(err.message)
        }
  
      }
      getLocation()
    },[0])
  const proceed = async()=>{
    try{
    if(Password == "" || phoneNumber == ""){
      ToastAndroid.showWithGravity(
        "Some fields are missing or blank, fill them first",
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
        return
    }
    
    setVisible(true)
    const data = {
      "phoneNumber":phoneNumber, "password":Password
    }
 
    const res = await axios.post("http://192.168.18.5:3001/api/login",data)
    if(res.status == 200){
      const data = await AsyncStorage.setItem("credentials",JSON.stringify(res.data))
      await registerIndieID(`${res.data.id}`, 10140, 'drpVcF7TNyQVJ8WceIm3ou');
      console.log("sending data payload")
      await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: `${res.data.id}`,
      appId: 10140,
      appToken: 'drpVcF7TNyQVJ8WceIm3ou',
      title: `Success`,
      message: `Successfully logged in as ${res.data.FirstName} ${res.data.LastName}`,
      pushData: { screenName: "MainScreen" }
       });
      initSocket()
      setVisible(false)
      navigation.navigate("MainScreen")
    
    }
  }catch(err){
    console.log(err.message)
    console.log(err.message)
    setVisible(false)
    if(err.message.includes("401")){
      setError(true)
      setTimeout(()=>{
          setError(false)
      },2000)
    }else if(err.message.includes("400")){
      setError(true)
    setTimeout(()=>{
        setError(false)
    },2000)
}}}
  const handleSignup = () => {
  navigation.navigate("Register")
}

  return (
    <View style={styles.container}>
  
        <LoginPopup visible={visible}/>
        <IncorrectLoginModal visible={error}/>
        <View style={{display:'flex',flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
        <Text style={styles.logo}>YoDate<Text style={styles.location}>.{location}</Text></Text>
   
        </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Phone Number"
          placeholderTextColor="#003f5c"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text)=>setPhoneNumber(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={Password}
          onChangeText={(text)=>setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={()=>proceed()}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
      <View style={{marginTop:25}}>
      <TouchableOpacity onPress={handleSignup} >
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#e91e63',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    elevation:10
  },
  inputText: {
    height: 50,
    color: '#003f5c',
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
  signupText: {
    color: '#003f5c',
    textDecorationLine: 'underline',
  },
  location:{
    fontSize:15,
    color:COLORS.black,
    fontWeight:'400'
  }
});

export default SampleLogin;
