import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { getMatchesData } from '../actions/matchesData'
import { standingsEnabled } from '../services/enabledFeatures'
import IconDiv from './IconComponent';
import './FilterItem.css'

export default function FilterItem(props) {

    const [showOptions, setShowOptions] = useState(false)

    function handleOptions() {
        if (showOptions === true) {
            document.getElementById('filter-item-options').className = 'filter-item-options-on-close'
            setTimeout(() => { setShowOptions(!showOptions) }, 400)
        } else {
            setShowOptions(!showOptions)
        } 
    }

    const dispatch = useDispatch()

    function getMatches(item) {
        dispatch(getMatchesData('', [item]))
        props.handleClose()
        document.getElementById('content-menu').scrollIntoView({behavior: "smooth", block: "start"})
    }

    function displayName(name) {
        return name.split(' - ').length > 1 ? name.split(' - ').slice(0,-1).join(' - ') : name
    }

    return(
        <div className='filter-item-component'>
            {['level','team'].includes(props.item.type) ?
            <div
                className='filter-item-header-with-options'
                onClick={() => handleOptions()}
            >
                <div className='filter-item-header-details'>
                    <span className='filter-item-header-name'>
                        {displayName(props.item.name)}
                    </span>
                    <span className='filter-item-header-sport'>
                        {props.item.sport.toUpperCase()}
                    </span>
                </div>
                <div><i className={showOptions ? 'arrow-up':'arrow-down'}></i></div>
            </div>
            :
            <div className='filter-item-header'>
                <div className='filter-item-header-name'>
                    <span>{props.item.name}</span>
                </div>
            </div>   
            }
            {['level','team'].includes(props.item.type) && showOptions &&
            <div id='filter-item-options' className='filter-item-options'>
                <Link to='/'>
                    <span onClick={() => getMatches(props.item)}>
                        <IconDiv icon={'list-ul'} definition={'OTTELUT'} />
                    </span>
                </Link>
                {standingsEnabled(props.item.sport, props.item.type) &&
                <Link to='/standings'>
                    <span onClick={() => getMatches(props.item)}>
                        <IconDiv icon={'trophy'} definition={'SARJATILANNE'} />
                    </span>
                </Link>
                }
            </div>
            }
        </div>
    )
}