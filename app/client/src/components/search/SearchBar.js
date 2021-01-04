import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setItemSearchText } from '../../actions/searchText'
import styled from 'styled-components'

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

const SearchIconDiv = styled.div`
    color: black;
    height: 2rem;
    width: 2rem;
    margin-right: 3rem;
    margin-left: 1rem;
`

const SearchInput = styled.input`
    flex: 1;
    height: 2rem;
`

export default function SearchBar() {

    const { itemSearchText } = useSelector(state => state)

    const dispatch = useDispatch()

    function handleText(text) {
        dispatch(setItemSearchText(text))
    }

    return (
        <Wrapper>
            <SearchIconDiv>
                <i className={"fas fa-search"}></i>
            </SearchIconDiv>
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
