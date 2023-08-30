
import PagerView from 'react-native-pager-view';
import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap,TabBar } from 'react-native-tab-view';
import Matches from './MiniScreens/Matches';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { MatchNLinkes } from "../components"
import { Ionicons } from '@expo/vector-icons';
import Toggle from "react-native-toggle-element";
import { COLORS } from '../assets/Config/colors';
import axios from "axios"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useContext } from 'react';
import Liked from './MiniScreens/Liked';
import Like from './MiniScreens/Like';


const FirstRoute = () =>{ 
  return( <Matches like="⚤" tag="matches"/>)
}
  

const SecondRoute = () => {
  
  return(<Like like="😘"  tag="Likes"/>)
}

const ThirdRoute = () =>{
  return(<Liked like="😍" tag="Liked"/>)
}
const TabBarComponent = (props) => {
  const { navigationState, ...rest } = props;

  useEffect(() => {
    // Call your API based on the activeTabIndex
    // Set loading to true before API call
    setLoading(true);

    return () => {
      // Cleanup logic if needed
    };
  }, [navigationState]);

  return <TabBar {...rest} style={styles.tabBar} />;
};


const MatchesScreen = () => {
  const isFocused = useIsFocused();
  // useEffect(async()=>{getData()},[isFocused])
  
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Matches' },
    { key: 'second', title: 'Likes' },
    { key: 'third', title: 'Liked' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third:ThirdRoute
  });

  return(
  <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={props => <TabBar {...props} style={{
        backgroundColor: COLORS.pink,
        height: 50,
        shadowOffset: {
          width: 0,
          height: -2, 
        },
        shadowOpacity: 0.1,
        justifyContent: 'center',
   
        elevation: 4,
        shadowColor: '#000000',
        color:'whit'
      }}  labelStyle={{
        color: 'white',
      }}
      />} 
  />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF', // White background color
    // Adjust the height as needed
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000', // Shadow color
    // Shadow opacity
   
    elevation: 4, // Elevation for Android
  },
});

export default MatchesScreen;
