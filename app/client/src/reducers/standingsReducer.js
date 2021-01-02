export const standingsItemReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_STANDINGS_ITEM':
            return action.data
        default:
            return state
    }
}