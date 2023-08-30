import React, { useState,useEffect } from 'react';
import { View, TextInput, StyleSheet,Text, TouchableOpacity,ScrollView,Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../assets/Config/colors';
import { AntDesign } from '@expo/vector-icons';
import LoginPopup from '../components/LoginPopup';
import { Fontisto } from '@expo/vector-icons';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import LoginContext from '../ContextApi/AppContext';

const Editcreds = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [makePublic, setMakePublic] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [email,setEmail] = useState("")
  const [facebook,setFacebook] = useState("")
  const [twitter,setTwitter] = useState("")
  const [instagram,setInstagram] = useState("")
  const [url,setUri]=useState("http://192.168.18.5:3001/api/editcreds")
  const [village,setVillage] = useState("")
  const [other,setOther] = useState("")

  const [isvisible,setIsvisible] = useState(false)
  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
         app_id: 10140,
         app_token: 'drpVcF7TNyQVJ8WceIm3ou',
         screenName: 'Edit credentials'
     });
});

  const handleFormSubmit = async() => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is atleast required.');
      return;
    }
    const user = JSON.parse(await AsyncStorage.getItem("credentials"))
    const data = {
      "id":user.id,
      "instagram":instagram,
      "facebook":facebook,
      "twitter":twitter,
      "phone":phoneNumber,
      "email":email,
      "makePublic":makePublic,
      "village":village
    }
    try{
     
      setIsvisible(true)
      const datax = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = datax.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res=await axios.post(url, data,{headers:headers})
      if(res.status == 200){
        setIsvisible(false)
        navigation.pop()
      }
    }catch(e){
      setIsvisible(false)
    }

  };
  const { getCurrentUser } = useContext(LoginContext)

 

  return (
    <ScrollView style={styles.container}>
        <View style={styles.backarrow}>
            <TouchableOpacity onPress={()=>navigation.pop()}>
            <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
        <Text style={styles.text}>Edit Personal Profile</Text>
        </View>
        <LoginPopup visible={isvisible}/>
      <View style={styles.fieldContainer}>
        <Ionicons name="logo-whatsapp" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="WhatsApp Number"
          onChangeText={(text)=>setPhoneNumber(text)}
          value={phoneNumber}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Ionicons name="mail" size={20} style={styles.icon} />
        <TextInput style={styles.input} placeholder="Email Address eg support@yodate.ug" 
         onChangeText={(text)=>setEmail(text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Ionicons name="logo-facebook" size={20} style={styles.icon} />
        <TextInput style={styles.input} placeholder="Facebook Username eg @Douglas"
         onChangeText={(text)=>setFacebook(text)}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Ionicons name="logo-twitter" size={20} style={styles.icon} />
        <TextInput style={styles.input} placeholder="Twitter Username eg @Douglas" 
         onChangeText={(text)=>setTwitter(text)} />
      </View>
      <View style={styles.fieldContainer}>
       <Ionicons name="logo-instagram" size={20} style={styles.icon} />
       <TextInput style={styles.input} placeholder="instagram"  onChangeText={(text)=>setInstagram(text)} />
      </View>
      <View style={styles.fieldContainer}>
      <Fontisto name="holiday-village" size={18} style={styles.icon} />
       <TextInput style={styles.input} placeholder="Village"  onChangeText={(text)=>setVillage(text)} />
      </View>
      <View style={styles.fieldContainer}>
      <AntDesign name="phone" size={20} color="black" style={styles.icon}/>
       <TextInput style={styles.input} placeholder="Other Phone Number eg 0780......"  onChangeText={(text)=>setOther(text)} />
      </View>

      <View style={styles.btncontainer}>
  { <TouchableOpacity style={styles.submit} onPress={()=>handleFormSubmit()}>
          <Text style={{color:'white'}}>Submit</Text>
      </TouchableOpacity>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    btncontainer:{
        width:'100%',
        display:'flex',
        justifyContent: 'center',
        alignItems:'center'
    },
    submit:{
        backgroundColor:COLORS.pink,
        borderRadius:5,
        paddingHorizontal:80,
        paddingVertical:15
    },
  container: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
    color: 'gray',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text:{
    fontSize:20,
    marginLeft:20,
    marginVertical:10
  },
  backarrow:{
    display:'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection:'row'
  }
});

export default Editcreds;
