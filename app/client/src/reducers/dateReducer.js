const initialState = new Date().toJSON().split('T')[0]

export const dateFromReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATE_FROM':
            return action.data
        default:
            return state
    }
}

export const dateToReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATE_TO':
            return action.data
        default:
            return state
    }
}