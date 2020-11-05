import axios from 'axios';

export const getMatchesData = (dates, filters) => async dispatch => {

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
        if (!data[filter.type]) {
          data[filter.type] = []
        }
        data[filter.type].push({ "name": filter.name })
      })
    }

    /*
    if (sportsFilters.length > 0) {
      data['sport'] = []
      sportsFilters.map(sport => data['sport'].push(sport))
    }
    */

    let searchData = {}
    searchData['dates'] = dates
    //searchData['sportsFilters'] = sportsFilters
    searchData['filters'] = filters

    let selectedItem = null

    if (filters.length === 1 && ['level','team'].includes(filters[0].type)) {
      selectedItem = filters[0]
    }
    
    try {
      const matches = await axios.post('/api/matches', data)

      dispatch({
        type: 'ADD_MATCHES',
        data: matches.data.matches
      })

      dispatch({
          type: 'ADD_LOCATIONS',
          data: matches.data.locations
      })

      dispatch({
        type: 'SET_SEARCH_CONDITIONS',
        data: searchData
      })

      dispatch({
        type: 'SET_SELECTED_ITEM',
        data: selectedItem
      })

      if (matches.data.matches.length === 1100) {
        dispatch({
          type: 'SET_MATCHES_LIMIT_NOTIFICATION',
          data: true
        })
      }
    } catch (error) {

    } finally {
      dispatch({
        type: 'SET_IS_LOADING',
        data: false
      })
    }
}

export const setMatchesLimitNotification = (selection) => {
  return {
      type: 'SET_MATCHES_LIMIT_NOTIFICATION',
      data: selection
  }
}