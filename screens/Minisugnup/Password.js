import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ToastAndroid } from "react-native"
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'


const Password = ({ phoneNumber, ResendOtp, Phonex, signupchange, changestate, changecodestate, ChangeCodErrorName, settingReason, navigation }) => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState('');

  const validatePasswords = () => {
    if (password === confirmPassword) {
      return true
    } else {
      return false
    }
  };

  const registerpass = async () => {
    const data = {
      "phoneNumber": phoneNumber,
      "password": password
    }
    if (!validatePasswords()) {
      ToastAndroid.showWithGravity(
        "Passwords donot match, please retype your correct passwords",
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
      return
    }
    if (password.length < 8) {
      ToastAndroid.showWithGravity(
        "Password must be 8 characters or above",
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
      return
    }
    if (!(password === confirmPassword)) {
      ToastAndroid.showWithGravity(
        "Passwords donot match, please",
        ToastAndroid.LONG,
        ToastAndroid.CENTER)
      return
    }
    try {
      changestate(true)
      const res = await axios.post("http://192.168.100.57:3001/api/signup", data)
      if (res.status == 201) {

        await AsyncStorage.setItem(
          'data',
          JSON.stringify(res.data),
        )
        changestate(false)
        navigation.navigate("ProfileDetails")
      }
    } catch (err) {
      changestate(false)
      settingReason(err.message)
      ChangeCodErrorName("Something went wrong.")
      changecodestate(true)

      setTimeout(() => {
        changecodestate(false)
      }, 4000)

    }
  }
  return (
    <View style={styles.stepContainer}>
      <View style={{ backgroundColor: 'white', display: 'flex', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 50, color: '#e91e63' }}>YoDate</Text>
      </View>
      <Text style={styles.label}>Create your new password:</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>

      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => registerpass()}
      >
        <Text style={styles.loginText}>Submit</Text>
      </TouchableOpacity>

    </View>
  )
}

export default Password

const styles = StyleSheet.create({
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
})