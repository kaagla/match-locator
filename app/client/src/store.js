import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { areaReducer, 
         levelReducer, 
         teamReducer, 
         infoReducer } from './reducers/initialDataReducer'

import { citySearchReducer, 
         itemSearchReducer } from './reducers/searchTextReducer'
import { matchesReducer, 
         locationsReducer, 
         isLoadingMatchesReducer, 
         matchesLimitNotificationReducer } from './reducers/matchesReducer'
import { dateFromReducer, dateToReducer } from './reducers/dateReducer'
import { mapCenterReducer } from './reducers/mapReducer'
import { selectedLocationReducer,
         selectedItemReducer, 
         searchConditionsReducer, 
         visibleFiltersReducer, 
         selectedFiltersReducer,
         selectedContentReducer } from './reducers/selectionReducer'
import { standingsItemReducer } from './reducers/standingsReducer'
import { searchReducer } from './reducers/searchReducer'

const reducer = combineReducers({
    areas: areaReducer,
    levels: levelReducer,
    teams: teamReducer,
    info: infoReducer,
    citySearchText: citySearchReducer,
    itemSearchText: itemSearchReducer,
    matches: matchesReducer,
    locations: locationsReducer,
    dateFrom: dateFromReducer,
    dateTo: dateToReducer,
    mapCenter: mapCenterReducer,
    isLoadingMatches: isLoadingMatchesReducer,
    selectedLocation: selectedLocationReducer,
    selectedItem: selectedItemReducer,
    searchConditions: searchConditionsReducer,
    matchesLimitNotification: matchesLimitNotificationReducer,
    visibleFilters: visibleFiltersReducer,
    selectedFilters: selectedFiltersReducer,
    selectedContent: selectedContentReducer,
    standingsItem: standingsItemReducer,
    searchIsActive: searchReducer
})

export const store = createStore(reducer, applyMiddleware(thunk))