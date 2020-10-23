import React from 'react'
import './InfoComponent.css'
import { useSelector } from 'react-redux'
import { displayDMY } from '../services/dateService'

export default function Info() {

    const { info } = useSelector(state => state)

    return (
        <div className='info-component'>
            <div><h3>missä pelaa?</h3></div>
            <div>
                "Ottelut helposti kartalle."
            </div>
            <div>Ottelu-, lokaatio- ja sarjatilannetiedot on kerätty lajiliittojen sivuilta *</div>
            <div className='sports-details'>
                <span className='info-link' onClick={() => window.open('https://www.palloliitto.fi')}>Jalkapallo ja futsal - palloliitto.fi</span>                 
                <span className='info-link' onClick={() => window.open('https://www.basket.fi')}>Koripallo - basket.fi</span>
                <span className='info-link' onClick={() => window.open('https://www.lentopalloliitto.fi')}>Lentopallo - lentopalloliitto.fi</span>
                <span className='info-link' onClick={() => window.open('https://finnhandball.net/')}>Käsipallo - finnhandball.net</span>
                
            </div>
            <div className='info-details'>
                {info &&
                <div>
                <div>Ottelutietokanta päivitetty</div>
                <div className='info-details-sports'>
                    <span>Jalkapallo - {displayDMY(info.football)}</span>
                    <span>Futsal - {displayDMY(info.futsal)}</span>
                    <span>Koripallo - {displayDMY(info.basketball)}</span>
                    <span>Lentopallo - {displayDMY(info.volleyball)}</span>
                    <span>Käsipallo - {displayDMY(info.handball)}</span>
                </div>
                </div>
                }
                <div>
                    <span>{'Sovelluksen lähdekoodi: '}</span>
                    <span className='info-link' onClick={() => window.open('https://www.github.com/kaagla/match-locator')}>
                            <i className="fab fa-github"></i>
                    </span>
                </div>
                <div className='sports-details-info'>
                    * Tiedoissa voi esiintyä virheitä.
                </div>
            </div>
        </div>
    )
}