import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import './SearchList.css'
import FilterItem from '../filters/FilterItem'
import { setVisibleFilters, setSelectedFilters } from '../../actions/selectionData'

export default function SearchList(props) {

    const { visibleFilters, selectedFilters } = useSelector(state => state)

    const dispatch = useDispatch()

    function handleFilterSelection(item) {
        if (visibleFilters.filter(f => f.name === item.name).length === 0) {
            let vfilters = [...visibleFilters]
            vfilters.push(item)
            let filters = [...selectedFilters]
            filters.push(item)
            dispatch(setVisibleFilters(vfilters))
            dispatch(setSelectedFilters(filters))
        } else {
            let filters = [...selectedFilters].filter(f => f.name !== item.name)
            dispatch(setSelectedFilters(filters))
            let vfilters = [...visibleFilters].filter(f => f.name !== item.name)
            dispatch(setVisibleFilters(vfilters))
        }
    }

    return(
        <div className='search-list-component'>
            {props.items.slice(0,props.numItems).map(item =>
                <div key={item.name} className='search-list-item'>
                    <FilterItem
                        item={item}
                        handleClose={props.handleClose}
                    />
                    <div 
                        className={visibleFilters.filter(f => f.name === item.name).length === 0 ? 'search-list-item-filter-icon':'search-list-item-filter-selected'}
                        onClick={() => handleFilterSelection(item)}
                    >
                        <i className={"fas fa-filter"}></i>
                    </div>
                </div>
            )}
            {props.items.length >  props.numItems &&
            <div
                className='show-more-items'
                onClick={() => props.showMoreItems()}
            >
                <span>NÄYTÄ LISÄÄ</span>
                <span><i className='arrow-down'></i></span>
            </div>
            }
        </div>
    )
}