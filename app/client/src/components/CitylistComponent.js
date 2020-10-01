import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setMapCenter } from '../actions/mapSettings'
import './CitylistComponent.css'

export default function Citylist(props) {

    const defaultCity = [{'type': 'city', 'name': 'Suomi'}]
    const searchText = useSelector(state => state.citySearchText)
    const availableCities = defaultCity.concat(useSelector(state => state.cities))
    const cities = availableCities.filter(city => city.name.toLowerCase().includes(searchText.toLowerCase()))

    const dispatch = useDispatch()

    function handleMapCenterChange(item) {
        dispatch(setMapCenter(item))
    }

    return (
        <div className='city-list-component'>
            <ul>
                {cities.map(city =>
                    <li
                        key={city.name}
                        onClick={() => handleMapCenterChange(city)}
                    >
                        <Link to='/'>
                            {city.name}
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    )
}