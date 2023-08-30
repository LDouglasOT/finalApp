import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { COLORS } from '../assets/Config/colors'

const DEFAULT_IMAGE_URL = 'https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7';

const Matches = ({ data, tosms }) => {
  const [image, setImage] = useState('https://img.freepik.com/free-photo/african-woman-posing-looking-up_23-2148747978.jpg?w=360&t=st=1682754347~exp=1682754947~hmac=1bd1626763ae44647968e93b5d78a660a66e5d3892fe10d4263f6d2fd81c41d7');

  const setAvailableImage = useCallback(() => {
    const availableImages = ['imgx', 'imgxx', 'imgxxx', 'imgxxxx'];
    for (const availableImage of availableImages) {
      if (data[availableImage]) {
        setImage(data[availableImage]);
        return;
      }
    }
    setImage(DEFAULT_IMAGE_URL);
  }, [data]);

  useEffect(() => {
    async function dip(){
      setAvailableImage();
    }
    dip()
    
  }, [setAvailableImage]);

  return (
    <TouchableOpacity style={{ margin: 5 }} onPress={() => tosms(data)}>
      <Image
        style={styles.image}
        source={{ uri: image }}
        resizeMode="cover"
        onError={() => setImage(DEFAULT_IMAGE_URL)}
      />
    </TouchableOpacity>
  );
};

export default Matches;

const styles = StyleSheet.create({
  image: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: COLORS.pink,
  },
});
