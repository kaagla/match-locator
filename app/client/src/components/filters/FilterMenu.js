import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getMatchesData } from '../../actions/matchesData'
import { setSearchIsActive } from '../../actions/searchActivity'
import styled from 'styled-components'
import MenuItem from './MenuItem'
import Calendar from './CalendarComponent'
import FilterGroup from './FilterGroup'

import { displayDates } from '../../services/dateService'

const Wrapper = styled.div`
    /*background-color: rgba(0,0,0,0.3);*/
    flex: 1;
    width: 100%;
    max-width: 600px;
    padding-top: 6rem;
    padding-bottom: 6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    ::before, ::after {
        content: '';
        margin: auto;
    }
`

export default function FilterMenu() {

    const { dateFrom, dateTo, selectedFilters, visibleFilters, 
        isLoadingMatches } = useSelector(state => state)

    const dispatch = useDispatch()

    function getMatches() {
        const dates = dateFrom + ',' + dateTo
        dispatch(getMatchesData(dates, selectedFilters))
    }

    function displayCount(typeList) {
        const selected = selectedFilters.filter(f => typeList.includes(f.type)).length
        const visible = visibleFilters.filter(f => typeList.includes(f.type)).length
        return selected + ' / ' + visible
    }

    function activateSearch() {
        dispatch(setSearchIsActive(true))
    }

    return (
        <Wrapper>
            <MenuItem key={'search'} icon={'search'} definition={'ETSI SUODATTIMIA'} onClick={() => activateSearch()} />
            {isLoadingMatches ?
            <MenuItem key={'isLoading'} icon={'download'} definition={'LADATAAN OTTELUITA...'} />
            :
            <MenuItem key={'readyToLoad'} icon={'redo'} definition={'PÄIVITÄ OTTELUHAKU'} onClick={() => getMatches()} />
            }
            <MenuItem key={'calendar'} icon={'calendar'} definition={displayDates(dateFrom,dateTo)}>
                <Calendar />
            </MenuItem>
            <MenuItem key={'areas'} icon={'map-marked-alt'} definition='ALUEET' count={displayCount(['grandarea','municipality','postoffice'])}>
                <FilterGroup
                    useDefaultFilters={true}
                    defaultFilterTypes={['grandarea']}
                    useNewFilters={true}
                    newFilterTypes={['municipality','postoffice']}
                    notification={'alueita'}
                />
            </MenuItem>
            <MenuItem key={'sports'} icon={'running'} definition='LAJIT' count={displayCount(['sport'])}> 
                <FilterGroup
                    useDefaultFilters={true}
                    defaultFilterTypes={['sport']}
                    useNewFilters={false}
                />
            </MenuItem>
            <MenuItem key={'levels'} icon={'trophy'} definition='SARJAT' count={displayCount(['level'])}>
                <FilterGroup
                    useDefaultFilters={false}
                    useNewFilters={true}
                    newFilterTypes={['level']}
                    notification={'sarjoja'}
                />
            </MenuItem>
            <MenuItem key={'teams'} icon={'users'} definition='JOUKKUEET' count={displayCount(['team'])}>
                <FilterGroup
                    useDefaultFilters={false}
                    useNewFilters={true}
                    newFilterTypes={['team']}
                    notification={'joukkueita'}
                />
            </MenuItem>
        </Wrapper>
    )
}
