import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Icon } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { getAuthUser, subscribeToAuthChanges } from "../AuthManager";
import { setUser, subscribeToProjectsUpdates, setUserList, subscribeToCurrentUserTasks } from "../data/Actions";
import OverviewLabel from "../components/ProjectDetail/OverviewLabel";
import MyTasksItem from "../components/Dashboard/MyTasksItem";


function DashboardScreen({navigation}) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);
    const currentUserTasks = useSelector(state => state.currentUserTasks);
    const projects = useSelector(state => state.projects);
    const userList = useSelector(state => state.userList);
    const [taskShow, setTaskShow] = useState(true);
    const [updateShow, setUpdateShow] = useState(true);
    const [userTasks, setUserTasks] = useState([]);

    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const formatUserTasks = () => {
        const listWithProjectName = [...currentUserTasks].map((item) => {
            const projectWithName = projects.find(project => project.key === item.projectId);
            return {
                ...item,
                projectName: projectWithName.name,
            };
        });
        const listWithUserTasks = listWithProjectName.map((item) => {
            const taskMap = item.tasks.reduce((map, task) => {
                map[task.key] = task;
                return map;
            }, {});
            const updatedUserTasks = item.userTasks.map((key) => taskMap[key]);
            const updatedTasks = updatedUserTasks.map((task) => {
                const updatedAssignedTo = task.assignedTo.map((userId) => {
                  const user = userList.find((user) => user.key === userId);
                  return user ? user : {
                    key: userId,
                    profile: currentUser.profile.uri,
                  };
                });
                return { ...task, assignedTo: updatedAssignedTo };
            });
            return {
                ...item,
                userTasks: updatedTasks,
            };
        });
        setUserTasks(listWithUserTasks);
    };

    useEffect(() => {
        dispatch(subscribeToProjectsUpdates(getAuthUser().uid));
        dispatch(setUserList(currentUser));
        dispatch(subscribeToCurrentUserTasks(currentUser.projectsList, currentUser.key));
    }, []);

    useEffect(() => {
        if (projects.length !== 0) {
            formatUserTasks();
        };
    }, [currentUserTasks, projects]);

    return (
        <View style={styles.container}>
            {/* header */}
            <View style={styles.header}>
                <Text style={[styles.date, {fontFamily: "Poppins_600SemiBold"}]}>{date}</Text>
                <View style={styles.profile}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Setting')}
                    >
                        <Image
                            style={styles.profileImage}
                            source={{uri: currentUser.profile.uri}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {/* content */}
            <ScrollView style={styles.contentContainer}>
                {/* tasks */}
                <View>
                    <OverviewLabel title='My Tasks' show={taskShow} setShow={setTaskShow} />
                    <View style={taskShow ? styles.myTasksContainer : {display: 'none'}}>
                        {userTasks.map((item, index) => (
                            <MyTasksItem key={index} item={item} navigation={navigation} />
                        ))}
                    </View>
                </View>
                {/* updates */}
                <View>
                    <OverviewLabel title='My Updates' show={updateShow} setShow={setUpdateShow} />
                </View>
            </ScrollView>
            {/* gradient */}
            <LinearGradient
                colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.6)']}
                style={styles.gradientBlock}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#C4E868',
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        height: 120,
        paddingTop: 55,
        paddingHorizontal: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    date: {
        width: '90%',
        color: '#265504',
        fontSize: 22,
    },
    profile: {
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    contentContainer: {
        marginHorizontal: 20,
        marginTop: 10,
    },
    myTasksContainer: {
        marginHorizontal: 2.5,
        marginTop: 5,
    },
    gradientBlock: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
})

export default DashboardScreen;