import React from 'react';
import './CountBadgeComponent.css'

export default function CountBadge(props) {
    return (
        <div className='count-badge-component'>
            <div className='count-badge-component--item'>
                {props.count}
            </div>
        </div>
    )
}