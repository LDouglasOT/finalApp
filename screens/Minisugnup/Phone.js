import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import LottieView from 'lottie-react-native';
import { ToastAndroid } from "react-native"
import IncorrectModal from '../../components/IncorrectModal'
import axios from 'axios';

const Phone = ({ changestate, changecodestate, ChangeCodErrorName, settingReason, signupchange, settingPhoneNumber }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [signupProgress, setSignupProgress] = useState(0);
  const [error, setError] = useState(false)
  const [reason, setReason] = useState("Something went wrong")
  const [coderror, setCodeError] = useState("Something went wrong")
  const phoneverify = async () => {
    const data = {
      "PhoneNumber": phoneNumber
    }
    if (phoneNumber.length < 9) {
      ToastAndroid.showWithGravity(
        "Phone number must be alteast 9 characters in the format 0781211111 or 256781211111",
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
      return
    }
    if (phoneNumber.length > 10) {
      ToastAndroid.showWithGravity(
        "Phone number must be 10 characters in the format 078121....",
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
      return
    }
    try {
      changestate(true)
      const res = await axios.post("http://192.168.100.57:3001/api/generateotp", data)

      if (res.status == 200) {
        changestate(false)
        settingReason(res.data.message)
        ChangeCodErrorName(res.data.head)
        changecodestate(true)
        setTimeout(() => {
          settingPhoneNumber(phoneNumber)
          changecodestate(false)
          signupchange()
        }, 4000)
      }
      if (res.status !== 200) {
        changestate(false)
        settingReason(res.data.message)
        ChangeCodErrorName(res.data.head)
        changecodestate(true)
        setTimeout(() => {
          changecodestate(false)
        }, 4000)
        return
      }
    } catch (err) {

      console.log(err.message)
      settingReason("Something is wrong and we are working very hard to fix it.")
      ChangeCodErrorName("Something went wrong.")
      changecodestate(true)
      changestate(false)
      setTimeout(() => {
        changecodestate(false)
      }, 5000)
      return
    }
  }

  const handleNextStep = async () => {
    if (signupProgress == 0) {
      await phoneverify()
    }

  };

  return (
    <View style={styles.stepContainer}>
      <View style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#e91e63' }}>YoDate</Text>
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, }}>Phone Number Verification:</Text>
      </View>
      <IncorrectModal visible={error} code={coderror} reason={reason} />
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Phone Number"
          placeholderTextColor="#003f5c"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={() => handleNextStep()}>
        <Text style={styles.loginText}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Phone

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: "100%",
    height: "100%"
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputView: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
    elevation: 10
  },
  inputText: {
    height: 50,
    color: '#003f5c',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
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
    elevation: 2,
    bottom: 0
  },
})