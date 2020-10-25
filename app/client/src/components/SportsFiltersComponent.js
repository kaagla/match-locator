import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSportsFilters } from '../actions/selectionData'
import './SportsFiltersComponent.css'

export default function SportsFilters() {

    const { sportsFilters } = useSelector(state => state)

    const dispatch = useDispatch()

    function handleSportsFilters(sport) {
        if (sportsFilters.includes(sport)) {
            dispatch(setSportsFilters([...sportsFilters].filter(f => f !== sport)))
        } else {
            dispatch(setSportsFilters([...sportsFilters, sport]))
        }
    }

    return(
        <div className='sports-filters-component'>
            <div className='sports-filters-items'>
                <div key='Jalkapallo' className='sports-filters-item'>
                    <div className='sports-filters-item-icon'><i className="fas fa-futbol"></i></div>
                    <div className='sports-filters-item-name'>Jalkapallo</div>
                    <div className='sports-filters-item-toggle'>
                        <div
                            className={sportsFilters.includes('Jalkapallo') ? 'toggle-switch toggle-switch-on':'toggle-switch toggle-switch-off'}
                            onClick={() => handleSportsFilters('Jalkapallo')}
                        >
                            <div className={sportsFilters.includes('Jalkapallo') ? 'toggle-indicator-on':'toggle-indicator-off'}></div>
                        </div>
                    </div>
                </div>
                <div key='Futsal' className='sports-filters-item'>
                    <div className='sports-filters-item-icon'><i className="far fa-futbol"></i></div>
                    <div className='sports-filters-item-name'>Futsal</div>
                    <div className='sports-filters-item-toggle'>
                        <div
                            className={sportsFilters.includes('Futsal') ? 'toggle-switch toggle-switch-on':'toggle-switch toggle-switch-off'}
                            onClick={() => handleSportsFilters('Futsal')}
                        >
                            <div className={sportsFilters.includes('Futsal') ? 'toggle-indicator-on':'toggle-indicator-off'}></div>
                        </div>
                    </div>
                </div>
                <div key='Koripallo' className='sports-filters-item'>
                    <div className='sports-filters-item-icon'><i className="fas fa-basketball-ball"></i></div>
                    <div className='sports-filters-item-name'>Koripallo</div>
                    <div className='sports-filters-item-toggle'>
                        <div
                            className={sportsFilters.includes('Koripallo') ? 'toggle-switch toggle-switch-on':'toggle-switch toggle-switch-off'}
                            onClick={() => handleSportsFilters('Koripallo')}
                        >
                            <div className={sportsFilters.includes('Koripallo') ? 'toggle-indicator-on':'toggle-indicator-off'}></div>
                        </div>
                    </div>
                </div>
                <div key='Lentopallo' className='sports-filters-item'>
                    <div className='sports-filters-item-icon'><i className="fas fa-volleyball-ball"></i></div>
                    <div className='sports-filters-item-name'>Lentopallo</div>
                    <div className='sports-filters-item-toggle'>
                        <div
                            className={sportsFilters.includes('Lentopallo') ? 'toggle-switch toggle-switch-on':'toggle-switch toggle-switch-off'}
                            onClick={() => handleSportsFilters('Lentopallo')}
                        >
                            <div className={sportsFilters.includes('Lentopallo') ? 'toggle-indicator-on':'toggle-indicator-off'}></div>
                        </div>
                    </div>
                </div>
                <div key='Käsipallo' className='sports-filters-item'>
                    <div className='sports-filters-item-icon'><i className="fas fa-baseball-ball"></i></div>
                    <div className='sports-filters-item-name'>Käsipallo</div>
                    <div className='sports-filters-item-toggle'>
                        <div
                            className={sportsFilters.includes('Käsipallo') ? 'toggle-switch toggle-switch-on':'toggle-switch toggle-switch-off'}
                            onClick={() => handleSportsFilters('Käsipallo')}
                        >
                            <div className={sportsFilters.includes('Käsipallo') ? 'toggle-indicator-on':'toggle-indicator-off'}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}