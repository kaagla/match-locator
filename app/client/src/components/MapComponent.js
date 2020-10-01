import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { setSelectedLocation } from '../actions/selectionData'
import { Map as LeafletMap, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import './MapComponent.css';
import Locate from './LocateComponent'
import LocationDetails from './LocationDetailsComponent'

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default function Map() {

    const mapCenter = useSelector(state => state.mapCenter)
    const matches = useSelector(state => state.matches)
    const locations = useSelector(state => state.locations)

    const history = useHistory()
    const dispatch = useDispatch()

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

    function handleLocationPopup(location) {
        dispatch(setSelectedLocation(location))
        history.push('/locationmatchlist', location)
    }

    function goToLocationDetails() {
        document.getElementById('content-menu').scrollIntoView({behavior: "smooth", block: "start"})
    }

    function displayTeamName(name) {
        if (name.length > 8) {
            return name.slice(0,8) + '...'
        }
        return name
    }
    
    return (
        <div className='map-container'>
            <Locate />
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
                {locations.map(location =>
                <Marker
                    key={location._id}
                    position={[location.lat,location.lon]}
                    opacity={0.9}
                    onclick={() => handleLocationPopup(location)}
                >
                    <Popup className='request-popup'>
                        <LocationDetails location={location} />
                        <div className='matches-list'>
                            {matches.filter(m => m.location_id === location._id).map(match =>
                            <div className='matches-item'>
                                <span>{displayTeamName(match.home_name)}</span>
                                <span>{match.score.split(' ')[0]}</span>
                                <span>{displayTeamName(match.away_name)}</span>
                            </div>
                            )}
                        </div>
                        <Link to='/locationmatchlist' style={{textDecoration:'none'}}>
                            <div className='go-to-details' onClick={() => goToLocationDetails()}>
                                Näytä tarkat ottelutiedot
                            </div>
                        </Link>
                    </Popup>
                </Marker>
                )}
                <ZoomControl position='bottomright' />
            </LeafletMap>
        </div>
    )
}