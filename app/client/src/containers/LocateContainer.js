import React, { useState } from 'react';
import './LocateContainer.css'
import './components/ListComponent'
import SearchInput from './components/SearchInputComponent'

export default function Locate(props) {

    const [searchText, setSearchText] = useState('')

    let cities = [...props.cities]
    cities.unshift({'type': 'city', 'name': 'Suomi'})

    function handleSelect(city) {
        props.handleMapCenterChange(city)
        props.handleNaviChange('map')
    }

    return (
        <div className='container'>
            <div className='container-box'>
                <div
                    className='close-btn'
                    onClick={() => props.handleNaviChange('map')}
                >X</div>
                <div className='locate-components'>
                    <div className='locate-components--search'>
                        <SearchInput
                            searchText={searchText}
                            setSearchText={setSearchText}
                            placeholder={'etsi kaupunki...'}
                        />
                    </div>
                    <div className='city-list'>
                        <ul>
                            {cities.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase())).map(city =>
                                <li
                                    key={city.name}
                                >
                                    <span onClick={() => handleSelect(city)}>
                                        {city.name}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}