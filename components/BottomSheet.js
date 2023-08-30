import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';

const UniversityScreen = () => <Text>University Screen</Text>;
const InterestsScreen = () => <Text>Interests Screen</Text>;
const HobbiesScreen = () => <Text>Hobbies Screen</Text>;

const BottomPopupSheet = () => {
  const [visible, setVisible] = React.useState(true);
  const [screen, setScreen] = React.useState(null);

  const showScreen = (screenComponent) => {
    setScreen(screenComponent);
    setVisible(true);
  };

  const hideScreen = () => {
    setVisible(false);
  };

  return (
    <View>
      <Button onPress={() => showScreen(UniversityScreen)}>Enter University</Button>
      <Button onPress={() => showScreen(InterestsScreen)}>Select Interests</Button>
      <Button onPress={() => showScreen(HobbiesScreen)}>Select Hobbies</Button>

      <Portal>
        <Modal visible={visible} onDismiss={hideScreen} contentContainerStyle={styles.modal}>
          {screen && screen()}
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default BottomPopupSheet;
