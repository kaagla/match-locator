import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import './LocationMatchlistComponent.css';
import MatchListItems from '../matches/MatchListItemsComponent'
import LocationDetails from './LocationDetailsComponent'
import CloseButton from '../other/CloseButton'

const Container = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.9);
    z-index: 99;
    opacity: ${props => props.opacity};
    transition: all 0.5s ease-out;
`

const MatchListBox = styled.div`
    width: 100%;
    max-width: 600px;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /*justify-content: center;*/
    overflow-y: auto;
`

export default function LocationMatchlist(props) {

    const location = props.location
    const [opacity, setOpacity] = useState(0)
    const {matches} = useSelector(state => state)


    function getVenues() {
        let venues = new Set([])
        matches.filter(match => match.location_id === location._id).map(m => {
            venues.add(m.venue_name)
        })
        return Array.from(venues)
    }

    function closeContainer() {
        setOpacity(0)
        setTimeout(() => { props.closeEvent()} , 500)
    }

    useEffect(() => {
        setOpacity(1)
    }, [])

    return (
        location &&
        <Container opacity={opacity}>
            <CloseButton closeEvent={closeContainer} />
            <MatchListBox>
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
            </MatchListBox>
        </Container>
    )
}