import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { firebaseConfig } from "../Secrets";
import {
  SET_USER,
  LOAD_PROJECTS,
  LOAD_USERLIST,
  ADD_PROJECT,
  SET_PROJECT,
  SET_STAGES,
  SET_TASKS,
  SET_COMMENTS,
  SET_USER_TASKS,
} from "./Reducer";

let app;
const apps = getApps();
if (apps.length == 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = apps[0];
}
const db = getFirestore(app);
const storage = getStorage(app);

const addUser = (newUser, pictureObject) => {
  return async (dispatch) => {
    const fileName = pictureObject.uri.split("/").pop();
    const pictureRef = ref(storage, `profileImages/${fileName}`);
    const response = await fetch(pictureObject.uri);
    const imageBlob = await response.blob();
    await uploadBytes(pictureRef, imageBlob);

    const downloadURL = await getDownloadURL(pictureRef);
    const newImage = {
      ...pictureObject,
      uri: downloadURL,
    };

    const userToAdd = {
      userName: newUser.displayName,
      email: newUser.email,
      key: newUser.uid,
      profile: newImage,
      projectsList: [],
    };
    await setDoc(doc(db, "users", newUser.uid), userToAdd);
    dispatch({
      type: SET_USER,
      payload: {
        user: userToAdd,
      },
    });
  };
};

const setUser = (authUser) => {
  return async (dispatch) => {
    let userSnap = await getDoc(doc(db, "users", authUser.uid));
    while (!userSnap.data()) {
      userSnap = await getDoc(doc(db, "users", authUser.uid));
    }
    const user = userSnap.data();
    dispatch({
      type: SET_USER,
      payload: {
        user: user,
      },
    });
  };
};

let projectsSnapshotUnsub = undefined;
const subscribeToProjectsUpdates = (userUid) => {
  if (projectsSnapshotUnsub) {
    projectsSnapshotUnsub();
  }

  return async (dispatch) => {
    projectsSnapshotUnsub = onSnapshot(
      doc(db, "users", userUid),
      async (snap) => {
        const updateUser = { ...snap.data() };
        dispatch({
          type: SET_USER,
          payload: {
            user: updateUser,
          },
        });

        const projectId = snap.data().projectsList;
        const projectsPromises = projectId.map(async (id) => {
          const docRef = doc(db, "Projects", id);
          const projectDoc = await getDoc(docRef);
          const project = projectDoc.data().basicInfo;
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
          };
          const endDate = project.endDate
            .toDate()
            .toLocaleDateString("en-US", options);

          return {
            name: project.name,
            logo: project.logo,
            endDate: endDate,
            key: id,
          };
        });

        const projects = await Promise.all(projectsPromises);
        dispatch({
          type: LOAD_PROJECTS,
          payload: {
            projects: [...projects],
          },
        });
      }
    );
  };
};

const unsubscribeFromProjects = () => {
  if (projectsSnapshotUnsub) {
    projectsSnapshotUnsub();
    projectsSnapshotUnsub = undefined;
  }
};

const setUserList = (authUser) => {
  return async (dispatch) => {
    const usersSnap = await getDocs(collection(db, "users"));
    const userList = usersSnap.docs.map((docSnap) => {
      return {
        ...docSnap.data(),
        profile: docSnap.data().profile.uri,
      };
    });
    const filteredUserList = userList.filter(
      (user) => user.key !== authUser.key
    );

    dispatch({
      type: LOAD_USERLIST,
      payload: {
        userList: filteredUserList,
      },
    });
  };
};

const addProject = (
  logo,
  projectName,
  description,
  members,
  startDate,
  endDate,
  stages
) => {
  return async (dispatch) => {
    const fileName = logo.split("/").pop();
    const pictureRef = ref(storage, `projectLogoImages/${fileName}`);
    const response = await fetch(logo);
    const imageBlob = await response.blob();
    await uploadBytes(pictureRef, imageBlob);
    const downloadURL = await getDownloadURL(pictureRef);
    const newImage = downloadURL;

    const newProject = {
      basicInfo: {
        name: projectName,
        logo: newImage,
        description: description,
        startDate: startDate,
        endDate: endDate,
      },
      members: [...members],
    };
    const newStages = stages.map((stage) => {
      return {
        stageName: stage.title,
        startDate: stage.startDate,
        endDate: stage.endDate,
      };
    });
    const projectRef = await addDoc(collection(db, "Projects"), newProject);
    newProject.id = projectRef.id;

    for (let stage of newStages) {
      const stageRef = await addDoc(
        collection(db, "Projects", projectRef.id, "stages"),
        stage
      );
      stage.id = stageRef.id;
    }

    const savedStages = newStages.map((stage) => {
      return {
        ...stage,
        startDate: stage.startDate.toString(),
        endDate: stage.endDate.toString(),
      };
    });

    const project = {
      ...newProject,
      basicInfo: {
        ...newProject.basicInfo,
        startDate: newProject.basicInfo.startDate.toLocaleDateString(),
        endDate: newProject.basicInfo.endDate.toLocaleDateString(),
      },
      stages: savedStages,
      tasks: [],
    };

    dispatch({
      type: ADD_PROJECT,
      payload: {
        id: newProject.id,
        newProject: project,
      },
    });

    const promises = newProject.members.map(async (member) => {
      const ref = doc(db, "users", member);
      const snap = await getDoc(ref);
      const projectsList = snap.data().projectsList;
      const newList = projectsList.concat(newProject.id);
      await updateDoc(ref, { projectsList: newList });
    });
    await Promise.all(promises);
  };
};

const updateProject = (updatedProject, projectId, userList) => {
  return async (dispatch) => {
    if (Object.keys(updatedProject).includes("stages")) {
      const promises = updatedProject.stages.map(async (stage) => {
        if (stage.key) {
          const ref = doc(db, "Projects", projectId, "stages", stage.key);
          const newStage = {
            endDate: new Date(stage.endDate),
            stageName: stage.stageName,
            startDate: new Date(stage.startDate),
          };
          await updateDoc(ref, newStage);
        } else {
          const ref = collection(db, "Projects", projectId, "stages");
          const newStage = {
            endDate: new Date(stage.endDate),
            stageName: stage.stageName,
            startDate: new Date(stage.startDate),
          };
          await addDoc(ref, newStage);
        }
      });
      await Promise.all(promises);

      if (updatedProject.deleted.length !== 0) {
        const deletePromises = updatedProject.deleted.map(async (stage) => {
          const ref = doc(db, "Projects", projectId, "stages", stage);
          await deleteDoc(ref);
        });
        await Promise.all(deletePromises);
      }
    } else {
      await updateDoc(doc(db, "Projects", projectId), updatedProject);

      if (Object.keys(updatedProject).includes("members")) {
        const promises = userList.map(async (member) => {
          const ref = doc(db, "users", member.key);
          const snap = await getDoc(ref);
          const projectsList = snap.data().projectsList;
          if (
            projectsList.includes(projectId) &&
            !updatedProject.members.includes(member.key)
          ) {
            const newList = projectsList.filter(
              (project) => project !== projectId
            );
            await updateDoc(ref, { projectsList: newList });
          }
          if (
            !projectsList.includes(projectId) &&
            updatedProject.members.includes(member.key)
          ) {
            const newList = projectsList.concat(projectId);
            await updateDoc(ref, { projectsList: newList });
          }
        });
        await Promise.all(promises);
      }
    }
  };
};

const deleteProject = (projectId, project) => {
  return async (dispatch) => {
    await deleteDoc(doc(db, "Projects", projectId));

    const members = project.members;
    const promises = members.map(async (member) => {
      const ref = doc(db, "users", member.key);
      const snap = await getDoc(ref);
      const projectList = snap.data().projectsList;
      const newProjectList = [...projectList].filter(
        (project) => project !== projectId
      );
      await updateDoc(ref, { projectsList: newProjectList });
    });
    await Promise.all(promises);
  };
};

let currentProjectSnapshotUnsub = undefined;
let currentProjectStagesUnsub = undefined;
let currentProjectTasksUnsub = undefined;
let currentTaskCommentsUnsub = undefined;
let currentUserTasksUnsub = undefined;
const subscribeToCurrentProjectUpdates = (projectId) => {
  if (currentProjectSnapshotUnsub) {
    currentProjectSnapshotUnsub();
  }

  return async (dispatch, getState) => {
    currentProjectSnapshotUnsub = onSnapshot(
      doc(db, "Projects", projectId),
      async (snap) => {
        const data = { ...snap.data() };
        const startDate = data.basicInfo.startDate.toDate().toString();
        const endDate = data.basicInfo.endDate.toDate().toString();
        const updateBasicInfo = {
          ...data.basicInfo,
          startDate: startDate,
          endDate: endDate,
        };

        const memberList = [...data.members];
        const fetchMemberInfoPromises = memberList.map(async (mem) => {
          const docRef = doc(db, "users", mem);
          const snapShot = await getDoc(docRef);
          const userData = snapShot.data();

          return {
            userName: userData.userName,
            profile: userData.profile.uri,
            email: userData.email,
            key: userData.key,
          };
        });
        const updateMembers = await Promise.all(fetchMemberInfoPromises);

        const updateProject = {
          basicInfo: updateBasicInfo,
          members: updateMembers,
        };
        dispatch({
          type: SET_PROJECT,
          payload: {
            project: updateProject,
          },
        });
      }
    );
  };
};

const unsubscribeFromCurrentProjectUpdates = () => {
  if (currentProjectSnapshotUnsub) {
    currentProjectSnapshotUnsub();
    currentProjectSnapshotUnsub = undefined;
  }
};

const subscribeToStagesUpdate = (projectId) => {
  if (currentProjectStagesUnsub) {
    currentProjectStagesUnsub();
  }

  return async (dispatch, getState) => {
    currentProjectStagesUnsub = onSnapshot(
      collection(db, "Projects", projectId, "stages"),
      async (snaps) => {
        const updateStages = snaps.docs.map((snap) => {
          const stage = { ...snap.data() };
          const startDate = stage.startDate.toDate().toString();
          const endDate = stage.endDate.toDate().toString();
          return {
            ...stage,
            startDate: startDate,
            endDate: endDate,
            key: snap.id,
          };
        });

        dispatch({
          type: SET_STAGES,
          payload: {
            stages: updateStages,
          },
        });
      }
    );
  };
};

const unsubscribeFromStageUpdate = () => {
  if (currentProjectStagesUnsub) {
    currentProjectStagesUnsub();
    currentProjectSnapshotUnsub = undefined;
  }
};

const subscribeToCommentsUpdate = (projectId, tasks) => {
  if (currentTaskCommentsUnsub) {
    currentTaskCommentsUnsub.forEach((unsub) => unsub());
  }

  return async (dispatch, getState) => {
    const commentsUnsubFunctions = [];
    const currentProjectComments = getState().currentProjectComments;

    tasks.forEach((task) => {
      const commentsUnsub = onSnapshot(
        collection(db, "Projects", projectId, "tasks", task.key, "comments"),
        async (commentSnaps) => {
          const commentsPromises = commentSnaps.docs.map(
            async (commentSnap) => {
              const createdAt = commentSnap
                .data()
                .createdAt.toDate()
                .toString();
              const authorData = await getDoc(
                doc(db, "users", commentSnap.data().author)
              );
              const updateAuthor = {
                key: commentSnap.data().author,
                profile: authorData.data().profile.uri,
                userName: authorData.data().userName,
              };
              return {
                ...commentSnap.data(),
                createdAt: createdAt,
                author: updateAuthor,
              };
            }
          );
          const comments = await Promise.all(commentsPromises);
          const updatedComments = currentProjectComments.map((ele) =>
            ele.taskId === task.key ? { ...ele, comments: comments } : ele
          );

          dispatch({
            type: SET_COMMENTS,
            payload: {
              comments: [...updatedComments],
            },
          });
        }
      );
      commentsUnsubFunctions.push(commentsUnsub);
    });

    currentTaskCommentsUnsub = commentsUnsubFunctions;
  };
};

const unsubscribeFromCommentsUpdate = () => {
  if (currentTaskCommentsUnsub) {
    currentTaskCommentsUnsub.forEach((unsub) => unsub());
    currentTaskCommentsUnsub = undefined;
  }
};

const subscribeToTasksUpdate = (projectId) => {
  if (currentProjectTasksUnsub) {
    currentProjectTasksUnsub();
  }

  return async (dispatch) => {
    currentProjectTasksUnsub = onSnapshot(
      collection(db, "Projects", projectId, "tasks"),
      async (snaps) => {
        if (snaps.docs.length === 0) {
          dispatch({
            type: SET_TASKS,
            payload: {
              tasks: [],
            },
          });
        }

        if (snaps.docs.length !== 0) {
          const updateTasksPromises = snaps.docs.map(async (snap) => {
            const task = { ...snap.data() };
            const dueDate = task.dueDate.toDate().toString();

            const loadAssignedPromises = task.assignedTo.map(async (mem) => {
              const memData = await getDoc(doc(db, "users", mem));
              return {
                key: mem,
                profile: memData.data().profile.uri,
              };
            });
            const assignedTo = await Promise.all(loadAssignedPromises);

            let updateStage;
            if (task.stage !== "") {
              const stageDate = await getDoc(
                doc(db, "Projects", projectId, "stages", task.stage)
              );
              updateStage = {
                ...stageDate.data(),
                startDate: stageDate.data().startDate.toDate().toString(),
                endDate: stageDate.data().endDate.toDate().toString(),
                key: task.stage,
              };
            } else {
              updateStage = {};
            }

            const edited = task.edited;
            const updatedEdited = {
              ...edited,
              time: edited.time.toDate().toString(),
            };

            let key;
            if (snap._key.path.segments[8]) {
              key = snap._key.path.segments[8];
            } else {
              key = snap._key.path.segments[3];
            }

            const commentsDoc = await getDocs(
              collection(db, "Projects", projectId, "tasks", key, "comments")
            );
            const commentsPromises = commentsDoc.docs.map(async (comment) => {
              const createdAt = comment.data().createdAt.toDate().toString();
              const authorData = await getDoc(
                doc(db, "users", comment.data().author)
              );
              const updateAuthor = {
                key: comment.data().author,
                profile: authorData.data().profile.uri,
                userName: authorData.data().userName,
              };
              return {
                ...comment.data(),
                createdAt: createdAt,
                author: updateAuthor,
              };
            });
            const comments = await Promise.all(commentsPromises);

            return {
              ...task,
              dueDate: dueDate,
              assignedTo: assignedTo,
              stage: updateStage,
              key: key,
              comments: comments,
              edited: updatedEdited,
            };
          });
          const updateTasks = await Promise.all(updateTasksPromises);

          dispatch({
            type: SET_TASKS,
            payload: {
              tasks: updateTasks,
            },
          });

          const updateComments = updateTasks.map((task) => {
            return {
              taskId: task.key,
              comments: task.comments,
            };
          });
          dispatch({
            type: SET_COMMENTS,
            payload: {
              comments: [...updateComments],
            },
          });
        }
      }
    );
  };
};

const unsubscribeFromTasksUpdate = () => {
  if (currentProjectTasksUnsub) {
    currentProjectTasksUnsub();
    currentProjectTasksUnsub = undefined;
  }
};

const subscribeToCurrentUserTasks = (projects, userId) => {
  if (currentUserTasksUnsub) {
    currentUserTasksUnsub.forEach((unsub) => unsub());
  }

  return async (dispatch, getState) => {
    const userTasksUnsubFunctions = [];
    const list = getState().currentUserTasks;
    const newTasksList = [...list];

    projects.forEach((project) => {
      const userTasksUnsub = onSnapshot(
        collection(db, "Projects", project, "tasks"),
        async (snapshots) => {
          const userTasks = [];
          const tasks = [];
          snapshots.docs.forEach(async (snap) => {
            const dueDate = snap.data().dueDate.toDate().toString();
            const editedTime = snap.data().edited.time.toDate().toString();
            if (
              snap.data().assignedTo.includes(userId) &&
              !snap.data().finished
            ) {
              userTasks.push(snap._key.path.segments[8]);
            }
            tasks.push({
              ...snap.data(),
              dueDate: dueDate,
              edited: {
                ...snap.data().edited,
                time: editedTime,
              },
              key: snap._key.path.segments[8],
            });
          });

          const currentUserTasks = {
            projectId: project,
            userTasks: userTasks,
            tasks: tasks,
          };

          const existingTaskIndex = newTasksList.findIndex(
            (item) => item.projectId === project
          );

          if (existingTaskIndex !== -1) {
            newTasksList[existingTaskIndex] = { ...currentUserTasks };
          } else {
            newTasksList.push(currentUserTasks);
          }

          dispatch({
            type: SET_USER_TASKS,
            payload: {
              tasks: [...newTasksList],
            },
          });
        }
      );
      userTasksUnsubFunctions.push(userTasksUnsub);
    });

    currentUserTasksUnsub = userTasksUnsubFunctions;
  };
};

const unsubscribeFromCurrentUserTasks = () => {
  if (currentUserTasksUnsub) {
    currentUserTasksUnsub.forEach((unsub) => unsub());
    currentUserTasksUnsub = undefined;
  }
};

const addTask = (
  taskName,
  description,
  assignedTo,
  stage,
  dueDate,
  attachedLinks,
  projectId
) => {
  return async (dispatch) => {
    const newTask = {
      taskName: taskName,
      description: description,
      assignedTo: assignedTo,
      stage: stage,
      dueDate: dueDate,
      attachedLinks: attachedLinks,
      finished: false,
      edited: {
        time: new Date(),
        type: "create",
      },
    };
    await addDoc(collection(db, "Projects", projectId, "tasks"), newTask);
  };
};

const updateTask = (updatedTask, taskId, projectId) => {
  return async (dispatch) => {
    const updates = {
      ...updatedTask,
      edited: {
        time: new Date(),
        type: "change",
      },
    };
    await updateDoc(doc(db, "Projects", projectId, "tasks", taskId), updates);
  };
};

const deleteTask = (taskId, projectId) => {
  return async (dispatch) => {
    await deleteDoc(doc(db, "Projects", projectId, "tasks", taskId));
  };
};

const addComment = (comment, projectId, taskId) => {
  return async (dispatch) => {
    const ref = collection(
      db,
      "Projects",
      projectId,
      "tasks",
      taskId,
      "comments"
    );
    const commentToAdd = {
      ...comment,
      createdAt: new Date(),
    };
    await addDoc(ref, commentToAdd);
  };
};

export {
  addUser,
  setUser,
  subscribeToProjectsUpdates,
  unsubscribeFromProjects,
  setUserList,
  addProject,
  updateProject,
  deleteProject,
  subscribeToCurrentProjectUpdates,
  unsubscribeFromCurrentProjectUpdates,
  subscribeToStagesUpdate,
  unsubscribeFromStageUpdate,
  subscribeToTasksUpdate,
  unsubscribeFromTasksUpdate,
  subscribeToCommentsUpdate,
  unsubscribeFromCommentsUpdate,
  subscribeToCurrentUserTasks,
  unsubscribeFromCurrentUserTasks,
  addTask,
  updateTask,
  deleteTask,
  addComment,
};
