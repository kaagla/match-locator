import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Map from '../map/MapComponent'
import Info from '../info/Info'
import FilterMenu from '../filters/FilterMenu'
import MatchList from '../matches/MatchlistComponent'
import Search from '../search/Search'
import Standings from '../standings/Standings'
import Notification from '../notification/NotificationComponent'

const Container = styled.div`
    width: 100%;
    height: 400%;
    position: fixed;
    top: ${props => props.position};
    left: 0;
    display: flex;
    flex-direction: column;
    transition: all 0.5s ease-out;

    @media (orientation: portrait) {
        width: 400%;
        height: 92vh;
        flex-direction: row;
        top: 0;
        left: ${props => props.position};
    }
`

const ContentItem = styled.div`
    width: 100%;
    height: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: ${props => props.opacity};
    transition: all 1s linear;

    @media (orientation: portrait) {
        width: 25%;
        height: 100%;
    }
`

const ItemBox = styled.div`
    background-color: rgba(0,0,0,0.3);
    position: relative;
    height: 100%;
    width: 100%;
    padding-bottom: 10rem;
    overflow-y: scroll;

    @media (orientation: landscape) and (max-width: 800px) {
        padding-left: 3rem;
    }
`

export default function Content() {

    const { selectedContent, searchIsActive, standingsItem,
        matchesLimitNotification } = useSelector(state => state)

    function setContentFocus() {
        switch (selectedContent) {
            case 'info':
                return '0'
            case 'filters':
                return '-100%'
            case 'map':
                return '-200%'
            case 'matches':
                return '-300%'
            default:
                return '-200%'
        }
    }

    return (
        <Container position={setContentFocus()}>
            {matchesLimitNotification && <Notification />}
            <ContentItem opacity={selectedContent === 'info' ? 1:0.3} >
                <ItemBox>
                    <Info />
                </ItemBox>
            </ContentItem>
            <ContentItem opacity={selectedContent === 'filters' ? 1:0.3} >
                <ItemBox>
                    {searchIsActive && <Search />}
                    {standingsItem && <Standings />}
                    <FilterMenu />
                </ItemBox>
            </ContentItem>
            <ContentItem opacity={selectedContent === 'map' ? 1:0.3} >
                <Map />
            </ContentItem>
            <ContentItem opacity={selectedContent === 'matches' ? 1:0.3} >
                <ItemBox>
                    <MatchList />
                </ItemBox>
            </ContentItem>
        </Container>
    )
}
