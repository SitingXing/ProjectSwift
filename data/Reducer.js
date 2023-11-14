const ADD_USER = "ADD_USER";
const LOAD_PROJECTS = "LOAD_PROJECTS";

const initialState = {
    users: [],
    projects: [],
};

const addUser = (state, payload) => {
    return {
        ...state,
        usres: state.users.concat({...payload.user}),
    }
};

const loadProjects = (state, payload) => {
    return {
        ...state,
        projects: [...payload.projects],
    }
}

const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        case ADD_USER:
            return addUser(state, action.payload);
        case LOAD_PROJECTS:
            return loadProjects(state, action.payload);
        default:
            return state;
    }
};

export { rootReducer, ADD_USER, LOAD_PROJECTS };