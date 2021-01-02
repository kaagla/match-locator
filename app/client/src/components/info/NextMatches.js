import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ArrowAltCircleLeft, ArrowAltCircleRight } from '@styled-icons/fa-solid'
import axios from 'axios'
import { displayDM } from '../../services/dateService'
import CountBadge from '../other/CountBadgeComponent'
import { getMatchesData } from '../../actions/matchesData'
import { setSelectedContent } from '../../actions/selectionData'

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-x: hidden;
    transition: all 0.5s ease-out;
`

const Title = styled.div`
    padding: 2rem;
    font-size: 1.7rem;
`

const Box = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    overflow-x: scroll;
    
    scrollbar: none;
    -ms-overflow-style: none;
    scrollbar-width: none;

    ::-webkit-scrollbar {
        display: none;
    }
`

const ScrollBtns = styled.div`
    width: 100%;
    height: 3rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
`

const ScrollBtn = styled.button`
    border: none;
    outline: none;
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    background-color: transparent;
    color: white;
`

const Card = styled.div`
    width: 120px;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
    border-radius: 7px;
    background-color: rgba(0,0,0,0.1);
    padding: 1rem;
    margin: 1rem;
`

const CardHeader = styled.div`
    height: 2.5rem;
    width: 8rem;
    text-align: center;
    font-size: 1.7rem;
`

const SportItems = styled.div`
    width: 10rem;
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0 0.5rem 0;
`

const SportItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 1.3rem;
`

const ShowMatchesBtn = styled.button`
    padding: 1rem 0 1rem 0;
    border: 1px solid rgba(0,0,0,0.2);
    border-radius: 7px;
    color: inherit;
    font: inherit;
    font-size: 1.2rem;
    background-color: rgba(0,0,0,0.2);
    cursor: pointer;
    transition: all 0.2s;

    :hover {
        background-color: rgba(255,255,255,0.4);
        color: black;
    }
`

export default function NextMatches() {

    const [data, setData] = useState([])
    const [scrollPos, setScrollPos] = useState(0)

    const dispatch = useDispatch()

    function getMatches(date) {
        const ddate = new Date(date).toJSON().split('T')[0]
        const dates = `${ddate},${ddate}`

        dispatch(getMatchesData(dates,[]))
        dispatch(setSelectedContent('map'))
    }

    function displayDate(date) {
        const dDate = displayDM(new Date(date).toJSON().split('T')[0])
        if (dDate === today()) {
            return 'Tänään'
        } else {
            return dDate
        }
    }

    function today() {
        const today = new Date().toJSON().split('T')[0]
        const d = parseInt(today.split('-')[2])
        const m = parseInt(today.split('-')[1])
        return `${d}.${m}.`
    }

    function maxScroll() {
        try {
            let el = document.getElementById("card-box")
            return el.scrollWidth - el.clientWidth
        } catch {
            return 600
        }
        
    }

    function scrollLenght() {
        let el = document.getElementById("card-box")
        return Math.floor(el.clientWidth / 140) * 140
    }

    function scrollRightEnabled() {
        return scrollPos < maxScroll()
    }

    function nextItems() {
        let el = document.getElementById("card-box")

        if (scrollRightEnabled()) {
            const slength = scrollPos + scrollLenght()
            setScrollPos(slength)
            el.scrollTo({ top: 0, left: slength, behavior: 'smooth' })
        }
    }

    function prevItems() {
        let el = document.getElementById("card-box")
        if (scrollPos > 0) {
            const slength = scrollPos - scrollLenght()
            setScrollPos(slength)
            el.scrollTo({ top: 0, left: slength, behavior: 'smooth' })
        }
    }

    /*useEffect(() => {
        if (data.length > 0) {
            
        }
    }, [])*/

    useEffect(() => {
        axios.get('api/nextmatchdays')
        .then(res => {
            if (res.data.length > 0) {
                setData(res.data)
                let el = document.getElementById("card-box")
                el.addEventListener('scroll', function() {
                    setScrollPos(el.scrollLeft)
                })
            }
        })
        .catch(error => console.log(error))
    }, [])

    if (data.length === 0) {
        return null
    }

    return (
        <Wrapper>
            <Title>Seuraavat ottelupäivät:</Title>
            <Box id='card-box'>
                {data.map(item =>
                    <Card key={item._id}>
                        <CardHeader>
                            <span>{displayDate(item._id)}</span>
                            <CountBadge count={item.count} />
                        </CardHeader>
                        <SportItems>
                        {item.sports.map(sport =>
                            <SportItem>
                                <span>{sport.sport}</span>
                                <span>{sport.count}</span>
                            </SportItem>
                        )}
                        </SportItems>
                        <ShowMatchesBtn
                            onClick={() => getMatches(item._id)}
                        >HAE OTTELUT</ShowMatchesBtn>
                    </Card>
                )}
            </Box>
            <ScrollBtns>
                <ScrollBtn>
                    {scrollPos > 0 &&
                    <ArrowAltCircleLeft onClick={() => prevItems()} />
                    }
                </ScrollBtn>
                <ScrollBtn>
                    {scrollRightEnabled() &&
                    <ArrowAltCircleRight onClick={() => nextItems()} />
                    }
                </ScrollBtn>
            </ScrollBtns>
        </Wrapper>
    )
}
