import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HobbiesPage = ({pagechange,pressback}) => {
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const handleHobbySelection = (hobby) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));
    } else {
      if (selectedHobbies.length < 3) {
        setSelectedHobbies([...selectedHobbies, hobby]);
      }
    }
  };

  const hobbies = [
    { id: 1, name: 'Photography' },
    { id: 2, name: 'Cooking' },
    { id: 3, name: 'Gardening' },
    { id: 4, name: 'Playing an Instrument' },
    { id: 5, name: 'Painting' },
    { id: 6, name: 'Sports' },
    { id: 1, name: 'Photography' },
    { id: 2, name: 'Cooking' },
    { id: 3, name: 'Gardening' },
    { id: 4, name: 'Playing an Instrument' },
    { id: 5, name: 'Painting' },
    { id: 6, name: 'Sports' },
    { id: 1, name: 'Photography' },
  ];

  return (
    <View style={styles.container}>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'flex-start',marginVertical:10}}>
      <TouchableOpacity onPress={()=>pressback()}>
        <AntDesign name="arrowleft" size={24} color="black" style={{marginRight:10}}/>
      </TouchableOpacity>
      <Text style={{marginRight:'auto',fontSize:20,fontWeight:600,marginLeft:10,marginVertical:5}}>Select upto 3 hobbies</Text>   
      </View>
      <View style={styles.hobbiesContainer}>
        {hobbies.map((hobby) => (
          <TouchableOpacity
            key={hobby.id}
            onPress={() => handleHobbySelection(hobby)}
            style={[
              styles.hobby,
              {
                backgroundColor: selectedHobbies.includes(hobby)
                  ? 'yello'
                  : 'green',
              },
            ]}
          >
            <Text style={styles.hobbyText}>{hobby.name}</Text>
          </TouchableOpacity>
        ))}
        
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={()=>pagechange()}>
        <Text style={styles.loginText}>REGISTER</Text>
      </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    display:'flex',
    justifyContent: 'center',
  },
  hobby: {
    width: '25%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: '2%',
  },
  hobbyText: {
    fontSize: 16,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#e91e63',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 10,
    elevation:10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HobbiesPage;
