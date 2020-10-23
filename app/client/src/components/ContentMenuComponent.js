import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import './ContentMenuComponent.css'
import IconDiv from './IconComponent'
import { displayDates } from '../services/dateService'
import { standingsEnabled } from '../services/enabledFeatures'

export default function Content(props) {

    const {matches, searchConditions, selectedLocation, selectedItem} = useSelector(state => state)
    const [selectedContent, setSelectedContent] = useState('all-matches')

    const location = useLocation()

    function handleContent(selected) {
        if (selected !== selectedContent) {
            setSelectedContent(selected)
        }
        document.getElementById('content-menu').scrollIntoView({behavior: "smooth", block: "start"})
    }

    return (
        <div id='content-menu' className='content-menu-component'>
            {searchConditions !== null ?
            <div className='content-menu-details'>
                <div>Hakuehdot:</div>
                {searchConditions['dates'] !== '' ?
                <div>
                <div>
                    {displayDates(searchConditions['dates'].split(',')[0],searchConditions['dates'].split(',')[1])}
                </div>
                {searchConditions['sportsFilters'] &&
                <div>
                    {searchConditions['sportsFilters'].map(sport =>
                        <span>{sport} </span>
                    )}
                </div>
                }
                {searchConditions['filters'].map(filter =>
                    <div>{filter.name}</div>)}
                </div>
                :
                <div>{searchConditions['filters'][0].name}</div>
                }
            </div>
            : null
            }
            <div className='content-menu'>
                {searchConditions ?
                <Link to='/'>
                    <div
                        className={location.pathname === '/' ? 'all-matches selected-menu-item':'all-matches'}
                        onClick={() => handleContent('all-matches')}
                    >
                        <IconDiv 
                            icon={'list-ul'}
                            definition={'OTTELUT ' + matches.length}
                        />
                    </div>
                </Link>
                : null
                }
                {selectedLocation ?
                <Link to='/locationmatchlist'>
                    <div
                        className={location.pathname === '/locationmatchlist' ? 'selected-menu-item':''}
                        onClick={() => handleContent('location')}
                    >
                        <IconDiv
                            icon={'map-marker-alt'}
                            definition={'OTTELUT KOHTEESSA'} 
                        />
                    </div>
                </Link>
                : null
                }
                {selectedItem && standingsEnabled(selectedItem.sport, selectedItem.type) ?
                <Link to='/standings' >
                    <div
                        className={location.pathname === '/standings' ? 'selected-menu-item':''}
                        onClick={() => handleContent('standings')}
                    >
                        <IconDiv
                            icon={'trophy'}
                            definition={'SARJATILANNE'}
                        />
                    </div>
                </Link>
                :
                null
                }
            </div>
        </div>
    )
}