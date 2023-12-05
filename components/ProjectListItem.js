import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import { Icon } from "@rneui/themed";

function ProjectListItem({ item, navigation, currentUser }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("ProjectDatail", {
          projectId: item.key,
          currentUser: currentUser,
        })
      }
    >
      <View style={styles.dateContainer}>
        <Icon name="flag" type="ionicon" size={16} color="white" />
        <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
          {item.endDate}
        </Text>
      </View>
      <Image style={styles.icon} source={{ uri: item.logo }} />
      <Text style={[styles.name, { fontFamily: "Poppins_600SemiBold" }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5552C3",
    height: 175,
    width: 175,
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
  },
  dateContainer: {
    backgroundColor: "#4847A6",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  date: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
  icon: {
    marginLeft: 15,
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  name: {
    fontSize: 24,
    color: "white",
    paddingLeft: 15,
  },
});

export default ProjectListItem;
