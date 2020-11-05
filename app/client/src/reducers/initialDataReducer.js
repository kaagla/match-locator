const initialState = []

export const areaReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_AREAS':
            return action.data
        default:
            return state
    }
}

export const levelReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_LEVELS':
            return action.data
        default:
            return state
    }
}

export const teamReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TEAMS':
            return action.data
        default:
            return state
    }
}

export const infoReducer = (state = null, action) => {
    switch (action.type) {
        case 'ADD_INFO':
            return action.data
        default:
            return state
    }
}