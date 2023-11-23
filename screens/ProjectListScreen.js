import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Icon } from "@rneui/themed";

import { subscribeToProjectsUpdates } from "../data/Actions";
import { getAuthUser } from "../AuthManager";
import ProjectListItem from "../components/ProjectListItem";


function ProjectListScreen({navigation}) {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);
    const projects = useSelector((state) => state.projects);

    useEffect(() => {
        dispatch(subscribeToProjectsUpdates(currentUser.key));
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.headerText, {fontFamily: 'Poppins_600SemiBold'}]}>Projects</Text>
            </View>
            <View style={styles.projectList}>
                {projects.map((item, index) => <ProjectListItem key={index} item={item} />)}
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => navigation.navigate('ProjectCreate', {currentUser: currentUser})}
                >
                    <Icon name="plus" type="ant-design" size={42} color="#265504" />
                    <Text style={[styles.addText, {fontFamily: 'Poppins_400Regular'}]}>Add new project</Text>
                </TouchableOpacity>
            </View>
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
        marginTop: 70,
        marginLeft: 30,
    },
    headerText: {
        fontSize: 28,
        color: '#1A1E1F',
    },
    projectList: {
        marginTop: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    addBtn: {
        height: 175,
        width: 175,
        borderColor: '#C4E868',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    addText: {
        fontSize: 12,
        color: '#265504',
    },
    gradientBlock: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
})

export default ProjectListScreen;