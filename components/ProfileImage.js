import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

const ProfileImage = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <View style={{ margin: 5 }}>
      <TouchableOpacity onPress={handleImageClick}>
        <Image style={styles.image} source={{ uri: data }} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image style={styles.modalImage} source={{ uri: data }} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    borderRadius: 3,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalImage: {
    height: '80%',
    width: '80%',
  },
});
