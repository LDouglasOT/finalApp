import React, { useState, useEffect } from 'react';
import { View, Animated, Text, FlatList, Image, TouchableOpacity, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios"
import { Loader } from '../components';
import { AntDesign } from '@expo/vector-icons';


const WithdrawPage = ({ navigation }) => {
  const [selectedGift, setSelectedGift] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [gifts, setGifts] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedGiftInfoVisible, setSelectedGiftInfoVisible] = useState(false);
  const [myGiftsLoading, setMyGiftsLoading] = useState(false)
  const [global, setGlobal] = useState(null)
  const fetchMyGifts = async () => {
    try {
      setMyGiftsLoading(true)
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      setGlobal(data)
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.get(`https://yodatebackend.tech/api/getusergifts/${data.id}`, { headers: headers })
      setTimeout(() => {
        setMyGiftsLoading(false)
      }, 5000)
      if (response.status == 200) {
        setMyGiftsLoading(false)
        console.log(response.data)
        setGifts(response.data)
      }
    } catch (err) {
      console.log(err.message)
      setMyGiftsLoading(false)
    }
  }
  useEffect(() => {
    fetchMyGifts()
  }, []);

  useEffect(() => {
    if (selectedGift) {
      setWithdrawAmount(selectedGift.Value * quantity);
    }
  }, [selectedGift, quantity]);


  const handleGiftSelect = (gift) => {
    setSelectedGift(gift);
    setSelectedGiftInfoVisible(true); // Slide in the selected gift information
  };

  const handleGiftDeselect = () => {
    setSelectedGift(null);
    setSelectedGiftInfoVisible(false); // Slide out the selected gift information
  };
  const handleWithdraw = async () => {
    if (!selectedGift) {
      return;
    }

    // Simulate withdrawal process
    setLoading(true);
    const datadog = {
      "id": global.id,
      "name": selectedGift.Name,
      "qty": parseInt(quantity)
    }
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post("https://yodatebackend.tech/api/withdraw", datadog, { headers: headers })
      if (response.status == 200) {
        handleGiftDeselect()
        setLoading(false)
        alert(`Withdrawal successful! You've withdrawn ${quantity} ${selectedGift.Name}(s), credit will reflect on your mobile money in less than 30 minutes`);
        fetchMyGifts()
      } else if (response.status == 201) {
        handleGiftDeselect()
        setLoading(false)
        alert(response.data.message);
      }
    } catch (err) {
      alert(`Something went wrong, please try again`);
      handleGiftDeselect()
      setLoading(false)
      console.log(err)
    }
  };


  const renderGiftItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.giftItem, selectedGift === item && styles.selectedGiftItem]}
      onPress={() => handleGiftSelect(item)}
    >
      <Image source={{ uri: item.Image }} style={styles.giftImage} />
    </TouchableOpacity>
  );

  const emptystate = () => {
    return (
      <View>
        {myGiftsLoading ? <Loader /> : <Text>You have no gifts</Text>}
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, alignItems: "flex-start", justifyContent: 'flex-start', width: "100%", marginHorizontal: 20 }}>
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.pop()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Gift to Withdraw</Text>
      </View>
      <FlatList
        data={gifts}
        renderItem={renderGiftItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.giftList}
        ListEmptyComponent={emptystate}
      />
      {selectedGift && (
        <Animated.View style={[styles.selectedGiftInfo, { transform: [{ translateY: selectedGiftInfoVisible ? 0 : 500, },], },]}>
          <View style={{ width: "100%", display: 'flex' }}>
            <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={() => handleGiftDeselect()} style={{ marginLeft: 'auto', marginRight: 10 }}>
                <Text style={{ fontSize: 20, color: 'red' }}>Deselect</Text>
              </TouchableOpacity>
              <View></View>
              <View></View>
            </View>

            <Text style={styles.giftName}>{selectedGift.Name}</Text>
            <Text style={{ marginLeft: 'auto', marginRight: 'auto' }}>Value: {selectedGift.Value}                 QTY:{selectedGift.quantity}</Text>
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={quantity.toString()}
              onChangeText={(text) => setQuantity(parseInt(text) || 0)}
            />
            <Text style={{ marginLeft: 'auto', marginRight: 'auto' }}>Total Amount: {withdrawAmount}</Text>
            {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Button title="Withdraw" color="#FF0080" onPress={() => handleWithdraw()} />}
          </View>
        </Animated.View>
      )}


    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 20
  },
  giftList: {
    marginTop: 20,
  },
  giftItem: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  selectedGiftItem: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  giftImage: {
    width: '100%',
    height: '100%',
  },
  selectedGiftInfo: {
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // This is used for Android, but doesn't affect iOS
    padding: 20,
    borderRadius: 0,
    shadow: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Shadow color
      height: 10, // Adjust the height of the shadow as needed
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      elevation: 5, // Elevation for Android
    },
  },
  giftName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  quantityInput: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
});

export default WithdrawPage;
