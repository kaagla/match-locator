import React from 'react';
import './InfoContainer.css'

export default function Info(props) {

    function displayDate(date) {
        let year = date.split('-')[0]
        let month = parseInt(date.split('-')[1])
        let day = parseInt(date.split('-')[2])
        return day + '.' + month + '.' + year
    }

    return (
        <div className='container'>
            <div className='container-box'>
                <div
                    className='close-btn'
                    onClick={() => props.handleNaviChange('map')}
                >X</div>
                <div className='info-container'>
                    <div><h3>missä pelaa?</h3></div>
                    <div>
                        "Jalkapallo-ottelut helposti kartalle."
                    </div>
                    <div>
                        Ottelu-, lokaatio- ja sarjatilannetiedot on kerätty Suomen Palloliiton 
                        sivuilta <a href='https://www.palloliitto.fi' target='_blank'>(www.palloliitto.fi)</a>.                   
                    </div>
                    <div className='info-container--details'>
                        {props.DBinfo.updated ?
                        <span>Ottelutietokanta päivitetty: {displayDate(props.DBinfo.updated)}</span>
                        :
                        <span></span>
                        }
                        <span>{'Sovelluksen lähdekoodi: '}
                            <a href='https://www.github.com/kaagla/match-locator' target='_blank'>
                                <i className="fab fa-github"></i>
                            </a></span>
                    </div>

                </div>
            </div>
        </div>
    )
}