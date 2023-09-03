import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Modal, StyleSheet, Text } from 'react-native';
import Picker from './Picker';
import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useContext } from 'react'
import MatchContext from '../ContextApi/MatchContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
// import 



const PostMomentPopup = ({ moment, onClose, onPostMoment, getMoments }) => {
  const [picture, setPicture] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [wording, setWording] = useState('');
  const { change_post } = useContext(MatchContext)
  const [images, setImages] = useState([])
  const [posting, setPosting] = useState(false)
  useEffect(() => {

  }, [0])

  const handlePostMoment = ({ handleHide }) => {
    onPostMoment(picture, hashtag, wording);
    setPicture('');
    setHashtag('');
    setWording('');
    onClose();
  };
  const proceed = async () => {
    setPosting(true)
    try {
      // let user = await AsyncStorage.getItem("credentials")
      const user = JSON.parse(await AsyncStorage.getItem("credentials"))
      const data = {
        "ownerid": user.id,
        "hashtag": hashtag,
        "tagline": wording,
        "images": images
      }
      const authToken = user.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post("http://192.168.18.14:3001/api/moments", data, { headers })
      console.log(response.status)
      if (response.status == 201) {
        setPosting(false)
        console.log(response.status)
        change_post(false)
        getMoments()
      }

    } catch (err) {
      setPosting(false)
      console.log(err.message)
    }
    setPosting(false)
  }
  const appendImg = (img) => {
    setImages([...images, img])
  }

  return (
    <Modal visible={moment} animationType="slide">
      <View style={styles.container}>
        <View style={{ backgroundColor: 'white', width: '100%', height: '100%' }}>
          <TouchableOpacity onPress={() => change_post(false)} style={{ marginLeft: 'auto' }} >
            <AntDesign name="close" size={30} color="black" />
          </TouchableOpacity>
          <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Picker appendImg={appendImg} />
            <Picker appendImg={appendImg} />
            <Picker appendImg={appendImg} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Hashtag eg. #ComingHome"
            value={hashtag}
            onChangeText={setHashtag}
          />
          <TextInput
            style={styles.input}
            placeholder="zing eg. a glorious journey"
            value={wording}
            onChangeText={setWording}
          />
          {posting && <LottieView
            source={require('../assets/Lottie/97443-loading-gray.json')}
            autoPlay
            loop
          />
          }
          <TouchableOpacity style={styles.loginBtn} onPress={() => proceed()}>
            <Text style={styles.inputText}>Post Moment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'green',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 4,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  loginBtn: {
    width: '100%',
    backgroundColor: '#e91e63',
    borderRadius: 25,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    elevation: 10
  },
  inputText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default PostMomentPopup;
