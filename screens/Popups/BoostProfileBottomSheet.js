import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import Modal from 'react-native-modal';
import { COLORS } from '../../assets/Config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, RadioButton, TextInput } from 'react-native-paper';
import axios from 'axios';
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


const BoostProfileBottomSheet = ({ isVisible, onClose }) => {
  const [option,setOption] = useState(0)
  const [selecturi,setSelecteduri]=useState("")
  const [images,setImages] = useState(null)
  const [checked, setChecked] = React.useState('first');
  const [value,setValue]=useState(0)
  const [payOption,setPayoption] = useState(true)
  const [enabled,setEnabled] = useState(true)
  const [amount,setAmount]=useState(0)
  const [invalid,setInvalid] = useState(false)

  const [phone,setPhone] = useState(false)

  const [finish,setFinish]=useState(true)
const handlePayment=async()=>{
try{

  if(phone.length <10){
    setInvalid(true)
    setOption(6)
    setEnabled(true)
    setTimeout(()=>{
      setInvalid(false)
      setOption(3)
    },3000)
    return
  }

  let data = JSON.parse(await AsyncStorage.getItem("credentials"))
    const paymentdata = {
      "amount":amount,
      "id":data.id,
      "img":selecturi,
      "phone":phone
    }
    console.log(paymentdata)
    const authToken = data.token; // Replace this with your actual authorization token
    const headers = {
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    };
    const res = await axios.post("http://192.168.18.5:3001/api/promote",paymentdata,{headers:headers})
    if(res.status==200){
      setOption(4)
      setTimeout(()=>{
        onClose()
        setOption(0)
        setEnabled(true)
      },3000)
    
    }

}catch(err){
  setOption(5)
  console.log(err.message)

  setEnabled(true)
  setTimeout(()=>{
    setOption(3)
  },3000)

}
}

  const handlePromote=async()=>{
    if(option==3){
      setEnabled(false)
      handlePayment()
      return
    }
    if(option==2){
      setFinish(false)
    }
    setOption(option+1)
  }
  useEffect(()=>{
    async function getImages(){
      let data = JSON.parse(await AsyncStorage.getItem("credentials"))
      console.log(data)
      setImages(data)
    }
    getImages()
  },[0])

const displayOptions=()=>{
  if(option == 0){
    return(
      <View style={styles.profileImagesContainer}>
      <Text style={styles.boostText}>Choose an image to boost your profile</Text>
      <TouchableOpacity onPress={()=>{
        setSelecteduri(images?.imgx)
        setOption(1)
        }}>
      <Image source={{uri:images?.imgx}}  placeholder={blurhash} contentFit="cover" style={styles.profileImage}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{
        setSelecteduri(images?.imgxx)
        setOption(1)
        }}>
      <Image source={{uri:images?.imgxx}}  placeholder={blurhash} contentFit="cover" style={styles.profileImage}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{
        setSelecteduri(images?.img) 
        setOption(1)}}
        >
      <Image  placeholder={blurhash}
        contentFit="cover" source={{uri:images?.img}} style={styles.profileImage}/>
      </TouchableOpacity>
    </View>
    )
  }else if(option==1){
   return (
   <View style={{ display:'flex',alignItems: 'center',justifyContent: 'center',marginBottom: 66}}>
     <Text style={{fontWeight:'bold'}}>Selected Profile Profile</Text>
    <TouchableOpacity style={{marginLeft:'auto',marginRight:'auto'}}>
    <Image source={{uri:selecturi}} style={{...styles.profileImage,marginVertical:10}}/>
    </TouchableOpacity>
    <Text style={{fontWeight:'bold'}}>Luzind Douglas</Text>
  </View>)
  }else if(option==2){
    return(
      <View>
        <View style={{display:'flex',alignItems: 'center',flexDirection:'row'}}>
        <RadioButton value="first" status={ checked === 'first' ? 'checked' : 'unchecked' } onPress={() => {
          setChecked('first')
          setAmount(5000)
      }}/>
        <Text style={{fontWeight:'800'}}>1 week for USh 5K</Text>
      </View>
    <View style={{display:'flex',alignItems: 'center',flexDirection:'row'}}>
      <RadioButton value="second" status={ checked === 'second' ? 'checked' : 'unchecked' } onPress={() =>{
         setChecked('second')
         setAmount(10000)
         }}/>
      <Text style={{fontWeight:'800'}}>1 Month for USh 20k</Text>
    </View>
    </View>
    )
  }else if(option==3){
    return(
    <View>
      <Text>ENTER MTN/AIRTEL NUMBER TO PROCESS PAYMENT</Text>
      <View>
        {invalid && <Text>Invalid phone number, use 10 digits</Text>}
     <TextInput value={phone} onChangeText={(text)=>setPhone(text)} style={styles.input} type="Number" keyboardType="phone-pad" placeholder='Phone Number to charge eg 078...'/>
      </View>
    </View>
    )
  }else if(option==4){
    return(
    <View>
      <Text style={{fontSize:20, color:'lightgreen'}}>Profile Successfully Promoted</Text>
    </View>
    )
  }else if(option==5){
    return(
    <View>
      <Text style={{fontSize:20, color:'red'}}>Something went wrong, please try again</Text>
    </View>
    )
  }else if(option==6){
    return(
    <View>
      <Text style={{fontSize:20, color:'pink'}}>Incorrect Phone Number</Text>
    </View>
    )
  }

}
const paymentButoon = ()=>{
  if(option < 10){
    return(
      <>
  { enabled ? 
  <TouchableOpacity style={styles.boostButton} onPress={()=>handlePromote()}>
  <Text style={styles.boostButtonText}>{finish ? "Next":"Pay"}</Text>
  </TouchableOpacity>
  :
  <View>
  <ActivityIndicator size="large" color={loadingColor = '#000000'} />
  <Text>Processing Payment, Please enter your pin when the mobile money prompt arrives</Text>
  </View>
   }
  </>)
  }else{
    if(value=="first"){
      setValue(10000)
      return(
        <TouchableOpacity style={styles.boostButton}>
        <Text style={styles.boostButtonText}>Pay 10k</Text>
      </TouchableOpacity>
      )
    }else{
      setValue(25000)
      return(
        <>   
        <TouchableOpacity style={styles.boostButton}>
          <Text style={styles.boostButtonText}>Pay 25k</Text>
        </TouchableOpacity>
        </>
      )
    }
  }
}
  return (
    <Modal
      isVisible={isVisible}
      swipeDirection="down"
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
      {!enabled && <TouchableOpacity style={styles.closeButton} onPress={()=>{
          onClose()
          setOption(0)
          }}>
          <Text style={{fontWeight:'bold',fontSize:18,color:COLORS.pink}}>cancel</Text>
        </TouchableOpacity>}
        <Text style={styles.title}>Boost Your Profile</Text>
        {displayOptions()}

        {paymentButoon()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  profileImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 96,
    flexWrap:'wrap'
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  boostText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#777',
    width:'100%'
  },
  boostButton: {
    backgroundColor: COLORS.pink,
    paddingVertical: 16,
    borderRadius: 8,
  },
  boostButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  momo:{
    height:120,
    width:120,
    marginHorizontal:10,
    marginVertical:0,
  },
  mobilemoney:{
    display:'flex',
    flexDirection: 'row',
    borderWidth:1,
    borderColor: 'gray',
    borderStyle:'solid',
    borderRadius:10,
    flexWrap:'wrap',
    marginVertical:10,
    alignItems:'center',
  },
  mobilemoneyx:{
    display:'flex',
    flexDirection: 'row',
    borderWidth:1,
    borderColor: 'gray',
    borderStyle:'solid',
    borderRadius:10,
    flexWrap:'wrap',
    marginVertical:10,
    alignItems:'center',
    backgroundColor:COLORS.pink
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    marginVertical:10
  },
});

export default BoostProfileBottomSheet;
