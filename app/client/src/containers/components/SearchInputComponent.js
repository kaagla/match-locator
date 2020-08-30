import React from 'react';
import './SearchInputComponent.css'

export default function SearchInput(props) {

    return (
        <div className='search-input-component'>
            <form>
                <label>
                    <input
                        className="input-search"
                        type="search"
                        value={props.searchText}
                        placeholder={props.placeholder}
                        onChange={(e) => props.setSearchText(e.target.value)}
                    />
                </label>
            </form>
        </div>
    )
}