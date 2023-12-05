import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";

import AddMemberOverlay from "./AddMemberOverlay";

function TeamPage({ project, userList, projectId }) {
  const members = project.members;
  const [show, setShow] = useState(false);

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={() => setShow(true)}>
        <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
          Edit
        </Text>
      </TouchableOpacity>
      <ScrollView style={styles.container}>
        {members.map((member, index) => (
          <View key={index} style={styles.memContainer}>
            <Image source={{ uri: member.profile }} style={styles.profile} />
            <View style={styles.text}>
              <Text
                style={[styles.name, { fontFamily: "Poppins_600SemiBold" }]}
              >
                {member.userName}
              </Text>
              <Text
                style={[styles.email, { fontFamily: "Poppins_400Regular" }]}
              >
                {member.email}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <AddMemberOverlay
        show={show}
        setShow={setShow}
        userList={userList}
        projectId={projectId}
        members={members}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 40,
  },
  btn: {
    alignSelf: "flex-end",
    marginRight: 40,
    backgroundColor: "#C4E868",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  btnText: {
    color: "#265504",
    fontSize: 12,
  },
  memContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomColor: "#DFDFDF",
    borderBottomWidth: 0.75,
    paddingVertical: 12.5,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 20,
  },
  text: {
    marginTop: 2,
  },
  name: {
    fontSize: 16,
    color: "#1A1E1F",
  },
  email: {
    fontSize: 13,
    color: "#1A1E1F",
    marginTop: -2,
  },
});

export default TeamPage;
