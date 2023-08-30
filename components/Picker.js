import { StyleSheet, View, TouchableOpacity,Image,ActivityIndicator,Text } from "react-native";
import React,{useState} from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getStorage,ref,uploadBytes,getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


const firebaseConfig = {
  apiKey: "AIzaSyDZ0Dc5HQXCkrwfmJuoZcrSAVT_vcE_Bi0",
  authDomain: "flirtify-616c0.firebaseapp.com",
  projectId: "flirtify-616c0",
  storageBucket: "flirtify-616c0.appspot.com",
  messagingSenderId: "305402540915",
  appId: "1:305402540915:web:a2ea8b773d478e5cd90b06",
  measurementId: "G-G2C9KGD4XV"
};
initializeApp(firebaseConfig)

const Picker = ({appendImg}) => {
    const [resourcePath,setresourcePath] = useState(null)
    const [upload,setUpload] = useState(true)

    
    const selectFile = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission not granted.');
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
          aspect: [3, 2]
        });
        
    
        if (!result.cancelled) {
          setUpload(true);
    
          const responseURI = result.uri;
    
          // Resize the selected image
          const resizedUri = await resizeImage(responseURI);
    
          setresourcePath(resizedUri);
          const fileName = `${Date.now()}-image.webp`; // Change the file name to .webp format
    
          const storage = getStorage();
          const reference = ref(storage, fileName);
    
          console.log('Response URI:', responseURI);
    
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
              resolve(xhr.response);
            };
            xhr.onerror = (e) => {
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', resizedUri, true);
            xhr.send(null);
          });
    
          await uploadBytes(reference, blob);
          const url = await getDownloadURL(reference);
          appendImg(url);
        } else {
          console.log('Image selection canceled.');
        }
      } catch (error) {
        console.log('Error:', error.message);
        // Handle any errors that occurred during image selection or upload
      } finally {
        setUpload(false);
      }
    };
    getResizePercentage = (width, height) => {
      let percentage = 0
      let newWidth = width
      let newHeight = height
    
      while (newWidth > 1200 || newHeight > 1150) {
        percentage += 0.01
        newWidth = width - width * percentage
        newHeight = height - height * percentage
      }
    
      return percentage
    }


    const resizeImage = async (uri) => {
      return new Promise(async (resolve, reject) => {
        try {
          Image.getSize(uri, async (width, height) => {
            console.log(width, height);
            let percentage = await getResizePercentage(width, height);
            
            const resizedImage = await ImageManipulator.manipulateAsync(
              uri,
              [
                {
                  resize: {
                    width: width - width * percentage,
                    height: height - height * percentage,
                  },
                },
              ],
              { compress: 1, format: ImageManipulator.SaveFormat.PNG }
            );
            console.log(resizedImage.uri);
            resolve(resizedImage.uri);
          });
        } catch (error) {
          reject(error);
        }
      });
    };
    
    
    
  
  return (
    <TouchableOpacity style={styles.container} onPress={selectFile}>
    {resourcePath ? (
      <View style={styles.imageContainer}>
        {upload && <ActivityIndicator size="large" color="#00ff00" style={styles.loadingIndicator} />}
        <Image source={{ uri: resourcePath }} style={styles.image} />
      </View>
    ) : (
      <View style={styles.btnSelect}>
        <MaterialCommunityIcons name="camera-plus" size={44} color="#FF559D" />
        <Text style={styles.text}>Select Image</Text>
      </View>
    )}
  </TouchableOpacity>
  )
}

export default Picker

const styles = StyleSheet.create({
  container: {
    width: "45%",
    height: 145,
    margin: 3,
  },
  btnSelect: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  text: {
    marginTop: 10,
    color: "#757575",
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  loadingIndicator: {
    position: "absolute",
    zIndex: 9999,
    alignSelf: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  })