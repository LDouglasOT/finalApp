import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { COLORS } from '../../assets/Config/colors';
import { useNavigation } from '@react-navigation/native';

const Matches = ({ like, tag }) => {
  const isFocused = useIsFocused()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMatches()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  async function fetchMatches() {
    setIsLoading(true);
    try {
      const localdata = JSON.parse(await AsyncStorage.getItem("credentials")) | 0
      const json = {
        "id": localdata.id,
      }
      const authToken = localdata.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("http://192.168.18.14:3001/api/matchedusers", json)
      console.log(res.data)
      if (res.status == 200) {

        setData([...res.data])
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err.message);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [isFocused])
  if (isLoading) {
    return (
      <View style={styles.grid}>
        <View style={styles.topBar}>
          <Text style={styles.title}>My {tag} {like}</Text>
        </View>
        <View style={{ width: '100%', height: '100%', display: 'flex', align: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
          <LottieView
            source={require('../../assets/Lottie/97443-loading-gray.json')}
            autoPlay
            loop={true}
            style={{ height: 300, width: 300 }}
          />
          <Text style={{ color: COLORS.pink, fontSize: 18, marginLeft: 'auto', marginRight: 'auto', flexWrap: 'wrap' }}>Getting matches ...</Text>
        </View>
      </View>
    )
  }
  if (data.length == 0) {
    return (
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } style={{ flex: 1 }}>
        <View style={styles.grid}>
          <View style={styles.topBar}>
            <Text style={styles.title}>My {tag} {like}</Text>
          </View>
          <View style={{ width: '100%', height: '100%', display: 'flex', align: 'center', justifyContent: 'center', paddingHorizontal: 20, flex: 1 }}>
            <LottieView
              source={require('../../assets/Lottie/emptystate.json')}
              autoPlay
              loop={true}
              style={{ height: 300, width: 300 }}
            />
            <Text style={{ color: 'gray', fontSize: 18, marginLeft: 'auto', marginRight: 'auto', flexWrap: 'wrap' }}>No Matches Found, keep liking to get matches</Text>

          </View>
        </View>
      </ScrollView>
    )
  }
  return (
    <View style={styles.grid}>
      <View style={styles.topBar}>
        <Text style={styles.title}>My {tag} {like}</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } >
        <View style={{ width: "100%", display: 'flex', flexDirection: 'row', flexWrap: 'wrap', paddingTop: 70 }}>
          {
            data.map(date => (
              <View style={styles.container} key={date}>
                <Image source={{ uri: date.imgxxx }} style={styles.backgroundImage} resizeMode="cover" />

                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
                  style={styles.background}
                >
                  {/* Matched person */}
                  <View style={styles.matchedPerson}>
                    <Text style={styles.firstName}>{date.FirstName} {date.LastName}</Text>
                    <View style={[styles.statusDot, date.online ? styles.online : styles.offline]} />
                  </View>

                  {/* Buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("LikedProfile", { "data": date })}>
                      <Text style={styles.buttonText}>view</Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default Matches;

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    display: 'flex',
  },
  container: {
    width: '80%',
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  matchedPerson: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  firstName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  online: {
    backgroundColor: '#00ff00', // Green dot for online status
  },
  offline: {
    backgroundColor: '#ffff00', // Yellow dot for offline status
  },
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
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  topBar: {
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingVertical: 10,
    position: 'absolute',
    marginBottom: 10,
    zIndex: 999,
    width: '100%'
  },
  flexer: {
    paddingBottom: 70,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    width: '100%'
  }
});
