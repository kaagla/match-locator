export const setFilters = (filters) => {
    window.localStorage.setItem('filters', JSON.stringify(filters))
    return {
        type: 'SET_FILTERS',
        data: filters
    }
}

export const setFavourites = (favourites) => {
    window.localStorage.setItem('favourites', JSON.stringify(favourites))
    return {
        type: 'SET_FAVOURITES',
        data: favourites
    }
}

export const setSelectedLocation = (item) => {
    return {
        type: 'SET_SELECTED_LOCATION',
        data: item
    }
}