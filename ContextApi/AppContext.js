import { createContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerIndieID } from 'native-notify';
import * as Notifications from 'expo-notifications';

const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [count, setCount] = useState(1);
  const [likes, setLikes] = useState(5);
  const [notification, setNotifications] = useState(0);
  const [online, setOnline] = useState([]);
  const [initial, setInitial] = useState(null);
  const [sockets, setSocket] = useState(null);
  const [smsignaller, setSmsignaller] = useState(false)
  const [person, setPerson] = useState(null)
  const ref = useRef();
  const [subscribed, setSubscribed] = useState(false)
  const [loggedUser, setLoggedUser] = useState(null)

  const checksubscription = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("credentials"))

    const authToken = user.token; // Replace this with your actual authorization token

    const headers = {
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.post("http://192.168.18.14:3001/api/subscribe", data, { headers })
    if (response.status == 200) {
      setSubscribed(false)
    } else if (response.status == 401) {
      setSubscribed(true)
    }

  }

  const getCurrentUser = async () => {
    const user = JSON.parse(await AsyncStorage.getItem("credentials"));
    const authToken = user.token; // Replace this with your actual authorization token

    const headers = {
      Authorization: `${authToken}`,
      'Content-Type': 'application/json',
    };
    const response = await axios.get(`http://192.168.18.14:3001/api/currentuser/${user.id}`, { headers })
    if (response.status == 200) {
      console.log(response.data)
      setLoggedUser(response.data)
    }
  }
  useEffect(() => {
    async function initSocket() {
      if (!ref.current) {
        ref.current = io('ws://socketserver-fimb.onrender.com');
        setInitial(ref.current);
      }
    }
    initSocket();
  }, []);
  const addUsers = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      if (sockets) {
        if (!data?.id) {
          return
        }
        console.log("Socket connection initiated");
        sockets.emit('addUser', data?.id);
        sockets.on('getUsers', async (users) => {
          setOnline(users);
          const userIdsArray = users.map(user => user.userId);
          const jsonString = JSON.stringify(userIdsArray);
          await AsyncStorage.setItem("checkonline", jsonString);
        });
      }
    } catch (error) {
      console.error("Error storing array in AsyncStorage:", error);
    }
  };

  async function initSocket() {
    if (!ref.current) {
      console.log("attempting connecton")
      ref.current = io('ws://socketserver-fimb.onrender.com');
      setInitial(ref.current);
    }
    if (ref.current) {
      console.log("attempting new user additions")
      addUsers();
    }
  }

  useEffect(() => {
    setSocket(ref.current);
  }, [ref.current]);

  useEffect(() => {
    addUsers();
  }, [sockets]);



  useEffect(() => {
    const handleDisconnect = () => {
      console.log("Socket disconnected. Reconnecting...");
      if (ref.current && !ref.current.connected) {
        ref.current.connect();
      }
    };
    if (ref.current) {
      ref.current.on("disconnect", handleDisconnect);
    }

  }, []);

  const createSignal = (status) => {
    if (status == 1) {
      setSmsignaller(true)
    } else {
      setSmsignaller(false)
    }
  }
  const updateUser = async () => {
    if (online.length !== 0) {
      return
    }
    requestPermissions();
    const data = JSON.parse(await AsyncStorage.getItem("credentials"));
    if (sockets) {
      if (!data?.id) {
        return
      }
      sockets.emit('addUser', data?.id);
      sockets.on('getUsers', async (users) => {
        setOnline(users);
        try {
          const jsonString = JSON.stringify(users);
          await AsyncStorage.setItem("likedProfiles", jsonString);
        } catch (error) {
          console.error("Error storing array in AsyncStorage:", error);
        }
      });
    }
  }

  const requestPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        console.log('Notification permissions not granted.');
        return;
      }
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Notifications token:', token);
  };



  return (
    <LoginContext.Provider value={{ loggedUser, count, getCurrentUser, likes, notification, sockets, online, initSocket, updateUser, subscribed, checksubscription }}>
      {children}
    </LoginContext.Provider>
  );
}

export { LoginContext as default };
