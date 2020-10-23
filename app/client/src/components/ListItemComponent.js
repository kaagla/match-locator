import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setFilters, setFavourites } from '../actions/selectionData'
import { getMatchesData } from '../actions/matchesData'
import { standingsEnabled } from '../services/enabledFeatures'
import IconDiv from './IconComponent';
import './ListItemComponent.css'

export default function ListItem(props) {

    const [selectionOpen, setSelectionOpen] = useState(false)

    const filters = useSelector(state => state.filters)
    const favourites = useSelector(state => state.favourites)

    const dispatch = useDispatch()

    function handleSelection(group, item) {
        if (group === 'favourites') {
            if (favourites.filter(fav => fav.name === item.name).length === 0) {
                let newFavourites = [...favourites]
                newFavourites.push(item)
                dispatch(setFavourites(newFavourites))
            } else {
                let newFavourites = [...favourites].filter(fav => fav.name !== item.name)
                dispatch(setFavourites(newFavourites))
            }
        }
        if (group === 'filters') {
            if (filters.filter(fil => fil.name === item.name).length === 0) {
                let newFilters = [...filters]
                newFilters.push(item)
                dispatch(setFilters(newFilters))
            } else {
                let newFilters = [...filters].filter(filter => filter.name !== item.name)
                dispatch(setFilters(newFilters))
            }
        }
    }

    function getMatches(item) {
        dispatch(getMatchesData('', [item], []))
        document.getElementById('content-menu').scrollIntoView({behavior: "smooth", block: "start"})
        props.handleClose()
    }

    return (
        <div className='list-item-component'>
            <div
                className='list-item-component--header'
                onClick={() => setSelectionOpen(!selectionOpen)}
            >
                <span>{props.item.name}</span>
                <span><i className={selectionOpen ? 'arrow-up':'arrow-down'}></i></span>
            </div>
            <div className='list-item-component--header-sport'>
                {props.item.sport ?
                props.item.sport.toUpperCase()
                : ''}
            </div>
            {selectionOpen ?
            <div className='list-item-component--options'>
                <div>
                    <div>VALINNAT</div>
                    <div className='list-item-component--options-group'>
                        <span 
                            className={favourites.filter(fav => fav.name === props.item.name).length > 0 ? 'list-item-component--options-selected':''}
                            onClick={() => handleSelection('favourites', props.item)}
                        >
                            <IconDiv
                                icon={'star'}
                                definition={'SUOSIKKI'}
                            />   
                        </span>      
                        <span
                            className={filters.filter(fil => fil.name === props.item.name).length > 0 ? 'list-item-component--options-selected':''}
                            onClick={() => handleSelection('filters', props.item)}
                        >
                            <IconDiv
                                icon={'filter'}
                                definition={'SUODATIN'}
                            />
                        </span>
                    </div>
                </div>
                <div>
                    <div>NÄYTÄ</div>
                    <div className='list-item-component--options-group'>
                        <Link to='/'>
                            <span
                                onClick={() => getMatches(props.item)}
                            >
                                <IconDiv
                                    icon={'list-ul'}
                                    definition={'OTTELUT'}
                                />
                            </span>
                        </Link>
                        {standingsEnabled(props.item.sport, props.item.type) ?
                        <Link to='/standings'>
                            <span
                                onClick={() => getMatches(props.item)}
                            >
                                <IconDiv
                                    icon={'trophy'}
                                    definition={'SARJATILANNE'}
                                />
                            </span>
                        </Link>
                        :
                        null
                        }
                    </div>
                </div>
            </div>
            : <div></div>
            }
        </div>
    )
}