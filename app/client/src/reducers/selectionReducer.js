function getInitialVisibleFilters() {
    if (JSON.parse(window.localStorage.getItem('visibleFilters'))) {
        return JSON.parse(window.localStorage.getItem('visibleFilters'))
    }
    return [
        {'type': 'grandarea', 'name': 'Helsinki-Uusimaa'},
        {'type': 'grandarea', 'name': 'Etelä-Suomi'},
        {'type': 'grandarea', 'name': 'Länsi-Suomi'},
        {'type': 'grandarea', 'name': 'Pohjois- ja Itä-Suomi'},
        {'type': 'grandarea', 'name': 'Ahvenanmaa'},
        {'type': 'sport', 'name': 'Jalkapallo'},
        {'type': 'sport', 'name': 'Futsal'},
        {'type': 'sport', 'name': 'Koripallo'},
        {'type': 'sport', 'name': 'Lentopallo'},
        {'type': 'sport', 'name': 'Käsipallo'}
    ]
}

function getInitialSelectedFilters() {
    if (JSON.parse(window.localStorage.getItem('selectedFilters'))) {
        return JSON.parse(window.localStorage.getItem('selectedFilters'))
    }
    return []
}

export const visibleFiltersReducer = (state = getInitialVisibleFilters(), action) => {
    switch (action.type) {
        case 'SET_VISIBLE_FILTERS':
            return action.data
        default:
            return state
    }
}

export const selectedFiltersReducer = (state = getInitialSelectedFilters(), action) => {
    switch (action.type) {
        case 'SET_SELECTED_FILTERS':
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

export const selectedContentReducer = (state = 'info', action) => {
    switch (action.type) {
        case 'SET_SELECTED_CONTENT':
            return action.data
        default:
            return state
    }
}