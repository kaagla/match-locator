const initialState = []

export const matchesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_MATCHES':
            return action.data
        default:
            return state
    }
}

export const locationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_LOCATIONS':
            return action.data
        default:
            return state
    }
}

export const isLoadingMatchesReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_IS_LOADING':
            return action.data
        default:
            return state
    }
}