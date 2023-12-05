import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CalendarList } from "react-native-calendars";
import { useState, useEffect } from "react";
import { Overlay, Icon } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import TaskItem from "./TaskItem";
import { subscribeToTasksUpdate } from "../../data/Actions";
import { getDayEndDate } from "../../DateSet";

function StagesPage({ stages, project, navigation, projectId }) {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.currentProjectTasks);
  const [calendar, setCalendar] = useState(true);
  const [overlayShow, setOverlayShow] = useState(false);
  const [selectedStage, setSelectedStage] = useState({});
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [currentStageTasks, setCurrentStageTasks] = useState([]);

  const findStage = (date) => {
    const selectedDate = new Date(date);
    for (const stage of stages) {
      const startDate = new Date(stage.startDate);
      const endDate = new Date(stage.endDate);

      if (selectedDate >= startDate && selectedDate <= endDate) {
        return stage;
      }
    }
    return {};
  };

  const start = new Date(project.basicInfo.startDate);
  const end = new Date(project.basicInfo.endDate);
  const scrollRange =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString) => {
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const year = dateString.slice(8);
    const day = dateString.slice(4, 6);
    const month = months[dateString.slice(0, 3)];

    return getDayEndDate(new Date(year, month, day));
  };

  const [selected, setSelected] = useState(formatDate(new Date()));

  let markedDates = {};
  stages.forEach((stage) => {
    const start = new Date(stage.startDate);
    const end = new Date(stage.endDate);

    markedDates[formatDate(start)] = {
      startingDay: true,
      color: "#C4E868",
      textColor: "#265504",
    };
    markedDates[formatDate(end)] = {
      endingDay: true,
      color: "#C4E868",
      textColor: "#265504",
    };

    const currentDate = new Date(stage.startDate);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate < end) {
      const formattedDate = formatDate(currentDate);
      markedDates[formattedDate] = {
        color: "#C4E868",
        textColor: "#265504",
        disabled: true,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  tasks.forEach((task) => {
    if (Object.keys(task.stage).length === 0) {
      const date = formatDate(new Date(task.dueDate));
      if (markedDates.hasOwnProperty(date)) {
        markedDates[date].marked = true;
        markedDates[date].dotColor = "#265504";
      } else {
        markedDates[date] = {
          marked: true,
          dotColor: "#265504",
        };
      }
    }
  });

  if (markedDates.hasOwnProperty(selected)) {
    markedDates[selected].selected = true;
    markedDates[selected].textColor = "#ffffff";
  } else {
    markedDates[selected] = {
      selected: true,
      textColor: "#FFD80D",
    };
  }

  const onDayPress = (day) => {
    setSelected(day.dateString);

    const stage = findStage(day.dateString);
    setSelectedStage(stage);

    if (markedDates[day.dateString]) {
      if (markedDates[day.dateString].marked) {
        const dayTasks = tasks.filter(
          (task) => formatDate(new Date(task.dueDate)) === day.dateString
        );
        setSelectedDateTasks(dayTasks);
      }
      setOverlayShow(true);
    }
  };

  const onPressStage = (stage) => {
    let stageTaskList = [];
    const tasksList = tasks.filter((task) => task.stage.key === stage.key);

    const end = new Date(stage.endDate);
    const currentDate = new Date(stage.startDate);
    const options = { month: "short", day: "numeric", year: "numeric" };
    while (currentDate <= end) {
      let date = {
        date: "",
        tasks: [],
      };
      const formattedDate = new Date(currentDate).toLocaleDateString(
        "en-US",
        options
      );
      date.date = formattedDate;
      tasksList.forEach((task) => {
        if (
          new Date(task.dueDate).toLocaleDateString("en-US", options) ===
          formattedDate
        ) {
          date.tasks.push(task);
        }
      });
      stageTaskList.push(date);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setCurrentStageTasks(stageTaskList);
  };

  useEffect(() => {
    dispatch(subscribeToTasksUpdate(projectId));
  }, []);

  useEffect(() => {
    onPressStage(selectedStage);
  }, [tasks]);

  if (calendar) {
    return (
      <View>
        <CalendarList
          calendarStyle={styles.calendar}
          theme={{
            textDayHeaderFontFamily: "Poppins_600SemiBold",
            textMonthFontFamily: "Poppins_600SemiBold",
            textDayFontFamily: "Poppins_400Regular",
            todayTextColor: "#5552C3",
          }}
          pastScrollRange={scrollRange + 2}
          futureScrollRange={scrollRange + 2}
          markingType="period"
          markedDates={markedDates}
          onDayPress={(day) => onDayPress(day)}
        />
        {/* overlay */}
        <Overlay
          isVisible={overlayShow}
          onBackdropPress={() => {
            setOverlayShow(false);
            setSelectedDateTasks([]);
            setSelectedStage({});
          }}
          backdropStyle={styles.backdropStyle}
          overlayStyle={styles.overlayStyle}
        >
          {Object.keys(selectedStage).length !== 0 && (
            <TouchableOpacity
              style={styles.stageContainer}
              onPress={() => {
                onPressStage(selectedStage);
                setCalendar(false);
                setOverlayShow(false);
              }}
            >
              <Text
                style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}
              >
                Stage:{" "}
              </Text>
              <Text
                style={[styles.content, { fontFamily: "Poppins_400Regular" }]}
              >
                {selectedStage.stageName}
              </Text>
              <Icon
                name="chevron-right"
                type="feather"
                size={18}
                color="#265504"
              />
            </TouchableOpacity>
          )}
          {selectedDateTasks.length !== 0 &&
            selectedDateTasks.map((task, index) => (
              <TouchableOpacity
                key={index}
                style={styles.stageContainer}
                onPress={() =>
                  navigation.navigate("TaskDetail", {
                    task: task,
                    projectId: projectId,
                    tasks: tasks,
                  })
                }
              >
                <Text
                  style={[styles.label, { fontFamily: "Poppins_600SemiBold" }]}
                >
                  Task:{" "}
                </Text>
                <Text
                  style={[styles.content, { fontFamily: "Poppins_400Regular" }]}
                >
                  {task.taskName}
                </Text>
                <Icon
                  name="chevron-right"
                  type="feather"
                  size={18}
                  color="#265504"
                />
              </TouchableOpacity>
            ))}
        </Overlay>
      </View>
    );
  }

  if (!calendar) {
    return (
      <View style={styles.container}>
        {/* header */}
        <View>
          <TouchableOpacity
            style={styles.headerContainer}
            onPress={() => setCalendar(true)}
          >
            <Icon
              name="chevron-left"
              type="feather"
              size={18}
              color="#1A1E1F"
            />
            <Text
              style={[styles.stageName, { fontFamily: "Poppins_600SemiBold" }]}
            >
              Stage: {selectedStage.stageName}
            </Text>
          </TouchableOpacity>
        </View>
        {/* timeline */}
        <ScrollView style={styles.timelineContainer}>
          {currentStageTasks.map((task, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.dateLabel}
                onPress={() =>
                  navigation.navigate("TaskCreate", {
                    projectId: projectId,
                    task: {
                      key: -1,
                      taskName: "",
                      description: "",
                      selectedMembers: [...project.members],
                      stage: { ...selectedStage },
                      due: parseDate(task.date).toString(),
                      links: [],
                    },
                  })
                }
              >
                <View style={styles.circle} />
                <Text
                  style={[styles.date, { fontFamily: "Poppins_400Regular" }]}
                >
                  {task.date}
                </Text>
                <Icon
                  name="pluscircle"
                  type="antdesign"
                  size={16}
                  color="#F7F7F7"
                />
              </TouchableOpacity>
              <View style={styles.taskList}>
                <View style={styles.line} />
                <View style={styles.tasksContainer}>
                  {task.tasks.map((task, index) => (
                    <TaskItem
                      key={index}
                      task={task}
                      tasks={tasks}
                      projectId={projectId}
                      navigation={navigation}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 25,
  },
  calendar: {
    width: "94%",
    alignSelf: "center",
  },
  backdropStyle: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  overlayStyle: {
    width: "65%",
    rowGap: 15,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  stageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#C4E868",
    borderRadius: 5,
    height: 35,
    paddingLeft: 10,
  },
  label: {
    fontSize: 14,
    color: "#265504",
    marginTop: 2,
    flex: 1,
  },
  content: {
    fontSize: 14,
    color: "#265504",
    marginTop: 2,
    flex: 2.5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  stageName: {
    fontSize: 14,
    color: "#1A1E1F",
    marginTop: 2,
    marginLeft: 5,
  },
  dateLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  date: {
    fontSize: 13,
    color: "#1A1E1F",
    marginTop: 2,
    flex: 0.3,
  },
  timelineContainer: {
    marginTop: 10,
    marginLeft: 10,
    height: "72.5%",
  },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 40,
    backgroundColor: "#265504",
    marginRight: 10,
  },
  taskList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 7,
  },
  line: {
    height: "100%",
    width: 1,
    backgroundColor: "#408210",
    marginRight: 25,
    marginVertical: 10,
  },
  tasksContainer: {
    width: "92.5%",
    paddingTop: 10,
  },
});

export default StagesPage;
