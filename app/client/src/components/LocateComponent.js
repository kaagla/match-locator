import React, { useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import { setCitySearchText } from '../actions/searchText'
import './LocateComponent.css'
import Searchfield from './SearchfieldComponent2'
import Citylist from './CitylistComponent'

export default function Locate() {

    const [isOpen, setIsOpen] = useState(false)
    const { citySearchText } = useSelector(state => state)

    const dispatch = useDispatch()

    function activateSearch() {
        setIsOpen(true)
    }

    function closeSearch() {
        setIsOpen(false)
    }

    function handleText(text) {
        dispatch(setCitySearchText(text))
    }

    return (
        <div className='locate-component'>
            <div className='locate-search'>
                <div onClick={() => activateSearch()}>
                <Searchfield
                    value={citySearchText}
                    handleText={handleText}
                    icon={'eye'}
                    handleSelect={() => {}}
                    isActive={isOpen}
                />
                </div>
                {isOpen ?
                <div
                    className='locate-close-btn'
                    onClick={() => closeSearch()}
                >X</div>
                : null}
            </div>
            {isOpen ?
            <div
                className='locate-list'
            >
                <Citylist />
            </div>
            :
            <div>

            </div>
            }
        </div>
    )
}