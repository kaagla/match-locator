import React, { useState } from 'react'
import './MapLayersComponent.css'

export default function MapLayers(props) {

    const [showLayers, setShowLayers] = useState(false)
    
    function toggleLayers() {
        setShowLayers(!showLayers)
    }

    return(
        <div className='map-layers-component'>
            <div className='layers-indicator' onClick={() => toggleLayers()}>
                {showLayers ?
                <div key='open'>
                    <i className='fas fa-times'></i>
                </div>
                :
                <div key='close'>
                    <i className='fas fa-layer-group'></i>
                </div>
                }
            </div>
            {showLayers &&
            <div className='layers-sports'>
                <span 
                    className={props.selectedSports.includes('Jalkapallo') ? 'sport-item-selected football-layer':'sport-item'}
                    onClick={() => props.handleSelectedSports('Jalkapallo')}
                >
                    <i className="fas fa-futbol"></i> Jalkapallo
                </span>
                <span 
                    className={props.selectedSports.includes('Futsal') ? 'sport-item-selected futsal-layer':'sport-item'}
                    onClick={() => props.handleSelectedSports('Futsal')}
                >
                    <i className="far fa-futbol"></i> Futsal
                </span>
                <span 
                    className={props.selectedSports.includes('Koripallo') ? 'sport-item-selected basketball-layer':'sport-item'}
                    onClick={() => props.handleSelectedSports('Koripallo')}
                >
                    <i className="fas fa-basketball-ball"></i> Koripallo
                </span>
                <span 
                    className={props.selectedSports.includes('Lentopallo') ? 'sport-item-selected volleyball-layer':'sport-item'}
                    onClick={() => props.handleSelectedSports('Lentopallo')}
                >
                    <i className="fas fa-volleyball-ball"></i> Lentopallo
                </span>
                <span 
                    className={props.selectedSports.includes('Käsipallo') ? 'sport-item-selected handball-layer':'sport-item'}
                    onClick={() => props.handleSelectedSports('Käsipallo')}
                >
                    <i className="fas fa-baseball-ball"></i> Käsipallo
                </span>
            </div>
            }
        </div>
    )
}