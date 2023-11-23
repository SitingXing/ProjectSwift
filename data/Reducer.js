const SET_USER = "SET_USER";
const LOAD_PROJECTS = "LOAD_PROJECTS";
const LOAD_USERLIST = "LOAD_USERLIST";

const initialState = {
    currentUser: {},
    projects: [],
    userList: [],
};

const _setUser = (state, user) => {
    return {
        ...state,
        currentUser: user,
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

const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        case SET_USER:
            return _setUser(state, action.payload.user);
        case LOAD_PROJECTS:
            return loadProjects(state, action.payload);
        case LOAD_USERLIST:
            return loadUserList(state, action.payload);
        default:
            return state;
    }
};

export { rootReducer, SET_USER, LOAD_PROJECTS, LOAD_USERLIST };