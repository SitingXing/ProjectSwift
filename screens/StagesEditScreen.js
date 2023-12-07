import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";

import StageEditItem from "../components/ProjectDetail/Stages/StageEditItem";
import { subscribeToStagesUpdate, updateProject } from "../data/Actions";
import { getDayEndDate, getDayStartDate } from "../DateSet";

function StagesEditScreen({ navigation, route }) {
  const { projectId, userList } = route.params;
  const dispatch = useDispatch();
  const stages = useSelector((state) => state.currentProjectStages);
  const sortedStages = [...stages].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );
  const [updatedStages, setUpdatedStages] = useState([...sortedStages]);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [selected, setSelected] = useState(0);
  const [deleted, setDeleted] = useState([]);

  const onChangeText = (index, text) => {
    const list = [...updatedStages];
    list[index].stageName = text;
    setUpdatedStages(list);
  };

  const onChangeStart = (index, date) => {
    const list = [...updatedStages];
    list[index].startDate = date.toString();
    setUpdatedStages(list);
  };

  const onChangeEnd = (index, date) => {
    const list = [...updatedStages];
    list[index].endDate = date.toString();
    setUpdatedStages(list);
  };

  const onPressPlus = () => {
    const add = {
      endDate: new Date().toString(),
      stageName: "",
      startDate: new Date().toString(),
    };
    const newList = [...updatedStages];
    newList.push(add);
    setUpdatedStages(newList);
  };

  const onPressMinus = (stage) => {
    const list = [...updatedStages];
    const newList = list.filter((item) => item.key !== stage.key);
    setUpdatedStages(newList);
    const deletedList = [...deleted].concat(stage.key);
    setDeleted(deletedList);
  };

  const handleSave = () => {
    const updates = {
      stages: [...updatedStages],
      deleted: deleted,
    };
    dispatch(updateProject(updates, projectId, userList));
    navigation.goBack();
  };

  useEffect(() => {
    dispatch(subscribeToStagesUpdate(projectId));
  }, []);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            style={styles.backIcon}
            name="chevron-back"
            type="ionicon"
            size={26}
            color="#1A1E1F"
          />
        </TouchableOpacity>
        <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
          Edit Stages
        </Text>
      </View>
      {/* input area */}
      <View style={styles.scroll}>
        <ScrollView style={styles.inputContainer}>
          {updatedStages.map((stage, index) => (
            <StageEditItem
              key={index}
              stage={stage}
              onChangeText={(text) => onChangeText(index, text)}
              setSelected={() => setSelected(index)}
              setShowStart={setShowStart}
              setShowEnd={setShowEnd}
              onPressMinus={onPressMinus}
            />
          ))}
          <TouchableOpacity onPress={onPressPlus}>
            <Icon
              name="pluscircle"
              type="antdesign"
              size={32}
              color="#F7F7F7"
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
      {showStart && (
        <DateTimePicker
          value={new Date(updatedStages[selected].startDate)}
          onChange={(event, selectedDate) => {
            onChangeStart(selected, getDayStartDate(selectedDate));
            setShowStart(!showStart);
          }}
        />
      )}
      {showEnd && (
        <DateTimePicker
          value={new Date(updatedStages[selected].endDate)}
          onChange={(event, selectedDate) => {
            onChangeEnd(selected, getDayEndDate(selectedDate));
            setShowEnd(!showEnd);
          }}
        />
      )}
      {/* button */}
      <View style={styles.btn}>
        <TouchableOpacity style={styles.createBtn} onPress={handleSave}>
          <Text style={[styles.btnText, { fontFamily: "Poppins_600SemiBold" }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 2,
    marginRight: 10,
  },
  header: {
    fontSize: 22,
    color: "#1A1E1F",
  },
  scroll: {
    height: "75%",
  },
  inputContainer: {
    marginHorizontal: 25,
    marginTop: 10,
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
});

export default StagesEditScreen;
