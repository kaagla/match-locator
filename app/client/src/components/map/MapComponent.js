import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Map as LeafletMap, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import './MapComponent.css';
import Locate from './LocateComponent'
import LocationDetails from './LocationDetailsComponent'
import MapLayers from './MapLayersComponent'
import LocationMatchlist from './LocationMatchlist'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const footballMarker = L.divIcon({
    html: '<div class="custom-marker-div"><i class="fas fa-futbol"></i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30],
    className: 'custom-marker football-marker'
})

const futsalMarker = L.divIcon({
    html: '<div class="custom-marker-div"><i class="far fa-futbol"></i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30],
    className: 'custom-marker futsal-marker'
})

const basketballMarker = L.divIcon({
    html: '<div class="custom-marker-div"><i class="fas fa-basketball-ball"></i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30],
    className: 'custom-marker basketball-marker'
})

const volleyballMarker = L.divIcon({
    html: '<div class="custom-marker-div"><i class="fas fa-volleyball-ball"></i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30],
    className: 'custom-marker volleyball-marker'
})

const handballMarker = L.divIcon({
    html: '<div class="custom-marker-div"><i class="fas fa-baseball-ball"></i></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 40],
    popupAnchor: [0, -30],
    className: 'custom-marker handball-marker'
})

function getMarker(sport) {
    switch(sport) {
        case 'Jalkapallo':
          return footballMarker
        case 'Futsal':
          return futsalMarker
        case 'Koripallo':
          return basketballMarker
        case 'Lentopallo':
            return volleyballMarker
        case 'Käsipallo':
            return handballMarker
        default:
            return footballMarker
      }
}

export default function Map() {

    const { mapCenter, matches, locations, isLoadingMatches } = useSelector(state => state)
    const [ selectedSports, setSelectedSports ] = useState(['Jalkapallo','Futsal','Koripallo','Lentopallo','Käsipallo'])
    const [selectedLocation, setSelectedLocation] = useState(null)

    function getZoom() {
        let zoom;
        if (mapCenter.city !== 'Suomi') {
            zoom = 11
        } else {
            zoom = 6
        }

        if (window.innerWidth <= 600) {
            return zoom-1
        }
        return zoom
    }

    function goToLocationDetails(location) {
        setSelectedLocation(location)
    }

    function closeLocationDetails() {
        setSelectedLocation(null)
    }

    function displayTeamName(name) {
        if (name.length > 8) {
            return name.slice(0,8) + '...'
        }
        return name
    }

    function handleSelectedSports(sport) {
        if (selectedSports.includes(sport)) {
            setSelectedSports([...selectedSports].filter(s => s !== sport))
        } else {
            setSelectedSports([...selectedSports, sport])
        }
    }

    function matchesByLevel(locationMatches) {
        let levelSet = new Set([])
        locationMatches.map(m => levelSet.add(m.level))

        let levels = []

        Array.from(levelSet).map(level => {
            let data = {}
            data['name'] = level
            data['matches'] = []

            locationMatches.filter(m => m.level === level).map(match => {
                data['matches'].push(match)
            })

            levels.push(data)
        })

        return levels
    }

    return (
        <div className='map-container'>
            {isLoadingMatches &&
            <div className='loader-div'>
                <div className='loader'>LADATAAN OTTELUITA...</div>
            </div>
            }
            {selectedLocation &&
            <LocationMatchlist 
                location={selectedLocation}
                closeEvent={closeLocationDetails}
            />
            }
            <Locate />
            <MapLayers selectedSports={selectedSports} handleSelectedSports={handleSelectedSports} />
            <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css" />
            <LeafletMap
                center={[mapCenter.lat, mapCenter.lon]}
                zoom={getZoom()}
                attributionControl={true}
                zoomControl={false}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                dragging={true}
                animate={true}
                easeLinearity={0.35}
            >
                <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                />
                {locations.filter(l => selectedSports.includes(l.sport)).map(location =>
                <Marker
                    key={location._id}
                    position={[location.lat,location.lon]}
                    opacity={0.9}
                    icon={getMarker(location.sport)}
                >
                    <Popup className='request-popup'>
                        <LocationDetails location={location} />
                        <div className='location-sport'>{location.sport}</div>
                        <div className='matches-list'>
                            {matchesByLevel(matches.filter(m => m.location_id === location._id)).map(level =>
                            <div key={level.name} className='level-card'>
                            <div className='level-card-title'>{level.name}</div>
                            {level.matches.map(match =>
                                <div key={match._id} className='level-card-matches'>
                                    <span className='level-card-matches-home'>{displayTeamName(match.home_name)}</span>
                                    <span className='level-card-matches-score'>{match.score.split(' ')[0]}</span>
                                    <span className='level-card-matches-away'>{displayTeamName(match.away_name)}</span>
                                </div>
                            )}
                            </div>
                            )}
                        </div>
                        <div className='go-to-details' onClick={() => goToLocationDetails(location)}>
                            Näytä tarkat ottelutiedot
                        </div>
                    </Popup>
                </Marker>
                )}
                <ZoomControl position='bottomright' />
            </LeafletMap>
        </div>
    )
}