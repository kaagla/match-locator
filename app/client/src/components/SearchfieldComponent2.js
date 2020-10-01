import React from 'react';
import './SearchfieldComponent2.css'

export default function Searchfield(props) {

    return (
        <div className='searchfield2-component'>
            <div className='searchfield2-items'>
                <i className={`fas fa-${props.icon} icon`}></i>
                {props.isActive ?
                <input
                    type="search"
                    value={props.searchText}
                    placeholder={props.placeholder}
                    onChange={(e) => props.handleText(e.target.value)}
                    onFocus={() => props.handleSelect('search')}
                    autoFocus
                />
                :
                <div className='search-field-iconmode'></div>
                }
            </div>
        </div>
    )
}