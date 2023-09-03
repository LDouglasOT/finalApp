import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../assets/Config/colors';
import { AntDesign } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import { PostMomentPopup } from '../components';
import MatchContext from '../ContextApi/MatchContext'
import { useContext } from 'react';
import LoginContext from '../ContextApi/AppContext'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Carousel from 'react-native-reanimated-carousel';
import 'react-native-gesture-handler'
import SpotlightShowcase from './SpotlightShowcase';
import RenderProfile from '../components/RenderProfile';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SnackBar from 'react-native-snackbar-component'

const Omege = ({ navigation }) => {
  const isFocused = useIsFocused()
  const { change_post, moment } = useContext(MatchContext)
  const { online } = useContext(LoginContext)
  const [onlineusers, setOnlineusers] = useState([])
  const [localdata, setLocaldata] = useState([])
  const [promoted, setPromoted] = useState([])
  const [message, setMessage] = useState(false)
  const [tag, setTag] = useState("")


  useEffect(() => {
    async function fetchOnline() {
      let onlineuser = []
      online.map((user) => {
        onlineuser.push(user.userId)
      })

      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      setLocaldata(data)
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("http://192.168.18.14:3001/api/random", { 'gender': data.gender, "users": onlineuser }, { headers: headers })

      if (res.status == 200) {
        console.log(res.data)
        setOnlineusers(res.data)
      }
    }
    fetchOnline()

    async function getPromoted() {
      const userdata = JSON.parse(await AsyncStorage.getItem("credentials"))
      const data = {
        "gender": userdata.gender
      }
      const datax = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = datax.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const promoted = await axios.post("http://192.168.18.14:3001/api/promoted", data, { headers: headers })
      if (promoted.status == 200) {
        setPromoted(promoted.data)
      }
    }

    getPromoted()
  }, [isFocused])
  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
      app_id: 10140,
      app_token: 'drpVcF7TNyQVJ8WceIm3ou',
      screenName: 'Active users page'
    });
  });

  const showSnackbar = (message) => {
    setTag(message)
    setMessage(true)
    setTimeout(() => {
      setMessage(false)
    }, 3000)
  };
  const gotoProfile = (data) => {
    navigation.navigate("Profiling")
  }
  const addPopup = () => {
    navigation.navigate("Gifts")
  }
  return (
    <ScrollView style={{ flex: 1 }}>
      <TopBar
        onFilterPress={() => console.log('Filter pressed')}
        onProfilePress={() => console.log('Profile pressed')}
        title="Luzinda Douglas"
        subtitle="online"
        button="btn"
        addPopup={addPopup}
        gotoProfile={() => navigation.navigate("Profiling")}
      />
      <SpotlightShowcase navigation={navigation} promoted={promoted} localdata={localdata} showSnackbar={(msg) => showSnackbar(msg)} />
      <Text style={styles.onlineText}>Online Users</Text>

      <FlatList
        data={onlineusers}
        renderItem={({ item }) => (<RenderProfile navigation={navigation} item={item} localdata={localdata} showSnackbar={(msg) => showSnackbar(msg)} />)}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
      <SnackBar position="top" visible={message} textMessage={tag} actionText="Nice!!" />
    </ScrollView>
  )
}

export default Omege

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 5
  },
  boostedProfileContainer: {
    width: '50%',
    height: 100,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginHorizontal: 2
  },
  boostedProfileName: {
    color: 'white',
    fontWeight: '800',
    top: 0,
    zIndex: 9999,
    fontSize: 18
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
  },
  sectionTitle: {
    marginTop: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 20
  },
  boostedImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  profileHead: {
    fontSize: 25,
    marginRight: 'auto',
    color: 'white',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  containerize: {
    flex: 1,
    padding: 8,
  },
  bghandler: {
    backgroundColor: COLORS.pink,
    padding: 11,
    width: '100%',
    borderRadius: 18,
    height: 350,
    display: 'flex',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineText: {
    marginLeft: 20,
    fontSize: 20,
    marginTop: 20,
    color: 'gray',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    textDecorationStyle: "underline"
  },
  boostedProfilesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    width: '100%',
    height: 230,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
    zIndex: 999,
  },
})