import { StyleSheet, Text, TextInput, View,TouchableOpacity,ScrollView } from 'react-native'
import React,{ useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../assets/Config/colors';
import SelectDropdown from 'react-native-select-dropdown'
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '../components';
import DatepickerExample from '../components/Date';
import LoginPopup from '../components/LoginPopup';


const PofileDetails = ({ navigation }) => {
    const [FirstName,setFirstName] = useState("")
    const [LastName,setLastName] = useState("")
    const [Day,setDay] = useState("")
    const [month,setMonth] = useState("")
    const [year,setYear] = useState("")
    const [gender,setGender] = useState(['Male','Female','Other'])
    const [Selectedreligion,setSelectedreligion] = useState("")
    const [country,setCountry] = useState("")
    const [id,setId] = useState("")
    const [countries,setCountries] = useState(["Uganda", "Kenya", "Tanzania", "Rwanda"])
    const [districts,setDistricts] = useState(["Wakiso", "Kampala", "Kalangala", "None"])
    const [hopes,setHopes] = useState(["A relationship", "Casual dating", "Friendship", "I'm not sure yet","Prefer not to say"])
    const [images,setImages] = useState([])
    const [selectedHope,setSelectedHopes] = useState()
    const [selectedistrict,setSelectedistrict] = useState()
    const [genderList,setGenderList] = useState()
    const [religionList,setReligionList] = useState()
    const [religion, setReligion] = useState(['Muslim','Christian','Other']);
    const [ localdata, setLocaldata ] = useState([])
    const [selectedDate,setSelectedDate] = useState("")
    const [page,setPage] = useState(0)


    const [coderror,setCodeError]=useState("Something went wrong")
    const [reason,setReason]=useState("Something went wrong")
    const [error,setError] = useState(false)
    const [visible,setVisible] = useState(false)

    const changecodestate = (state)=>{
      console.log(state)
      setError(state)
    }
    const ChangeCodErrorName=(error)=>{
      setCodeError(error)
    }
    const settingReason = (res)=>{
      setReason(res)
    }
    useEffect(async()=>{
        const data = JSON.parse(await AsyncStorage.getItem("data"))
     
        setLocaldata(data)

    },[0])
    const appendImg = (img) =>{
        setImages([...images,img])
    }
    useEffect(() => {
      axios.post(`https://app.nativenotify.com/api/analytics`, {
           app_id: 10140,
           app_token: 'drpVcF7TNyQVJ8WceIm3ou',
           screenName: 'Profile details'
       });
 });
 

const save= async() =>{
       try{
        const data = {
            "firstName":FirstName,
            "lastName":LastName,
            "day":selectedDate,
            "month":"month",
            "year":"year",
            "gender":genderList,
            "id":localdata.id,
            "religion":religionList,
            "district":selectedistrict,
            "id":localdata.id,
            "hopes":selectedHope,
            "img":images
           }
        setVisible(true)
        const res= await axios.post("http://192.168.18.5:3001/api/register",data)
        if(res.status == 200){
            await AsyncStorage.setItem(
                'profilexdata',
                JSON.stringify(res.data),
              )
              setVisible(true)
              ChangeCodErrorName(res.data.head)
              settingReason(res.data.message)
              changecodestate(true)   
              setTimeout(()=>{
              changecodestate(false)
              navigation.navigate("Login")
              },4000)
        }
       }catch(err){
        setVisible(false)
        ChangeCodErrorName(res.data.head)
        settingReason(res.data.message)
        changecodestate(true)
        setTimeout(()=>{
          changecodestate(false)
          },4000)
        console.log(err.message)
       }
    }
const getdate = (dated) =>{
setSelectedDate(dated)
}

  return (
<ScrollView style={{flex:1,backgroundColor:'white'}}>
<LoginPopup visible={visible}/>
{page == 0 && 
<View style={{flex:1,height:'100%',display:'flex',justifyContent:'center',alignItems:'center',width:'100%'}}>
<View style={{display:'flex',flexDirection:'row',alignItems:'center',padding:10,marginRight:'auto',width:'100%'}}>
<TouchableOpacity onPress={()=>setPage(page-1)}>
<AntDesign name="arrowleft" size={24} color="black" style={{marginRight:10}}/>
</TouchableOpacity>
<Text style={{marginRight:'auto',fontSize:18,fontWeight:600,marginLeft:10}}>Fill your personal information</Text>  
</View>
<View style={{flex:1,height:"100%",width:'100%',display:'flex',alignItems: 'center',justifyContent:'center',marginTop:'20%'}}>
<View style={{display:'flex',alignItems:'center',marginVertical:20}}>
      <Text style={{fontWeight: 'bold',fontSize: 50,color: '#e91e63'}}>YoDate</Text>
</View>
  <View style={styles.inputView}>
<TextInput style={styles.inputText} placeholder="First Name" placeholderTextColor="#003f5c" secureTextEntry={false} value={FirstName} onChangeText={(Text)=>setFirstName(Text)}/>
</View>
<View style={styles.inputView}>
<TextInput style={styles.inputText} placeholder="Last Name" placeholderTextColor="#003f5c" secureTextEntry={false} value={LastName} onChangeText={(Text)=>setLastName(Text)}/>
</View>
<TouchableOpacity style={styles.loginBtn} onPress={()=>setPage(page+1)}>
  <Text style={styles.loginText}>continue</Text>
</TouchableOpacity>
</View>
</View>
}
{page == 1 && (
<View style={{direction:'flex',alignItems:'center',justifyContent:'center',flex:1}}>
<Text style={{color:COLORS.black,margin:10}}>More about you</Text>
<DatepickerExample getdate={getdate}/>
<SelectDropdown data={gender} onSelect={(selectedItem, index) => {setGenderList(selectedItem)}} defaultButtonText="Select your gender" buttonStyle={styles.button} buttonTextStyle={{color:'white',fontWeight:'bold'}} buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}} rowTextForSelection={(item, index) => { return item }}/>
<SelectDropdown data={religion} onSelect={(selectedItem, index) => {setReligionList(selectedItem)}} buttonStyle={styles.button} buttonTextStyle={{color:'white',fontWeight:'bold'}} defaultButtonText="Select your religion" buttonTextAfterSelection={(selectedItem, index) => {return selectedItem }} rowTextForSelection={(item, index) => {return item}}/>
<SelectDropdown data={districts} onSelect={(selectedItem, index) => {setSelectedistrict(selectedItem)}} buttonStyle={styles.button} buttonTextStyle={{color:'white',fontWeight:'bold'}} defaultButtonText="Select your district" buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}} rowTextForSelection={(item, index) => {return item}}/>
<SelectDropdown data={hopes} onSelect={(selectedItem, index) => {setSelectedHopes(selectedItem)}} buttonStyle={styles.button} buttonTextStyle={{color:'white',fontWeight:'bold'}} defaultButtonText="Select your hopes" buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}} rowTextForSelection={(item, index) => {return item}}/>
<TouchableOpacity style={{...styles.loginBtn,marginTop:'auto',marginBottom:8}} onPress={()=>setPage(page+1)}>
  <Text style={styles.loginText}>continue</Text>
</TouchableOpacity>
</View>
)}
{
  page == 2 && (
    <View style={{flex:1,display:'flex',alignItems:'center'}}>
      <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginVertical:10}}>
      <TouchableOpacity onPress={()=>setPage(page-1)}>
        <AntDesign name="arrowleft" size={24} color="black" style={{marginRight:10}}/>
      </TouchableOpacity>
      <Text style={{marginRight:'auto',fontSize:20,fontWeight:600,marginLeft:10,marginVertical:5}}>Upload Your Beautiful Photos</Text>   
      </View>
     <View style={{flex:1,display:'flex',flexWrap:'wrap',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <Picker appendImg ={appendImg}/>
      <Picker appendImg ={appendImg}/>
      <Picker appendImg ={appendImg}/>
      <Picker appendImg ={appendImg}/>
      </View>
      <TouchableOpacity style={{...styles.loginBtn,marginTop:'auto'}} onPress={()=>save()}>
      <Text style={styles.loginText}>Register</Text>
      </TouchableOpacity>
    </View>
  )
}
</ScrollView>
  )
}

export default PofileDetails

const styles = StyleSheet.create({
    signin:{
        backgroundColor:COLORS.pink,
        width:'85%',
        paddingVertical:10,
        borderRadius:8,
        display:'flex',
        alignItems:'center',
        marginVertical:11
      },
      inputView: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: 'center',
        padding: 20,
        elevation:10,
        marginHorizontal:"auto"
      },
      inputText: {
        height: 50,
        color: '#003f5c',
      },

      calendarContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        overflow: 'hidden',
      },
      calendarHeader: {
        backgroundColor: '#3f51b5',
        padding: 10,
      },
      calendarHeaderText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 18,
      },
      dayButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
      },
      dayLabel: {
        fontSize: 25,
        color: '#333333',
      },
      selectedDayLabel: {
        color: '#ffffff',
      },
      selectedDayButton: {
        backgroundColor: '#3f51b5',
      },
      button: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 10,
        color:"white",
        borderColor:COLORS.pink,
        backgroundColor: COLORS.pink,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical:15
    },
    loginBtn: {
        width: '80%',
        backgroundColor: '#e91e63',
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: 10,
        elevation:10,
      },
      loginText: {
        color: '#fff',
        fontWeight: 'bold',
      },
})