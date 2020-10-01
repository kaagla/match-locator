import React, { useState } from 'react';
import ListItem from './ListItemComponent'
import './ListComponent.css'

export default function List(props) {

    const [numItems, setNumItems] = useState(20)

    function showAllItems() {
        setNumItems(Infinity)
    }

    return (
        <div className='list-component'>
            <ul>
                {props.items.slice(0,numItems).map(item =>
                    <li key={item.name}>
                        <ListItem
                            item={item}
                            handleClose={props.handleClose}
                        />
                    </li>
                )}
                {props.items.length >  numItems ?
                <li
                    className='show-all'
                    onClick={() => showAllItems()}
                >
                    <span>NÄYTÄ KAIKKI</span>
                    <span><i className='arrow-down'></i></span>
                </li>
                : null
                }
            </ul>
        </div>
    )
}