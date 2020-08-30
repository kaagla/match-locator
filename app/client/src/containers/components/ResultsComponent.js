import React from 'react';
import './ResultsComponent.css'

export default function Results(props) {

    //const numMatches = props.numMatches
    let info = 'Hakutulos: '

    if (props.numMatches === 0) {
        info += 'ei otteluita.'
    } else if (props.numMatches === 1) {
        info += '1 ottelu.'
    } else {
        info += `${props.numMatches} ottelua.`
    }

    return (
        <div className='results-component'>
            <span>
                {props.isLoading ?
                props.loadingText
                :
                info
                }
            </span>
            <span 
                className={props.changesMade ? 'results-component--update-btn': 'results-component--update-btn-hide'}
                onClick={() => props.applySearch()}
            >PÄIVITÄ HAKUTULOKSET</span>
        </div>
    )
}