import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Input } from "@rneui/themed";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

function ProjectStageItem({
  handleStageNameInput,
  handleStageStartInput,
  handleStageEndInput,
}) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [showstart, setShowstart] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showend, setShowend] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Input
          placeholder="Enter a name"
          style={styles.inputBox}
          inputContainerStyle={styles.inputContainerStyle}
          inputStyle={[styles.inputStyle, { fontFamily: "Poppins_400Regular" }]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            handleStageNameInput(text);
          }}
        />
      </View>
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
            setShowstart(false);
            setStartDate(selectedDate);
            handleStageStartInput(selectedDate);
          }}
        />
      )}
      <Text style={[styles.to, { fontFamily: "Poppins_400Regular" }]}>to</Text>
      <TouchableOpacity style={styles.dateBtn} onPress={() => setShowend(true)}>
        <Text style={[styles.date, { fontFamily: "Poppins_400Regular" }]}>
          {endDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showend && (
        <DateTimePicker
          value={endDate}
          onChange={(event, selectedDate) => {
            setShowend(false);
            setEndDate(selectedDate);
            handleStageEndInput(selectedDate);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginBottom: -15,
  },
  input: {
    width: "45%",
  },
  inputBox: {
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    color: "#1A1E1F",
    fontSize: 16,
  },
  dateBtn: {
    height: 40,
    borderWidth: 1,
    borderColor: "#F7F7F7",
    borderRadius: 20,
    alignItems: "center",
    paddingTop: 9,
    paddingHorizontal: 5,
  },
  date: {
    color: "#1A1E1F",
  },
  to: {
    paddingTop: 9,
  },
});

export default ProjectStageItem;
