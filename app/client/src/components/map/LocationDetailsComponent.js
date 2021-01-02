import React from 'react'
import './LocationDetailsComponent.css'
import IconDiv from '../other/IconComponent'

export default function LocationDetails(props) {

    const location = props.location

    function getDirections(lat,lon) {
        let url = `https://www.google.fi/maps/dir//${lat},${lon}/@${lat},${lon},11z`
        return url
    }

    return (
        <div className='location-details-component'>
            <div className='location-address'>
                <div>
                    {location.address}
                </div>
                <div>
                    {location.postalcode} {location.postoffice}
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
    )
}