import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View,TextInput } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { COLORS } from '../assets/Config/colors';


const FilterPopup = ({ isVisible, onClose, onFilter }) => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');
  const [districts,setDistricts] = useState(["Wakiso", "Kampala", "Kalangala", "None"])
  const [hopes,setHopes] = useState(["A relationship", "Casual dating", "Friendship", "I'm not sure yet","Prefer not to say"])


  const handleFilter = () => {
    onFilter({ age, location, status });
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent>
      <View style={styles.container}>
        <View style={styles.popup}>
          <Text style={styles.title}>Filter by</Text>
          <View style={styles.filters}>
            <Text style={styles.filterLabel}>Age</Text>
            <SelectDropdown data={districts} onSelect={(selectedItem, index) => {setSelectedistrict(selectedItem)}} buttonStyle={styles.buttonxx} buttonTextStyle={{color:'white',fontWeight:'bold'}} defaultButtonText="Select religion" buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}} rowTextForSelection={(item, index) => {return item}}/>
            <SelectDropdown data={districts} onSelect={(selectedItem, index) => {setSelectedistrict(selectedItem)}} buttonStyle={styles.buttonxx} buttonTextStyle={{color:'white',fontWeight:'bold'}} defaultButtonText="Select country" buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}} rowTextForSelection={(item, index) => {return item}}/>
            
            <SelectDropdown data={hopes} onSelect={(selectedItem, index) => {setSelectedHopes(selectedItem)}} buttonStyle={styles.buttonxx} buttonTextStyle={{color:'white',fontWeight:'bold'}} defaultButtonText="Select his/her hopes" buttonTextAfterSelection={(selectedItem, index) => {return selectedItem}} rowTextForSelection={(item, index) => {return item}}/>
          
            <Text style={styles.filterLabel}>Status</Text>
            <View style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
            <View style={{width:"50%",display:'flex',alignItems:'flex-end',justifyContent:'flex-end'}}>
            <Text>From:</Text>
            <TextInput
              style={styles.filterInput}
              value={status}
              onChangeText={setStatus}
            />
            </View>
            <Text style={{fontSize:25,fontWeight:'bold',marginHorizontal:10}}>-</Text>
            <View style={{width:"50%",display:'flex',alignItems:'flex-start',justifyContent:'flex-start'}}>
            <Text>To:</Text>
            <TextInput
              style={styles.filterInput}
              value={status}
              onChangeText={setStatus}
            />
            </View>
           
            </View>
            
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleFilter}>
              <Text style={styles.buttonText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width:"100%"
  },
  popup: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width:"80%"
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filters: {
    marginBottom: 20,
  },
  filterLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    width:"50%"
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  buttonxx: {
    width: '90%',
    borderWidth: 1,
    borderRadius: 10,
    color:"white",
    borderColor:COLORS.pink,
    backgroundColor: COLORS.pink,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical:15
},
});

export default FilterPopup;
