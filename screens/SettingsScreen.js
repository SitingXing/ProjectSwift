import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector } from "react-redux";

import { signOut } from "../AuthManager";
import {
  unsubscribeFromCommentsUpdate,
  unsubscribeFromCurrentProjectUpdates,
  unsubscribeFromCurrentUserTasks,
  unsubscribeFromProjects,
  unsubscribeFromStageUpdate,
  unsubscribeFromTasksUpdate,
} from "../data/Actions";

function SettingsScreen() {
  const currentUser = useSelector((state) => state.currentUser);

  return (
    <View style={styles.container}>
      <View style={styles.settingsContainer}>
        <Image
          source={{ uri: currentUser.profile.uri }}
          style={styles.profile}
        />
        <Text style={[styles.userName, { fontFamily: "Poppins_600SemiBold" }]}>
          {currentUser.userName}
        </Text>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>
              Email
            </Text>
            <Text style={[styles.text, { fontFamily: "Poppins_400Regular" }]}>
              {currentUser.email}
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}>
              Uid
            </Text>
            <Text style={[styles.text, { fontFamily: "Poppins_400Regular" }]}>
              {currentUser.key}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btn}
          onPress={async () => {
            try {
              await signOut();
              unsubscribeFromProjects();
              unsubscribeFromCurrentProjectUpdates();
              unsubscribeFromStageUpdate();
              unsubscribeFromTasksUpdate();
              unsubscribeFromCommentsUpdate();
              unsubscribeFromCurrentUserTasks();
            } catch (error) {
              Alert.alert("Sign Out Error", error.message, [{ text: "OK" }]);
            }
          }}
        >
          <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
            LogOut
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#C4E868",
    paddingTop: 200,
  },
  settingsContainer: {
    backgroundColor: "white",
    height: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: -50,
  },
  userName: {
    alignSelf: "center",
    fontSize: 26,
    color: "#1A1E1F",
    marginTop: 10,
  },
  contentContainer: {
    marginHorizontal: 30,
    alignItems: "center",
    marginTop: 20,
  },
  content: {
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#1A1E1F",
    marginBottom: -2,
  },
  text: {
    fontSize: 12,
    color: "#828282",
  },
  btn: {
    width: "80%",
    height: 35,
    backgroundColor: "#C4E868",
    alignSelf: "center",
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
  },
  btnText: {
    fontSize: 15,
    color: "#265504",
  },
});

export default SettingsScreen;
