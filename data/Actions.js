import { initializeApp, getApps } from "firebase/app";
import { getFirestore, setDoc, doc, onSnapshot, collection, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { firebaseConfig } from "../Secrets";
import { SET_USER, LOAD_PROJECTS, LOAD_USERLIST } from "./Reducer";

let app;
const apps = getApps();
if (apps.length == 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = apps[0];
};
const db = getFirestore(app);
const storage = getStorage(app);

const addUser = (newUser, pictureObject) => {
    return async (dispatch) => {
        const fileName = pictureObject.uri.split('/').pop();
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
        await setDoc(doc(db, 'users', newUser.uid), userToAdd);
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
        let userSnap = await getDoc(doc(db, 'users', authUser.uid));
        while (!userSnap.data()) {
            userSnap = await getDoc(doc(db, 'users', authUser.uid));
        };
        const user = userSnap.data();
        dispatch({
            type: SET_USER,
            payload: {
                user: user,
            },
        });
    }
};

let projectsSnapshotUnsub = undefined;
const subscribeToProjectsUpdates = (userUid) => {
    if (projectsSnapshotUnsub) {
        projectsSnapshotUnsub();
    };

    return async (dispatch) => {
        projectsSnapshotUnsub = onSnapshot(
            doc(db, 'users', userUid),
            async (snap) => {
                const updateUser = {...snap.data()};
                dispatch({
                    type: SET_USER,
                    payload: {
                        user: updateUser,
                    },
                });

                const projectId = snap.data().projectsList;
                const projectsPromises = projectId.map(async(id) => {
                    const docRef = doc(db, 'Projects', id);
                    const projectDoc = await getDoc(docRef);
                    const project = projectDoc.data().basicInfo;
                    const options = {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    };
                    const endDate = project.endDate.toDate().toLocaleDateString("en-US", options);
                    return {
                        name: project.name,
                        endDate: endDate,
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
        )
    }
};

const unsubscribeFromProjects = () => {
    if (projectsSnapshotUnsub) {
        projectsSnapshotUnsub();
        projectsSnapshotUnsub = undefined;
    }
};

const setUserList = (authUser) => {
    return async (dispatch) => {
        const usersSnap = await getDocs(collection(db, 'users'));
        const userList = usersSnap.docs.map((docSnap) => {
            return {
                ...docSnap.data(),
                profile: docSnap.data().profile.uri,
            };
        });
        const filteredUserList = userList.filter(user => user.key !== authUser.key);

        dispatch({
            type: LOAD_USERLIST,
            payload: {
                userList: filteredUserList,
            },
        });
    }
};

export { addUser, setUser, subscribeToProjectsUpdates, unsubscribeFromProjects, setUserList };