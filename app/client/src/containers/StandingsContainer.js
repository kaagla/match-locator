import React, { useState, useEffect } from 'react';
import './StandingsContainer.css'
import './components/StandingsTableComponent'
import StandingsTable from './components/StandingsTableComponent';

export default function Standings(props) {

    const standings = [...props.standings]
    let initialSelectedGroup
    try {
        initialSelectedGroup = standings[0].name
    } catch {
        initialSelectedGroup = 'Ongelma haettaessa sarjatilannetta'
    }

    const [selectedGroup, setSelectedGroup] = useState(initialSelectedGroup)

    const groups = standings.map(group => {return group.name})

    return (
        <div className='container'>
            <div className='container-box'>
                <div
                    className='close-btn'
                    onClick={() => props.handleNaviChange('search')}
                >X</div>
                <div className='standings-container'>
                    <h3>Sarjatilanne: {props.selectedStandings.name}</h3>
                    {groups.length > 1 ?
                        <form>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                            >
                                {groups.map(group =>
                                    <option value={group}>{group}</option>
                                )}
                            </select>
                        </form>
                        :
                        groups[0] !== 'Sarja' ?
                        <span>{groups[0]}</span>
                        :
                        <span></span>
                    }
                    <div className='standings-container--table'>
                        <StandingsTable
                            standings={standings}
                            selectedGroup={selectedGroup}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}