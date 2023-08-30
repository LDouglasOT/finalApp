import React, { useState,useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Image, Button, ScrollView, StyleSheet, FlatList, Dimensions } from 'react-native';
import { ActivityIndicator } from 'react-native';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';
import { COLORS } from '../assets/Config/colors';
import MessageContext from '../ContextApi/MessageContext';
import { useContext } from 'react'
const screenWidth = Dimensions.get('window').width;


const GiftPopup = ({ onClose,handleSendGiftExternal,isSendingGift,navigation,giftError,errmessage }) => {

  const [selectedGift, setSelectedGift] = useState(null);
  const [giftQuantity, setGiftQuantity] = useState(1);
  const [myGiftsLoading,setMyGiftsLoading] = useState(false)
  const [sampleGifts,setsampleGifts] = useState([])
  const { fetchConversations } = useContext(MessageContext)
 

  const handleGiftSelection = (gift) => {
    setSelectedGift(gift);
  };
  useEffect(()=>{
    fetchMyGifts()
  },[])
  const fetchMyGifts = async() =>{
    try{
    setMyGiftsLoading(true)
    const data = JSON.parse(await AsyncStorage.getItem("credentials"));
    const user = JSON.parse(
      await AsyncStorage.getItem('credentials')
    );
    const authToken = user.token; // Replace this with your actual authorization token

    const headers = {
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.get(`http://192.168.18.5:3001/api/getusergifts/${data.id}`,{headers})
    if(response.status == 200){
      setMyGiftsLoading(false)
      setsampleGifts(response.data)
    }
    }catch(err){
      setMyGiftsLoading(false)
    }
  }

  const handleSendGift = async() => {  
    let gift = await handleSendGiftExternal(selectedGift,giftQuantity)
    if(gift){
      fetchMyGifts()
    }

  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleGiftSelection(item)}>
      <View style={styles.giftItem}>
        <Image source={{uri:item.Image}} style={styles.giftItemImage} />
        <Text style={styles.giftItemName}>{item.quantity} {item.Name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal isVisible={false} animationType="slide" transparent={true} style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
      <TouchableOpacity onPress={()=>onClose()}>
       <Text style={{color:'red',fontStyle:"bold",fontSize:20}}>Cancel</Text>
      </TouchableOpacity>   
      {selectedGift && <TouchableOpacity onPress={()=>setSelectedGift(null)}>
       <Text style={{color:'red',fontStyle:"bold",fontSize:20}}>Back</Text>
      </TouchableOpacity>}   
      </View>
      {selectedGift ? (
          <View>
            <Image source={{uri:selectedGift.Image}} style={styles.selectedGiftImage} />
            <Text style={styles.selectedGiftName}>{selectedGift.Name}</Text>
            <View style={styles.quantityContainer}>
              <Button title="-" color="#FF0080" onPress={() => setGiftQuantity(Math.max(1, giftQuantity - 1))} />
              <Text style={styles.quantityText}>{giftQuantity}</Text>
              <Button title="+" onPress={() => setGiftQuantity(giftQuantity + 1)} color="#FF0080" />
            </View>
            {isSendingGift ? (
              <ActivityIndicator size="large" color="#FF0080"/>
            ) : (
            <Button title="Gift" onPress={()=>handleSendGift(selectedGift)} color="#FF0080" />)
            }
            {giftError && <Text style={{color:"red",fontSize:25,marginTop:10}}>{errmessage}</Text>}
          </View>
        ) : (
          <FlatList
            data={sampleGifts}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.giftsList}
            ListEmptyComponent={()=>(
              <View>
              {myGiftsLoading ? <Loader/>:<Text style={{marginVertical:20}}>No Gifts available</Text>}
              <Button title="Goto Gifts Shop" onPress={()=>{
                onClose()
                navigation.navigate("Gifts")}
              } color="#FF0080" />
              </View>
            )}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    height:"80%",
    left:20,
    top:50,
    // backgroundColor:"green",
    marginHorizontal:"auto"
  },
  selectedGiftImage: {
    width: 120,
    height: 120,
    borderRadius:10,
    alignSelf: 'center',
  },
  selectedGiftName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 15,
  },
  giftsList: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  giftItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: screenWidth / 2 - 20,
  },
  giftItemImage: {
    width: 120,
    height: 120,
    borderRadius:10
  },
  giftItemName: {
    fontSize: 16,
    marginTop: 5,
  },
  giftItemQuantity: {
    color: 'gray',
  },
});

export default GiftPopup;
