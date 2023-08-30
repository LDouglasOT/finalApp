import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import TimeAgo from 'react-native-timeago';
import { useIsFocused } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'

const SingleMoment = ({ moment, navigation, myprofile }) => {
  const [liked, setLiked] = useState(false);
  const isFocused = useIsFocused()
  const [likes, setLikes] = useState(0)


  useEffect(() => {
    const checkLiked = async () => {
      try {
        const liked = JSON.parse(await AsyncStorage.getItem("likes")) || []
        console.log(liked)
        if (liked.includes(moment.id.toString())) {
          setLiked(true)
        }
      } catch (err) {
        console.log(err.message)
      }
      setLikes(moment.Likes)
    }
    checkLiked()
  }, [isFocused])

  const Like = async (datax) => {
    setLiked(true)
    try {
      let liked = JSON.parse(await AsyncStorage.getItem("likes")) || [];
      if (liked.includes(moment.id.toString())) {
        setLiked(true)
        return;
      }

      const data = {
        momentLiked: moment.owenId,
        likedId: datax.id,
      };
      const user = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = user.token; // Replace this with your actual authorization token

      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post('https://yodatebackend.tech/api/likemoment', data, { headers });
      if (response.status === 200) {
        console.log("api hit")
        setLikes(likes + 1)
        setLiked(true);
        liked.push(moment.id.toString()); // Convert moment.id to string before pushing
        await AsyncStorage.setItem('likes', JSON.stringify(liked));
      }
    } catch (err) {
      setLiked(true);
      console.log(err.message);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('details', { moment: moment, myprofile: myprofile })}
    >
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: moment.imageTwo }}
          style={styles.profileImage}
        />
        <View style={styles.nameTimeContainer}>
          <Text style={styles.name}>{moment.LastName}</Text>
          <Text style={styles.timestamp}><TimeAgo time={moment.timestamp} /></Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: moment.imageOne || moment.imageTwo }} style={styles.image} />
        <View style={styles.overlay} />

      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.captionText}>#{moment.HashTag}</Text>
        <View style={styles.iconsWrapper}>
          <TouchableOpacity style={styles.icon}>
            <Text style={{ marginHorizontal: 5, fontSize: 15 }}>{moment.comments.length}</Text>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
          </TouchableOpacity>
          {liked ? <TouchableOpacity style={styles.icon}>
            <Text style={{ marginHorizontal: 5, fontSize: 15 }}>{likes}</Text>
            <AntDesign name="heart" size={24} color="red" />
          </TouchableOpacity> : <TouchableOpacity style={styles.icon} onPress={() => Like(moment)}>
            <Text style={{ marginHorizontal: 5, fontSize: 15 }}>{likes}</Text>
            <AntDesign name="heart" size={24} color="black" />
          </TouchableOpacity>}

        </View>

      </View>
    </TouchableOpacity>
  );
};

export default SingleMoment;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginVertical: 10,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',

  },
  image: {
    height: 300,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 10
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  iconsWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 8,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 2,
    zIndex: 999
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  nameTimeContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  timestamp: {
    color: '#fff',
  },
  captionText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    marginVertical: 5,
    fontStyle: 'italic'
  },
});
