import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Map from './containers/MapContainer'
import Navi from './containers/NaviContainer'
import Info from './containers/InfoContainer'
import Search from './containers/SearchContainer';
import MatchList from './containers/MatchListContainer'
import LocationPopup from './containers/LocationPopupContainer'
import Locate from './containers/LocateContainer';
import Standings from './containers/StandingsContainer'
import Loading from './containers/LoadingContainer'

function App() {

  const [mapCenter, setMapCenter] = useState({'city': 'Suomi', 'lat': 63, 'lon': 25});
  const [showPopup, setShowPopup] = useState(false)
  const [selectedLocation, setSeletedLocation] = useState({})
  const [naviSelected, setNaviSelected] = useState('search');
  const [teams, setTeams] = useState([]);
  const [cities, setCities] = useState([]);
  const [levels, setLevels] = useState([]);
  const [matches, setMatches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [standings, setStandings] = useState([]);
  const [selectedStandings, setSelectedStandings] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [DBinfo, setDBinfo] = useState({})

  function handleNaviChange(item) {
    setNaviSelected(item)
  }

  function handleLocationPopup(item) {
    setSeletedLocation(item)
    setShowPopup(true)
  }

  function handleMapCenterChange(item) {

    if (item.name === 'Suomi') {
      setMapCenter({'city': 'Suomi', 'lat': 63, 'lon': 25})
    } else {
      let city = { 'city': {...item}}

      axios.post('/api/citycoordinates', city)
      .then(res => {
        setMapCenter(res.data[0])
      })
      .catch(error => console.log(error))
      }
  }

  function getData(name) {
    axios.get('api/'+name)
    .then(res => {
      if (name === 'teams') {
        setTeams(res.data.filter(team => team.name.charAt(0) > '9'))
      }
      if (name === 'cities') {
        setCities(res.data.filter(city => city.name !== null))
      }
      if (name === 'levels') {
        setLevels(res.data)
      }
      if (name === 'info') {
        setDBinfo(res.data[0])
      }
    })
    .catch(error => console.log(error))
  }

  function getMatches(dates, filters) {
    setIsLoading(true)
    setLoadingText('Haetaan otteluita...')

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

    axios.post('/api/matches', data)
    .then(res => {
      setMatches(res.data)
      let locIds = new Set([])
      res.data.map(m => locIds.add(m.location_id))
      return Array.from(locIds)
    })
    .then(ids => {
      if (ids.length > 0) {
        axios.get('/api/locations?ids='+ids.join(','))
        .then(r => {
          setLocations(r.data)
          console.log(r.data.length)
        })
        .catch(error => console.log(error))
      } else {
        setLocations([])
        setMatches([])
      }
    })
    .then(() => {
      setIsLoading(false)
      setLoadingText('')
    })
    .catch(error => {
      console.log(error)
      setIsLoading(false)
      setLoadingText('')
      setErrorText('Ongelma ilmeni haettaessa otteluita.')
      setTimeout(() => setErrorText(''), 6000)
    })
  }

  function getStandings(item) {
    setStandings([])
    setIsLoading(true)

    setLoadingText('Haetaan sarjatilannetta...')

    let standings = {'standings': item}

    axios.post('/api/standings', standings)
    .then(res => {
      console.log(res.data)
      setStandings(res.data)
      setSelectedStandings(item)
    })
    .then(() => {
      setIsLoading(false)
      setLoadingText('')
    })
    .catch(error => {
      console.log(error)
      handleNaviChange('search')
      setIsLoading(false)
      setLoadingText('')
      setErrorText('Ongelma ilmeni haettaessa sarjatilannetta.')
      setTimeout(() => setErrorText(''), 6000)
    })
  }

  useEffect(() => {
    getData('cities')
    getData('levels')
    getData('teams')
    getData('info')
  }, []);
  

  return (
    <div className="App">

      <Map
        mapCenter={mapCenter}
        locations={locations}
        matches={matches}
        handleLocationPopup={handleLocationPopup}
      />

      {showPopup ?
      <LocationPopup
          setShowPopup={setShowPopup}
          selectedLocation={selectedLocation}
          matches={matches.filter(match => match.location_id === selectedLocation._id)}
      /> : <div></div>
      }

      <Navi
        naviSelected={naviSelected}
        handleNaviChange={handleNaviChange}
        numMatches={matches.length}
      />

      {naviSelected === 'eye' ?
      <Locate 
        cities={cities}
        handleMapCenterChange={handleMapCenterChange}
        handleNaviChange={handleNaviChange}
      /> : <div></div>}

      <Search
        naviSelected={naviSelected}
        teams={teams}
        cities={cities}
        levels={levels}
        matches={matches}
        getMatches={getMatches}
        handleNaviChange={handleNaviChange}
        getStandings={getStandings}
        isLoading={isLoading}
        loadingText={loadingText}
        errorText={errorText}
      />

      {naviSelected === 'info' ?
      <Info
        handleNaviChange={handleNaviChange}
        DBinfo={DBinfo}
      /> : <div></div>
      }

      {naviSelected === 'list-ul' ?
        isLoading ?
        <Loading loadingText={loadingText} />
        :
        matches.length === 0 ?
        handleNaviChange('search')
        :
        <MatchList
          matches={matches}
          handleNaviChange={handleNaviChange}
        />
      : <div></div>
      }

      {naviSelected === 'standings' ?
        isLoading ?
        <Loading loadingText={loadingText} />
        :
        <Standings
          standings={standings}
          selectedStandings={selectedStandings}
          handleNaviChange={handleNaviChange}
        />
      : <div></div>
      }
      
    </div>
  );
}

export default App;
