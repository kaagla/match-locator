import React, { useState } from 'react'
import './MenuItem.css'

export default function MenuItem(props) {

    const [isOpen, setIsOpen] = useState(false)

    function toggleItem() {
        if (isOpen === true) {
            document.getElementById('menu-item-content').className = 'menu-item-content-on-close'
            setTimeout(() => { setIsOpen(!isOpen) }, 400)
        } else {
            setIsOpen(!isOpen)
        }
    }

    return (
        <div id={props.definition} className='menu-item-component'>
            <div
                className={isOpen ? 'menu-item-selected':'menu-item'}
                onClick={() => props.onClick ? props.onClick() : toggleItem()}
            >
                <div className='menu-item-header'>
                    <div className='menu-item-icon'>
                        <i className={"fas fa-"+props.icon}></i>
                    </div>
                    <div className={props.count ? 'menu-item-definition':'menu-item-definition-expanded'}>
                        {props.definition}
                    </div>
                    {props.count &&
                    <div className='menu-item-count'>
                        {props.count}
                    </div>
                    }
                </div>
                <div className='menu-item-content-indicator'>
                    <i className={props.children ? isOpen ? 'arrow-up':'arrow-down' : ''}></i>
                </div>
            </div>
            {props.children && isOpen &&
            <div id='menu-item-content' className='menu-item-content'>
                {props.children}
            </div>
            }
        </div>
    )
}