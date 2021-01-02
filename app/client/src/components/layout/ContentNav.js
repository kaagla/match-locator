import React from 'react'
import styled from 'styled-components'
import { InfoCircle, Filter, MapMarkedAlt, ListAlt } from '@styled-icons/fa-solid'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedContent } from '../../actions/selectionData'
import CountBadge from '../other/CountBadgeComponent'

const Wrapper = styled.div`
    position: fixed;
    height: fit-content;
    top: 50%;
    bottom: 50%;
    transform: translateY(-50%);
    left: 2%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    z-index: 100;
    color: white;
    background-color: rgba(0,0,0,0.3);
    padding: 2rem;
    border-radius: 100px;
    transition: all 1s linear;

    @media (orientation: landscape) and (max-width: 800px) {
        left: 0;
        padding: 0.1rem;
    }

    @media (orientation: portrait) {
        width: 100%;
        height: 8vh;
        flex-direction: row;
        align-items: center;
        bottom: 0;
        top: auto;
        transform: translateY(0);
        left: auto;
        padding: 0;
        background-color: rgb(0,0,0);
        border-radius: 0;
    }
`

const NavItem = styled.div`
    height: 2.5rem;
    width: 2.5rem;
    color: white;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 5px solid ${props => props.borderColor};
    cursor: pointer;
    transition: all 0.1s;

    &:hover {
        border-bottom: 5px solid white;
    }

    @media (orientation: landscape) and (max-width: 800px) {
        height: 1.5rem;
        width: 1.5rem;
        border-bottom: 2px solid ${props => props.borderColor};
    }

    @media (orientation: portrait) {
        margin-top: 0;
        margin-bottom: 0;
        margin-left: 1rem;
        margin-right: 1rem;
    }
`

const NavItemDisabled = styled(NavItem)`
    color: #ccc;
    cursor: default;

    &:hover {
        border-color: transparent;
    }
`

export default function ContentNav() {

    const { selectedContent, matches, locations } = useSelector(state => state)
    
    const dispatch = useDispatch()

    function handleContent(content) {
        dispatch(setSelectedContent(content))
    }

    return (
        <Wrapper>
            <NavItem
                borderColor={selectedContent === 'info' ? 'white':'transparent'}
                onClick={() => handleContent('info')}
            >
                <InfoCircle />
            </NavItem>
            <NavItem
                borderColor={selectedContent === 'filters' ? 'white':'transparent'}
                onClick={() => handleContent('filters')}
            >
                <Filter />
            </NavItem>
            {locations.length > 0 ?
            <NavItem
                borderColor={selectedContent === 'map' ? 'white':'transparent'}
                onClick={() => handleContent('map')}
            >
                <MapMarkedAlt />
                <CountBadge count={locations.length} />
            </NavItem>
            :
            <NavItemDisabled borderColor={'transparent'}>
                <MapMarkedAlt style={{ color: '#ccc' }} />
            </NavItemDisabled>
            }
            {matches.length > 0 ?
            <NavItem
                borderColor={selectedContent === 'matches' ? 'white':'transparent'}
                onClick={() => handleContent('matches')}
            >
                <ListAlt />
                <CountBadge count={matches.length} />
            </NavItem>
            :
            <NavItemDisabled borderColor={'transparent'}>
                <ListAlt style={{ color: '#ccc' }} />
            </NavItemDisabled>
            }
        </Wrapper>
    )
}
