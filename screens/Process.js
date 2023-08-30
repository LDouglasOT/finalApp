import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginPopup from '../components/LoginPopup';
import IncorrectModal from '../components/IncorrectModal';
import Phone from './Minisugnup/Phone';
import ConfirmCode from './Minisugnup/ConfirmCode';
import Password from './Minisugnup/Password';

const SignupProcess = ({navigation}) => {
  
  const [visible,setVisible] = useState(false)
  const [error,setError] = useState(false)
  const [signupProgress,setsignupProgress]=useState(0)
  const [coderror,setCodeError]=useState("Something went wrong")
  const [reason,setReason]=useState("Something went wrong")

  const [Phonex,setPhone]=useState(null)
  const [PasswordCode,setPassword]=useState(null)

  const changestate=(state)=>{
    setVisible(state)
  }
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
  const signupchange=()=>{
    setsignupProgress(signupProgress+1)
  }
  const ResendOtp=()=>{
    setsignupProgress(signupProgress-1) 
  }
  return (
    <View style={{backgroundColor:"white",height:"100%"}}>
    <LoginPopup visible={visible}/>
    <IncorrectModal visible={error} code={coderror} reason={reason}/>
    {signupProgress === 0 && (
      <Phone changestate={changestate} settingPhoneNumber={(text)=>{setPhone(text)}} changecodestate={changecodestate} ChangeCodErrorName={ChangeCodErrorName} settingReason={settingReason} signupchange={signupchange}/>
    )}
    {signupProgress === 1 && (
    <ConfirmCode ResendOtp={ResendOtp}Phonex={Phonex} signupchange={signupchange} changestate={changestate} changecodestate={changecodestate} ChangeCodErrorName={ChangeCodErrorName} settingReason={settingReason}/>
    )}

    {signupProgress === 2 && (
    <Password navigation={navigation} phoneNumber={Phonex} ResendOtp={ResendOtp}Phonex={Phonex} signupchange={signupchange} changestate={changestate} changecodestate={changecodestate} ChangeCodErrorName={ChangeCodErrorName} settingReason={settingReason}/>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#e91e63',
    marginBottom: 40,
  },
});

export default SignupProcess