import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity, Modal, TextInput, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../assets/Config/colors';
import { AntDesign } from '@expo/vector-icons';
import SnackBar from 'react-native-snackbar-component';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loader } from '../components';
import { useContext } from 'react'

const Gifts = ({ navigation }) => {
  const [selectedGift, setSelectedGift] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showsnack, setShowsnack] = useState(false);
  const [mygifts, setGifts] = useState([]);
  const [myGiftsLoading, setMyGiftsLoading] = useState(false)
  const [success, setSuccess] = useState(false);
  const [totalgifts, setTotalgifts] = useState([])

  useEffect(() => {
    const getGifts = async () => {
      try {
        setLoading(true)
        const datax = JSON.parse(await AsyncStorage.getItem("credentials"))
        const authToken = datax.token; // Replace this with your actual authorization token
        const headers = {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        };
        const response = await axios.get("http://192.168.100.57:3001/api/getgifts", { headers: headers })
        if (response.status == 200) {
          setLoading(false)
          console.log(response.data)
          setTotalgifts(response.data)
        }
      } catch (err) {
        setLoading(false)
        console.log(err.message)
      }
    }
    getGifts()
    fetchMyGifts()
  }, [0])

  const handleGiftClick = (gift) => {
    setSelectedGift(gift);
    setQuantity(1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };
  const fetchMyGifts = async () => {
    try {
      setMyGiftsLoading(true)
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.get(`http://192.168.100.57:3001/api/getusergifts/${data.id}`, { headers: headers })
      if (response.status == 200) {
        setMyGiftsLoading(true)
        setGifts(response.data)
      }
    } catch (err) {
      setMyGiftsLoading(false)
    }
  }

  const handlePayment = async () => {
    if (phoneNumber == "" || phoneNumber.length < 9) {
      setShowsnack(true);
      setTimeout(() => {
        setShowsnack(false);
      }, 3000)
      return
    }
    setLoading(true);
    const payload = {
      "amount": selectedGift.Value,
      "phone": phoneNumber,
      "qty": quantity,
      "reason": `${quantity} ${selectedGift.Name} purchase for ${phoneNumber} at ${new Date()}`,
      "name": selectedGift.Name,
      "myid": selectedGift.id,
      "imgrurl": selectedGift.Image
    }
    console.log(payload)
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post("http://192.168.100.57:3001/api/buyingift", payload, { headers: headers })
      if (response.status == 201) {
        setLoading(false);
        setSuccess(false)
        setSelectedGift(null)

      }

    } catch (err) {
      setShowsnack(false);
      setLoading(false);
      console.log(err.message)
    }
  };

  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
      app_id: 10140,
      app_token: 'drpVcF7TNyQVJ8WceIm3ou',
      screenName: 'Gifts Page'
    });
  });



  return (
    <ScrollView>

      <View style={styles.container}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ color: COLORS.faint, marginVertical: 10, marginLeft: 15 }}>YOUR AVAILABLE GIFTS</Text>
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => navigation.navigate("WithdrawPage")}>
            <Text style={{ color: COLORS.pink, fontSize: 20 }}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View>
          {mygifts.length > 0 ? <ScrollView horizontal={true}>
            {mygifts.map((item, i) => (
              <View key={i} onPress={() => handleGiftClick(item)} style={styles.giftItemContainer}>
                <Image source={{ uri: item.Image }} style={styles.giftImage} />
                <Text style={styles.giftName}>{item.Name}</Text>
                <Text style={styles.giftPrice}>{item.quantity}</Text>
              </View>
            ))}
          </ScrollView> : <View>
            {myGiftsLoading ? <ActivityIndicator size="large" color={loadingColor = '#000000'} /> : <Text style={{ marginVertical: 30 }}>You have no gifts yet</Text>}
          </View>

          }
        </View>

        <Text style={{ color: COLORS.faint }}>MARKETPLACE</Text>
        {loading ? <ActivityIndicator size="large" color={loadingColor = '#000000'} /> : <FlatList
          data={totalgifts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleGiftClick(item)} style={styles.giftItemContainer}>
              <Image source={{ uri: item.Image }} style={styles.giftImage} />
              <Text style={styles.giftName}>{item.Name}</Text>
              <Text style={styles.giftPrice}>{item.Value} UGX</Text>
            </TouchableOpacity>
          )}
        />}

        <Modal visible={selectedGift !== null} onRequestClose={() => setSelectedGift(null)} style={styles.modalContainer}>
          {selectedGift && (
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalClose} onPress={() => {
                setLoading(false)
                setSelectedGift(null);
              }}>

                <Text style={{ fontSize: 20, color: COLORS.pink, fontWeight: 600 }}>CLOSE</Text>
              </TouchableOpacity>
              <Image source={{ uri: selectedGift.Image }} style={{ width: 200, height: 200 }} />
              <Text style={styles.totalPrice}>{selectedGift.Name}</Text>
              <Text style={styles.totalPrice}>{selectedGift.Value} UGX</Text>
              <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', marginVertical: 10, marginHorizontal: 'auto' }}>
                <TouchableOpacity onPress={handleDecreaseQuantity}>
                  <AntDesign name="plussquare" size={34} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity onPress={handleIncreaseQuantity}>
                  <AntDesign name="plussquare" size={34} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={styles.totalPrice}>Total Price: {selectedGift.Value * quantity} UGX</Text>
              <TextInput
                placeholder="Enter phone number"
                value={phoneNumber}
                style={styles.phoneNumberInput}
                maxLength={10}
                editable
                onChangeText={text => setPhoneNumber(text)}
              />
              {loading ? <ActivityIndicator size="large" color={loadingColor = '#000000'} /> : <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {success ? <Text style={{ fontSize: 20, color: "lightgreen" }}>Successfully Purchased {quantity} {selectedGift.Name}</Text>
                  :
                  <TouchableOpacity onPress={() => handlePayment()} style={styles.progressbtn}>
                    <Text style={{ color: "white" }}>BUY</Text>
                  </TouchableOpacity>}
              </View>}
              <SnackBar position="bottom" visible={showsnack} textMessage={"Phone number invalid or empty"} />
            </View>
          )}
        </Modal>

      </View>
    </ScrollView>
  )
}

export default Gifts

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  progressbtn: {
    backgroundColor: COLORS.pink,
    width: '90%',
    paddingVertical: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  giftItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 4, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
  },
  giftImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  giftName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  giftPrice: {
    fontSize: 14,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 8, // For iOS shadow
    shadowOffset: { width: 0, height: 4 },
    display: "flex",
    alignItems: 'center',
    justifyContent: 'center'
    // For iOS shadow
  },
  giftImageModal: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  giftNameModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  giftPriceModal: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityText: {
    fontSize: 26,
    marginHorizontal: 16,
  },
  quantityInput: {
    width: 50,
    paddingHorizontal: 5,
    paddingVertical: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.fadedbg,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  phoneNumberInput: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 5,
    height: 45
  },
  payButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  loaderText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
  },
  modalClose: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginRight: 'auto'
  }
});
