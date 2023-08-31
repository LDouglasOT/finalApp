import { createContext, useState, useEffect } from 'react'
import io from 'socket.io-client';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';



const MessageContext = createContext()

export function MessageProvider({ children }) {

  const [userMatches, setUsermatches] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [userId, setId] = useState(null)
  const [messagesId, setMsgId] = useState(null)
  const [messageaLoader, setMessageLoader] = useState(false)

  const fetchConversations = async () => {
    console.log("Fetching your conversations...")
    setMessageLoader(true)
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      setUserdata(data)

      const authToken = data.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.get(`http://192.168.100.57:3001/api/conversation/${data.id}`, { headers: headers })
      if (response.status == 200) {
        setUsermatches(response.data.conversations)
      }
    } catch (err) {
      console.log("There was an error fetching the conversations",err.message)
    }
    setMessageLoader(false)
  }


  const fetchData = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const json = {
        id: data.id,
      };
      const authToken = data.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post(
        "http://192.168.100.57:3001/api/matchedusers",
        json, { headers: headers }
      );
      if (response.status === 200) {
        console.log(response.data)
        setLocaldata(response.data)
      }
    } catch (err) {

    }
  };

  const afterGift = async () => {
    console.log("fetching gifts now")
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      setUserdata(data)
      const authToken = data.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.get(`http://192.168.100.57:3001/api/conversation/${data.id}`, { headers: headers })
      if (response.status == 200) {
        setUsermatches(response.data.conversations)
      }
    } catch (err) {

    }
  }

  const changesms = (id) => {
    setMsgId(id)
  }
  return (
    <MessageContext.Provider value={{ fetchData, changesms, messagesId, messageaLoader, fetchConversations, userMatches, userdata, userId, afterGift }}>
      {children}
    </MessageContext.Provider>
  )
}
export default MessageContext