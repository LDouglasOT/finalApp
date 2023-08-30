import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import Svg, { Circle } from 'react-native-svg';

const PopupLoader = ({ visible }) => {
  return (
    <Modal isVisible={visible} animationIn="fadeIn" animationOut="fadeOut">
      <View style={styles.container}>
        <Svg height={80} width={80}>
          <Circle
            cx={40}
            cy={40}
            r={30}
            stroke="#9B9B9B"
            strokeWidth={10}
            fill="transparent"
          />
          <Circle
            cx={40}
            cy={40}
            r={30}
            stroke="#0C69C7"
            strokeWidth={5}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray="50"
            strokeDashoffset="50"
          />
        </Svg>
        <ActivityIndicator size="large" style={styles.loader} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  loader: {
    position: 'absolute',
  },
});

export default PopupLoader;
