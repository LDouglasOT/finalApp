import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';

const ConfirmCode = ({ ResendOtp, signupchange, changestate, changecodestate, ChangeCodErrorName, settingReason, Phonex }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [reason, setReason] = useState("Something went wrong")
  const [coderror, setCodeError] = useState("Something went wrong")
  const verifyCodeSent = async () => {
    const data = {
      "token": verificationCode,
      "PhoneNumber": Phonex
    }
    try {
      changestate(true)
      const res = await axios.post("http://192.168.100.57:3001/api/verifyotp", data)
      if (res.status == 200) {
        changestate(false)
        changestate(false)
        ChangeCodErrorName(res.data.head)
        settingReason(res.data.message)
        changecodestate(true)
        setTimeout(() => {
          signupchange()
          changecodestate(false)
        }, 3000)

      } else if (res.status == 201) {
        changestate(false)
        ChangeCodErrorName(res.data.head)
        settingReason(res.data.message)
        changecodestate(true)
        setTimeout(() => {
          changecodestate(false)
        }, 3000)
      }
    } catch (err) {
      console.log(err.message)
      changestate(false)
      ChangeCodErrorName("Something went wrong")
      settingReason("Something went wrong, please retry")
      changecodestate(true)
      setTimeout(() => {
        changecodestate(false)
      }, 3000)
    }
  }

  return (
    <View style={styles.stepContainer}>
      <View style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#e91e63' }}>YoDate</Text>
      </View>
      <View>
        <Text style={styles.label}>Enter verification code:</Text>
        <View>
          <TextInput style={styles.codeInput} onChangeText={(text) => setVerificationCode(text)} keyboardType="numeric" maxLength={6} />
        </View>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={() => verifyCodeSent()}>
        <Text style={styles.loginText}>CONTINUE</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 20 }}>

        <TouchableOpacity onPress={() => phoneverify()}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#003f5c', textDecorationLine: 'underline', }}>Resend OTP Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ConfirmCode

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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  codeInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: 250,
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