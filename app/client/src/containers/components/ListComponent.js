import React, { useState } from 'react';
import ListItem from './ListItemComponent'
import './ListComponent.css'

export default function List(props) {
    return (
        <div className='list-component'>
            <ul>
                {props.items.map(item =>
                    <li key={item.name}>
                        <ListItem
                            item={item}
                            favourites={props.favourites}
                            filters={props.filters}
                            handleSelection={props.handleSelection}
                            applyQuickSearch={props.applyQuickSearch}
                            applyGetStandings={props.applyGetStandings}
                        />
                    </li>
                )}
            </ul>
        </div>
    )
}