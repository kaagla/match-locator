import React from 'react'
import './NaviContainer.css';

export default function Navi(props) {
    const naviItems = {
        'info': 'INFO',
        'search': 'HAKU',
        'eye': 'KOHDISTUS',
        'map': 'KARTTA',
        'list-ul': 'OTTELUT'
    }
    return (
        <div className='navi-container'>
            <div className='navi-box'>
                <ul>
                    {Object.keys(naviItems).map(item =>
                    (props.numMatches === 0 && item === 'list-ul') ?
                    <li
                        key={item}
                    >
                        <span className='navi-item-disabled'>
                        <i className={"fas fa-"+item}></i>
                        <span className='navi-definition'>{naviItems[item]}</span>
                        </span>
                    </li>
                    :
                    <li
                        key={item}
                        onClick={() => props.handleNaviChange(item)}
                    >
                        <span className={props.naviSelected === item ? 'navi-item-selected':'navi-item'}>
                        <i className={"fas fa-"+item}></i>
                        <span className='navi-definition'>{naviItems[item]}</span>
                        </span>
                    </li>
                    )}
                </ul>
            </div>
            
        </div>
    )
}