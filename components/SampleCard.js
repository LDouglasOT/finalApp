import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../assets/Config/colors';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import Lottie from 'lottie-react-native';
import LoginContext from '../ContextApi/AppContext';
import { useContext } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const DatingAppCard = ({ item, navigate, id, gotoProfile }) => {
  const [image, setImage] = useState(item.Profilepic)
  const [status, setStatus] = useState(false)
  const IsFocused = useIsFocused()
  const [checkonline, setCheckonline] = useState([])
  const [conversation, setConversation] = useState([])

  useEffect(() => {
    setImage(item.imgx ?? item.imgxx ?? item.imgxxx ?? item.imgxxxx ?? "https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7");
  }, [0])

  const [like, setLiked] = useState(false)
  const { online, sockets } = useContext(LoginContext)

  const Like = async () => {
    try {
      setLiked(true)
      console.log("initiated")
      const data = {
        "userId": id, "likedId": item.id
      }
      const user = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = user.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post("http://192.168.18.14:3001/api/like", data, { headers })
      if (response.status == 200) {

        let liked = JSON.parse(await AsyncStorage.getItem("likedProfiles")) || [];
        liked.push(item.id.toString()); // Convert moment.id to string before pushing
        await AsyncStorage.setItem('likedProfiles', JSON.stringify(liked));
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    const checkLiked = async () => {
      try {
        const liked = JSON.parse(await AsyncStorage.getItem("likedProfiles")) || []
        console.log(liked)
        if (liked.includes(item.id.toString())) {
          setLiked(true)
        }
      } catch (err) {
        console.log(err.message)
      }
    }
    checkLiked()
    const checkOnline = async () => {
      console.log(item.id)
      const checkusers = online.some(obj => obj.userId === item.id);
      // console.log(".....................................")
      console.log(checkusers.userId)
      if (checkusers) {
        setStatus(true)
      }
    }
    checkOnline()
  }, [sockets])

  useEffect(() => {
    sockets.on("getUsers", () => {
      console.log("checking online users")
      checkOnline()
    })
  }, [sockets])

  useEffect(() => {
    checkOnline();
  }, [online]);

  const checkOnline = async () => {
    console.log(item.id)
    const checkusers = online.filter(usersonline => usersonline.userId === item.id)
    // console.log(".....................................")
    console.log(checkusers)
    if (checkusers) {
      setStatus(true)
    }
  }

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => gotoProfile(item)}>
      <Image style={styles.image} source={{ uri: image }} />
      <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.5)']} style={styles.gradient} />
      <View style={styles.detailsContainer}>
        <View style={styles.profileContainer}>
          <View>
            <View style={styles.namewrapper}>
              <Text style={styles.name}>{item.FirstName}</Text>
              {status ? <Octicons name="dot-fill" size={24} color="#00f541" /> : <Octicons name="dot-fill" size={24} color="#57807E" />}
            </View>
          </View>
          <View style={{ display: 'flex', alignContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Entypo name="location-pin" size={24} color="red" />
            <Text style={styles.location}>{item.District}</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonx} onPress={() => navigate(item, id)} >
            <Text style={styles.buttonText}>send Message</Text>
          </TouchableOpacity>

          {!like ? <TouchableOpacity style={styles.button} onPress={() => Like()}>

            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
            :
            <View style={styles.buttonxx}>
              <Text style={styles.buttonText}>Liked</Text>
            </View>
          }
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  namewrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  name: {
    fontSize: 25,
    fontWeight: '700',
    color: '#ffdd00'
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 5,
    marginBottom: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    width: '97%',
    height: 500,
    marginHorizontal: 'auto',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  detailsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16

  },
  // button: {
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   borderColor: '#999',
  //   borderRadius: 48,
  //   borderWidth: 2,
  //   height: 64,
  //   justifyContent: 'center',
  //   width: 64,
  // },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  buttonx: {
    // width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'white'
  },
  buttonxx: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.pink,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.pink
  }
});

export default DatingAppCard;
