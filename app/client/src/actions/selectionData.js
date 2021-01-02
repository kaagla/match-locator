export const setVisibleFilters = (filters) => {
    window.localStorage.setItem('visibleFilters', JSON.stringify(filters))
    return {
        type: 'SET_VISIBLE_FILTERS',
        data: filters
    }
}

export const setSelectedFilters = (filters) => {
    window.localStorage.setItem('selectedFilters', JSON.stringify(filters))
    return {
        type: 'SET_SELECTED_FILTERS',
        data: filters
    }
}

export const setSelectedLocation = (item) => {
    return {
        type: 'SET_SELECTED_LOCATION',
        data: item
    }
}

export const setSelectedContent = (content) => {
    return {
        type: 'SET_SELECTED_CONTENT',
        data: content
    }
}