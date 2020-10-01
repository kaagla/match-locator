import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import axios from 'axios'
import './StandingsComponent.css'
import StandingsTable from './StandingsTableComponent'

export default function Standings(props) {

    const item = useSelector(state => state.selectedItem)
    const [standings, setStandings] = useState([])
    const [selectedGroup, setSelectedGroup] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const groups = standings.map(group => {return group.name})

    function getStandings() {
        setIsLoading(true)
        let data = {'standings': item}

        axios.post('/api/standings', data)
            .then(res => {
                if (res.data.length === 0) {
                    setError(true)
                } else {
                    setSelectedGroup(res.data[0].name)
                    setStandings(res.data)
                }
            })
            .catch(err => {
                console.log(err)
                setError(true)
            })
            .finally(() => setIsLoading(false))
    }
    
    useEffect(() => {
        if (typeof(item) !== 'undefined') {
            getStandings()
        }
    }, [])

    return (
        typeof(item) === 'undefined' ?
        null
        :
        <div id='standings-component' className='standings-component'>
            <div className='standings-header'>
                {item.name}
            </div>
            {isLoading ?
            <div>Ladataan sarjatilannetta...</div>
            :
            error ?
            <div>Sarjatilannetta ei saatavilla.</div>
            :
            <div className='standings-content'>
                <div>
                    {groups.length > 1 ?
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                    >
                        {groups.map(group =>
                            <option value={group}>{group}</option>
                        )}
                    </select>
                    :
                    groups[0] !== 'Sarja' ?
                    <span>{groups[0]}</span>
                    :
                    <span></span>
                    }
                </div>
                <StandingsTable
                    standings={standings}
                    selectedGroup={selectedGroup}
                />
            </div>
            }
        </div>
    )
}