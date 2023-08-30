import { TouchableOpacity, StyleSheet, Text, View,Image } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MatchNLinkes = ({data,clicked}) => {
  const [image,setImage] = useState("https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7")
  useEffect(()=>{
    try{
      if(data.imgx !== null){
        setImage(data.imgx)
      }else if(data.imgxx !== null){
        setImage(data.imgxx)
      }else if(data.imgxxx !== null){
        setImage(data.imgxxx)
      }else{
        setImage(data.imgxxxx)
      }
    }catch(err){
      setImage("https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7")

    }
    
  },[0])
  return (
    <TouchableOpacity style={styles.container} onPress={()=>clicked(data)}>
        <Image
            style={{width : '100%', height: 200,borderRadius:10}}
            source={{uri : image}}>
        </Image>
        <LinearGradient 
                colors={['#00000000', '#000000']} 
                style={{height : 200, width : '100%',borderRadius:10,position:'absolute'}}>
        </LinearGradient>
        <View style={styles.creds}>
            <Text style={{color:'white',fontSize:12}}>{data.FirstName} (12)</Text>
            <View style={{display:'flex',flexDirection:'row'}}>
            <Entypo name="location-pin" size={15} color="white" style={styles.icon}/>
            <Text style={{color:'white',fontSize:12}}>{data.District}</Text>
            </View>
            <Text style={{color:'white',fontSize:12}}>2km away</Text>
        </View>
    </TouchableOpacity>
  )
}

export default MatchNLinkes

const styles = StyleSheet.create({
    container:{
      backgroundColor:'blue',
      width:'45%',
      borderRadius:10,
      margin:5
    },
    creds:{
    position:'absolute',
    bottom:'5%',
    left:10
    },
    icon:{
        marginLeft:-5
    }
})