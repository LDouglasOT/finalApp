import React, { useState } from 'react';
import { View, Button, StyleSheet,TouchableOpacity,Text } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS } from '../assets/Config/colors';


const DatepickerExample = ({getdate}) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      console.warn("A date has been picked: ", date);
      getdate(date)
      hideDatePicker();
    };
  return (
    <View style={{width:'90%',padding:5}}>
      <TouchableOpacity style={styles.button}  title="Show Date Picker" onPress={showDatePicker} >
        <Text style={{color:'white',fontWeight:'bold'}}>Select date of birth</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    button: {
      backgroundColor: COLORS.pink,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      width:'100%'
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  

export default DatepickerExample;
