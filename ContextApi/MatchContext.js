import { createContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [moment, setPostmoment] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState([])
  useEffect(() => {
    getData()
  }, [])
  const change_post = (status) => {
    setPostmoment(status)
  }

  const getData = async () => {
    setIsLoading(true);
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      const json = {
        "likeIded": data.id
      }
      const authToken = data.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("https://yodatebackend.tech/api/likedprofiles", json, { headers })
      if (res.status == 200) {

        setMatches(res.data)
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);

    }
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    if (refresh) {
      await getData();
      setRefreshing(false);
    } else {
      await getLikedData()
    }
    setRefreshing(false);
  };

  const getLikedData = async () => {
    setIsLoading(true);
    try {
      const data = JSON.parse(await AsyncStorage.getItem("credentials"))
      const json = {
        "likeIded": data.id
      }
      const authToken = data.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("https://yodatebackend.tech/api/mylikes", json, { headers: headers })
      if (res.status == 200) {

        setMatches(res.data)
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  }

  return (
    <MatchContext.Provider value={{ isLoading, getLikedData, handleRefresh, getData, refreshing, matches, change_post, moment }}>
      {children}
    </MatchContext.Provider>
  );
}

export { MatchContext as default };
