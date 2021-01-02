export const searchReducer = (state = false, action) => {
    switch (action.type) {
        case 'SET_SEARCH_IS_ACTIVE':
            return action.data
        default:
            return state
    }
}