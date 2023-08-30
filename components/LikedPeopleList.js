import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { COLORS } from '../assets/Config/colors';
import { ProfileScreen } from '../screens';

const LikedPeopleList = () => {

  const [likedPeople, setLikedPeople] = useState([
    { id: '1', name: 'John Doe', location: 'New York, NY', image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fbeautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg&tbnid=3du_EqKvbNmtvM&vet=12ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fnature.html&docid=bH1YFPQkm85agM&w=800&h=533&q=images&ved=2ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ" },
    { id: '2', name: 'Jane Doe', location: 'Los Angeles, CA', image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fbeautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg&tbnid=3du_EqKvbNmtvM&vet=12ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fnature.html&docid=bH1YFPQkm85agM&w=800&h=533&q=images&ved=2ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ" },
    { id: '3', name: 'Jack Smith', location: 'Chicago, IL', image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fbeautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg&tbnid=3du_EqKvbNmtvM&vet=12ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fnature.html&docid=bH1YFPQkm85agM&w=800&h=533&q=images&ved=2ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ" },
    { id: '4', name: 'Jill Johnson', location: 'Houston, TX', image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fbeautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg&tbnid=3du_EqKvbNmtvM&vet=12ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fnature.html&docid=bH1YFPQkm85agM&w=800&h=533&q=images&ved=2ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ" },
    { id: '5', name: 'Jim Brown', location: 'Philadelphia, PA', image: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fb%2Fbeautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg&tbnid=3du_EqKvbNmtvM&vet=12ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Fphotos-images%2Fnature.html&docid=bH1YFPQkm85agM&w=800&h=533&q=images&ved=2ahUKEwiQgvPRs_L-AhVIkicCHb0pBcYQMygCegUIARDiAQ" },
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={likedPeople}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default LikedPeopleList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemLocation: {
    fontSize: 14,
    color: COLORS.gray,
  },
});
