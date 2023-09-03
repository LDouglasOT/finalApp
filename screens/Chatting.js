import { ActivityIndicator, StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { MessageComponent } from "../components"
import { SimpleLineIcons } from '@expo/vector-icons';
import { COLORS } from '../assets/Config/colors';
import axios from "axios"
import {
  wrapScrollView,
  useScrollIntoView,
} from 'react-native-scroll-into-view';
import LottieView from 'lottie-react-native';
import ScrollIntoView from 'react-native-scroll-into-view';
import { io } from "socket.io-client"
import { AntDesign } from '@expo/vector-icons';
import { SpecialScrollView, SpecialView } from 'react-native-scroll-to-element';
import LoginContext from '../ContextApi/AppContext';
import { useContext } from 'react'
import MessageContext from '../ContextApi/MessageContext';
import TopBar from '../components/TopBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GiftPopup from "../components/GiftPopup"
import { useIsFocused } from '@react-navigation/native';


const CustomScrollView = wrapScrollView(ScrollView);

const MainComponent = ({ navigation, route }) => {
  const { conversationId, userdata, credentials } = route.params;
  const [sms, setSms] = useState([])
  const [typing, setTyping] = useState(false)
  const inputRef = useRef(null);
  const socket = useRef()
  const [currentUser, setCurrentuser] = useState(userdata)
  const [arrivalsms, setArrivalsms] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const [typingHandler, setTypingHandler] = useState(null)
  const [gifting, setGifting] = useState(false)
  const { sockets } = useContext(LoginContext)
  const [content, setContent] = useState("")
  const scrollRef = useRef()
  const [sendingsms, setSendingsms] = useState(false)
  const [isSendingGift, setIsSendingGift] = useState(false)
  const [giftError, setGiftError] = useState(false)
  const isFocused = useIsFocused()
  const [errmessage, setErrmessage] = useState("You have insufficient gifts")
  useEffect(() => {
    setGifting(false)
  }, [])
  const { fetchConversations, MessagesId, changesms, messageaLoader, afterGift } = useContext(MessageContext)
  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
      app_id: 10140,
      app_token: 'drpVcF7TNyQVJ8WceIm3ou',
      screenName: 'Chatting'
    });
  });
  useEffect(() => {
    sockets.on("getGift", () => afterGift())
    if (!currentUser) {
      initialLoad()
    }

  }, [sockets])
  useEffect(() => {
    initialLoad()
  }, [isFocused])

  useEffect(() => {
    get_messages()
  }, [currentUser?.id])

  async function initialLoad() {
    try {
      await fetchConversations()
      console.log(conversationId)
      const userlogged = conversationId?.chatUser.filter((item) => item.id !== currentUser.id)
      setCurrentuser(userlogged[0])
      changesms(userlogged[0].id)
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    async function getsms() {
      sockets.on("getMessage", (msg) => {
        setSms((prev) => [...prev, ...msg])
      })
    }
    getsms()
  }, [sockets])


  useEffect(() => {
    sockets?.on("typingIndicator", (data) => {
      if (MessagesId == data.id) {
        setTyping(true)
      }
      // setTypingHandler(data)
    })
    sockets?.on("stoptypingIndicator", (data) => {
      if (MessagesId == data.id) {
        setTyping(false)
      }
    })
  }, [0])


  useEffect(() => {
    async function arrivals() {
      if (arrivalsms == null) {
        return
      }
      if (arrivalsms !== null) {
        setSms((prev) => [...prev, arrivalsms])
      }
    }
    arrivals()
  }, [arrivalsms])

  const fetchSent = (msg) => {
    const datanow = {
      "id": msg[0]?.id,
      "sms": msg[0]?.sms,
      "conversationId": msg[0]?.conversationId,
      "sender": msg[0]?.sender,
      "reciever": msg[0]?.reciever,
      "seen": false,
      "createAt": msg[0]?.createAt
    }
    setSms((prev) => [...prev, datanow])
  }

  const get_messages = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.get("http://192.168.18.14:3001/api/messages/" + conversationId.id, { headers: headers })
      if (response.status == 200) {
        setSms(response.data)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  const sendMessage = async () => {

    try {

      if (content == "") {
        return
      }
      console.log(conversationId)
      const messages_content = {
        "sender": credentials.id,
        "reciever": credentials.id,
        "sms": content,
        "conversationId": conversationId.id
      }
      const datanow = [{
        "id": sms.length + 1,
        "sms": content,
        "conversationId": conversationId.id,
        "sender": credentials.id,
        "reciever": credentials.id,
        "seen": true,
        "createAt": Date.now()
      }]

      setSms([...sms, ...datanow])
      setContent("")
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      let response = await axios.post("http://192.168.18.14:3001/api/messages/new", messages_content, { headers: headers })

      if (response.status == 200) {
        response = response.data
        const id = currentUser?.id
        sockets.emit("sendMessage", { response, id })
      }
    } catch (err) {
      console.log(err.message)
    }
  }


  const handleSendGiftExternal = async (gift, qty) => {
    const giftdata = {
      "name": gift.Name,
      "qty": qty,
      "user": currentUser?.id,
      "myid": credentials.id,
      "conversationId": conversationId.id,
      "img": gift.Image
    }
    console.log(giftdata)
    setIsSendingGift(true)
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("http://192.168.43.95:3001/api/giftpeople", giftdata, { headers: headers })
      if (res.status == 200) {
        setSms([...sms, res.data])
        setGifting(false)
        setIsSendingGift(false)
        sockets.emit("getGift", { id: currentUser.id })
        return "200"
      } else if (res.status == 404) {
        navigation.navigate("Gifts")
      }
    } catch (err) {
      console.log(err.message)
      setIsSendingGift(false)
      if (err.message == "Request failed with status code 404") {
        setGiftError(true)
        setTimeout(() => {
          setGiftError(false)
          navigation.navigate("Gifts")
        }, 2000)

      } else if (err.message == "Request failed with status code 500") {

        setGiftError(true)
        setTimeout(() => {
          setGiftError(false)
          setErrmessage("You don't have these gifts in your account")
        }, 2000)
      } else if (err.message == "Request failed with status code 400") {
        setGiftError(true)
        setTimeout(() => {
          setGiftError(false)
          setErrmessage("You have insufficient gifts")
        }, 2000)
      }

      // console.log(err.message)
    }
  }

  return (
    <View style={{ flex: 1 }}>

      <View style={{ display: 'flex', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fafafa', zIndex: 999, shadowColor: "#fafafa", shadowOffset: { width: 0, height: 0.5, }, shadowOpacity: 0.15, shadowRadius: 0.5, elevation: 5 }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <SimpleLineIcons name="arrow-left" size={24} color="black" style={{ left: 10 }} />
              <Image style={{ height: 35, width: 35, margin: 0, left: 10, borderRadius: 25, borderWidth: 1, borderColor: 'dodgerblue' }} source={{ uri: currentUser?.imgx }} />
            </View>
          </TouchableOpacity>
        </View>
        <View>
          <View style={{ display: 'flex', left: 28, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20 }}>{currentUser?.FirstName} {currentUser?.LastName}</Text>
            {typing && <Text style={{ fontSize: 10, color: COLORS.faint }}>Typing...</Text>}
          </View>
        </View>
        <View style={{ right: 11, position: 'absolute' }}>
          <TouchableOpacity onPress={() => setGifting(true)}>
            <AntDesign name="gift" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ marginTop: 50 }}></View>
      {messageaLoader ?
        <LottieView
          source={require('../assets/Lottie/10357-chat-typing-indicator.json')}
          autoPlay
          loop={true}
          style={styles.animation}
        />
        :
        <SpecialScrollView showsHorizontalScrollIndicator={false} style={styles.MessageWrapper}>
          {
            sms.map((message, key) => (
              <View key={key} ref={scrollRef}>
                <View style={{ padding: 5 }}>
                  <MessageComponent message={message} own={credentials.id === message.sender} />
                </View>
                <SpecialView focused>
                </SpecialView>
              </View>
            ))
          }
        </SpecialScrollView>
      }
      {!messageaLoader &&
        <View style={styles.container}>
          <TextInput ref={inputRef} editable={!isLoading} onFocus={() => {
            sockets?.emit("typing", { id: credentials?.id, reciever: currentUser?.id })
          }} onBlur={() => {
            try {
              setTyping(false)
              sockets?.emit("stoptyping", { id: credentials?.id, reciever: currentUser?.id })
            } catch (err) {
            }
          }} placeholder="Type your message..." value={content} style={styles.input} onChangeText={(text) => setContent(text)} />
          <TouchableOpacity onPress={() => sendMessage()} style={{ padding: 10, borderRadius: 25 }}>
            {sendingsms ? <ActivityIndicator size="small" color="#0000ff" /> : <Text style={{ fontWeight: 700, color: COLORS.pink, fontSize: 25 }}>send</Text>}
          </TouchableOpacity>
        </View>}
      {gifting && <GiftPopup errmessage={errmessage} giftError={giftError} isVisible={true} navigation={navigation} isSendingGift={isSendingGift} onClose={() => setGifting(false)} handleSendGiftExternal={(Name, qty) => handleSendGiftExternal(Name, qty)} />}
    </View>
  )
}
const Chatting = ({ navigation, route }) => {
  return (
    <MainComponent navigation={navigation} route={route} />
  )
}
export default Chatting

const styles = StyleSheet.create({
  textEntry: {
    borderWidth: 1,
    width: "80%",
    borderRadius: 5,
    paddingHorizontal: 5,
    borderColor: COLORS.faint,
    left: 10
  },
  MessageWrapper: {
    flex: 1,
    overflow: 'scroll',
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  animation: {
    flex: 1,
    marginHorizontal: 'auto'
  },
  input: {
    flex: 1,
    marginRight: 16,
  },
})