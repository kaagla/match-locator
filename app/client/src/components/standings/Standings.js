import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setStandingsItem } from '../../actions/standingsItem'
import axios from 'axios'
import styled from 'styled-components'
import StandingsTable from './StandingsTable'
import CloseBtn from '../other/CloseButton'

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-color: rgb(0,0,0);
    z-index: 99;
    opacity: ${props => props.opacity};
    overflow-y: auto;
    transition: all 0.5s ease-out;

    @media (orientation: portrait) {
        height: 90vh;
    }
`

const Header = styled.div`
    padding: 1rem;
`

const Loading = styled.div`
`

const Error = styled.div`
`

const Content = styled.div`
    justify-self: flex-start;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (orientation: portrait) {
        margin-bottom: 7rem;
    }
`

const GroupSelector = styled.div`
    padding: 0.5rem;
`

const Select = styled.select`
    border-bottom: 2px solid white;
    background-color: inherit;
    color: inherit;
    padding: 0.2rem;
`

const Option = styled.option`
    color: black;
`

export default function Standings() {

    const item = useSelector(state => state.standingsItem)
    const { selectedContent } = useSelector(state => state)

    const [standings, setStandings] = useState([])
    const [opacity, setOpacity] = useState(0)
    const [selectedGroup, setSelectedGroup] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    const groups = standings.map(group => {return group.name})

    const dispatch = useDispatch()

    function closeContainer() {
        setOpacity(0)
        setTimeout(() => {
            dispatch(setStandingsItem(null))
        }, 400)
    }

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
        setOpacity(1)
        if (typeof(item) !== 'undefined') {
            getStandings()
        }
    }, [])
    
    useEffect(() => {
        if (selectedContent !== 'filters') {
            closeContainer()
        }
    }, [selectedContent])

    return (
        typeof(item) === 'undefined' ?
        null
        :
        <Container opacity={opacity}>
            <CloseBtn closeEvent={closeContainer} />
            <Header className='standings-header'>
                {item.name}
            </Header>
            {isLoading ?
            <Loading>Ladataan sarjatilannetta...</Loading>
            :
            error ?
            <Error>Sarjatilannetta ei saatavilla.</Error>
            :
            <>
            <GroupSelector>
                {groups.length > 1 ?
                <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                >
                    {groups.map(group =>
                        <Option value={group}>{group}</Option>
                    )}
                </Select>
                :
                groups[0] !== 'Sarja' ?
                <span>{groups[0]}</span>
                :
                null
                }
            </GroupSelector>
            <Content>
                <StandingsTable
                    standings={standings}
                    selectedGroup={selectedGroup}
                />
            </Content>
            </>
            }
        </Container>
    )
}