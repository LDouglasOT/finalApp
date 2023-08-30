import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';


const ProfilePopup = ({ profile1, profile2, onClose, onChat }) => {
  const [visible, setVisible] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const startChat = () => {
    // Start the chat between the two people
    setChatStarted(true);
  };
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.profilePictures}>
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: "https://img.freepik.com/free-photo/beautiful-woman-with-her-shoulders-naked-is-touching-her-body_144627-64.jpg?w=360&t=st=1682791231~exp=1682791831~hmac=13c3945af57d4607748431d5da6ae96e1eae0d9ef025a06c0f030ed3a5a2bbd0" }}
              style={styles.profilePicture}
            />
             <Image
              source={{ uri: "https://img.freepik.com/free-photo/beautiful-woman-with-her-shoulders-naked-is-touching-her-body_144627-64.jpg?w=360&t=st=1682791231~exp=1682791831~hmac=13c3945af57d4607748431d5da6ae96e1eae0d9ef025a06c0f030ed3a5a2bbd0" }}
              style={styles.profilePicture}
            />
           
          </View>
          <View style={styles.profilePictureContainer}>
            <Text style={styles.profileName}>Luzinda</Text>
            <Text style={styles.profileName}>Rahma</Text>
          </View>
        </View>
        {!chatStarted ? (
          <TouchableOpacity style={styles.chatButton} onPress={startChat}>
            <Text style={styles.chatButtonText}>Start Chatting</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.chatStartedText}>Chat started!</Text>
        )}
      </View>
    </View>
  </Modal>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        zIndex: 2,
      },
      closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
      },
      content: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
      },
      profilePictures: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      },
      profilePictureContainer: {
        marginHorizontal: 10,
        alignItems: 'center',
        display:'flex',
        flexDirection:'row'
        
      },
      profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#42f5e8',
      },
      profileName: {
        marginTop: 10,
        fontWeight: 'bold',
      },
      chatButton: {
        backgroundColor: '#42f5e8',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      chatButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
      },
      chatStartedText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'green',
      },
});

export default ProfilePopup;
