import React, { useState } from 'react';
import './StandingsTable.css'

export default function StandingsTable(props) {

    const [selectedSort, setSelectedSort] = useState('points')
    const [sortDescending, setSortDescending] = useState(true)

    const standings = props.standings
    const selectedGroup = props.selectedGroup

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
        if (selectedSort === header) {
            sortDescending ? setSortDescending(false) : setSortDescending(true)
            
        } else {
            setSelectedSort(header)
            setSortDescending(true)
        }
    }
    return (
        <div className='standingstable-component'>
            {sortedStandingsByGroup().map(group =>
            <div key={group.name} className='group-component'>
                <table className='standings-group-table'>
                    <thead>
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
                    </thead>
                    <tbody>
                    {group.standings.map(team =>
                        <tr 
                            key={team.name}
                            name={team.name}
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
                    </tbody>
                </table>
            </div>
            )}
        </div>
    )
}