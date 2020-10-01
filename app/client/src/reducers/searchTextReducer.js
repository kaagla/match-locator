const initialState = ''

export const citySearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CITY_SEARCH_TEXT':
            return action.data
        default:
            return state
    }
}

export const itemSearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ITEM_SEARCH_TEXT':
            return action.data
        default:
            return state
    }
}