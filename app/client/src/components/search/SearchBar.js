import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setItemSearchText } from '../../actions/searchText'
import styled from 'styled-components'
import { Search } from '@styled-icons/fa-solid'

const Wrapper = styled.div`
    width: 70%;
    height: 2rem;
    border-bottom: black solid 2px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    cursor:pointer;
    margin-bottom: 2rem;
    color: black;
    padding-bottom: 1rem;
`

const SearchIcon = styled(Search)`
    //color: black;
    height: 2rem;
    width: 2rem;
    margin-right: 3rem;
    margin-left: 1rem;
`

const SearchInput = styled.input`
    flex: 1;
    height: 2rem;
`

const SearchLabel = styled.div`
    position: absolute;
    top: 1rem;
    left: 6rem;
    color: red;
`

const SearchItems = styled.div`
    width: 100%;
    height: 20rem;
    position: absolute;
    top: 5rem;
    left: 50%;
    background-color: white;
`

export default function SearchBar(props) {

    const { itemSearchText } = useSelector(state => state)
    const [isActive, setIsActive] = useState(false)

    const dispatch = useDispatch()

    function handleText(text) {
        //setNumItems(20)
        dispatch(setItemSearchText(text))
    }

    function handleActivity() {
        if (!isActive) {
            setIsActive(!isActive)
        }
    }

    return (
        <Wrapper>
            <SearchIcon />
            <SearchInput
                id='item-search'
                type='search'
                value={itemSearchText}
                onChange={(e) => handleText(e.target.value)}
                autoFocus={true}
            />
        </Wrapper>
    )
}
