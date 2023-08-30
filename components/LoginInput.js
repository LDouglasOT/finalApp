import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginInput = ({ iconName, placeholder, secureTextEntry, onChangeText }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 16 }}>
      <Ionicons name={iconName} size={24} color="#ccc" style={{ marginRight: 8 }} />
      <TextInput 
        placeholder={placeholder} 
        placeholderTextColor="#ccc"
        style={{ flex: 1, fontSize: 16, color: '#333', paddingVertical: 8 }}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default LoginInput;
