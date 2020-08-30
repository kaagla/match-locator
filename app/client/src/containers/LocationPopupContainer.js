import React from 'react'
import './LocationPopupContainer.css';
import MatchListItems from './components/MatchListItemsComponent'
import IconDiv from './components/IconComponent'

export default function LocationPopup(props) {

    const location = {...props.selectedLocation}

    function getVenues() {
        let venues = new Set([])
        props.matches.map(m => {
            venues.add(m.venue_name)
        })
        return Array.from(venues)
    }

    function getDirections(lat,lon) {
        let url = `https://www.google.fi/maps/dir//${lat},${lon}/@${lat},${lon},11z`
        return url
    }

    /*
    {getVenues(location._id).map(venue =>
                    <MatchListItems 
                        key={venue}
                        onMap={false}
                        header={venue}
                        groupbyItem={'venue_name'}
                        matches={props.matches.filter(match => match.venue_name === venue)}
                    />
                    )}
    */

    return (
        <div className='container'>
            <div className='container-box'>
                <div className='locationpopup-container'>
                    <div
                        className='close-btn'
                        onClick={() => props.setShowPopup(false)}
                    >X</div>
                    <div className='location-address-bar'>
                        <div>
                            <div className='location-address'>
                                {location.address}
                            </div>
                            <div className='location-address-city'>
                                {location.postalcode} {location.city}
                            </div>
                        </div>
                        <div
                            className='location-directions'
                            onClick={() => window.open(getDirections(location.lat,location.lon))}
                        >
                            <IconDiv 
                                icon={'directions'}
                                definition={'REITTIOHJE'}
                            />
                        </div>
                    </div>
                    {getVenues().map(venue =>
                        <MatchListItems 
                            key={venue}
                            header={venue}
                            groupbyItem={'venue_name'}
                            matches={props.matches.filter(match => match.venue_name === venue)}
                            itemIsOpen={true}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}