import { View, StyleSheet, TouchableOpacity, Text, Image, Linking, ScrollView } from "react-native";
import { Icon, Overlay, Input } from "@rneui/themed";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { addComment, deleteTask, subscribeToCommentsUpdate, subscribeToTasksUpdate } from "../data/Actions";
import TaskItemComment from "../components/ProjectDetail/TaskItemComment";


function TaskDetailScreen({route, navigation}) {
    const {task, projectId, tasks} = route.params;
    const dispatch = useDispatch();
    const currentProject = useSelector(state => state.currentProject);
    const currentProjectComments = useSelector(state => state.currentProjectComments);
    const currentUser = useSelector(state => state.currentUser);
    const [commentBoxShow, setCommentBoxShow] = useState(false);
    const [comment, setComment] = useState('');
    const [atMembers, setAtMembers] = useState([]);
    const [membersShow, setMembersShow] = useState(false);

    const commentsList = [...currentProjectComments].filter(ele => ele.taskId === task.key);
    const comments = commentsList[0].comments;

    const handlePress = async (url) => {
        await Linking.openURL(url);
    };

    const selectAt = (member) => {
        setAtMembers([...atMembers].concat(member));
        setMembersShow(false);
    };

    const cancelSelect = (member) => {
        const newSelected = atMembers.filter(mem => mem.key !== member.key);
        setAtMembers(newSelected);
    };

    const handleComment = () => {
        const atMemberList = atMembers.map(mem => mem.key);
        const item = {
            author: currentUser.key,
            comment: comment,
            at: atMemberList,
        };
        dispatch(addComment(item, projectId, task.key));
        setCommentBoxShow(false);
        setComment('');
    };

    const handleEditPress = () => {
        const members = [...currentProject.members];
        const selectedMembers = members.map((mem) => {
            if (task.assignedTo.some(user => user.key === mem.key)) {
                return {
                    ...mem,
                    selected: true,
                };
            } else {
                return {...mem};
            };
        });

        navigation.navigate("TaskCreate", {
            task: {
                taskName: task.taskName,
                description: task.description,
                selectedMembers: selectedMembers,
                stage: task.stage,
                due: task.dueDate,
                links: task.attachedLinks,
                key: task.key,
                finished: task.finished,
            },
            projectId: projectId,
        });
    };

    useEffect(() => {
        dispatch(subscribeToCommentsUpdate(projectId, tasks));
    }, []);

    return (
        <View>
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
                <Text style={[styles.header, { fontFamily: "Poppins_600SemiBold" }]}>
                    Task Detail
                </Text>
            </View>
            {/* content */}
            <ScrollView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Text style={[styles.label, {fontFamily: "Poppins_600SemiBold"}]}>Task</Text>
                    <Text style={[styles.info, {fontFamily: "Poppins_400Regular"}]}>{task.taskName}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.label, {fontFamily: "Poppins_600SemiBold"}]}>Description</Text>
                    <Text style={[styles.info, {fontFamily: "Poppins_400Regular"}]}>{task.description}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.label, {fontFamily: "Poppins_600SemiBold"}]}>Assigned To</Text>
                    <View style={styles.assignedContainer}>
                        {task.assignedTo.map((mem, index) => {
                            return (
                                <Image
                                    key={index}
                                    source={{uri : mem.profile}}
                                    style={styles.profile}
                                />
                            )
                        })}
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={[styles.label, {fontFamily: "Poppins_600SemiBold"}]}>Attached Links</Text>
                    <ScrollView horizontal={true}>
                        <View style={styles.linkContainer}>
                            {task.attachedLinks.map((link, index) => {
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.linkBtn}
                                        onPress={() => handlePress(link.link)}
                                    >
                                        <Text style={[styles.link, {fontFamily: "Poppins_400Regular"}]}>{link.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.content}>
                    <View style={styles.commentLabel}>
                        <Text style={[styles.label, {fontFamily: "Poppins_600SemiBold"}]}>Comments</Text>
                        <TouchableOpacity
                            style={styles.commentBtn}
                            onPress={() => setCommentBoxShow(true)}
                        >
                            <Text style={[styles.comment, {fontFamily: "Poppins_500Medium"}]}>Comment</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.commentsList}>
                        {comments.map((comment, index) => {
                            return (
                                <TaskItemComment key={index} comment={comment} />
                            )
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
            {/* button */}
            <View style={styles.btnContainer}>
                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={handleEditPress}
                >
                    <Text style={[styles.edit, {fontFamily: "Poppins_600SemiBold"}]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => {
                        dispatch(deleteTask(task.key, projectId));
                        navigation.goBack();
                    }}
                >
                    <Text style={[styles.delete, {fontFamily: "Poppins_600SemiBold"}]}>Delete</Text>
                </TouchableOpacity>
            </View>
            {/* comment overlay */}
            <Overlay
                isVisible={commentBoxShow}
                onBackdropPress={() => setCommentBoxShow(false)}
                overlayStyle={styles.overlayContainer}
            >
                <Text style={[styles.overlayHeader, { fontFamily: "Poppins_600SemiBold" }]}>Comment :</Text>
                <Input
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    style={styles.inputBox}
                    inputContainerStyle={styles.inputContainerStyle}
                    inputStyle={[
                        styles.inputStyle,
                        { fontFamily: "Poppins_400Regular" },
                    ]}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                />
                <Text style={[styles.overlayHeader, { fontFamily: "Poppins_600SemiBold" }]}>@ :</Text>
                <View style={styles.atContainer}>
                    {atMembers.map((mem, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => cancelSelect(mem)}
                            >
                                <Image
                                    source={{uri: mem.profile}}
                                    style={styles.profile}
                                />
                            </TouchableOpacity>
                        )
                    })}
                    <TouchableOpacity
                        onPress={() => setMembersShow(true)}
                    >
                        <Icon
                            type="ant-design"
                            name="pluscircle"
                            size={35}
                            color="#F7F7F7"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.overlayBtn}>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={handleComment}
                    >
                        <Text style={[styles.edit, { fontFamily: "Poppins_600SemiBold" }]}>
                            Comment
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => {
                            setComment('');
                            setCommentBoxShow(false);
                        }}
                    >
                        <Text style={[styles.delete, { fontFamily: "Poppins_600SemiBold" }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Overlay>
            <Overlay
                isVisible={membersShow}
                onBackdropPress={() => setMembersShow(false)}
                overlayStyle={styles.membersList}
            >
                {currentProject.members.map((mem, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.memberItem}
                            onPress={() => selectAt(mem)}
                        >
                            <Image
                                source={{uri: mem.profile}}
                                style={styles.profile}
                            />
                            <Text style={[styles.userName, { fontFamily: "Poppins_400Regular" }]}>{mem.userName}</Text>
                        </TouchableOpacity>
                    )
                })}
            </Overlay>
        </View>
    )
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
    header: {
        fontSize: 20,
        marginTop: 6,
        color: "#1A1E1F",
    },
    contentContainer: {
        marginHorizontal: 35,
        height: '80%',
    },
    content: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#1A1E1F',
    },
    info: {
        fontSize: 14,
        color: '#1A1E1F',
    },
    assignedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profile: {
        width: 35,
        height: 35,
        borderRadius: 35,
        marginRight: 10,
    },
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 5,
    },
    linkBtn: {
        width: 100,
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        color: '#5552C3',
        fontSize: 14,
        textDecorationLine: 'underline',
        textDecorationColor: '#5552C3',
    },
    commentLabel: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    commentBtn: {
        backgroundColor: '#C4E868',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 40,
    },
    comment: {
        fontSize: 13,
        color: '#265504',
    },
    commentsList: {
        marginTop: 5,
    },
    btnContainer: {
        width: '90%',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    editBtn: {
        width: '40%',
        backgroundColor: '#C4E868',
        paddingVertical: 5,
        borderRadius: 50,
        alignItems: 'center',
    },
    deleteBtn: {
        width: '40%',
        paddingVertical: 5,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        alignItems: 'center',
    },
    edit: {
        fontSize: 16,
        color: '#265504',
        marginTop: 2,
    },
    delete: {
        fontSize: 16,
        color: '#B7B7B7',
        marginTop: 2,
    },
    overlayContainer: {
        height: "40%",
        width: "80%",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    overlayHeader: {
        fontSize: 20,
        color: "#1A1E1F",
        marginLeft: 10,
    },
    inputBox: {
        backgroundColor: "#F7F7F7",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 5,
        marginBottom: -15,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
    },
    inputStyle: {
        color: "#1A1E1F",
        fontSize: 16,
    },
    atContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 10,
    },
    overlayBtn: {
        position: "absolute",
        bottom: 25,
        alignSelf: 'center',
        width: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    membersList: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        rowGap: 15,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        columnGap: 10,
    },
    userName: {
        fontSize: 14,
        marginTop: 3,
    },
})

export default TaskDetailScreen;