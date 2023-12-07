import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import * as Progress from "react-native-progress";
import { useEffect, useState } from "react";

import OverviewLabel from "./OverviewLabel";
import TaskItem from "../Tasks/TaskItem";
import UpdateComment from "./UpdateComment";
import UpdateChange from "./UpdateChange";

function OverviewPage({
  members,
  currentStage,
  tasks,
  projectId,
  navigation,
  comments,
}) {
  const [teamShow, setTeamShow] = useState(true);
  const [updatesShow, setUpdatesShow] = useState(true);
  const [tasksShow, setTasksShow] = useState(true);

  const teamList = members.map((mem) => mem.profile);

  const [recentTasks, setRecentTasks] = useState([]);
  const getRecentTasks = () => {
    const recentTasks = tasks.filter((task) => {
      const recentDays = 7;
      const todayDate = new Date();
      const date = new Date(task.dueDate).getTime();
      const daysDifference = Math.floor(
        (todayDate - date) / (24 * 60 * 60 * 1000)
      );
      return (
        (date <= todayDate && !task.finished) ||
        (date >= todayDate && daysDifference <= recentDays)
      );
    });
    const orderedRecentTasks = recentTasks.sort((a, b) => {
      const dueDateA = new Date(a.dueDate).getTime();
      const dueDateB = new Date(b.dueDate).getTime();
      return dueDateA - dueDateB;
    });

    setRecentTasks(orderedRecentTasks);
  };

  const [recentUpdates, setRecentUpdates] = useState([]);
  const getRecentUpdates = () => {
    const commentsToUse = [...comments];
    const withComments = commentsToUse.filter(
      (item) => item.comments.length !== 0
    );

    let updateList = [];
    withComments.forEach((comment) => {
      const coms = [...comment.comments];
      const orderedComs = coms.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      updateList.push({
        comment: orderedComs[0],
        task: comment.taskId,
      });
    });

    const tasksToUse = [...tasks];
    tasksToUse.forEach((task) => {
      updateList.push(task);
    });

    const sortedUpdates = updateList.sort((a, b) => {
      const getTime = (item) => {
        if (item.edited && item.edited.time) {
          return new Date(item.edited.time).getTime();
        } else if (item.comment && item.comment.createdAt) {
          return new Date(item.comment.createdAt).getTime();
        }
        return 0;
      };

      const timeA = getTime(a);
      const timeB = getTime(b);

      return timeB - timeA;
    });

    setRecentUpdates(sortedUpdates.slice(0, 3));
  };

  const findTask = (taskId) => {
    for (let task of tasks) {
      if (task.key === taskId) {
        return task;
      }
    }
  };

  const [stageProgress, setStageProgress] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const calculateStageProgress = () => {
    const tasksCurrentStage = tasks.filter(
      (task) => task.stage.key && task.stage.key === currentStage.key
    );
    const total = tasksCurrentStage.length;
    if (total !== 0) {
      const finishedTasks = tasksCurrentStage.filter(
        (task) => task.finished === true
      ).length;
      const percentage = (finishedTasks / total) * 100;
      setStageProgress(Math.round(percentage));
    }
  };
  const calculateTotalProgress = () => {
    const total = tasks.length;
    if (total !== 0) {
      const finished = tasks.filter((task) => task.finished).length;
      const percentage = (finished / total) * 100;
      setTotalProgress(Math.round(percentage));
    }
  };

  useEffect(() => {
    getRecentTasks();
    getRecentUpdates();
    calculateStageProgress();
    calculateTotalProgress();
  }, [tasks, comments]);

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text
            style={[styles.progress, { fontFamily: "Poppins_600SemiBold" }]}
          >
            Progress
          </Text>
          <TouchableOpacity style={styles.detailBtn}>
            <Text style={[styles.detail, { fontFamily: "Poppins_400Regular" }]}>
              More Details
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <Progress.Circle
                style={styles.overlay}
                progress={1}
                size={90}
                color="#F7F7F7"
                borderWidth={0}
                thickness={6}
              />
              <Progress.Circle
                style={styles.overlay}
                progress={stageProgress / 100}
                size={90}
                color="#C4E868"
                strokeCap="round"
                borderWidth={0}
                thickness={6}
              />
            </View>
            <View style={styles.circle}>
              <Progress.Circle
                style={styles.overlay2}
                progress={1}
                size={65}
                color="#F7F7F7"
                borderWidth={0}
                thickness={6}
              />
              <Progress.Circle
                style={styles.overlay2}
                progress={totalProgress / 100}
                size={65}
                color="#FFD80D"
                strokeCap="round"
                borderWidth={0}
                thickness={6}
              />
            </View>
          </View>
          <View style={styles.progressTextContainer}>
            <View style={styles.textContainer}>
              <View style={styles.point1} />
              <Text
                style={[styles.labelText, { fontFamily: "Poppins_400Regular" }]}
              >
                Current
              </Text>
              <Text
                style={[
                  styles.progressText,
                  { fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {currentStage.stageName}
              </Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.point2} />
              <Text
                style={[styles.labelText, { fontFamily: "Poppins_400Regular" }]}
              >
                Stage
              </Text>
              <Text
                style={[
                  styles.progressText,
                  { fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {stageProgress}%
              </Text>
            </View>
            <View style={styles.textContainer}>
              <View style={styles.point3} />
              <Text
                style={[styles.labelText, { fontFamily: "Poppins_400Regular" }]}
              >
                Total
              </Text>
              <Text
                style={[
                  styles.progressText,
                  { fontFamily: "Poppins_600SemiBold" },
                ]}
              >
                {totalProgress}%
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.scroll}>
        {/* Team */}
        <View style={styles.content}>
          <OverviewLabel title="Team" show={teamShow} setShow={setTeamShow} />
          <View style={teamShow ? "" : { display: "none" }}>
            <View style={styles.teamList}>
              {teamList.map((mem, index) => {
                return (
                  <Image
                    key={index}
                    source={{ uri: mem }}
                    style={styles.teamProfile}
                  />
                );
              })}
            </View>
          </View>
        </View>
        {/* Updates */}
        <View style={styles.content}>
          <OverviewLabel
            title="Recent Updates"
            show={updatesShow}
            setShow={setUpdatesShow}
          />
          <View style={updatesShow ? "" : { display: "none" }}>
            {recentUpdates.map((update, index) => {
              if (Object.keys(update).includes("edited")) {
                return (
                  <UpdateChange
                    key={index}
                    update={update}
                    navigation={navigation}
                    projectId={projectId}
                    tasks={tasks}
                  />
                );
              } else {
                return (
                  <UpdateComment
                    key={index}
                    task={findTask(update.task)}
                    update={update}
                    navigation={navigation}
                    projectId={projectId}
                    tasks={tasks}
                  />
                );
              }
            })}
          </View>
        </View>
        {/* Tasks */}
        <View style={styles.content}>
          <OverviewLabel
            title="Recent Tasks"
            show={tasksShow}
            setShow={setTasksShow}
          />
          <View style={tasksShow ? "" : { display: "none" }}>
            {recentTasks.map((task, index) => {
              return (
                <TaskItem
                  key={index}
                  tasks={tasks}
                  task={task}
                  projectId={projectId}
                  navigation={navigation}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    backgroundColor: "#5552C3",
    width: "87%",
    height: 165,
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 10,
  },
  progressHeader: {
    marginHorizontal: 25,
    marginTop: 12.5,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  progress: {
    color: "white",
    fontSize: 18,
  },
  detailBtn: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    height: 25,
    paddingTop: 3,
    borderRadius: 50,
    marginTop: 2,
    marginRight: -10,
  },
  detail: {
    color: "#5552C3",
    fontSize: 12,
  },
  progressBar: {
    marginHorizontal: 22,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  circleContainer: {
    marginTop: 11,
    position: "relative",
    width: 90,
    height: 90,
  },
  circle: {
    position: "absolute",
  },
  overlay: {
    position: "absolute",
  },
  overlay2: {
    position: "absolute",
    top: 12.5,
    left: 12.5,
  },
  progressTextContainer: {
    marginLeft: 45,
    width: 150,
    marginTop: 12,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  point1: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "white",
  },
  point2: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#C4E868",
  },
  point3: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#FFD80D",
  },
  labelText: {
    width: "35%",
    fontSize: 11,
    color: "white",
    marginTop: 3,
    marginLeft: 5,
  },
  progressText: {
    fontSize: 16,
    color: "white",
    marginTop: 3,
  },
  scroll: {
    height: "55%",
  },
  content: {
    width: "87%",
    alignSelf: "center",
  },
  teamList: {
    marginTop: 2.5,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  teamProfile: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 40,
  },
});

export default OverviewPage;
