import { FlatList, ScrollView, StyleSheet, Text, View,TextInput } from 'react-native'
import React,{ useState,useEffect, useRef } from 'react'
import { Matches,Chat } from '../components'
import { COLORS } from '../assets/Config/colors'
import TopBar from '../components/TopBar'
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import MessageContext from '../ContextApi/MessageContext';
import { useContext } from 'react'
import LoginContext from '../ContextApi/AppContext';
import { EvilIcons } from '@expo/vector-icons';
import axios from 'axios'


const ItemDivider = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#d3f3d3",
        }}
      />
    );
  }
const Header = ({length})=>{
return(
    <View style={{display:'flex',flexDirection:'row',
    justifyContent:'flex-start',
    paddingHorizontal:15,
    marginVertical:10
    // marginVertical:15
    }}>
        <Text style={{ color:COLORS.faint }}></Text>
    </View>
)
}

const EmptyListComponent = () => {
  return (
    <View style={styles.emptyContainer}>
         
          <LottieView
              source={require('../assets/Lottie/61735-message.json')}
              autoPlay
              loop={true}
              style={styles.animation}
            />
          <Text style={{marginTop:200}}>No messages yet</Text>
    </View>
  );
};

const Messages = ({ navigation }) => {
const isFocused = useIsFocused();
const [localdata, setLocaldata] = useState([]);
const { fetchConversations, userMatches, userdata, fetchData  } = useContext(MessageContext)
const [onlineUsers,setOnlineuser] = useState([])
const [user,setuser] = useState([])
const [deactivateuser,setDeactivateuser] = useState([])
const { socket  } = useContext(LoginContext)
const Refsockets = useRef()
const [searchQuery,setSearch]=useState("")

useEffect(() => {
  async function runsockets(){
  Refsockets.current = socket
  await fetchData();
  await fetchConversations()
  }
  runsockets()
},[isFocused]);
useEffect(() => {
  axios.post(`https://app.nativenotify.com/api/analytics`, {
       app_id: 10140,
       app_token: 'drpVcF7TNyQVJ8WceIm3ou',
       screenName: 'Messaging'
   });
});


const tosms = (data) =>{
  navigation.navigate("LikedProfile",{ data: data })
}

const tochat = (conversation,creds)=>{
  navigation.navigate("Chatting",{"conversationId":conversation,"credentials":creds})
}

useEffect(()=>{
  async function detectTyping(){
    Refsockets.current?.on("typing",(data)=>{
      setuser((prev)=>[...prev,data])
    })
    Refsockets.current?.on("stoptyping",(data)=>{
      setDeactivateuser(data)
    })
  }
  detectTyping()
 
},[socket])

useEffect(()=>{
  if(deactivateuser == null){

  }
},[socket])
const handleSearch =()=>{
}
const addPopup = ()=>{
  navigation.navigate("Gifts")
}
  return (
    <View style={{backgroundColor:'white',flex:1}}>
    <TopBar
      onFilterPress={() => console.log('Filter pressed')}
      onProfilePress={() => console.log('Profile pressed')}
      title="Luzinda Douglas"
      subtitle="online"
      button="btn"
      addPopup={addPopup}
      navigation={navigation}
      gotoProfile={()=>navigation.navigate("Profiling")}
    />
    <View style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
    <View style={styles.searchContainer}>
    <EvilIcons name="search" size={24} color="#888" style={styles.searchIcon}/>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      </View>
        <View>
        <Text style={styles.msgbar}>Messages({userMatches.length})</Text>
        </View>
        <View>
        </View>
    
        <FlatList 
          data={userMatches}
          renderItem={({ item }) => (
            <Chat data={item} tochat={tochat} userdata={userdata} />
          )}
          keyExtractor={(item) => item.id.toString()} 
          ListEmptyComponent={<EmptyListComponent />}
          ListHeaderComponent={<Header length={userMatches.length} />}
          style={styles.chatlist} 
          ItemSeparatorComponent={ItemDivider}
        />
        </View>
  )
}

export default Messages

const styles = StyleSheet.create({
    msgbar:{
        color:"black",
        top:15,
        fontSize:20,
        left:15
    },
    newmsg:{
        color:"black",
        marginHorizontal:15,
        marginVertical:5,
        color:'#fafafa',
        
    },
    emptyContainer:{
      backgroundColor:'white',
      height:300,
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'column' 
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      backgroundColor:'#f0f0f0',
      width:"90%",
      marginTop:10,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: '#333',
    },

})