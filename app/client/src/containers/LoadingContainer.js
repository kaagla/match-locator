import React from 'react';
import './LoadingContainer.css'

export default function Loading(props) {
    return (
        <div className='container'>
            <div className='container-box'>
                <div className='loading-container'>
                    <div className='loader'>{props.loadingText}</div>
                </div>
            </div>
        </div>
    )
}