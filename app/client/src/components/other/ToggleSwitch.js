import React from 'react'
import './ToggleSwitch.css'

export default function ToggleSwitch(props) {
    return(
        <div className='toggle-switch-component'>
            <div
                className={props.isSelected ? 'toggle-switch toggle-switch-on':'toggle-switch toggle-switch-off'}
                onClick={() => props.handleSelection(props.item)}
            >
                <div className={props.isSelected ? 'toggle-indicator-on':'toggle-indicator-off'}></div>
            </div>
        </div>
    )
}