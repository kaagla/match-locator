import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './MatchPreviewComponent.css';
import IconDiv from './IconComponent'
import StandingsTable from './StandingsTableComponent'

export default function MatchPreview(props) {

    const [showStandings, setShowStandings] = useState(false)
    const [previousMatches, setPreviousMatches] = useState([])
    const [standings, setStandings] = useState([])
    const [matchesError, setMatchesError] = useState('')
    const [standingsError, setStandingsError] = useState(false)

    function getResult(team, match) {
        if (match.score === '-') {
            return 'no-score'
        }
        let homeScore = parseInt(match.score.split(' ')[0].split('-')[0])
        let awayScore = parseInt(match.score.split(' ')[0].split('-')[1])
        
        if (homeScore === awayScore) {
            return 'draw'
        }
        if (homeScore - awayScore > 0) {
            if (team === match.home_name) {
                return 'win'
            } else {
                return 'loss'
            }
        } else {
            if (team === match.away_name) {
                return 'win'
            } else {
                return 'loss'
            }
        }
    }

    function isUpcomingMatch(date) {
        let y = parseInt(date.split('.')[2])
        let m = parseInt(date.split('.')[1]) - 1
        let d = parseInt(date.split('.')[0])

        return new Date(y,m,d) > new Date() ? true : false
    }

    function getPreviewData() {
        let data = {}

        let match = props.match
        let y = parseInt(match.date.split('.')[2])
        let m = parseInt(match.date.split('.')[1]) - 1
        let d = parseInt(match.date.split('.')[0]) - 1

        data['dates'] = '2019-01-01,' + new Date(y,m,d).toJSON().split('T')[0]
    
        data['team'] = []
        data['team'].push({ 'name': props.match.home_name + ' - ' + props.match.level })
        data['team'].push({ 'name': props.match.away_name + ' - ' + props.match.level })

        axios.post('/api/matches', data)
        .then(res => {
            if (res.data.length === 0) {
                setMatchesError('Ei aiempia otteluita')
            } else {
                setPreviousMatches(res.data)
            }
        })
        .catch(error => {
            console.log(error)
            setMatchesError('Edellisiä otteluita ei saatavilla')
        })
    }

    function getStandings() {
        if (!showStandings && !standingsError) {
            setShowStandings(true)
            let item = { 'type': 'team', 'name': props.match.home_name + ' - ' + props.match.level }
            let data2 = {'standings': item}

            axios.post('/api/standings', data2)
            .then(res => {
                if (res.data.length === 0) {
                    setStandingsError('Sarjatilannetta ei saatavilla')
                } else {
                    setStandings(res.data)
                }
            })
            .catch(err => {
                console.log(err)
                setShowStandings(false)
                setStandingsError('Sarjatilannetta ei saatavilla')
            })
        }   
    }

    useEffect(() => {
        getPreviewData()
    }, []);

    return (
        <div className='match-preview-component'>
            {matchesError !== '' ?
            <div>Edellisiä otteluita ei saatavilla</div>
            :
            <div className='match-preview-component-matchdiv'>
            <div className='match-preview-component-icon'>
                <div className={previousMatches.length === 0 ? 'loader':''}>
                    <IconDiv 
                        icon={'history'}
                        definition={'EDELLISET OTTELUT'}
                    />
                </div>
            </div>
            <div>
                <div className='match-preview-component--last-matches'>
                    <div className='match-preview-component--last-matches-home'>
                        <ul>
                            {previousMatches.filter(m => (m.home_name === props.match.home_name || m.away_name === props.match.home_name)).reverse().map(match =>
                                <li
                                    key={match['id']}
                                    className={getResult(props.match.home_name, match)}
                                >
                                    <div className='match-preview-component--last-matches-teams'>
                                        <span className={match.home_name === props.match.home_name ? 'selected':''}>{match.home_name}</span>
                                        <span className={match.away_name === props.match.home_name ? 'selected':''}>{match.away_name}</span>
                                    </div>
                                    {(isUpcomingMatch(match.date) || match.score === '-') ?
                                    <div className='match-preview-component--last-matches-date'>
                                        {match.date}
                                    </div>
                                    :
                                    <div className='match-preview-component--last-matches-score'>
                                        <span>{match.score.split(' ')[0].split('-')[0]}</span>
                                        <span>{match.score.split(' ')[0].split('-')[1]}</span>
                                    </div>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className='match-preview-component--last-matches-away'>
                        <ul>
                            {previousMatches.filter(m => (m.home_name === props.match.away_name || m.away_name === props.match.away_name)).reverse().map(match =>
                                <li
                                    key={match['id']}
                                    className={getResult(props.match.away_name, match)}
                                >
                                    <div className='match-preview-component--last-matches-teams'>
                                        <span className={match.home_name === props.match.away_name ? 'selected':''}>{match.home_name}</span>
                                        <span className={match.away_name === props.match.away_name ? 'selected':''}>{match.away_name}</span>
                                    </div>
                                    {(isUpcomingMatch(match.date) || match.score === '-') ?
                                    <div className='match-preview-component--last-matches-date'>
                                        {match.date}
                                    </div>
                                    :
                                    <div className='match-preview-component--last-matches-score'>
                                        <span>{match.score.split(' ')[0].split('-')[0]}</span>
                                        <span>{match.score.split(' ')[0].split('-')[1]}</span>
                                    </div>
                                    }
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            </div>
            }
            <div
                className='match-preview-component-icon'
                onClick={() => getStandings()}
            >
                <div className={(standings.length === 0 && showStandings) ? 'loader':''}>
                    <IconDiv 
                        icon={'trophy'}
                        definition={(showStandings || standingsError) ? 'SARJATILANNE':'NÄYTÄ SARJATILANNE'}
                    />
                </div>
            </div>
            {standingsError ?
            <div>Sarjatilannetta ei saatavilla</div>
            :
            standings.length > 0 ?
            <StandingsTable
                standings={standings}
                selectedGroup={standings[0].name}
            />
            : <div></div>
            }
        </div>
    )
}