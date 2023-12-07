import { StyleSheet, Text, TouchableOpacity } from "react-native";

function UpdateChange({ update, navigation, projectId, tasks }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("TaskDetail", {
          task: update,
          projectId: projectId,
          tasks: tasks,
        })
      }
    >
      <Text style={[styles.title, { fontFamily: "Poppins_500Medium" }]}>
        {update.taskName}
      </Text>
      <Text style={[styles.content, { fontFamily: "Poppins_400Regular" }]}>
        {update.edited.type === "change" && "There is a change to this task"}
        {update.edited.type === "create" && "There is a new task"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#DFDFDF",
    borderRadius: 10,
    paddingVertical: 7.5,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
  },
  content: {
    fontSize: 13,
    color: "#828282",
  },
});

export default UpdateChange;
