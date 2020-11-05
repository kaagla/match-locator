import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { getInitialData } from './actions/intialData'
import { getMatchesData } from './actions/matchesData'
import './App.css';

import Map from './components/MapComponent'
import TopMenu from './components/TopMenuComponent'
import ContentMenu from './components/ContentMenuComponent'
import Content from './components/ContentComponent'
import Notification from './components/NotificationComponent'

import Matchlist from './components/MatchlistComponent'
import LocationMatchlist from './components/LocationMatchlistComponent'
import Standings from './components/StandingsComponent'

function App() {

  const { dateFrom, dateTo, selectedFilters, selectedItem, selectedLocation, matchesLimitNotification } = useSelector(state => state)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getInitialData('areas'))
    dispatch(getInitialData('levels'))
    dispatch(getInitialData('teams'))
    dispatch(getInitialData('info'))
    dispatch(getMatchesData(dateFrom+','+dateTo, selectedFilters))
  }, []);

  return(
    <div className='App'>
      <Router>
        <TopMenu />
        <Map />
        <ContentMenu />
        {matchesLimitNotification && <Notification />}
        <Switch>
          <Route
            exact path='/'
            render={() => <Content><Matchlist /></Content>} 
          />
          <Route
            exact path='/locationmatchlist'
            render={() => selectedLocation && <Content><LocationMatchlist /></Content>} 
          />
          <Route
            exact path='/standings'
            render={() => selectedItem && <Content><Standings /></Content>} 
          />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
