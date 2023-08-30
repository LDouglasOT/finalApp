import React from 'react';
import { View, Image,Text,StyleSheet } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'white' }}>
      <Image source={require('../assets/Images/logo.png')} style={{ width: 100, height:100 }} />
      <Text style={styles.logo}>YoDate</Text>
      <Text style={{color:'purple',fontStyle:'italic'}}>Connecting Hearts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#e91e63',
  },
})
export default SplashScreen;