import React from 'react'
import './NotificationComponent.css'
import { useDispatch } from 'react-redux'
import { setMatchesLimitNotification } from '../actions/matchesData'

export default function Notification() {
    const dispatch = useDispatch()

    function confirmNotification() {
        dispatch(setMatchesLimitNotification(false))
    }

    return(
        <div className='notification-component'>
            <div className='notification-box'>
                <div className='box-close' onClick={() => confirmNotification()}>X</div>
                <div>
                    Suuren määrän vuoksi kaikkia hakuehdot täyttäviä otteluita ei ladattu.
                    Rajaa otteluiden määrää suodattimilla.
                </div>
            </div>
        </div>
    )
}