import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../assets/Config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SnackBar from 'react-native-snackbar-component';
import axios from 'axios';
import TimeAgo from 'react-native-timeago';
import { ActivityIndicator } from 'react-native';


const DetailsPage = ({ route, navigation }) => {
  const [liked, setLiked] = useState(false);
  const { moment } = route.params;
  const [comments, setComments] = useState(moment.comments);
  const [commentText, setComment] = useState(null);
  const [message, setMessage] = useState(false);
  const [tag, setTag] = useState('');
  const [commenting, setCommenting] = useState(false)
  const [liking, setLiking] = useState(false)
  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
      app_id: 10140,
      app_token: 'drpVcF7TNyQVJ8WceIm3ou',
      screenName: 'DetailsPage'
    });
  });

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
    }
    checkLiked()
  }, [])

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleAddComment = async () => {
    try {
      let dataStore = JSON.parse(await AsyncStorage.getItem('credentials'));
      console.log(commentText);
      if (!commentText) {
        setTag('Please write a comment!!');
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 3000);
        return;
      }
      setCommenting(true)
      const data = {
        Names: dataStore.firstname,
        imageOne: dataStore.img,
        df: commentText,
        momentId: moment.id,
      };
      const datax = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = datax.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post('http://192.168.18.14:3001/api/comment', data, { headers: headers });
      if (res.status === 200) {
        console.log(res.data);
        setComments([res.data, ...comments]);
        setComment('');
        setCommenting(false)
      }
    } catch (err) {
      setCommenting(false)
      console.log(err.message);
    }
  };

  const Like = async (datax) => {
    setLiking(true);
    try {
      let liked = JSON.parse(await AsyncStorage.getItem("likes")) || [];
      if (liked.includes(moment.id.toString())) {
        setLiking(false);
        return;
      }

      setLiked(liked);
      const data = {
        momentLiked: moment.owenId,
        likedId: datax.id,
      };
      const datax = JSON.parse(await AsyncStorage.getItem("credentials"))
      const authToken = datax.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post('http://192.168.18.14:3001/api/likemoment', data, { headers: headers });
      if (response.status === 200) {
        setLiking(false);
        liked.push(moment.id.toString()); // Convert moment.id to string before pushing
        await AsyncStorage.setItem('likes', JSON.stringify(liked));
      }
      setLiking(false);
    } catch (err) {
      setLiking(false);
      console.log(err.message);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View>
        {/* Profile Image */}
        <Image style={styles.profileImage} source={{ uri: moment.imageTwo }} />

        <Text style={styles.username}>
          Luzinda Douglas{' '}
        </Text>
        <Text style={styles.hashtags}>#{moment.HashTag}</Text>
        <Text style={styles.likes}>{moment.Likes} Likes</Text>
        {liking ? <ActivityIndicator size="large" style={styles.loader} /> : <TouchableOpacity style={styles.likeButton} onPress={() => Like(moment)}>
          <Text style={styles.likeButtonText}>{liked ? 'Unlike' : 'Like'}</Text>
        </TouchableOpacity>}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.pop()}>
          {/* <Image source={require('../assets/arrow_back.png')} style={styles.backButtonIcon} /> */}
        </TouchableOpacity>
        <Text style={styles.tagline}>{moment.HashTag}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: moment.imageOne }} />
        <Image style={styles.image} source={{ uri: moment.imageTwo }} />
        <Image style={styles.image} source={{ uri: moment.imageTwo }} />
      </View>
      <View style={styles.commentSection}>
        <TextInput
          multiline
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={(text) => setComment(text)}
          style={styles.input}
          placeholderTextColor="#A8A8A8"
          autoCapitalize="sentences"
          autoCorrect
          maxLength={150}
        />
        {commenting ? <ActivityIndicator size="large" style={styles.loader} /> : <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
          <Text style={styles.addCommentButtonText}>Add Comment</Text>
        </TouchableOpacity>}
        {Array.isArray(comments) && comments.reverse().map((comment, index) => (
          <View key={`comment_${index}`} style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.commentItem}>
              <Text style={styles.commentUser}>{comment.Names}</Text>
              <Text style={styles.commentText}>{comment.df}</Text>
            </View>
            <TimeAgo time={comment.date} />
          </View>
        ))}
      </View>
      <SnackBar position="top" visible={message} textMessage={tag} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: COLORS.textPrimary,
  },
  hashtags: {
    marginTop: 4,
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  likes: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textSecondary,
  },
  likeButton: {
    backgroundColor: COLORS.pink,
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  likeButtonText: {
    textAlign: 'center',
    color: "white",
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 16,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
  tagline: {
    fontSize: 18,
    marginTop: 16,
    color: COLORS.textPrimary,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 8,
  },
  commentSection: {
    marginVertical: 16,
  },
  input: {
    minHeight: 80,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  addCommentButton: {
    backgroundColor: COLORS.pink,
    padding: 12,
    borderRadius: 8,
  },
  addCommentButtonText: {
    color: "white",
    textAlign: 'center',
    fontWeight: 'bold',
  },
  commentItem: {
    marginBottom: 16,
  },
  commentUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  commentText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default DetailsPage;
