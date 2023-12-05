import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Overlay } from "@rneui/themed";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProject } from "../../data/Actions";

function AddMemberOverlay({ show, setShow, userList, members, projectId }) {
  const dispatch = useDispatch();
  const updateUserList = [...userList].map((user) =>
    members.some((item) => Object.values(item).includes(user.key))
      ? { ...user, selected: true }
      : user
  );
  const [selectedMembers, setSelectedMembers] = useState([...updateUserList]);

  const handleMemberPress = (item) => {
    const list = [...selectedMembers];
    const newList = list.map((mem) =>
      mem.key === item.key ? { ...item, selected: !item.selected } : mem
    );
    setSelectedMembers(newList);
  };

  const handleSavePress = () => {
    const list = [...selectedMembers];
    members.forEach((mem) => {
      if (!list.some((item) => Object.values(item).includes(mem.key))) {
        list.push({
          ...mem,
          selected: true,
        });
      }
    });
    const memberList = list.filter((mem) => mem.selected === true);
    const updatedMembers = memberList.map((mem) => mem.key);
    const update = {
      members: updatedMembers,
    };
    dispatch(updateProject(update, projectId, [...userList]));
    setShow(false);
  };

  return (
    <Overlay
      isVisible={show}
      onBackdropPress={() => setShow(false)}
      overlayStyle={styles.overlayContainer}
    >
      <Text
        style={[styles.overlayHeader, { fontFamily: "Poppins_600SemiBold" }]}
      >
        Edit Member
      </Text>
      <View style={styles.userList}>
        {selectedMembers.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.userItemContainer}
              onPress={() => handleMemberPress(item)}
            >
              <Image
                source={{ uri: item.profile }}
                style={
                  item.selected ? styles.selectedProfile : styles.userProfile
                }
              />
              <Text
                style={
                  item.selected
                    ? [styles.selectedName, { fontFamily: "Poppins_500Medium" }]
                    : [styles.userName, { fontFamily: "Poppins_400Regular" }]
                }
              >
                {item.userName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.overlayBtn} onPress={handleSavePress}>
        <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
          Save
        </Text>
      </TouchableOpacity>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    height: "40%",
    width: "80%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  overlayHeader: {
    fontSize: 20,
    color: "#1A1E1F",
    paddingBottom: 10,
    borderBottomColor: "#F7F7F7",
    borderBottomWidth: 2,
  },
  userList: {
    marginTop: 20,
    marginHorizontal: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    rowGap: 15,
  },
  userItemContainer: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  userProfile: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  selectedProfile: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderColor: "#265504",
    borderWidth: 3,
  },
  userName: {
    color: "#1A1E1F",
    fontSize: 16,
  },
  selectedName: {
    color: "#265504",
    fontSize: 16,
  },
  overlayBtn: {
    position: "absolute",
    bottom: 25,
    left: 25,
    width: "100%",
    alignItems: "center",
    height: 40,
    backgroundColor: "#C4E868",
    borderRadius: 35,
    paddingTop: 2,
  },
  btnText: {
    color: "#265504",
    fontSize: 16,
    marginTop: 5,
  },
});

export default AddMemberOverlay;
