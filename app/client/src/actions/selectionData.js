export const setFilters = (filters) => {
    window.localStorage.setItem('filters', JSON.stringify(filters))
    return {
        type: 'SET_FILTERS',
        data: filters
    }
}

export const setSportsFilters = (sportsFilters) => {
    window.localStorage.setItem('sportsFilters', JSON.stringify(sportsFilters))
    return {
        type: 'SET_SPORTS_FILTERS',
        data: sportsFilters
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