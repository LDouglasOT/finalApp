import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../assets/Config/colors';
import axios from 'axios';
import Lottie from 'lottie-react-native';
import LoginContext from '../ContextApi/AppContext';
import { useContext } from 'react'
import { useIsFocused } from '@react-navigation/native';


const Swipe = ({ item, navigate, id }) => {
  const [image, setImage] = useState("https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7")
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
      setLiked(!like)
      const data = {
        "userId": id, "likedId": item.id
      }
      const user = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = user.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post("http://192.168.100.57:3001/api/like", data, { headers })
      if (response.status == 201) {
      }
      if (response.status == 200) {
      }
    } catch (err) {
    }
  }
  useEffect(() => {
    sockets.on("getUsers", () => {
      checkOnline()
    })
  }, [sockets])

  useEffect(() => {
    checkOnline();
  }, [sockets, online]);
  const checkOnline = () => {
    if (online.length > 0) {
      const check = online.filter((items) => items.userId == item.id)
      if (check.length > 0) {
        setStatus(true)
      } else {
        setStatus(false)
      }
    }
  }

  setTimeout(() => {
    checkOnline()
  }, 50000)

  return (
    <View style={styles.container}>
      <Image resizeMode='cover' source={{ uri: image }} style={styles.Img} />
      <View style={styles.heartwrap}>
        <View></View>
        <TouchableOpacity onPress={() => Like()} style={styles.heart}>
          {like ? <Lottie source={require('../assets/Lottie/heart.json')} autoPlay /> : <FontAwesome name="heart" size={34} style={{ marginTop: 5 }} color="#301934" />}
        </TouchableOpacity>
      </View>

      <View style={styles.details}>
        <View style={styles.namewrapper}>
          <Text style={styles.name}>{item.FirstName}</Text>{status ? <Octicons name="dot-fill" size={24} color="#00f541" /> : <Octicons name="dot-fill" size={24} color="#57807E" />}
        </View>
        <TouchableOpacity onPress={() => navigate(item, id)} style={styles.messages}>
          <Ionicons name="chatbubble-ellipses" size={32} color="purple" />
        </TouchableOpacity>
      </View>
      <LinearGradient colors={['transparent', 'rgba(0,0,0.8,0.6)']} style={{ backgroundColor: "transparent", paddingHorizontal: 96, height: 90, borderRadius: 12, position: 'absolute', bottom: 0, width: '100%' }} />
    </View>
  )
}

export default Swipe

const styles = StyleSheet.create({
  heartwrap: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    width: '98%'
  },
  namewrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  heart: {
    position: 'absolute',
    backgroundColor: 'white',
    height: 48,
    width: 48,
    borderRadius: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    left: 10
  },
  messages: {
    backgroundColor: 'white',
    height: 45,
    width: 45,
    borderRadius: 30,
    display: 'flex',
    right: 6,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 10
  },
  details: {
    position: 'absolute',
    zIndex: 9999,
    width: '100%',
    top: '90%',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 35,
    fontWeight: '700',
    color: '#ffdd00'
  },
  Img: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 10,
    paddingTop: 5,
    borderRadius: 14
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    height: 500,
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 14,
    shadowColor: "#74858C",
    backgroundColor: 'yellow',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
})