import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {setItemSearchText} from '../actions/searchText'
import { getMatchesData } from '../actions/matchesData'
import { displayDates } from '../services/dateService'
import './TopMenuComponent.css'
import MenuItem from './MenuItem'
import IconDiv from './IconComponent'
import Searchfield from './SearchfieldComponent2'
import List from './ListComponent'
import Calendar from './CalendarComponent'
import Info from './InfoComponent'
import SportsFilters from './SportsFiltersComponent'

export default function TopMenu() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [searchIsActive, setSearchIsActive] = useState(false)
    const {itemSearchText, filters, sportsFilters, favourites, dateFrom, dateTo, cities, levels, teams}  = useSelector(state => state)

    const items = [...cities, ...levels, ...teams]
    const dispatch = useDispatch()
    const history = useHistory()

    function handleText(text) {
        dispatch(setItemSearchText(text))
    }

    function activateSearch() {
        setSearchIsActive(true)
    }

    function handleMenu() {
        setIsMenuOpen(!isMenuOpen)
    }

    function handleSelect(item) {
        if (item === selectedItem && item !== 'search') {
            setSelectedItem(null)
        } else {
            setSelectedItem(item)
        } 
    }

    function handleClose() {
        if (searchIsActive) {
            setSearchIsActive(false)
        }
        setSelectedItem(null)
    }

    function getMatches() {
        const dates = dateFrom + ',' + dateTo
        dispatch(getMatchesData(dates, filters, sportsFilters))
        setIsMenuOpen(!isMenuOpen)
        history.push('/')
    }

    return (
        <div className='top-menu-component'>
            <div className='top-menu-box'>
            <div className='top-menu-left'>
                <div className={selectedItem === 'info' ? 'menu-items-btn-active':'menu-items-btn'} onClick={() => handleSelect('info')}>missä pelaa?</div>
            </div>
            <div
                className='top-menu-center'
                onClick={() => activateSearch()}
            >
                <Searchfield
                    searchText={itemSearchText}
                    handleText={handleText}
                    handleSelect={handleSelect}
                    icon={'search'}
                    isActive={searchIsActive}
                    definition={'Etsi sarjaa, joukkuetta tai kaupunkia'}
                />
            </div>
            <div className='top-menu-right'>
                <span className={isMenuOpen ? 'menu-items-btn-active':'menu-items-btn'} onClick={() => handleMenu()}>
                    <IconDiv icon={'sliders-h'} definition={'HAKUVALINNAT'} />
                </span>
            </div>
            {isMenuOpen ?
            <div className='menu-items'>
                <MenuItem icon={'redo'} definition={'PÄIVITÄ HAKU'} onClick={() => getMatches()} />
                <MenuItem icon={'calendar'} definition={displayDates(dateFrom,dateTo)}>
                    <Calendar />
                </MenuItem>
                <MenuItem icon={'filter'} definition={'LAJISUODATTIMET ' + sportsFilters.length}>
                    <div className='menu-items-sports-filters'>
                        <SportsFilters />
                    </div>
                </MenuItem>
                <MenuItem icon={'filter'} definition={'SUODATTIMET ' + filters.length}>
                    {filters.length !== 0 ?
                    <List items={filters} handleClose={handleMenu} />
                    :
                    <div className='no-items'>Lisää suodattimia hakutoiminnolla.</div>
                    }
                </MenuItem>
                <MenuItem icon={'star'} definition={'SUOSIKIT ' + favourites.length}>
                    {favourites.length !== 0 ?
                    <List items={favourites} handleClose={handleMenu} />
                    :
                    <div className='no-items'>Lisää suosikkeja hakutoiminnolla.</div>
                    }
                </MenuItem>
            </div>
            : null
            }
            {selectedItem === 'search' ?
            <div className='item-container'>
                <div className='item-box'>
                    <div className='item-close' onClick={() => handleClose()}>X</div>
                    {itemSearchText !== '' ?
                    <List
                        items={items.filter(item => itemSearchText.split(' ').every(i => (item.name+' '+item.sport).toLowerCase().includes(i.toLowerCase())))}
                        handleClose={handleClose}
                    />
                    : <div className='search-instructions'>Etsi sarjaa, joukkuetta tai kaupunkia</div>
                    }
                </div>
                
                
            </div>
            :
            <span></span>
            }

            {selectedItem === 'info' ?
            <div className='item-container'>
                <div className='item-box'>
                    <div className='item-close' onClick={() => handleClose()}>X</div>
                    <Info />
                </div>
            </div>
            :
            <span></span>
            }

            {selectedItem === 'filters' ?
            <div className='item-container'>
                <div className='item-box'>
                    <div className='item-close' onClick={() => handleClose()}>X</div>
                    <List items={filters} />
                </div>
            </div>
            :
            <span></span>
            }

            {selectedItem === 'favourites' ?
            <div className='item-container'>
                <div className='item-box'>
                    <div className='item-close' onClick={() => handleClose()}>X</div>
                    <List items={favourites} />
                </div>
            </div>
            :
            <span></span>
            }
            </div>
        </div>
    )
}