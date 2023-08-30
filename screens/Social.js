import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Checkbox,
  Icon,
} from "react-native";

const Social = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [facebookUsername, setFacebookUsername] = useState("");
  const [twitterUsername, setTwitterUsername] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");

  const isPhoneNumberPublic = useState(false);
  const isPhoneNumberPrivate = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Social Media Usernames</Text>

      <TextInput
        placeholder="WhatsApp Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <Icon name="whatsapp" size={24} color="black" />

      <TextInput
        placeholder="Email Address"
        value={emailAddress}
        onChangeText={setEmailAddress}
        style={styles.input}
      />
      <Icon name="mail" size={24} color="black" />

      <TextInput
        placeholder="Facebook Username"
        value={facebookUsername}
        onChangeText={setFacebookUsername}
        style={styles.input}
      />
      <Icon name="facebook" size={24} color="black" />

      <TextInput
        placeholder="Twitter Username"
        value={twitterUsername}
        onChangeText={setTwitterUsername}
        style={styles.input}
      />
      <Icon name="twitter" size={24} color="black" />

      <TextInput
        placeholder="Instagram Username"
        value={instagramUsername}
        onChangeText={setInstagramUsername}
        style={styles.input}
      />
      <Icon name="instagram" size={24} color="black" />

      <Checkbox
        checked={isPhoneNumberPublic}
        onChange={() => setIsPhoneNumberPublic(!isPhoneNumberPublic)}
      >
        Make Phone Number Public
      </Checkbox>
      <Checkbox
        checked={isPhoneNumberPrivate}
        onChange={() => setIsPhoneNumberPrivate(!isPhoneNumberPrivate)}
      >
        Make Phone Number Private
      </Checkbox>
    </View>
  );
};
export default Social;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 4,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
});


