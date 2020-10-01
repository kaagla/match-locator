import React from 'react';
import './IconComponent.css';

export default function IconDiv(props) {
    return (
        <div className='icon-component'>
            <div>
                <i className={"fas fa-"+props.icon}></i>
            </div>
            <div className='icon-component--definition'>
                {props.definition}
            </div>
        </div>
    )
}