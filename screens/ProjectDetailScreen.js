import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Icon, Overlay } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import DetailNavigation from "../components/ProjectDetail/DetailNavigation";
import OverviewPage from "../components/ProjectDetail/OverviewPage";
import PlusBtn from "../components/ProjectDetail/PlusBtn";
import {
  deleteProject,
  setUserList,
  subscribeToCommentsUpdate,
  subscribeToCurrentProjectUpdates,
  subscribeToStagesUpdate,
  subscribeToTasksUpdate,
} from "../data/Actions";
import TasksPage from "../components/ProjectDetail/TasksPage";
import StagesPage from "../components/ProjectDetail/StagesPage";
import TeamPage from "../components/ProjectDetail/TeamPage";

function ProjectDetailScreen({ route, navigation }) {
  const { projectId, currentUser } = route.params;
  const dispatch = useDispatch();
  const currentProject = useSelector((state) => state.currentProject);
  const currentProjectStages = useSelector(
    (state) => state.currentProjectStages
  );
  const stages = [...currentProjectStages];
  const currentProjectTasks = useSelector((state) => state.currentProjectTasks);
  const userList = useSelector((state) => state.userList);
  const currentProjectComments = useSelector(
    (state) => state.currentProjectComments
  );

  const [deleteOverlay, setDeleteOverlay] = useState(false);

  const [selected, setSelected] = useState(0);
  const navigationList = ["Overview", "Stages", "Tasks", "Team"];

  useEffect(() => {
    dispatch(setUserList(currentUser));
    dispatch(subscribeToCurrentProjectUpdates(projectId));
    dispatch(subscribeToStagesUpdate(projectId));
    dispatch(subscribeToTasksUpdate(projectId));
    dispatch(subscribeToCommentsUpdate(projectId, currentProjectTasks));
  }, []);

  if (!currentProject.basicInfo) {
    return <View></View>;
  }

  const currentDate = new Date();
  const currentStage = currentProjectStages.find((stage) => {
    if (stage.startDate && stage.endDate) {
      const startDate = new Date(stage.startDate);
      const endDate = new Date(stage.endDate);
      return currentDate >= startDate && currentDate <= endDate;
    };
  });

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            style={styles.backIcon}
            name="chevron-back"
            type="ionicon"
            size={30}
            color="#1A1E1F"
          />
        </TouchableOpacity>
        <Image
          source={{ uri: currentProject.basicInfo.logo }}
          style={styles.logo}
        />
        <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
          {currentProject.basicInfo.name}
        </Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setDeleteOverlay(true)}
        >
          <Text style={[styles.delete, { fontFamily: "Poppins_600SemiBold" }]}>
            ...
          </Text>
        </TouchableOpacity>
      </View>
      {/* gradient */}
      <LinearGradient
        colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.75)"]}
        style={styles.gradientBlock}
        pointerEvents="none"
      />
      {/* Plus */}
      <PlusBtn
        navigation={navigation}
        members={currentProject.members}
        stages={stages}
        projectId={projectId}
        userList={userList}
      />
      {/* navigation */}
      <DetailNavigation
        selected={selected}
        setSelected={setSelected}
        navigationList={navigationList}
      />
      {/* content */}
      {selected === 0 && (
        <OverviewPage
          members={currentProject.members}
          currentStage={currentStage ? currentStage : ""}
          tasks={[...currentProjectTasks]}
          projectId={projectId}
          navigation={navigation}
          comments={currentProjectComments}
        />
      )}
      {selected === 1 && (
        <StagesPage
          stages={currentProjectStages}
          project={currentProject}
          tasks={currentProjectTasks}
          navigation={navigation}
          projectId={projectId}
        />
      )}
      {selected === 2 && (
        <TasksPage
          tasks={[...currentProjectTasks]}
          projectId={projectId}
          navigation={navigation}
        />
      )}
      {selected === 3 && (
        <TeamPage
          project={currentProject}
          userList={userList}
          projectId={projectId}
          members={currentProject.members}
        />
      )}
      {/* overlay */}
      <Overlay
        isVisible={deleteOverlay}
        onBackdropPress={() => setDeleteOverlay(false)}
        overlayStyle={styles.overlay}
      >
        <TouchableOpacity
          style={styles.overlayBtn}
          onPress={() => {
            dispatch(deleteProject(projectId, {...currentProject}));
            navigation.navigate('ProjectList');
          }}
        >
          <Icon name="trash-2" type="feather" size={24} color="white" />
          <Text
            style={[styles.overlayText, { fontFamily: "Poppins_600SemiBold" }]}
          >
            Delete Project
          </Text>
        </TouchableOpacity>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
    width: "100%",
  },
  headerContainer: {
    marginTop: 70,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 15,
    height: 40,
  },
  backIcon: {
    marginTop: 5,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 5,
  },
  header: {
    fontSize: 20,
    marginTop: 6,
    color: "#1A1E1F",
    flex: 0.9,
  },
  delete: {
    fontSize: 20,
    color: "#1A1E1F",
    marginBottom: 2,
  },
  overlay: {
    backgroundColor: "#F06060",
    height: 50,
    width: 300,
    borderRadius: 50,
  },
  overlayBtn: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 15,
  },
  overlayText: {
    fontSize: 18,
    color: "white",
    marginTop: 2,
  },
  gradientBlock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 80,
  },
});

export default ProjectDetailScreen;
