import React, { useState } from 'react';
import IconDiv from './IconComponent';
import './ListItemComponent.css'

export default function ListItem(props) {

    const [selectionOpen, setSelectionOpen] = useState(false)

    return (
        <div className='list-item-component'>
            <div
                className='list-item-component--header'
                onClick={() => setSelectionOpen(!selectionOpen)}
            >
                <span>{props.item.name}</span>
                <span><i className={selectionOpen ? 'arrow-up':'arrow-down'}></i></span>
            </div>
            {selectionOpen ?
            <div className='list-item-component--options'>
                <div>
                    <div>VALINNAT</div>
                    <div className='list-item-component--options-group'>
                        <span 
                            className={props.favourites.filter(fav => fav.name === props.item.name).length > 0 ? 'list-item-component--options-selected':''}
                            onClick={() => props.handleSelection('favourites', props.item)}
                        >
                            <IconDiv
                                icon={'star'}
                                definition={'SUOSIKKI'}
                            />   
                        </span>      
                        <span
                            className={props.filters.filter(fil => fil.name === props.item.name).length > 0 ? 'list-item-component--options-selected':''}
                            onClick={() => props.handleSelection('filters', props.item)}
                        >
                            <IconDiv
                                icon={'filter'}
                                definition={'SUODATIN'}
                            />
                        </span>
                    </div>
                </div>
                <div>
                    <div>NÄYTÄ</div>
                    <div className='list-item-component--options-group'>
                        <span
                            onClick={() => props.applyQuickSearch(props.item)}
                        >
                            <IconDiv
                                icon={'list-ul'}
                                definition={'OTTELUT'}
                            />
                        </span>
                        {['level','team'].includes(props.item.type) ?
                        <span
                            onClick={() => props.applyGetStandings(props.item)}
                        >
                            <IconDiv
                                icon={'trophy'}
                                definition={'SARJATILANNE'}
                            />
                        </span>
                        :
                        <span></span>
                        }
                    </div>
                </div>
            </div>
            : <div></div>
            }
        </div>
    )
}