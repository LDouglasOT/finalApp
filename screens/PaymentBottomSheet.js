import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import COLORS from '../assets/Config/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const PaymentBottomSheet = ({ isVisible, onClose, onSubmitPayment }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [numofmonths, setNumOfMonths] = useState(1);
  const [incorrect, setIncorrect] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handlePay = async () => {
    try {
      if (
        phoneNumber.startsWith('0') &&
        phoneNumber.length === 9
      ) {
        setIncorrect(true);

        setTimeout(() => {
          setIncorrect(false);
        }, 3000);
        return;
      }
      if (phoneNumber.length < 9 || phoneNumber.length > 12) {
        setIncorrect(true);

        setTimeout(() => {
          setIncorrect(false);
        }, 3000);
        return;
      }
      const data = {
        amount: numofmonths * 5000,
        phone: phoneNumber,
        numofmonths: numofmonths,
      };
      const user = JSON.parse(
        await AsyncStorage.getItem('credentials')
      );
      const authToken = user.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      setLoading(true);
      const req = await axios.post(
        'http://192.168.100.57:3001/api/subscribe',
        data,
        { headers: headers }
      );
      if (req.status === 200) {
        setLoading(false);
        setIsChecked(true)
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setIsChecked(true);

      console.log(err.message);
    }
  };

  const handleIncrement = () => {
    setNumOfMonths(numofmonths + 1);
  };
  const handleDecrement = () => {
    if (numofmonths === 1) {
      return;
    }
    setNumOfMonths(numofmonths - 1);
  };
  if (isChecked) {
    return (
      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View contentContainerStyle={styles.container}>
            <LottieView
              source={require('../assets/Lottie/animation_ll6lpdml.json')}
              autoPlay
              loop={false}
              style={{ height: 300, width: 300, top: 10 }}
              onAnimationFinish={() => {
                setIsChecked(false)
                onClose()
              }}
            />
          </View>
        </View>
      </Modal>
    )
  }
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalBackground}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Yodate Payment</Text>
          <Text style={styles.amount}>UGX {numofmonths * 5000}</Text>
          <View style={styles.numOfMonthsContainer}>
            <TouchableOpacity
              onPress={handleDecrement}
              style={styles.numOfMonthsButton}
            >
              <Entypo name="minus" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.numOfMonths}>{numofmonths}</Text>
            <TouchableOpacity
              onPress={handleIncrement}
              style={styles.numOfMonthsButton}
            >
              <Entypo name="plus" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <Text style={{ marginVertical: 5 }}>{numofmonths} Month/s - {numofmonths * 5000}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number to charge"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
            keyboardType="phone-pad"
          />
          {incorrect && (
            <Text style={styles.errorText}>
              Enter correct phone number
            </Text>
          )}
          <View style={styles.additionalFeatures}>
            <Text style={styles.featureText}>
              Comes with 2 Virtual Flowers that can be gifted to
              anyone redeemable as mobile money cash.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePay}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="white"
              />
            ) : (
              <Text style={styles.payButtonText}>Pay</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    width: '80%',
    Height: '90%',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  numOfMonthsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  numOfMonthsButton: {
    padding: 10,
  },
  numOfMonths: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    marginBottom: 20,
  },
  additionalFeatures: {
    marginVertical: 20,
  },
  featureText: {
    color: '#007bff',
    textAlign: 'center',
  },
  payButton: {
    backgroundColor: '#FF0080',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PaymentBottomSheet;
