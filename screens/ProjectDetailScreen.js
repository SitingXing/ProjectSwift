import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import DetailNavigation from "../components/ProjectDetail/DetailNavigation";
import OverviewPage from "../components/ProjectDetail/OverviewPage";
import PlusBtn from "../components/ProjectDetail/PlusBtn";
import { subscribeToCurrentProjectUpdates, subscribeToStagesUpdate, updateProject } from "../data/Actions";

function ProjectDetailScreen({ route, navigation }) {
  const { projectId } = route.params;
  const dispatch = useDispatch();
  const currentProject = useSelector(state => state.currentProject);
  const currentProjectStages = useSelector(state => state.currentProjectStages);

  useEffect(() => {
    dispatch(subscribeToCurrentProjectUpdates(projectId));
    dispatch(subscribeToStagesUpdate(projectId));
  }, []);

  if (!currentProject.basicInfo) {
    return (
        <View></View>
    )
  };

  const currentDate = new Date();
  const currentStage = currentProjectStages.find((stage) => {
    const startDate = new Date(stage.startDate);
    const endDate = new Date(stage.endDate);
    return currentDate >= startDate && currentDate <= endDate;
  });

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity>
          <Icon
            style={styles.backIcon}
            name="chevron-back"
            type="ionicon"
            size={30}
            color="#1A1E1F"
          />
        </TouchableOpacity>
        <Image source={{ uri: currentProject.basicInfo.logo }} style={styles.logo} />
        <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
          {currentProject.basicInfo.name}
        </Text>
      </View>
      {/* navigation */}
      <DetailNavigation />
      {/* content */}
      <OverviewPage members={currentProject.members} currentStage={currentStage.stageName} />
      {/* gradient */}
      <LinearGradient
        colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.75)"]}
        style={styles.gradientBlock}
        pointerEvents="none"
      />
      {/* Plus */}
      <PlusBtn />
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
  },
  gradientBlock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});

export default ProjectDetailScreen;
