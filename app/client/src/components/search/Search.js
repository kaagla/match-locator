import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setSearchIsActive } from '../../actions/searchActivity'
import styled from 'styled-components'
import CloseBtn from '../other/CloseButton'
import SearchBar from './SearchBar'
import SearchList from './SearchList'

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
    background-color: white;
    z-index: 99;
    opacity: ${props => props.opacity};
    overflow-y: auto;
    color: black;
    transition: all 0.5s ease-out;

    /*@media (orientation: portrait) {
        height: 90vh;
    }*/
`

const SearchBox = styled.div`
    height: 100%;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (orientation: portrait) {
        margin-bottom: 7rem;
    }
`

const SearchDesription = styled.div`
    padding: 2rem;
    text-align: center;
    color: black;
`

export default function Search() {

    const { areas, levels, teams, itemSearchText, selectedContent } = useSelector(state => state)
    const items = [...areas, ...levels, ...teams]

    const [numItems, setNumItems] = useState(10)
    const [opacity, setOpacity] = useState(0)

    const dispatch = useDispatch()

    function showMoreItems() {
        setNumItems(numItems + 10)
    }

    function closeContainer() {
        setOpacity(0)
        setTimeout(() => {
            dispatch(setSearchIsActive(false))
        }, 400)
    }
    
    useEffect(() => {
        if (selectedContent !== 'filters') {
            closeContainer()
        }
    }, [selectedContent])

    useEffect(() => {
        setOpacity(1)
    }, [])

    return (
        <Container opacity={opacity}>
            <SearchBox>
                <CloseBtn closeEvent={closeContainer} />
                <SearchBar />
                {itemSearchText.length > 0 ?
                <SearchList
                    items={items.filter(item => itemSearchText.split(' ').every(i => (item.name).toLowerCase().includes(i.toLowerCase())))}
                    numItems={numItems}
                    showMoreItems={showMoreItems}
                />
                : <SearchDesription>Etsi sarjaa, joukkuetta tai aluetta.</SearchDesription>
                }
            </SearchBox>
        </Container>
    )
}
