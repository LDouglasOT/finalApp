import { StyleSheet, Text, View, ImageBackground, Image, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ProfileImage } from "../components"
import { COLORS } from '../assets/Config/colors';
import { EvilIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react'
import MessageContext from '../ContextApi/MessageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axios from "axios"
import PersonalPosts from './ProfilePosts';


const LikedProfile = ({ route, navigation }) => {
  const { data } = route.params;
  const { userMatches } = useContext(MessageContext)
  const [user, setUser] = useState(null)
  const [like, setLiked] = useState(false)

  useEffect(() => {
    async function setUserData() {
      let userdata = JSON.parse(await AsyncStorage.getItem("credentials"))
      setUser(userdata)
    }
    setUserData()
  }, [0])
  useEffect(() => {
    axios.post(`https://app.nativenotify.com/api/analytics`, {
      app_id: 10140,
      app_token: 'drpVcF7TNyQVJ8WceIm3ou',
      screenName: 'Liked Profiles'
    });
  });

  const setProfile = () => {
    try {
      if (data.imgx !== null) {
        return data.imgx
      } else if (data.imgxx !== null) {
        return data.imgxx
      } else if (data.imgxxx !== null) {
        return data.imgxxx
      } else {
        return data.imgxxxx
      }
    } catch (err) {
      return "https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7"
    }
  }
  const SelectedUser = async (data, id) => {
    const conversation = userMatches.filter(obj => obj.chatUser.some(user => user.id === data.id));
    const convo = {
      "user1": parseInt(data.id),
      "user2": parseInt(id),
    }
    const creds = JSON.parse(await AsyncStorage.getItem("credentials"))
    try {
      if (conversation.length == 0) {
        const data = JSON.parse(await AsyncStorage.getItem("credentials"));
        const authToken = data.token; // Replace this with your actual authorization token
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
  const Like = async () => {
    try {
      setLiked(!like)
      const data = {
        "userId": user.id, "likedId": data.id
      }
      const datax = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = datax.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const response = await axios.post("http://192.168.100.57:3001/api/like", data, { headers: headers })
      if (response.status == 201) {
      }
      if (response.status == 200) {
      }
    } catch (err) {
    }
  }

  function calculateAge(birthdate) {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    const currentMonth = currentDate.getMonth();
    const birthMonth = birthDate.getMonth();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  return (
    <ScrollView>
      <View style={{ display: 'flex', alignItems: 'center', flex: 1, backgroundColor: "white" }}>
        <View style={{ backgroundColor: 'white', width: "100%", display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 15, marginTop: 10 }}>
          <TouchableOpacity onPress={() => navigation.pop()}>
            <Ionicons name="ios-arrow-back-sharp" size={30} color="black" />
          </TouchableOpacity>
        </View>
        <Image style={{ height: 120, width: 120, borderRadius: 75, borderWidth: 1, borderColor: 'dodgerblue', top: 0 }} source={{ uri: setProfile() }} />
        <View style={styles.details}>
          <Text style={{ fontWeight: 800, fontSize: 20 }}>{data.FirstName} {data.LastName}, {calculateAge(data.day)} yrs</Text>
          <Image style={{ height: 18, width: 18, marginHorizontal: 15 }} source={{ uri: "https://img.icons8.com/color/48/null/verified-badge.png" }} />

        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => Like()}>
            {like ? <AntDesign name="heart" size={24} color="red" /> : <AntDesign name="hearto" size={24} color="#858585" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => SelectedUser(data, user.id)}>
            <Feather name="message-circle" size={24} color="#858585" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Editcreds")}>
            <Feather name="edit" size={24} color="#858585" />
          </TouchableOpacity>
        </View>


        <View style={{ paddingHorizontal: 7, display: 'flex', flexDirection: 'row' }}>
          <EvilIcons name="location" size={24} color="black" />
          <Text style={{ color: COLORS.faint }}>Lives in {data.Country}, {data.District} district</Text>
        </View>
        <View style={{ paddingHorizontal: 30, display: 'flex', flexDirection: 'row' }}>
          <Text style={{ color: COLORS.faint }}>few km Away</Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: 700, fontSize: 25, marginBottom: 10 }}>About me</Text>
          <Text>{data.about}</Text>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={{ color: COLORS.faint }}>Looking for {data.hopes}</Text>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <View style={{ display: 'flex', flexDirection: 'row', margin: 5, alignItems: 'center' }}>
              <Text style={{ fontWeight: 700, fontSize: 20, marginBottom: 10 }}>Contact Info</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ display: 'flex', flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                <Entypo name="phone" size={24} color="black" />
                <Text style={{ color: COLORS.faint, marginHorizontal: 5 }}>{data.contact}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                <FontAwesome name="twitter" size={24} color="black" />
                <Text style={{ color: COLORS.faint, marginHorizontal: 5 }}>@{data.twitter}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                <FontAwesome name="instagram" size={24} color="black" />
                <Text style={{ color: COLORS.faint, marginHorizontal: 5 }}>@{data.instagram}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                <FontAwesome name="facebook" size={24} color="black" />
                <Text style={{ color: COLORS.faint, marginHorizontal: 5 }}>@{data.facebook}</Text>
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                <MaterialIcons name="email" size={24} color="black" />
                <Text style={{ color: COLORS.faint, marginHorizontal: 5 }}>{data.email}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 150 }}>
          <ProfileImage data={data.imgx} />
          <ProfileImage data={data.imgxx} />
          <ProfileImage data={data.imgxxx} />
          <ProfileImage data={data.Profilepic} />
        </View>
        <View style={{ display: 'flex', alignItems: 'center', flex: 1, backgroundColor: "white" }}></View>
      </View>
      <Text>Your Moments</Text>
      {data && <PersonalPosts userid={data?.id} navigation={navigation} FirstName={data?.FirstName} LastName={data?.LastName} />}

    </ScrollView>
  )
}

export default LikedProfile
const styles = StyleSheet.create({
  details: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    top: 10,
    alignItems: 'center'
  },

  button: {
    borderColor: "#858585",
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginHorizontal: 10,

    borderRadius: 5
  },


  buttonContainer: {
    marginVertical: 20,
    display: 'flex',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10
  }
})