import React from 'react'
import './ContentComponent.css'

export default function Content(props) {
    return (
        <div className='content-component'>
            <div className='content'>
                {props.children}
            </div>
        </div>
    )
}