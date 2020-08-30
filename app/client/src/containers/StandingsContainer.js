import React, { useState, useEffect } from 'react';
import './StandingsContainer.css'

export default function Standings(props) {

    const standings = [...props.standings]
    let initialSelectedGroup
    try {
        initialSelectedGroup = standings[0].name
    } catch {
        initialSelectedGroup = 'Ongelma haettaessa sarjatilannetta'
    }

    const [selectedGroup, setSelectedGroup] = useState(initialSelectedGroup)
    const [selectedSort, setSelectedSort] = useState('points')
    const [sortDescending, setSortDescending] = useState(true)

    const groups = standings.map(group => {return group.name})

    const headings = {
        'played': 'O',
        'wins': 'V',
        'draws': 'T',
        'losses': 'H',
        'scored': 'TM',
        'conceded': 'PM',
        'difference': '+/-',
        'points': 'P'
    }

    function sortedStandingsByGroup() {
        let standingsByGroup = standings.filter(g => g.name === selectedGroup)

        let data = {
            'name': selectedGroup,
            'standings': []
        }

        standingsByGroup[0].standings.sort((a,b) => {
            return sortDescending ? b[selectedSort] - a[selectedSort] : a[selectedSort] - b[selectedSort]
        }).map(item => {
            data['standings'].push(item)
        })

        return [data]
    }

    function applySort(header) {
        console.log(header)
        if (selectedSort === header) {
            sortDescending ? setSortDescending(false) : setSortDescending(true)
            
        } else {
            setSelectedSort(header)
            setSortDescending(true)
        }
    }

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
                
                    {sortedStandingsByGroup().map(group =>
                        <div key={group.name} className='group-component'>
                            <table className='standings-group-table'>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    {Object.keys(headings).map(heading =>
                                        heading === selectedSort ?
                                            <th onClick={() => applySort(heading)}>
                                            <span>{headings[heading]} </span>
                                            {sortDescending ?
                                                <span>&darr;</span>
                                                :
                                                <span>&uarr;</span>
                                            }
                                            </th>
                                            :
                                            <th onClick={() => applySort(heading)}>
                                                <span>{headings[heading]}</span>
                                            </th>
                                        
                                    )}
                                </tr>
                                {group.standings.map(team =>
                                    <tr 
                                        key={team.name}
                                        name={team.name}
                                        id={team.name === 'NuPS' ? 'standings-container--team-row':''}
                                    >
                                        <td>{group.standings.indexOf(team)+1}.</td>
                                        <td id={team.name} >{team.team}</td>
                                        <td>{team.played}</td>
                                        <td>{team.wins}</td>
                                        <td>{team.draws}</td>
                                        <td>{team.losses}</td>
                                        <td>{team.scored}</td>
                                        <td>{team.conceded}</td>
                                        <td>{team.difference}</td>
                                        <td>{team.points}</td>
                                    </tr>
                                )}
                            </table>
                            
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}