import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setMapCenter } from '../../actions/mapSettings'
import './AreaList.css'

export default function AreaList(props) {

    const defaultArea = [{'type': 'area', 'name': 'Suomi'}]
    const searchText = useSelector(state => state.citySearchText)
    const availableAreas = defaultArea.concat(useSelector(state => state.areas))
    const areas = availableAreas.filter(area => area.name.toLowerCase().includes(searchText.toLowerCase()))

    const dispatch = useDispatch()

    function handleMapCenterChange(item) {
        dispatch(setMapCenter(item))
    }

    return (
        <div className='area-list-component'>
            {areas.map(area =>
            <div
                key={area.name}
                className='area-list-item'
                onClick={() => handleMapCenterChange(area)}
            >
                {area.name}
            </div>
            )}
        </div>
    )
}