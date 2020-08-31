import React, { useState, useEffect } from 'react';
import IconDiv from './components/IconComponent';
import Calendar from './components/CalendarComponent';
import CountBadge from './components/CountBadgeComponent';
import SearchInput from './components/SearchInputComponent';
import List from './components/ListComponent'
import Results from './components/ResultsComponent'
import './SearchContainer.css';

export default function Search(props) {
    /*
    let initialFilters = []

    if (JSON.parse(window.localStorage.getItem('filters'))) {
        initialFilters = JSON.parse(window.localStorage.getItem('filters'))
    }

    let initialFavourites = []

    if (JSON.parse(window.localStorage.getItem('favourites'))) {
        initialFavourites = JSON.parse(window.localStorage.getItem('favourites'))
    }
    */
    const today = new Date().toJSON().split('T')[0]
    const [dateFrom, setDateFrom] = useState(today);
    const [dateTo, setDateTo] = useState(today);
    const [selectedMenuItem, setSelectedMenuItem] = useState('calendar')
    const [searchText, setSearchText] = useState('')
    const [filters, setFilters] = useState(getInitialFilters);
    const [favourites, setFavourites] = useState(getInitialFavourites);
    const [changesMade, setChangesMade] = useState(false);

    const searchItems = [...props.cities, ...props.levels, ...props.teams]

    function getInitialFavourites() {

        if (JSON.parse(window.localStorage.getItem('favourites'))) {
            return JSON.parse(window.localStorage.getItem('favourites'))
        }
        return []
    }

    function getInitialFilters() {

        if (JSON.parse(window.localStorage.getItem('filters'))) {
            return JSON.parse(window.localStorage.getItem('filters'))
        }
        return []
    }

    function handleSelection(group, item) {
        if (group === 'favourites') {
            if (favourites.filter(fav => fav.name === item.name).length === 0) {
                let newFavourites = [...favourites]
                newFavourites.push(item)
                setFavourites(newFavourites)
                window.localStorage.setItem('favourites', JSON.stringify(newFavourites))
            } else {
                let newFavourites = [...favourites].filter(fav => fav.name !== item.name)
                setFavourites(newFavourites)
                window.localStorage.setItem('favourites', JSON.stringify(newFavourites))
            }
        }
        if (group === 'filters') {
            if (filters.filter(fil => fil.name === item.name).length === 0) {
                let newFilters = [...filters]
                newFilters.push(item)
                setFilters(newFilters)
                window.localStorage.setItem('filters', JSON.stringify(newFilters))
            } else {
                let newFilters = [...filters].filter(filter => filter.name !== item.name)
                setFilters(newFilters)
                window.localStorage.setItem('filters', JSON.stringify(newFilters))
            }
        }
    }

    function applySearch() {
        props.getMatches(`${dateFrom},${dateTo}`, filters)
        setChangesMade(false)
    }

    function applyQuickSearch(item) {
        props.getMatches('', [item])
        setChangesMade(true)
        props.handleNaviChange('list-ul')
    }

    function applyGetStandings(item) {
        props.getStandings(item)
        props.handleNaviChange('standings')
    }

    useEffect(() => {
        setChangesMade(true)
    }, [dateTo, dateFrom, filters]);

    /*
    useEffect(() => {
        applySearch()
    }, []);
    */

    return (
        <div className={props.naviSelected === 'search' ? 'container': 'container not-visible'}>
            <div className='container-box'>
                <div
                    className='close-btn'
                    onClick={() => props.handleNaviChange('map')}
                >X</div>
                <div className='search-container'>
                    {props.errorText !== '' ?
                    <div className='error-info'>{props.errorText}</div>
                    : <span></span>
                    }
                    <div className='search-container--results'>
                        <Results
                            changesMade={changesMade}
                            numMatches={props.matches.length}
                            applySearch={applySearch}
                            isLoading={props.isLoading}
                            loadingText={props.loadingText}
                        />
                    </div>
                    <div className='search-container--menu'>
                        <div
                            className={selectedMenuItem === 'calendar' ? 'search-container--menu-item-selected':'search-container--menu-item'}
                            onClick={() => setSelectedMenuItem('calendar')}
                        >
                            <IconDiv
                                icon={'calendar'}
                                definition={'AJANJAKSO'}
                            />
                        </div>
                        <div
                            className={selectedMenuItem === 'search' ? 'search-container--menu-item-selected':'search-container--menu-item'}
                            onClick={() => setSelectedMenuItem('search')}
                        >
                            <IconDiv
                                icon={'search'}
                                definition={'ETSI'}
                            />
                        </div>
                        <div
                            className={selectedMenuItem === 'filter' ? 'search-container--menu-item-selected':'search-container--menu-item'}
                            onClick={() => setSelectedMenuItem('filter')}
                        >
                            <IconDiv
                                icon={'filter'}
                                definition={'SUODATTIMET'}
                            />
                            <div className='search-container--menu-item-count'>
                                <CountBadge count={filters.length} />
                            </div>
                        </div>
                        <div
                            className={selectedMenuItem === 'star' ? 'search-container--menu-item-selected':'search-container--menu-item'}
                            onClick={() => setSelectedMenuItem('star')}
                        >
                            <IconDiv
                                icon={'star'}
                                definition={'SUOSIKIT'}
                            />
                            <div className='search-container--menu-item-count'>
                                <CountBadge count={favourites.length} />
                            </div>
                        </div>
                    </div>
                    <div className='search-container--item-group'>
                        <div className={selectedMenuItem === 'calendar' ? '':'not-visible'}>
                            <Calendar
                                dateFrom={dateFrom}
                                setDateFrom={setDateFrom}
                                dateTo={dateTo}
                                setDateTo={setDateTo}
                            />
                        </div>
                        <div className={selectedMenuItem === 'search' ? '':'not-visible'}>
                            <SearchInput
                                searchText={searchText}
                                setSearchText={setSearchText}
                                placeholder={'etsi sarjaa, joukkuetta, kaupunkia...'}
                            />
                            <List
                                items={searchText === '' ? [] : searchItems.filter(item => searchText.split(' ').every(i => item.name.toLowerCase().includes(i.toLowerCase()))).slice(0,20)}
                                filters={filters}
                                favourites={favourites}
                                handleSelection={handleSelection}
                                applyQuickSearch={applyQuickSearch}
                                applyGetStandings={applyGetStandings}
                            />
                        </div>
                        <div className={selectedMenuItem === 'filter' ? '':'not-visible'}>
                            {filters.length > 0 ?
                            <List
                                items={filters}
                                filters={filters}
                                favourites={favourites}
                                handleSelection={handleSelection}
                                applyQuickSearch={applyQuickSearch}
                                applyGetStandings={applyGetStandings}
                            />
                            : <div></div>
                            }
                            
                        </div>
                        <div className={selectedMenuItem === 'star' ? '':'not-visible'}>
                            {favourites.length > 0 ?
                            <List
                                items={favourites}
                                filters={filters}
                                favourites={favourites}
                                handleSelection={handleSelection}
                                applyQuickSearch={applyQuickSearch}
                                applyGetStandings={applyGetStandings} 
                            />
                            : <div></div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 