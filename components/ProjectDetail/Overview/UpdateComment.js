import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";

function UpdateComment({ task, update, navigation, projectId, tasks }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("TaskDetail", {
          task: task,
          projectId: projectId,
          tasks: tasks,
        })
      }
    >
      <Text style={[styles.title, { fontFamily: "Poppins_500Medium" }]}>
        {task.taskName}
      </Text>
      <Text style={[styles.content, { fontFamily: "Poppins_400Regular" }]}>
        {update.comment.author.userName} left a comment here
      </Text>
      <View style={styles.commentContainer}>
        <Image
          style={styles.teamProfile}
          source={{ uri: update.comment.author.profile }}
        />
        <View style={styles.comment}>
          <Text
            style={[styles.commentText, { fontFamily: "Poppins_400Regular" }]}
          >
            {update.comment.comment.length <= 27 && update.comment.comment}
            {update.comment.comment.length > 27 &&
              `${update.comment.comment.slice(0, 27)}...`}
          </Text>
        </View>
      </View>
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
    paddingBottom: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
  },
  content: {
    fontSize: 13,
    color: "#828282",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 5,
  },
  comment: {
    marginLeft: 15,
    width: "85%",
    backgroundColor: "#DCF3A0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  commentText: {
    fontSize: 13,
    color: "#265504",
  },
  teamProfile: {
    height: 30,
    width: 30,
    borderRadius: 30,
  },
});

export default UpdateComment;
