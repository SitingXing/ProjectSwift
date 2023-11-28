import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Icon, Input, Overlay } from "@rneui/themed";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import ProjectStageItem from "../components/ProjectStageItem";
import { setUserList, addProject } from "../data/Actions";

function ProjectCreateScreen({ navigation, route }) {
  const { currentUser } = route.params;
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const [projectLogo, setProjectLogo] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [showstart, setShowstart] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showend, setShowend] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [overlayShow, setOverlayShow] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState([]);

  const [stages, setStages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    setProjectLogo(result.assets[0]);
  };

  const selectMember = (item) => {
    const list = [...selectedMembers];
    const updatedList = list.map((user) =>
      user.key === item.key ? { ...item, selected: !item.selected } : user
    );
    setSelectedMembers(updatedList);
  };

  const handleStagePlus = () => {
    const newStage = {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
    };
    setStages([...stages, newStage]);
  };

  const handleStageNameInput = (index, text) => {
    const newStages = [...stages];
    const newStage = { ...newStages[index] };
    newStage.title = text;
    newStages[index] = newStage;
    setStages(newStages);
  };

  const handleStageStartInput = (index, date) => {
    const newStages = [...stages];
    const newStage = { ...newStages[index] };
    newStage.startDate = date;
    newStages[index] = newStage;
    setStages(newStages);
  };

  const handleStageEndInput = (index, date) => {
    const newStages = [...stages];
    const newStage = { ...newStages[index] };
    newStage.endDate = date;
    newStages[index] = newStage;
    setStages(newStages);
  };

  const saveProject = () => {
    const selected = selectedMembers.filter(member => member.selected === true);
    const savedMembers = selected.map(member => member.key);
    const members = savedMembers.concat(currentUser.key);
    dispatch(addProject(projectLogo.uri, projectName, description, members, startDate, endDate, stages));
  };

  useEffect(() => {
    dispatch(setUserList(currentUser));
  }, []);

  useEffect(() => {
    setSelectedMembers(
      [...userList].map((user) => {
        return {
          ...user,
          selected: false,
        };
      })
    );
  }, [userList]);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ProjectList")}>
          <Icon
            style={styles.backIcon}
            name="chevron-back"
            type="ionicon"
            size={30}
            color="#1A1E1F"
          />
        </TouchableOpacity>
        <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
          New Project
        </Text>
      </View>
      {/* Input */}
      <View style={styles.inputArea}>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Project
          </Text>
          <View style={styles.projectInput}>
            <TouchableOpacity style={styles.logoBtn} onPress={pickImage}>
              {!projectLogo ? (
                <Icon
                  type="ant-design"
                  name="pluscircle"
                  size={40}
                  color="#F7F7F7"
                />
              ) : (
                <Image
                  source={{ uri: projectLogo.uri }}
                  style={{ width: 40, height: 40, borderRadius: 40 }}
                />
              )}
            </TouchableOpacity>
            <Input
              style={styles.inputBox}
              inputContainerStyle={styles.inputContainerStyle}
              inputStyle={[
                styles.inputStyle,
                { fontFamily: "Poppins_400Regular" },
              ]}
              value={projectName}
              onChangeText={(text) => setProjectName(text)}
            />
          </View>
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
            Team members
          </Text>
          <View style={styles.teamMember}>
            <Image
              style={styles.profileImage}
              source={{ uri: currentUser.profile.uri }}
            />
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
            Dates
          </Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowstart(true)}
            >
              <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
                {startDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showstart && (
              <DateTimePicker
                value={startDate}
                onChange={(event, selectedDate) => {
                  setStartDate(selectedDate);
                  setShowstart(false);
                }}
              />
            )}
            <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
              to
            </Text>
            <TouchableOpacity
              style={styles.dateBtn}
              onPress={() => setShowend(true)}
            >
              <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
                {endDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            {showend && (
              <DateTimePicker
                value={endDate}
                onChange={(event, selectedDate) => {
                  setEndDate(selectedDate);
                  setShowend(false);
                }}
              />
            )}
          </View>
        </View>
        <View style={styles.input}>
          <Text style={[styles.label, { fontFamily: "Poppins_500Medium" }]}>
            Stages
          </Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.stageList}>
              {stages.map((stage, index) => (
                <ProjectStageItem
                  key={index}
                  handleStageNameInput={(text) =>
                    handleStageNameInput(index, text)
                  }
                  handleStageStartInput={(date) => handleStageStartInput(index, date)}
                  handleStageEndInput={(date) => handleStageEndInput(index, date)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.plusBtn} onPress={handleStagePlus}>
              <Icon
                type="ant-design"
                name="pluscircle"
                size={32}
                color="#F7F7F7"
                style={styles.plusIcon}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      {/* buttons */}
      <View style={styles.btn}>
        <TouchableOpacity
            style={styles.createBtn}
            onPress={saveProject}
        >
          <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
            Add New Project
          </Text>
        </TouchableOpacity>
      </View>
      {/* member selection */}
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
            Add Member
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
  },
  input: {
    marginHorizontal: 20,
  },
  label: {
    fontSize: 18,
    marginLeft: 15,
    color: "#1A1E1F",
  },
  projectInput: {
    width: "87%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  logoBtn: {
    marginBottom: 15,
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  inputBox: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: -5,
  },
  inputBoxDes: {
    width: "100%",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 5,
    marginBottom: -5,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    color: "#1A1E1F",
    fontSize: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  teamMember: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  dateContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 15,
  },
  dateBtn: {
    width: "40%",
    height: 40,
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    alignItems: "center",
    paddingTop: 9,
  },
  date: {
    fontSize: 16,
    color: "#1A1E1F",
  },
  scrollView: {
    height: 160,
  },
  plusBtn: {
    alignSelf: "flex-start",
    marginLeft: 20,
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
});

export default ProjectCreateScreen;
