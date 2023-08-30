import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import MessageContext from '../ContextApi/MessageContext';
import { COLORS } from '../assets/Config/colors';
import { useIsFocused } from '@react-navigation/native';

const Chat = ({ data, tochat, userdata, typings }) => {
  const [image, setImage] = useState('https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7');
  const [mydata, setdata] = useState('');
  const [main, setMain] = useState();
  const [unread, setUnread] = useState(0);
  const { userMatches } = useContext(MessageContext);
  const [smsText,setSmstext] = useState("")
  const isFocused = useIsFocused()


  useEffect(() => {
    const fetchData = async () => {
      const jsondata = JSON.parse(await AsyncStorage.getItem('credentials'));
      setMain(jsondata);
      let user = data.chatUser.filter((data) => data.id !== jsondata.id);
      setdata(user[0]);
      try {
        if (user[0].imgx !== null) {
          setImage(user[0].imgx);
        } else if (user[0].imgxx !== null) {
          setImage(user[0].imgxx);
        } else if (user[0].imgxxx !== null) {
          setImage(user[0].imgxxx);
        } else {
          setImage(user[0].imgxxxx);
        }
    
        setSmstext(data.messages[data.messages.length-1])
        let mysms = data.messages.filter((sms) => sms?.sender !== userdata.id);
        setUnread(mysms.length)
      } catch (err) {
        setImage('https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7');
      }
    };
    fetchData();
  }, [isFocused]);

  return (
    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => tochat(data, main)}>
      <View style={styles.chatContainer}>
        <Image style={styles.image} source={{ uri: image }} />
        <View style={{ marginRight: 'auto', marginLeft: 8, display: 'flex', justifyContent: 'center', marginTop: 10 }}>
          <Text style={{ marginBottom: 'auto', marginTop: 5, fontWeight: 700 }}>{mydata?.FirstName} {mydata?.LastName}</Text>
          <Text style={{ marginBottom: 'auto', marginTop: -10, color: COLORS.faint }}>{smsText?.sms}</Text>
        </View>
        <View style={{width:50,display:'flex',  alignItems: 'center',justifyContent: 'center', }}>
          {unread > 0 && 
        <Text style={{
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          backgroundColor: COLORS.notifications,
          color: COLORS.light,
          borderRadius: 12.5,
          width: 25,
          height: 25,
          display: "flex",
          textAlign: 'center',
          // lineHeight: 25 // added this style
        }}>
{unread}
  </Text>} 
 
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default Chat;

const styles = StyleSheet.create({
  image: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.online,
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical:10
  }})