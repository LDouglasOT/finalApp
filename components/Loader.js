import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';

const Loader = ({ loading }) => {
  return (
    <View style={{display:'flex',alignItems: 'center',justifyContent: 'center'}}>
    <LottieView
      source={require('../assets/Lottie/97443-loading-gray.json')}
      autoPlay
      loop={true}
      style={{ height: 200, width: 200}}
  />
    </View>
  );
};

export default Loader;
