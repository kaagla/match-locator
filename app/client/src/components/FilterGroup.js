import React from 'react'
import './FilterGroup.css'
import { useSelector, useDispatch } from 'react-redux'
import { setVisibleFilters, setSelectedFilters } from '../actions/selectionData'
import ToggleSwitch from './ToggleSwitch'
import FilterItem from './FilterItem'

export default function FilterGroup(props) {

    const {visibleFilters, selectedFilters} = useSelector(state => state)

    const dispatch = useDispatch()

    function handleSelection(item) {
        if (selectedFilters.filter(f => f.name === item.name).length === 0) {
            let filters = [...selectedFilters]
            filters.push(item)
            dispatch(setSelectedFilters(filters))
        } else {
            let filters = [...selectedFilters].filter(f => f.name !== item.name)
            dispatch(setSelectedFilters(filters))
        }
    }

    function removeVisibleFilter(item) {
        let vfilters = [...visibleFilters].filter(f => f.name !== item.name)
        dispatch(setVisibleFilters(vfilters))

        if (selectedFilters.filter(f => f.name === item.name).length !== 0) {
            let filters = [...selectedFilters].filter(f => f.name !== item.name)
            dispatch(setSelectedFilters(filters))
        }
    }

    return (
        <div className='filter-group-component'>
            <div className='filter-group-items'>
                {props.useDefaultFilters &&
                visibleFilters.filter(f => props.defaultFilterTypes.includes(f.type)).map(filter =>
                    <div key={filter.name} className='filter-group-item'>
                        <div className='filter-group-item-header'>
                            <div className='filter-group-item-name'>{filter.name}</div>
                            <ToggleSwitch 
                                item={filter} 
                                isSelected={selectedFilters.filter(f => f.name === filter.name).length !== 0 ? true : false}
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                )}
                {props.useNewFilters &&
                visibleFilters.filter(f => props.newFilterTypes.includes(f.type)).map(filter =>
                    <div key={filter.name} className='filter-group-item'>
                        <div className='filter-group-item-header'>
                            <div
                                className='filter-group-item-remove'
                                onClick={() => removeVisibleFilter(filter)}
                            ><i class="far fa-times-circle"></i></div>
                            <FilterItem item={filter} handleClose={props.handleClose} />
                            <ToggleSwitch 
                                item={filter} 
                                isSelected={selectedFilters.filter(f => f.name === filter.name).length !== 0 ? true : false}
                                handleSelection={handleSelection}
                            />
                        </div>
                    </div>
                )}
                {props.useNewFilters && visibleFilters.filter(f => props.newFilterTypes.includes(f.type)).length === 0 &&
                <div className='filter-group-items-notification'>
                    Lisää {props.notification} hakutoiminnolla.
                </div>
                }
            </div>
        </div>
    )
}