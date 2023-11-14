import { initializeApp, getApps } from "firebase/app";
import { getFirestore, setDoc, doc, onSnapshot, collection, getDoc, getDocs } from "firebase/firestore";

import { firebaseConfig } from "../Secrets";
import { ADD_USER, LOAD_PROJECTS } from "./Reducer";

let app;
const apps = getApps();
if (apps.length == 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = apps[0];
};
const db = getFirestore(app);

const addUser = (newUser) => {
    return async (dispatch) => {
        const userToAdd = {
            userName: newUser.displayName,
            email: newUser.email,
            key: newUser.uid,
        };
        await setDoc(doc(db, 'users', newUser.uid), userToAdd);
    };
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

export { addUser, subscribeToProjectsUpdates, unsubscribeFromProjects };