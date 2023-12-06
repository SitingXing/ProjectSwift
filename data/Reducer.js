const SET_USER = "SET_USER";
const LOAD_PROJECTS = "LOAD_PROJECTS";
const LOAD_USERLIST = "LOAD_USERLIST";
const ADD_PROJECT = "ADD_PROJECT";
const SET_PROJECT = "SET_PROJECT";
const SET_STAGES = "SET_STAGES";
const SET_TASKS = "SET_TASKS";
const SET_COMMENTS = "SET_COMMENTS";
const SET_USER_TASKS = "SET_USER_TASKS";

const initialState = {
    currentUser: {},
    projects: [],
    currentUserTasks: [],
    userList: [],
    currentProject: {},
    currentProjectStages: [],
    currentProjectTasks: [],
    currentProjectComments: [],
};

const _setUser = (state, user) => {
    return {
        ...state,
        currentUser: user,
    }
};

const _setProject = (state, project) => {
    return {
        ...state,
        currentProject: project,
    }
};

const _setUserTasks = (state, tasks) => {
    return {
        ...state,
        currentUserTasks: tasks,
    }
};

const _setStages = (state, stages) => {
    return {
        ...state,
        currentProjectStages: stages,
    }
};

const _setTasks = (state, tasks) => {
    return {
        ...state,
        currentProjectTasks: tasks,
    }
};

const _setComments = (state, comments) => {
    return {
        ...state,
        currentProjectComments: comments,
    }
};

const loadProjects = (state, payload) => {
    return {
        ...state,
        projects: [...payload.projects],
    }
};

const loadUserList = (state, payload) => {
    return {
        ...state,
        userList: [...payload.userList],
    }
};

const addProject = (state, newProject, id) => {
    let {projects} = state;
    let newProjects = projects.concat({
        ...newProject,
        key: id,
    });
    return {
        ...state,
        projects: newProjects,
    };
};

const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return _setUser(state, action.payload.user);
        case LOAD_PROJECTS:
            return loadProjects(state, action.payload);
        case SET_USER_TASKS:
            return _setUserTasks(state, action.payload.tasks);
        case LOAD_USERLIST:
            return loadUserList(state, action.payload);
        case ADD_PROJECT:
            return addProject(state, action.payload.newProject, action.payload.id);
        case SET_PROJECT:
            return _setProject(state, action.payload.project);
        case SET_STAGES:
            return _setStages(state, action.payload.stages);
        case SET_TASKS:
            return _setTasks(state, action.payload.tasks);
        case SET_COMMENTS:
            return _setComments(state, action.payload.comments);
        default:
            return state;
    }
};

export { rootReducer, SET_USER, LOAD_PROJECTS, LOAD_USERLIST, ADD_PROJECT, SET_PROJECT, SET_STAGES, SET_TASKS, SET_COMMENTS, SET_USER_TASKS };