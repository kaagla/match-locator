import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { displayDM } from '../../services/dateService'
import NextMatches from './NextMatches'

const Wrapper = styled.div`
    width: 90%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    color: white;
    padding: 2rem;
    margin-left: auto;
    margin-right: auto;

    @media (orientation: landscape) and (min-height: 600px) {
        height: 100%;
        ::before, ::after {
            content: '';
            margin: auto;
        }
    }
`

const Title = styled.div`
    padding-bottom: 2rem;
    font-size: 3rem;
`

const Table = styled.table`
    align-self: center;
    width: 100%;
    max-width: 500px;
    padding: 5rem;
    margin: 2rem 0 2rem 0;
    border-collapse: collapse;
`

const Tr = styled.tr`
`

const Th = styled.th`
    text-align: left;
    padding: 0.5rem 0 0.5rem 0;
`

const TdSport = styled.td`
    width: 20%;
    padding: 0.2rem;
`

const TdCollected = styled.td`
    width: 30%;
    cursor: pointer;
    padding: 0.2rem;

    :hover {
        background-color: white;
        color:black;
    }
`

const TdData = styled.td`
    width: 20%;
    text-align: right;
    padding: 0.2rem;
`

export default function Info() {

    const { info } = useSelector(state => state)

    const AppInfo = () => {
        return (
            <Table>
                <Tr>
                    <Th>Laji</Th>
                    <Th>Ottelutiedot</Th>
                    {info && <Th style={{textAlign: 'right'}}>Päivitetty</Th>}
                </Tr>
                <Tr>
                    <TdSport>Jalkapallo</TdSport>
                    <TdCollected
                        onClick={() => window.open('https://palloliitto.fi')}
                    >palloliitto.fi</TdCollected>
                    {info && <TdData>{displayDM(info.football)}</TdData>}
                </Tr>
                <Tr>
                    <TdSport>Futsal</TdSport>
                    <TdCollected
                        onClick={() => window.open('https://palloliitto.fi')}
                    >palloliitto.fi</TdCollected>
                    {info && <TdData>{displayDM(info.futsal)}</TdData>}
                </Tr>
                <Tr>
                    <TdSport>Koripallo</TdSport>
                    <TdCollected
                        onClick={() => window.open('https://basket.fi')}
                    >basket.fi</TdCollected>
                    {info && <TdData>{displayDM(info.basketball)}</TdData>}
                </Tr>
                <Tr>
                    <TdSport>Lentopallo</TdSport>
                    <TdCollected
                        onClick={() => window.open('https://lentopalloliitto.fi')}
                    >lentopalloliitto.fi</TdCollected>
                    {info && <TdData>{displayDM(info.volleyball)}</TdData>}
                </Tr>
                <Tr>
                    <TdSport>Käsipallo</TdSport>
                    <TdCollected
                        onClick={() => window.open('https://finnhandball.net')}
                    >finnhandball.net</TdCollected>
                    {info && <TdData>{displayDM(info.handball)}</TdData>}
                </Tr>
            </Table>
        )
    }

    return (
        <Wrapper>
            <Title>missä pelaa?</Title>
            <NextMatches />
            <AppInfo />
        </Wrapper>
    )
}