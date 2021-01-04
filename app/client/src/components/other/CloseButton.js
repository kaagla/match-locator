import React from 'react'
import styled from 'styled-components'
import { CloseCircleOutline } from '@styled-icons/evaicons-outline'

const CloseDiv = styled.div`
    position: sticky;
    height: 4rem;
    width: 100%;
    max-width: 600px;
    margin-top: 2rem;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`

const CloseBtn = styled(CloseCircleOutline)`
    /*position: absolute;
    top: 1rem;
    right: 1rem;*/
    height: 2.5rem;
    width: 2.5rem;
    text-align: right;
    color: inherit;
    cursor: pointer;
`

export default function CloseButton(props) {
    return (
        <CloseDiv>
            <CloseBtn onClick={() => props.closeEvent()} />
        </CloseDiv>
    )
}
