import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Icon, Overlay } from "@rneui/themed";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { updateTask } from "../../data/Actions";

function TaskItem({ tasks, task, projectId, navigation }) {
  const dispatch = useDispatch();
  const [overlayShow, setOverlayShow] = useState(false);

  const handleBtn = () => {
    const assignedTo = task.assignedTo.map((mem) => mem.key);
    const updatedTask = {
      finished: !task.finished,
      dueDate: new Date(task.dueDate),
      assignedTo: assignedTo,
      attachedLinks: task.attachedLinks,
      description: task.description,
      stage: task.stage.key,
      taskName: task.taskName,
    };
    dispatch(updateTask(updatedTask, task.key, projectId));
    setOverlayShow(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.checkBox}
        onPress={() => setOverlayShow(true)}
      >
        <View style={task.finished ? styles.checkedCircle : styles.circle}>
          {task.finished && (
            <Icon
              style={styles.checkmark}
              name="check"
              type="entypo"
              size={20}
              color="#265504"
            />
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => navigation.navigate("TaskDetail", {task: task, projectId: projectId, tasks: tasks})}
      >
        <View style={styles.contentBox}>
          <Text style={[styles.title, { fontFamily: "Poppins_500Medium" }]}>
            {task.taskName}
          </Text>
          <Text style={[styles.content, { fontFamily: "Poppins_400Regular" }]}>
            {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.assignContainer}>
          {task.assignedTo.map((mem, index) => {
            return (
              <Image
                key={index}
                source={{ uri: mem.profile }}
                style={styles.profile}
              />
            );
          })}
        </View>
      </TouchableOpacity>
      {/* overlay */}
      <Overlay
        isVisible={overlayShow}
        onBackdropPress={() => setOverlayShow(false)}
        overlayStyle={styles.overlayStyle}
      >
        <Text
          style={[styles.overlayText, { fontFamily: "Poppins_600SemiBold" }]}
        >
          {task.finished
            ? "Confirm to check as unfinished?"
            : "Confirm to check as finished?"}
        </Text>
        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.finishedBtn} onPress={handleBtn}>
            <Text
              style={[styles.finish, { fontFamily: "Poppins_600SemiBold" }]}
            >
              {task.finished ? "Unfinished" : "Finished"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => setOverlayShow(false)}
          >
            <Text
              style={[styles.cancel, { fontFamily: "Poppins_600SemiBold" }]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  circle: {
    position: "relative",
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#DFDFDF",
  },
  checkedCircle: {
    position: "relative",
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "#C4E868",
  },
  checkmark: {
    marginTop: 5,
  },
  title: {
    fontSize: 15,
  },
  content: {
    fontSize: 13,
    color: "#828282",
  },
  contentPassed: {
    fontSize: 13,
    color: "red",
  },
  contentContainer: {
    width: "85%",
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  assignContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profile: {
    marginLeft: 5,
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  overlayStyle: {
    width: "80%",
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  overlayText: {
    fontSize: 16,
    color: "#1A1E1F",
    marginBottom: 20,
  },
  btnContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  finishedBtn: {
    backgroundColor: "#C4E868",
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 40,
  },
  finish: {
    color: "#265504",
    marginTop: 2,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#B7B7B7",
    height: 35,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 40,
  },
  cancel: {
    color: "#B7B7B7",
    marginTop: 2,
  },
});

export default TaskItem;
