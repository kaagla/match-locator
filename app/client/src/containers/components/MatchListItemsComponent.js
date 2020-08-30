import React, { useState } from 'react'
import './MatchListItemsComponent.css';
import CountBadge from './CountBadgeComponent'

export default function MatchListItems(props) {

    const [itemIsOpen, setItemIsOpen] = useState(props.itemIsOpen)

    //const city = props.matches.filter(m => m.venue_name === props.header)[0].city
    
    function displayVenue(venue) {
        let city = props.matches.filter(m => m.venue_name === venue)[0].city
        
        if (venue.includes(city)) {
            return venue
        }
        return venue + ', ' + city
    }

    let info = '('

    if (props.matches.length === 0) {
        info += 'ei otteluita)'
    } else if (props.matches.length === 1) {
        info += '1 ottelu)'
    } else {
        info += `${props.matches.length} ottelua)`
    }


    console.log(props)
    return (
        <div className='matchlist-component'>
            <div
                className='matchlist-component--header'
                onClick={() => setItemIsOpen(!itemIsOpen)}
            >
                <div className='matchlist-component--header-name'>
                    <span>{props.groupbyItem === 'venue_name' ? displayVenue(props.header) : props.header}</span>
                    <span className='matchlist-component--header-count'><CountBadge count={props.matches.length} /></span>
                </div>
                <div><i className={itemIsOpen ? 'arrow-up':'arrow-down'}></i></div>
            </div>
            {itemIsOpen ? 
            props.matches.map(match =>
                <div 
                    key={match['_id']}
                    className='matchlist-component--match-details'
                >
                    <div className='matchlist-component--match-details--whenwhere'>
                        <div className='matchlist-component--match-details--whenwhere-when'>
                            {props.groupbyItem !== 'date' ?
                            <span className='matchlist-component--match-details-date'>{match.date}</span>
                            : <span></span>
                            }
                            <span
                                className='matchlist-component--match-details-time'
                            >{match.time}</span>
                        </div>
                        <div className='matchlist-component--match-details--whenwhere-where'>
                            {props.groupbyItem !== 'venue_name' ?
                            <span
                                className='matchlist-component--match-details-venue'
                            >
                                {props.groupbyItem === 'city' ?
                                    match.venue_name
                                    :
                                    displayVenue(match.venue_name)
                                }
                            </span>
                            : <span></span>
                            }
                            {!['city','venue_name'].includes(props.groupbyItem) ?
                            <span
                                className='matchlist-component--match-details-city'
                            ></span>
                            : <span></span>
                            }
                        </div>
                    </div>
                    <div className='matchlist-component--match-details--who'>
                        <div>
                            {props.groupbyItem !== 'level' ?
                            <span
                                className='matchlist-component--match-details-level'
                            >{match.level}</span>
                            : <span></span>
                            }
                        </div>
                        <div className='matchlist-component--match-details-team-info'>
                            <div
                                className='matchlist-component--match-details-home'
                            >{match.home_name}</div>
                            <div
                                className='matchlist-component--match-details-score'
                            >{match.score}</div>
                            <div
                                className='matchlist-component--match-details-away'
                            >{match.away_name}</div>
                        </div>
                    </div>
                </div>)
            : <div></div>
            }
        </div>
    )
}