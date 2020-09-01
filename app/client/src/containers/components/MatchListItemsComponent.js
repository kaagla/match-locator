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
                        
                            {props.groupbyItem !== 'date' ?
                            <div className='matchlist-component--match-details-date'>
                                <span><i class="far fa-calendar"></i></span>
                                <span>{match.date}</span>
                            </div>
                            : <span></span>
                            }
                            <div className='matchlist-component--match-details-time'>
                                <span><i class="far fa-clock"></i></span>
                                <span>{match.time}</span>
                            </div>
                            {props.groupbyItem !== 'venue_name' ?
                            <div
                                className='matchlist-component--match-details-venue'
                            >
                                <span><i class="fas fa-map-marker-alt"></i></span>
                                <span>
                                {props.groupbyItem === 'city' ?
                                    match.venue_name
                                    :
                                    displayVenue(match.venue_name)
                                }
                                </span>
                            </div>
                            : <span></span>
                            }
                            {!['city','venue_name'].includes(props.groupbyItem) ?
                            <span
                                className='matchlist-component--match-details-city'
                            ></span>
                            : <span></span>
                            }
                    </div>
                    <div className='matchlist-component--match-details--who'>
                        {props.groupbyItem !== 'level' ?
                        <div className='matchlist-component--match-details-level'>
                            <span><i class="fas fa-trophy"></i></span>
                            <span>{match.level}</span>
                        </div>
                        : <span></span>
                        }
                        <div className='matchlist-component--match-details-team-info'>
                            <div className='matchlist-component--match-details-home'>
                                <span>{match.home_name}</span>
                            </div>
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