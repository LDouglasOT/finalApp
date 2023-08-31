import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfilePopup } from "../components"
import FilterPopup from '../components/FilterPopup';
import LottieView from 'lottie-react-native';
import LoginContext from '../ContextApi/AppContext';
import { useContext } from 'react'
import MessageContext from '../ContextApi/MessageContext';
import { useIsFocused } from '@react-navigation/native';
import DatingAppCard from '../components/SampleCard';
import TopBar from '../components/TopBar';
import socket from '../ContextApi/socket';
import PaymentBottomSheet from "./PaymentBottomSheet"
import { ActivityIndicator } from 'react-native';
import MatchContext from "../ContextApi/MessageContext"

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const SwipeScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [num, setNum] = useState(0)
  const [localdata, setLocaldata] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Unknown")
  const [filterVisible, setFilterVisible] = useState(false)
  const [isVisible, setisVisible] = useState(false)
  const { sockets, updateUser, getCurrentUser } = useContext(LoginContext)
  const [subscription, setSubscription] = useState(false);
  const [isFetchingMore, setisFetchingMore] = useState(false)

  const { fetchData, fetchConversations, userMatches, subscribed, checksubscription, afterGift } = useContext(MessageContext)
  // const {setupNotificationListener,saveTokenToLocalStorage,registerForPushNotificationsAsync,saveUserIdToLocalStorage} = useContext(MatchContext)

  useEffect(async () => {
    // Fetch the user ID from credentials in local storage

    const registerForPushNotificationsAsync = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status !== 'granted') {
        console.log('Permission to receive notifications was denied');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      return token;
    };

    const saveTokenToLocalStorage = async (token) => {
      try {
        console.log("....hold up wait a minute something aint right")
        const storedToken = JSON.parse(await AsyncStorage.getItem('expoToken'));
        const userData = JSON.parse(await AsyncStorage.getItem('credentials'));
        if (storedToken !== token) {
          await AsyncStorage.setItem('expoToken', token);
          const saveToDb = await axios.post("", { "token": token, id: userData.id })
        }
      } catch (error) {
        console.log('Error saving token to local storage:', error);
      }
    };

    const saveUserIdToLocalStorage = async (userId) => {
      try {
        await AsyncStorage.setItem('userId', userId.toString());
      } catch (error) {
        console.log('Error saving user ID to local storage:', error);
      }
    };

    const setupNotificationListener = () => {
      Notifications.addListener((notification) => {

      });
    };

    const credentials = await JSON.parse(AsyncStorage.getItem('credentials')) || 0;
    if (credentials && credentials.id) {
      saveUserIdToLocalStorage(credentials.id);
    }

    // Register for push notifications and save the token
    registerForPushNotificationsAsync()
      .then((token) => saveTokenToLocalStorage(token))
      .catch((error) => console.log('Error registering for notifications:', error));

    // Set up the notification listener
    // setupNotificationListener();
  }, []);



  useEffect(() => {
    async function fetchInitialData() {
      try {
        fetchData()
        await fetchConversations()
      } catch (error) {
        console.error('Error fetching conversations:', error)
      }
    }
    fetchInitialData()
  }, [0])
  useEffect(() => {
    const runmsgupdate = async () => {
      sockets?.on("getMessage", () => {
        afterGift()
      })
    }
    runmsgupdate()
  }, [sockets])

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 15,
          width: "100%",
          backgroundColor: 'transparent',
        }}
      />
    );
  }
  const [data, setData] = useState([])
  useEffect(() => {
    async function fetchMatches() {
      setIsLoading(true);
      try {
        const data = JSON.parse(await AsyncStorage.getItem("credentials"))
        const skip = JSON.parse(await AsyncStorage.getItem("skips")) || 0
        console.log("The skips are..........",skip)
        setLocaldata(data)
        setUsername(data.firstname)
        const json = {
          "id": data.id,
          "skip": skip ? parseInt(skip) : 0,
          "gender": data.gender
        }
        const authToken = data.token; // Replace this with your actual authorization token
        const headers = {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        };
        console.log("Making the api call..............................")
        const res = await axios.post("http://192.168.100.57:3001/api/matches", json, { headers: headers })
        if (res.status == 200) {
          console.log("Skip data is ...................",res.data.skip)
          if (res.data.flush) {
            res.data.skip = 0
          }

          await AsyncStorage.setItem("skips", JSON.stringify(res.data.skip))
          setData([...res.data.data, data])
          setIsLoading(false);
        }else if(res.status == 2001){
          setisFetchingMore(false)
          setSubscription(true)
        }
      } catch (err) {
        setIsLoading(false);
      }
    }
    fetchMatches()
    updateUser()
  }, [isFocused])

  useEffect(() => {
    sockets?.on('getMessage', () => {
      afterGift()
    });
    sockets?.emit("smssent", { "name": "luzinda" })

  }, [isFocused])

  const SelectedUser = async (data, id) => {
    const conversation = userMatches.filter(obj => obj.chatUser.some(user => user.id === data.id));
    const convo = {
      "user1": parseInt(data.id),
      "user2": parseInt(id),
    }
    const creds = JSON.parse(await AsyncStorage.getItem("credentials"))
    try {
      if (conversation.length == 0) {

        const authToken = creds.token; // Replace this with your actual authorization token
        const headers = {
          Authorization: `${authToken}`,
          'Content-Type': 'application/json',
        };
        const response = await axios.post("http://192.168.100.57:3001/api/conversation", convo, { headers: headers })
        if (response.status == 201 || response.status == 200) {
          navigation.navigate("Chatting", { "conversationId": response.data[0], "credentials": creds, "userdata": data })
        }
      } else {
        navigation.navigate("Chatting", { "conversationId": conversation[0], "credentials": creds, "userdata": data })
      }

    } catch (err) {

    }
  }

  const closepopup = () => {
    setFilterVisible(false)
  }
  const onFilter = (filterobj) => {

  }
  const addPopup = () => {
    navigation.navigate("Gifts")
  }
  const gotoProfile = (datanow) => {
    console.log(datanow)
    navigation.navigate("LikedProfile", { "data": datanow })
  }

  const fetchMoreUsers = async () => {
    setisFetchingMore(true)
    try {
      const skip = JSON.parse(await AsyncStorage.getItem("skipped_data")) || 0
      const json = {
        "id": localdata.id,
        "skip": skip ? parseInt(skip) : 0,
        "gender": localdata.gender
      }
      console.log(json)
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("http://192.168.100.57:3001/api/matches", json, { headers: headers });
      if (res.status == 200) {
        setisFetchingMore(false)
        if (res.data.length < 1) {
          console.log("Empty screens")
        }
        console.log(res.data)
        if (res.data.flush) {
          res.data.skip = 0
        }
        await AsyncStorage.setItem("skips", JSON.stringify(res.data.skip))
        setData([data, ...res.data.data])
      } else if (res.status == 201) {
        setisFetchingMore(false)
        setSubscription(true)
      }
    } catch (err) {
      console.log(err.message)
      setisFetchingMore(false)
    }
  }

  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
      app_id: 10140,
      app_token: 'drpVcF7TNyQVJ8WceIm3ou',
      screenName: 'Swipe screens'
    });
    getCurrentUser()
  }, [0]);

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          display: 'flex',
        }}>
        <ProfilePopup isVisible={isVisible} />
        <FilterPopup isVisible={filterVisible} onClose={closepopup} onFilter={onFilter} />
        <TopBar
          onFilterPress={() => console.log('Filter pressed')}
          onProfilePress={() => console.log('Profile pressed')}
          title="Luzinda Douglas"
          subtitle="online"
          addPopup={addPopup}
          gotoProfile={() => {
            console.log("Cameron")
            navigation.navigate("Profiling")
          }}
        />
        <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 100 }}>
          <LottieView
            source={require('../assets/Lottie/97443-loading-gray.json')}
            autoPlay
            loop={true}
            style={{ height: 300, width: 300, top: 150 }}
          />
        </View>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ProfilePopup isVisible={isVisible} />
      <FilterPopup isVisible={filterVisible} onClose={closepopup} onFilter={onFilter} />
      <TopBar
        onFilterPress={() => console.log('Filter pressed')}
        onProfilePress={() => console.log('Profile pressed')}
        title="Luzinda Douglas"
        subtitle="online"
        addPopup={addPopup}
        button="btn"
        gotoProfile={() => navigation.navigate("Profiling")}
        execute={() => {
          setisVisible(true)
        }}
      />
      {subscription && <PaymentBottomSheet onClose={() => setSubscription(false)} />}
      <View style={{ marginVertical: 2, backgroundColor: "orange" }}></View>
      <FlatList
        data={data}
        onEndReached={fetchMoreUsers}
        onEndReachedThreshold={0.1}
        renderItem={({ item }) => (
          <View style={{ display: 'flex', alignContent: 'center', alignItems: 'center' }}>
            <DatingAppCard gotoProfile={gotoProfile} navigate={SelectedUser} item={item} id={localdata.id} />
          </View>)}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={FlatListItemSeparator}
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: 'transparent',
              width: '100%',
              height: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              top: 10,
              marginHorizontal: 'auto',
            }}>
            <LottieView
              fsource={require('../assets/Lottie/emptystate.json')}
              autoPlay
              loop={true}
              style={{ height: 250, width: 200 }}
            />
            <Text>No users yet</Text>
          </View>
        }
      />
      {isFetchingMore && <ActivityIndicator size="large" color="blue" />}
    </View>
  )
}

export default SwipeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})