import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useSelector } from "react-redux";

import TaskItem from "./TaskItem";

function TasksPage({ tasks, projectId, navigation }) {
  const filterList = ["All Tasks", "My Task", "Recent", "Unfinished"];
  const currentUser = useSelector((state) => state.currentUser);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const sortTasks = (tasks, filter) => {
    if (filter === 0) {
      const list = tasks.sort((a, b) => {
        const finishedComparison = a.finished - b.finished;
        if (finishedComparison === 0) {
          const dueDateA = new Date(a.dueDate).getTime();
          const dueDateB = new Date(b.dueDate).getTime();
          return dueDateA - dueDateB;
        }
        return finishedComparison;
      });
      return list;
    } else if (filter === 1) {
      const list = tasks.filter((task) =>
        task.assignedTo.some((user) => user.key === currentUser.key)
      );
      const orderList = list.sort((a, b) => {
        const dueDateA = new Date(a.dueDate).getTime();
        const dueDateB = new Date(b.dueDate).getTime();
        return dueDateA - dueDateB;
      });
      return orderList;
    } else if (filter === 2) {
      const recentDays = 7 * 24 * 60 * 60 * 1000;
      const currentDate = new Date();
      const list = tasks.filter((task) => {
        const date = new Date(task.dueDate).getTime();
        return (
          date >= currentDate - recentDays || date <= currentDate + recentDays
        );
      });
      const orderList = list.sort((a, b) => {
        const dueDateA = new Date(a.dueDate).getTime();
        const dueDateB = new Date(b.dueDate).getTime();
        return dueDateA - dueDateB;
      });
      return orderList;
    } else if (filter === 3) {
      const list = tasks.filter((task) => !task.finished);
      return list;
    }
  };

  const tasksList = sortTasks(tasks, selectedFilter);

  return (
    <View style={styles.container}>
      {/* filter */}
      <View style={styles.filterContainer}>
        {filterList.map((filter, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={
                selectedFilter === index ? styles.selectedFilter : styles.filter
              }
              onPress={() => setSelectedFilter(index)}
            >
              <Text
                style={
                  selectedFilter === index
                    ? [
                        styles.selectedText,
                        { fontFamily: "Poppins_400Regular" },
                      ]
                    : [styles.filterText, { fontFamily: "Poppins_400Regular" }]
                }
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* List */}
      <ScrollView>
        {tasksList.map((task, index) => {
          return (
            <TaskItem
              tasks={tasks}
              key={index}
              task={task}
              projectId={projectId}
              navigation={navigation}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 15,
    marginLeft: 2,
  },
  filter: {
    borderWidth: 0.5,
    borderColor: "#B7B7B7",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 7.5,
  },
  selectedFilter: {
    backgroundColor: "#5552C3",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 7.5,
  },
  filterText: {
    fontSize: 11,
    color: "#B7B7B7",
    marginTop: 2,
  },
  selectedText: {
    fontSize: 11,
    color: "white",
    marginTop: 2,
  },
});

export default TasksPage;
