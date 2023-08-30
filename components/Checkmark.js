import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LottieView from 'lottie-react-native';

const Checkmark = ({ visible }) => {
  const [animationLoaded, setAnimationLoaded] = useState(false);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalOverlay}></View>
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Logging in...</Text>
        <LottieView
            source={require('../assets/Lottie/9844-loading-40-paperplane.json')}
            autoPlay
            loop
          />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // increase the opacity value to make the overlay darker
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 50,
    borderRadius: 10,
    padding: 20,
    height:"100%"
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default Checkmark;
