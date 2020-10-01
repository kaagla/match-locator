import React from 'react'
import { useSelector } from 'react-redux'
import './LocationMatchlistComponent.css';
import MatchListItems from './MatchListItemsComponent'
import LocationDetails from './LocationDetailsComponent'

export default function LocationMatchlist(props) {

    const location = useSelector(state => state.selectedLocation)
    const {matches} = useSelector(state => state)

    function getVenues() {
        let venues = new Set([])
        matches.filter(match => match.location_id === location._id).map(m => {
            venues.add(m.venue_name)
        })
        return Array.from(venues)
    }

    return (
        location === null ?
        null
        :
        <div className='location-matchlist-component'>
            <LocationDetails location={location} />
            {getVenues().map(venue =>
                <MatchListItems 
                    key={venue}
                    header={venue}
                    groupbyItem={'venue_name'}
                    matches={matches.filter(match => match.venue_name === venue)}
                    itemIsOpen={true}
                />
            )}
        </div>
    )
}