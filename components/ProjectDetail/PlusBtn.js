import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Icon, Overlay } from "@rneui/themed";
import { useState } from "react";
import AddMemberOverlay from "./AddMemberOverlay";
import { getDayEndDate } from "../../DateSet";

function PlusBtn({ navigation, members, stages, projectId, userList }) {
  const [overlayShow, setOverlayShow] = useState(false);
  const [plusShow, setPlusShow] = useState(true);
  const [memberShow, setMemberShow] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const plusPosition = (screenHeight * 2.1) / 3;
  const minusPosition = plusPosition - 40 - 22.5;

  return (
    <View style={styles.container}>
      {plusShow && (
        <TouchableOpacity
          style={[styles.btn, { top: plusPosition }]}
          onPress={() => {
            setPlusShow(false);
            setOverlayShow(!overlayShow);
          }}
        >
          <Icon type="octicon" name="plus" size={36} color="#265504" />
        </TouchableOpacity>
      )}
      <Overlay
        isVisible={overlayShow}
        onBackdropPress={() => {
          setOverlayShow(false);
          setPlusShow(true);
        }}
        overlayStyle={[styles.overlayStyle, { top: minusPosition }]}
        animationType="fade"
      >
        <View style={styles.plusContainer}>
          <TouchableOpacity
            style={styles.plusItem}
            onPress={() => {
              navigation.navigate("TaskCreate", {
                members: members,
                stages: stages,
                projectId: projectId,
                task: {
                  key: -1,
                  taskName: "",
                  description: "",
                  selectedMembers: [...members],
                  stage: {},
                  due: getDayEndDate(new Date()).toString(),
                  links: [],
                },
              });
              setPlusShow(true);
              setOverlayShow(false);
            }}
          >
            <Icon type="octicon" name="plus" size={24} color="#C4E868" />
            <Text style={[styles.text, { fontFamily: "Poppins_500Medium" }]}>
              New Task
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusItem}
            onPress={() => {
              setPlusShow(true);
              setOverlayShow(false);
              navigation.navigate("StagesEdit", {
                stages: [...stages],
                projectId: projectId,
                userList: userList,
              });
            }}
          >
            <Icon type="octicon" name="plus" size={24} color="#C4E868" />
            <Text style={[styles.text, { fontFamily: "Poppins_500Medium" }]}>
              Edit Stages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plusItem}
            onPress={() => {
              setOverlayShow(false);
              setPlusShow(true);
              setMemberShow(true);
            }}
          >
            <Icon type="octicon" name="plus" size={24} color="#C4E868" />
            <Text style={[styles.text, { fontFamily: "Poppins_500Medium" }]}>
              Edit Members
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.openedBtn}
          onPress={() => {
            setPlusShow(true);
            setOverlayShow(!overlayShow);
          }}
        >
          <Icon type="octicon" name="dash" size={36} color="#265504" />
        </TouchableOpacity>
      </Overlay>
      <AddMemberOverlay
        show={memberShow}
        setShow={setMemberShow}
        userList={userList}
        members={members}
        projectId={projectId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    right: 15,
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: "#C4E868",
    justifyContent: "center",
    zIndex: 99,
  },
  overlayStyle: {
    position: "absolute",
    right: 27.5,
    height: 125,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12.5,
  },
  plusContainer: {
    alignItems: "flex-start",
    rowGap: 5,
    marginTop: 4,
  },
  plusItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 10,
  },
  text: {
    fontSize: 16,
    color: "#265504",
    marginTop: 2,
  },
  openedBtn: {
    position: "absolute",
    right: -12.5,
    bottom: -93,
    width: 65,
    height: 65,
    borderRadius: 65,
    backgroundColor: "white",
    justifyContent: "center",
    zIndex: 2,
  },
});

export default PlusBtn;
