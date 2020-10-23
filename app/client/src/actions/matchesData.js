import axios from 'axios';

export const getMatchesData = (dates, filters, sportsFilters) => async dispatch => {

    dispatch({
      type: 'SET_IS_LOADING',
      data: true
    })

    dispatch({
      type: 'SET_SELECTED_LOCATION',
      data: null
    })

    let data = {}

    if (dates !== '') {
      data['dates'] = dates
    }
    if (filters.length > 0) {
      filters.map(filter => {
        data[filter.type] = []
        data[filter.type].push({ "name": filter.name })
      })
    }

    if (sportsFilters.length > 0) {
      data['sport'] = []
      sportsFilters.map(sport => data['sport'].push(sport))
    }

    let searchData = {}
    searchData['dates'] = dates
    searchData['sportsFilters'] = sportsFilters
    searchData['filters'] = filters

    dispatch({
      type: 'SET_SEARCH_CONDITIONS',
      data: searchData
    })

    let selectedItem = null

    if (filters.length === 1 && ['level','team'].includes(filters[0].type)) {
      selectedItem = filters[0]
    }

    dispatch({
      type: 'SET_SELECTED_ITEM',
      data: selectedItem
    })
    
    const matches = await axios.post('/api/matches', data)

    let locIds = new Set([])
    matches.data.map(m => locIds.add(m.location_id))
    const ids = Array.from(locIds)

    let locations = {}
    locations.data = []

    if (ids.length > 0) {
        locations = await axios.get('/api/locations?ids='+ids.join(','))
    }

    dispatch({
        type: 'ADD_MATCHES',
        data: matches.data
    })

    dispatch({
        type: 'ADD_LOCATIONS',
        data: locations.data
    })
    
    dispatch({
      type: 'SET_IS_LOADING',
      data: false
    })
}