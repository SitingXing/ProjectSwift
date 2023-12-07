import { View, StyleSheet, Text } from "react-native";

import TaskItem from "../ProjectDetail/Tasks/TaskItem";

function MyTasksItem({ item, navigation }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.projectName, { fontFamily: "Poppins_600SemiBold" }]}>
        {item.projectName}
      </Text>
      {item.userTasks.map((task, index) => (
        <TaskItem
          key={index}
          tasks={item.tasks}
          task={task}
          projectId={item.projectId}
          navigation={navigation}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5552C3",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 2.5,
    borderRadius: 10,
  },
  projectName: {
    fontSize: 15,
    color: "white",
    marginBottom: 5,
    marginLeft: 2,
  },
});

export default MyTasksItem;
