import React, { useEffect, useState,useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import { COLORS } from '../assets/Config/colors';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TopBar from '../components/TopBar';
import { SingleMoment } from '../components';
import MatchContext from '../ContextApi/MatchContext';
import { useContext } from 'react';
import {PostMomentPopup} from '../components';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import BoostProfileBottomSheet from './Popups/BoostProfileBottomSheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Carousel from 'react-native-reanimated-carousel';
import 'react-native-gesture-handler'
import SpotlightShowcase from './SpotlightShowcase';
import SnackBar from 'react-native-snackbar-component'
import { ActivityIndicator } from 'react-native';

const BoostedProfilesPage = ({ navigation }) => {
  const { change_post, moment } = useContext(MatchContext);
  const [skip,setSkip] = useState(0)
  const [profiles,setProfiles]=useState([])
  const [myprofile,setMyProfile]=useState(null)
const [promoted,setPromoted] = useState([])
const [message,setMessage] =useState(false)
const [tag,setTag] = useState("")
const scrollViewRef = useRef(null);
const [isLoading, setIsLoading] = useState(true);
const handleScroll = () => {
  console.log("MEN SEPARATOR")
    setIsLoading(true)
    setTimeout(()=>{
      setIsLoading(false)
    })
};
useEffect(() => {
  axios.post(`https://app.nativenotify.com/api/analytics`, {
       app_id: 10140,
       app_token: 'drpVcF7TNyQVJ8WceIm3ou',
       screenName: 'Moments Section'
   });
});

  const gotoProfile = () => {
    navigation.navigate('Profiling');
  };
  const isFocused = useIsFocused()
  async function getMoments(){
    try {
      console.log(skip)
      const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.get(`http://192.168.18.5:3001/api/moments/${skip}`,{headers:headers})
      if(res.status==200){
        setProfiles(res.data.data)
        console.log(res.data.data)
        setSkip(res.data.skip) 
      }
    } catch (error) {
      
    }
  }
    useEffect(()=>{
      getMoments()
    },[isFocused])
    useEffect(()=>{
      const getProfile = async function getProfileNow(){
        let data = JSON.parse(await AsyncStorage.getItem("credentials"))
        setMyProfile(data);
        if(data){
          promotedUsers(data.gender)
        }
      }
      getProfile()
    },[isFocused])
    const [isBottomSheetOpen, setIsBottomSheetOpen] =useState(false);

    const openBottomSheet = () => {
      setIsBottomSheetOpen(true);
    };
  
    const closeBottomSheet = () => {
      setIsBottomSheetOpen(false);
    };
  const promotedUsers =async(gender)=>{
      console.log(myprofile)
      const data = {
        gender:gender
      }
      console.log(data)
      try{  const data = JSON.parse(await AsyncStorage.getItem("credentials"));
      const authToken = data.token; // Replace this with your actual authorization token
      const headers = {
        Authorization: `${authToken}`,
        'Content-Type': 'application/json',
      };
      const res = await axios.post("http://192.168.18.5:3001/api/promoted",data,{headers:headers})
      if(res.status == 200){
        console.log(res.status)
        setPromoted(res.data)
      }
      }catch(err){
        console.log(err.message)
      }
      
    }
    const showSnackbar = () => {
      setMessage(true)
      setTimeout(() =>{
        setMessage(false)
      },3000)
    };
    const addPopup = ()=>{
      navigation.navigate("Gifts")
    }
  return (
    <View style={styles.container}>
      <TopBar
        onFilterPress={() => console.log('Filter pressed')}
        onProfilePress={() => console.log('Profile pressed')}
        title="Luzinda Douglas"
        subtitle="online"
        addPopup={addPopup}
        execute ={()=>change_post(true)}
        gotoProfile={()=>navigation.navigate("Profiling")}
      />

      <PostMomentPopup moment={moment} getMoments={()=>getMoments()}/>
      <Text style={styles.sectionTitle}>#Daily Moments</Text>
      {profiles.length == 0 ? <View style={{flex:1,display:'flex',alignItems: 'center',justifyContent:'center',height:200}}>
      <Text>No moments yet today</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={()=>change_post()}>
        <Text style={styles.buttonText}>Post a Moment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={openBottomSheet}>
        <Text style={styles.buttonText}>See Past moments</Text>
        </TouchableOpacity>
  </View>:<FlatList
  ref={scrollViewRef}
  data={profiles}
  ListHeaderComponent={
<View>
      <SpotlightShowcase navigation={navigation} promoted={promoted} localdata ={myprofile} showSnackbar={(msg)=>showSnackbar(msg)}/>    
<View style={{display:'flex',width:'100%',alignItems: 'center',justifyContent: 'center'}}>
<TouchableOpacity style={styles.buttonContainer} onPress={openBottomSheet}>
        <Text style={styles.buttonText}>Boost Your Profile</Text>
  </TouchableOpacity>
  <BoostProfileBottomSheet isVisible={isBottomSheetOpen} onClose={closeBottomSheet}/>
</View>
</View>

  }
  renderItem={({ item }) => (
    <SingleMoment moment={item} navigation={navigation} myprofile={myprofile} />
  )}
  keyExtractor={(item) => item.id.toString()}
  onEndReached={handleScroll}
  onEndReachedThreshold={0.1}
  scrollEventThrottle={10}
/>}
{isLoading && <ActivityIndicator size="large" color="blue" />}
  <SnackBar position="top" visible={message} textMessage={tag} actionText="Nice!!"/> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  boostedProfilesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  boostedProfileName: {
    color: 'white',
    fontWeight: '800',
    top:0,
    zIndex:9999,
    fontSize:18
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor:COLORS.pink,
    borderWidth:0.4,
    paddingHorizontal: 8,
    paddingVertical:10,
    backgroundColor:COLORS.pink,
    color:'white',
    borderRadius:5,
    width:"80%",
    marginHorizontal:"auto"
  },
  buttonText: {
    color: 'white',
    fontStyle:'bold'
  },
  sectionTitle: {
    marginTop: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 20,
  },
  boostedImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  profileHead: {
    fontSize: 25,
    marginRight: 'auto',
    color: 'white',
    fontStyle: 'normal',
    fontWeight: 'bold',
  },
  bghandler: {
    backgroundColor: COLORS.pink,
    padding: 11,
    width: '100%',
    borderRadius: 18,
    height:350,
    display:'flex',
  },
  card: {
    width: '100%',
    height: 230,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
    zIndex:999,
  },
});

export default BoostedProfilesPage;
