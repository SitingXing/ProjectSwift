import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

function ChatListScreen({ navigation }) {
  const projects = useSelector((state) => state.projects);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[styles.headerText, { fontFamily: "Poppins_600SemiBold" }]}
        >
          Chats
        </Text>
      </View>
      <View style={styles.chatListContainer}>
        {projects.map((project, index) => (
          <TouchableOpacity key={index} style={styles.chatList}>
            <Image source={{ uri: project.logo }} style={styles.logo} />
            <View style={styles.content}>
              <Text
                style={[
                  styles.projectName,
                  { fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {project.name}
              </Text>
              <Text
                style={[styles.message, { fontFamily: "Poppins_400Regular" }]}
              >
                message message message messa...
              </Text>
            </View>
            <View style={styles.notification}>
              <Text
                style={[
                  styles.notificationNumber,
                  { fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                1
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  header: {
    marginTop: 70,
    marginLeft: 30,
  },
  headerText: {
    fontSize: 28,
    color: "#1A1E1F",
  },
  chatListContainer: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  chatList: {
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomColor: "#DFDFDF",
    borderBottomWidth: 0.75,
    paddingVertical: 12.5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  projectName: {
    fontSize: 16,
    color: "#1A1E1F",
    marginBottom: -5,
  },
  message: {
    fontSize: 12,
    color: "#828282",
  },
  notification: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 200,
    backgroundColor: "#F06060",
  },
  notificationNumber: {
    fontSize: 14,
    color: "white",
    marginTop: 2,
  },
});

export default ChatListScreen;
