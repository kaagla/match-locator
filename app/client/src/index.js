import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { cityReducer, levelReducer, teamReducer, infoReducer } from './reducers/initialDataReducer'
import { citySearchReducer, itemSearchReducer } from './reducers/searchTextReducer'
import { matchesReducer, locationsReducer, isLoadingMatchesReducer } from './reducers/matchesReducer'
import { dateFromReducer, dateToReducer } from './reducers/dateReducer'
import { mapCenterReducer } from './reducers/mapReducer'
import { filtersReducer, sportsFiltersReducer, favouritesReducer, selectedLocationReducer,
  selectedItemReducer, searchConditionsReducer } from './reducers/selectionReducer'


const reducer = combineReducers({
  cities: cityReducer,
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
  filters: filtersReducer,
  favourites: favouritesReducer,
  isLoadingMatches: isLoadingMatchesReducer,
  selectedLocation: selectedLocationReducer,
  selectedItem: selectedItemReducer,
  searchConditions: searchConditionsReducer,
  sportsFilters: sportsFiltersReducer
})

const store = createStore(reducer, applyMiddleware(thunk))

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
