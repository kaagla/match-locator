import React, { useState } from 'react'
import './MatchListItemsComponent.css';
import CountBadge from '../other/CountBadgeComponent'
import MatchPreview from './MatchPreviewComponent'
import { matchPreviewEnabled } from '../../services/enabledFeatures'

export default function MatchListItems(props) {

    const [itemIsOpen, setItemIsOpen] = useState(props.itemIsOpen)
    const [selectedMatches, setSelectedMatches] = useState([])
    const [numMatches, setNumMatches] = useState(20)
    
    function selectMatch(id) {
        if (selectedMatches.includes(id)) { 
            setSelectedMatches([...selectedMatches].filter(x => x !== id))
        } else {
            setSelectedMatches([...selectedMatches, id])
        }
    }

    function displayVenue(venue) {
        let city = props.matches.filter(m => m.venue_name === venue)[0].postoffice
        
        if (venue.includes(city)) {
            return venue
        }
        return venue + ', ' + city
    }

    function displayLevel(level) {
        let sport = props.matches.filter(m => m.level === level)[0].sport
        
        return sport + ' - ' + level
    }

    function isUpcomingMatch(date) {
        let year = parseInt(date.split('.')[2])
        let month = parseInt(date.split('.')[1]) - 1
        let day = parseInt(date.split('.')[0])
        let matchDate = new Date(year,month,day)

        let tyear = new Date().getFullYear()
        let tmonth = new Date().getMonth()
        let tday = new Date().getDate()
        let today = new Date(tyear,tmonth,tday)

        if (matchDate >= today) {
            return true
        }
        return false
    }

    function showMoreMatches() {
        setNumMatches(numMatches + 20)
    }

    return (
        <div className='matchlist-items-component'>
            <div
                className='matchlist-component--header'
                onClick={() => setItemIsOpen(!itemIsOpen)}
            >
                <div className='matchlist-component--header-name'>
                    <span>
                        {props.groupbyItem === 'venue_name' ? displayVenue(props.header) : props.groupbyItem === 'level' ? displayLevel(props.header) : props.header}
                    </span>
                    <span className='matchlist-component--header-count'><CountBadge count={props.matches.length} /></span>
                </div>
                <div><i className={itemIsOpen ? 'arrow-up':'arrow-down'}></i></div>
            </div>
            {itemIsOpen ?
            <div className='matchlist-component--details'>
            {props.matches.slice(0,numMatches).map(match =>
                <div 
                    key={match['_id']}
                    className='matchlist-component--match-details'
                >
                    <div className='matchlist-component--match-details--whenwhere'>
                        
                            {props.groupbyItem !== 'date' ?
                            <div className='matchlist-component--match-details-date'>
                                <span><i className="far fa-calendar"></i></span>
                                <span>{match.date}</span>
                            </div>
                            : <span></span>
                            }
                            <div className='matchlist-component--match-details-time'>
                                <span><i className="far fa-clock"></i></span>
                                <span>{match.time}</span>
                            </div>
                            {props.groupbyItem !== 'venue_name' ?
                            <div
                                className='matchlist-component--match-details-venue'
                            >
                                <span><i className="fas fa-map-marker-alt"></i></span>
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
                            <span><i className="fas fa-trophy"></i></span>
                            <span>{match.sport} - {match.level}</span>
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
                    {matchPreviewEnabled(match.sport) && isUpcomingMatch(match.date) ?
                    <div className='matchlist-component--match-preview'>
                    <div 
                        className='matchlist-component--match-preview-btn'
                        onClick={() => selectMatch(match['_id'])}
                    >
                        <span>Ottelun asetelmat</span>
                        <span><i className={selectedMatches.includes(match['_id']) ? 'arrow-up':'arrow-down'}></i></span>
                    </div>
                        {selectedMatches.includes(match['_id']) ?
                        <div className='matchlist-component--match-preview-content'>
                            <MatchPreview
                                match={match}
                            />
                        </div>
                        :
                        <span></span>
                        }
                    </div>
                    : <span></span>
                    }
                    <div></div>
                </div>
                )}
                {numMatches < props.matches.length ?
                <div
                    className='show-more-matches'
                    onClick={() => showMoreMatches()}
                >
                    <span>NÄYTÄ LISÄÄ</span>
                    <span><i className='arrow-down'></i></span>
                </div>
                : <span></span>
                } 
            </div>
            : <div></div>}
        </div>
    )
}