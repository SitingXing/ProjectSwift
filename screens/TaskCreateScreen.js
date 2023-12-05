import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from "react-native";
import { Icon, Input, Overlay } from "@rneui/themed";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";

import AttachedLinks from "../components/ProjectDetail/AttachedLinks";
import { addTask, updateTask } from "../data/Actions";
import { getDayEndDate } from "../DateSet";

function TaskCreateScreen({ route, navigation }) {
  const { projectId, task } = route.params;
  const dispatch = useDispatch();
  const stages = useSelector((state) => state.currentProjectStages);
  const [taskName, setTaskName] = useState(task.taskName);
  const [description, setDescription] = useState(task.description);
  const [selectedMembers, setSelectedMembers] = useState(task.selectedMembers);
  const [overlayShow, setOverlayShow] = useState(false);
  const [selectedStage, setSelectedStage] = useState(task.stage);
  const [stage, setStage] = useState(task.stage);
  const [selectorShow, setSelectorShow] = useState(false);
  const [due, setDue] = useState(new Date(task.due));
  const [showDue, setShowDue] = useState(false);
  const [links, setLinks] = useState(task.links);

  const selectMember = (item) => {
    const list = [...selectedMembers];
    const updatedList = list.map((user) =>
      user.key === item.key ? { ...item, selected: !item.selected } : user
    );
    setSelectedMembers(updatedList);
  };

  const handleLinksPlus = () => {
    const newLink = {
      name: "",
      link: "",
    };
    setLinks([...links, newLink]);
  };

  const handleLinkNameInput = (index, text) => {
    const newLinks = [...links];
    const newLink = { ...newLinks[index] };
    newLink.name = text;
    newLinks[index] = newLink;
    setLinks(newLinks);
  };

  const handleLinkInput = (index, text) => {
    const newLinks = [...links];
    const newLink = { ...newLinks[index] };
    newLink.link = text;
    newLinks[index] = newLink;
    setLinks(newLinks);
  };

  const saveTask = () => {
    const selected = selectedMembers.filter(
      (member) => member.selected === true
    );
    const members = selected.map((member) => member.key);
    let stageToSave;
    if (stage.key) {
      stageToSave = stage.key;
    } else {
      stageToSave = "";
    }
    const updatedTask = {
      assignedTo: members,
      attachedLinks: links,
      description: description,
      dueDate: due,
      finished: task.finished,
      stage: stageToSave,
      taskName: taskName,
    };
    if (task.key === -1) {
      dispatch(
        addTask(
          taskName,
          description,
          members,
          stageToSave,
          due,
          links,
          projectId
        )
      );
      navigation.navigate("Home", { screen: "Projects" });
    } else {
      dispatch(updateTask(updatedTask, task.key, projectId));
      navigation.navigate("Home", { screen: "Projects" });
    }
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            style={styles.backIcon}
            name="chevron-back"
            type="ionicon"
            size={30}
            color="#1A1E1F"
          />
        </TouchableOpacity>
        <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
          {task.key === -1 ? "New Task" : "Edit Task"}
        </Text>
      </View>
      {/* Input */}
      <ScrollView style={styles.inputArea}>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Task Name
          </Text>
          <Input
            style={styles.inputBox}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[
              styles.inputStyle,
              { fontFamily: "Poppins_400Regular" },
            ]}
            value={taskName}
            onChangeText={(text) => setTaskName(text)}
          />
        </View>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Description
          </Text>
          <Input
            multiline
            numberOfLines={5}
            style={styles.inputBoxDes}
            inputContainerStyle={styles.inputContainerStyle}
            inputStyle={[
              styles.inputStyle,
              { fontFamily: "Poppins_400Regular" },
            ]}
            textAlignVertical="top"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Assign To
          </Text>
          <View style={styles.assignTo}>
            {selectedMembers.map((member, index) => {
              if (member.selected) {
                return (
                  <View key={index}>
                    <Image
                      style={styles.profileImage}
                      source={{ uri: member.profile }}
                    />
                  </View>
                );
              }
            })}
            <TouchableOpacity onPress={() => setOverlayShow(true)}>
              <Icon
                type="ant-design"
                name="pluscircle"
                size={40}
                color="#F7F7F7"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Stage
          </Text>
          <View style={styles.selectorContainer}>
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => setSelectorShow(true)}
            >
              <Text
                style={[
                  styles.inputStyle,
                  { fontFamily: "Poppins_400Regular" },
                ]}
              >
                {stage.stageName}
              </Text>
              <Icon
                name="chevron-down"
                type="entypo"
                size={18}
                color="#265504"
              />
            </TouchableOpacity>
            <View style={styles.stageDates}>
              {Object.keys(stage).length !== 0 ? (
                <Text
                  style={[
                    styles.stageDateP,
                    { fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  {new Date(stage.startDate).toLocaleDateString()}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.stageDateP,
                    { fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  Start
                </Text>
              )}
              <Text
                style={[
                  styles.stageDateTo,
                  { fontFamily: "Poppins_400Regular" },
                ]}
              >
                to
              </Text>
              {Object.keys(stage).length !== 0 ? (
                <Text
                  style={[
                    styles.stageDateP,
                    { fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  {new Date(stage.endDate).toLocaleDateString()}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.stageDateP,
                    { fontFamily: "Poppins_400Regular" },
                  ]}
                >
                  End
                </Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Due
          </Text>
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDue(true)}
          >
            <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
              {new Date(due).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDue && (
            <DateTimePicker
              value={due}
              onChange={(event, selectedDate) => {
                setDue(getDayEndDate(selectedDate));
                setShowDue(false);
              }}
            />
          )}
        </View>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Attached Links
          </Text>
          <View style={styles.linksContainer}>
            {links.map((link, index) => (
              <AttachedLinks
                key={index}
                handleLinkNameInput={(text) => handleLinkNameInput(index, text)}
                handleLinkInput={(text) => handleLinkInput(index, text)}
                link={link}
              />
            ))}
            <TouchableOpacity onPress={handleLinksPlus}>
              <Icon
                style={{ marginHorizontal: 15 }}
                type="ant-design"
                name="pluscircle"
                size={30}
                color="#F7F7F7"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* buttons */}
      <View style={styles.btn}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => {
            saveTask();
          }}
        >
          <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
            {task.key === -1 ? "Add New Task" : "Save Edited Task"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* assign overlay */}
      <Overlay
        isVisible={overlayShow}
        onBackdropPress={() => setOverlayShow(false)}
        overlayStyle={styles.overlayContainer}
      >
        <Text
          style={[styles.overlayHeader, { fontFamily: "Poppins_600SemiBold" }]}
        >
          Member
        </Text>
        <View style={styles.userList}>
          {selectedMembers.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.userItemContainer}
                onPress={() => selectMember(item)}
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
                      ? [
                          styles.selectedName,
                          { fontFamily: "Poppins_500Medium" },
                        ]
                      : [styles.userName, { fontFamily: "Poppins_400Regular" }]
                  }
                >
                  {item.userName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.overlayBtn}
          onPress={() => setOverlayShow(false)}
        >
          <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
            Assigned
          </Text>
        </TouchableOpacity>
      </Overlay>
      {/* stage selector overlay */}
      <Overlay
        isVisible={selectorShow}
        onBackdropPress={() => setSelectorShow(false)}
        overlayStyle={styles.overlayContainer}
      >
        <Text
          style={[styles.overlayHeader, { fontFamily: "Poppins_600SemiBold" }]}
        >
          Stage
        </Text>
        <ScrollView>
          {[...stages]
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .map((s, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.options}
                  onPress={() => setSelectedStage(s)}
                >
                  <Text
                    style={
                      s.key === selectedStage.key
                        ? [
                            styles.stageNameSelected,
                            { fontFamily: "Poppins_500Medium" },
                          ]
                        : [
                            styles.stageName,
                            { fontFamily: "Poppins_500Medium" },
                          ]
                    }
                  >
                    {s.stageName}
                  </Text>
                  <View style={styles.optionDates}>
                    <Text
                      style={
                        s.key === selectedStage.key
                          ? [
                              styles.dateTextSelected,
                              { fontFamily: "Poppins_400Regular" },
                            ]
                          : [
                              styles.dateText,
                              { fontFamily: "Poppins_400Regular" },
                            ]
                      }
                    >
                      {new Date(s.startDate).toLocaleDateString()}
                    </Text>
                    <Text
                      style={
                        s.key === selectedStage.key
                          ? [
                              styles.dateTextSelected,
                              { fontFamily: "Poppins_400Regular" },
                            ]
                          : [
                              styles.dateText,
                              { fontFamily: "Poppins_400Regular" },
                            ]
                      }
                    >
                      to
                    </Text>
                    <Text
                      style={
                        s.key === selectedStage.key
                          ? [
                              styles.dateTextSelected,
                              { fontFamily: "Poppins_400Regular" },
                            ]
                          : [
                              styles.dateText,
                              { fontFamily: "Poppins_400Regular" },
                            ]
                      }
                    >
                      {new Date(s.endDate).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
        <TouchableOpacity
          style={styles.overlayBtn}
          onPress={() => {
            setStage(selectedStage);
            setSelectorShow(false);
          }}
        >
          <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
            Select
          </Text>
        </TouchableOpacity>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  headerContainer: {
    marginTop: 70,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  backIcon: {
    marginTop: 5,
    marginRight: 10,
  },
  header: {
    fontSize: 28,
    color: "#1A1E1F",
  },
  inputArea: {
    marginTop: 10,
    position: "absolute",
    top: "12.5%",
    width: "100%",
    height: "75%",
  },
  input: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
    marginLeft: 15,
    color: "#1A1E1F",
  },
  inputBox: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: -10,
  },
  inputBoxDes: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 5,
    marginBottom: -10,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    color: "#1A1E1F",
    fontSize: 16,
  },
  assignTo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
  },
  linksContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  dateBtn: {
    width: "97.5%",
    height: 40,
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingTop: 9,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: 15,
  },
  date: {
    fontSize: 16,
    color: "#1A1E1F",
  },
  selectorContainer: {
    marginHorizontal: 5,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorBtn: {
    width: "50%",
    height: 40,
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  stageDates: {
    width: "40%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "flex-end",
  },
  stageDate: {
    fontSize: 12,
    color: "#1A1E1F",
  },
  stageDateP: {
    fontSize: 12,
    color: "#828282",
  },
  stageDateTo: {
    fontSize: 14,
    color: "#265504",
  },
  btn: {
    position: "absolute",
    bottom: 35,
    width: "100%",
    alignItems: "center",
    zIndex: 99,
  },
  createBtn: {
    backgroundColor: "#C4E868",
    width: "85%",
    height: 45,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#265504",
    fontSize: 16,
    marginTop: 5,
  },
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
  options: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: "#F7F7F7",
    borderBottomWidth: 2,
  },
  optionDates: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    columnGap: 5,
  },
  stageName: {
    width: "50%",
    fontSize: 16,
    color: "#1A1E1F",
  },
  stageNameSelected: {
    width: "50%",
    fontSize: 16,
    color: "#265504",
  },
  dateText: {
    fontSize: 11,
    color: "#1A1E1F",
  },
  dateTextSelected: {
    fontSize: 11,
    color: "#265504",
  },
});

export default TaskCreateScreen;
