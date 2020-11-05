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
import Calendar from './CalendarComponent'
import Info from './InfoComponent'
import FilterGroup from './FilterGroup'
import SearchList from './SearchList'

export default function TopMenu() {

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [searchIsActive, setSearchIsActive] = useState(false)
    const [numItems, setNumItems] = useState(20)
    const {itemSearchText, dateFrom, dateTo,
        areas, levels, teams, selectedFilters, visibleFilters}  = useSelector(state => state)

    const items = [...areas, ...levels, ...teams]
    const dispatch = useDispatch()
    const history = useHistory()

    function showMoreItems() {
        setNumItems(numItems + 20)
    }

    function handleText(text) {
        setNumItems(20)
        dispatch(setItemSearchText(text))
    }

    function activateSearch() {
        setSearchIsActive(true)
    }

    function handleMenu() {
        if (isMenuOpen === true) {
            document.getElementById('menu-items').className = 'menu-items-on-close'
            setTimeout(() => { setIsMenuOpen(!isMenuOpen) }, 400)
        } else {
            setIsMenuOpen(!isMenuOpen)
        } 
    }

    function handleSelect(item) {
        if (item === selectedItem && item !== 'search') {
            document.getElementById('item-box').className = 'item-box-on-close'
            setTimeout(() => {
                if (searchIsActive) {
                    setSearchIsActive(false)
                }
                setSelectedItem(null)
            }, 400)
        } else {
            setSelectedItem(item)
        } 
    }

    function handleClose() {
        document.getElementById('item-box').className = 'item-box-on-close'
            setTimeout(() => {
                if (searchIsActive) {
                    setSearchIsActive(false)
                }
                setSelectedItem(null)
            }, 400)
    }

    function getMatches() {
        const dates = dateFrom + ',' + dateTo
        dispatch(getMatchesData(dates, selectedFilters))
        setIsMenuOpen(!isMenuOpen)
        history.push('/')
    }

    function displayCount(typeList) {
        const selected = selectedFilters.filter(f => typeList.includes(f.type)).length
        const visible = visibleFilters.filter(f => typeList.includes(f.type)).length
        return selected + ' / ' + visible
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
                    definition={'Etsi sarjaa, joukkuetta tai aluetta'}
                />
            </div>
            <div className='top-menu-right'>
                <span className={isMenuOpen ? 'menu-items-btn-active':'menu-items-btn'} onClick={() => handleMenu()}>
                    <IconDiv icon={'sliders-h'} definition={'HAKUVALINNAT'} />
                </span>
            </div>
            {isMenuOpen &&
            <div id='menu-items' className='menu-items'>
                <div className='menu-items-content'>
                    <MenuItem icon={'redo'} definition={'PÄIVITÄ HAKU'} onClick={() => getMatches()} />
                    <MenuItem icon={'calendar'} definition={displayDates(dateFrom,dateTo)}>
                        <Calendar />
                    </MenuItem>
                    <MenuItem icon={'map-marked-alt'} definition='ALUEET' count={displayCount(['grandarea','municipality','postoffice'])}>
                        <div className='menu-items-filter-group'>
                            <FilterGroup
                                useDefaultFilters={true}
                                defaultFilterTypes={['grandarea']}
                                useNewFilters={true}
                                newFilterTypes={['municipality','postoffice']}
                                notification={'alueita'}
                                handleClose={handleMenu}
                            />
                        </div>
                    </MenuItem>
                    <MenuItem icon={'running'} definition='LAJIT' count={displayCount(['sport'])}>
                        <div className='menu-items-filter-group'>
                            <FilterGroup
                                useDefaultFilters={true}
                                defaultFilterTypes={['sport']}
                                useNewFilters={false}
                                handleClose={handleMenu}
                            />
                        </div>
                    </MenuItem>
                    <MenuItem icon={'trophy'} definition='SARJAT' count={displayCount(['level'])}>
                        <div className='menu-items-filter-group'>
                            <FilterGroup
                                useDefaultFilters={false}
                                useNewFilters={true}
                                newFilterTypes={['level']}
                                notification={'sarjoja'}
                                handleClose={handleMenu}
                            />
                        </div>
                    </MenuItem>
                    <MenuItem icon={'users'} definition='JOUKKUEET' count={displayCount(['team'])}>
                        <div className='menu-items-filter-group'>
                            <FilterGroup
                                useDefaultFilters={false}
                                useNewFilters={true}
                                newFilterTypes={['team']}
                                notification={'joukkueita'}
                                handleClose={handleMenu}
                            />
                        </div>
                    </MenuItem>
                </div>
            </div>
            }
            {selectedItem === 'search' &&
            <div className='item-container'>
                <div id='item-box' className='item-box'>
                    <div className='item-close' onClick={() => handleClose()}>
                        <i class="fas fa-times-circle"></i>
                    </div>
                    {itemSearchText !== '' ?
                    <SearchList
                        items={items.filter(item => itemSearchText.split(' ').every(i => (item.name+' '+item.sport).toLowerCase().includes(i.toLowerCase())))}
                        handleClose={handleClose}
                        numItems={numItems}
                        showMoreItems={showMoreItems}
                    />
                    : <div className='search-instructions'>Etsi sarjaa, joukkuetta tai aluetta</div>
                    }
                </div>
            </div>
            }
            {selectedItem === 'info' &&
            <div className='item-container'>
                <div id='item-box' className='item-box'>
                    <div className='item-close' onClick={() => handleClose()}>
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <Info />
                </div>
            </div>
            }
            </div>
        </div>
    )
}