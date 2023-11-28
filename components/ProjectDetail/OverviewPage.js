import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import * as Progress from "react-native-progress";
import { Icon } from "@rneui/themed";
import { useState } from "react";

import OverviewLabel from "./OverviewLabel";
import UpdateChange from "./UpdateChange";
import UpdateComment from "./UpdateComment";
import TaskItem from "./TaskItem";

function OverviewPage({ members, currentStage }) {
  const [teamShow, setTeamShow] = useState(true);
  const [updatesShow, setUpdatesShow] = useState(true);
  const [tasksShow, setTasksShow] = useState(true);

  const teamList = members.map(mem => mem.profile);

  return (
    <View>
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
                progress={0.6}
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
                progress={0.2}
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
                {currentStage}
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
                60%
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
                20%
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
                    source={{uri: mem}}
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
            <UpdateChange />
            <UpdateComment />
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
            {/* <TaskItem />
            <TaskItem />
            <TaskItem /> */}
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
