import React from 'react'
import './InfoComponent.css'
import { useSelector } from 'react-redux'
import { displayDMY } from '../services/dateService'

export default function Info() {

    const { info } = useSelector(state => state)
    console.log(info)

    return (
        <div className='info-component'>
            <div><h3>missä pelaa?</h3></div>
            <div>
                "Jalkapallo-ottelut helposti kartalle."
            </div>
            <div>
                <span>Ottelu-, lokaatio- ja sarjatilannetiedot on kerätty Suomen Palloliiton sivuilta</span>
                <span className='info-link' onClick={() => window.open('https://www.palloliitto.fi')}> (www.palloliitto.fi).</span>                 
            </div>
            <div className='info-details'>
                {info.updated ?
                <div>
                <span>Ottelutietokanta päivitetty: {displayDMY(info.updated)}</span>
                </div>
                : null
                }
                <div>
                    <span>{'Sovelluksen lähdekoodi: '}</span>
                    <span className='info-link' onClick={() => window.open('https://www.github.com/kaagla/match-locator')}>
                            <i className="fab fa-github"></i>
                    </span>
                </div>
            </div>
        </div>
    )
}