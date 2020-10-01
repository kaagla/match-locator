import React, { useState } from 'react'
import './MenuItem.css'

export default function MenuItem(props) {

    const [isOpen, setIsOpen] = useState(false)

    function toggleItem() {
        setIsOpen(!isOpen)
    }

    return (
        <div className='menu-item-component'>
            <div
                className='menu-item'
                onClick={() => props.onClick ? props.onClick() : toggleItem()}
            >
                <div className='menu-item-header'>
                    <div className='menu-item-icon'>
                        <i className={"fas fa-"+props.icon}></i>
                    </div>
                    <div className='menu-item-definition'>
                        {props.definition}
                    </div>
                </div>
                <div className='menu-item-content-indicator'>
                    <i className={props.children ? isOpen ? 'arrow-up':'arrow-down' : ''}></i>
                </div>
            </div>
            {props.children && isOpen ?
            <div className='menu-item-content'>
                {props.children}
            </div>
            : null
            }
        </div>
    )
}