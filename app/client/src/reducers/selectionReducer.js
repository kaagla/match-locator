function getInitialFilters() {
    if (JSON.parse(window.localStorage.getItem('filters'))) {
        return JSON.parse(window.localStorage.getItem('filters'))
    }
    return []
}

function getInitialFavourites() {

    if (JSON.parse(window.localStorage.getItem('favourites'))) {
        return JSON.parse(window.localStorage.getItem('favourites'))
    }
    return []
}

export const filtersReducer = (state = getInitialFilters(), action) => {
    switch (action.type) {
        case 'SET_FILTERS':
            return action.data
        default:
            return state
    }
}

export const favouritesReducer = (state = getInitialFavourites(), action) => {
    switch (action.type) {
        case 'SET_FAVOURITES':
            return action.data
        default:
            return state
    }
}

export const selectedLocationReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_SELECTED_LOCATION':
            return action.data
        default:
            return state
    }
}

export const selectedItemReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_SELECTED_ITEM':
            return action.data
        default:
            return state
    }
}

export const searchConditionsReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_SEARCH_CONDITIONS':
            return action.data
        default:
            return state
    }
}