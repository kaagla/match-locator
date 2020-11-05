import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import './MatchlistComponent.css';
import MatchListItems from './MatchListItemsComponent';

export default function MatchList(props) {

    const { matches } = useSelector(state => state)
    const [groupbyItem, setGroupByItem] = useState('sport')
    const isLoadingMatches = useSelector(state => state.isLoadingMatches)

    let groupbySet = new Set([])
    matches.map(match => {
        groupbySet.add(match[groupbyItem])
    })

    function sortedGroupbySet() {
        return ['date'].includes(groupbyItem) ? Array.from(groupbySet) : Array.from(groupbySet).sort()
    }

    function handleItemIsOpen(index) {
        if (groupbySet.size === 1) {
            return true
        } else if (groupbyItem === 'sport') {
            return false
        } else if (index === 0) {
            return true
        } else {
            return false
        }
    }

    return (
        <div className='matchlist-component'>
            {isLoadingMatches ?
            <div>Ladataan otteluita...</div>
            :
            matches.length === 0 ?
            null
            :
            <div className='matchlist-content'>
                <div className='matchlist-component--grouping'>
                    <div className='matchlist-component--grouping-label'>Ryhmittely:</div>
                    <div>
                        <select
                            value={groupbyItem}
                            onChange={(e) => setGroupByItem(e.target.value)}
                        >
                            <option value="sport">Laji</option>
                            <option value="date">Päivämäärä</option>
                            <option value="level">Sarjataso</option>
                            <option value="postoffice">Alue</option>
                            <option value="venue_name">Kenttä</option>
                        </select>
                     </div>
                </div>
                <div className='matchlist-component--matchlist-items'>
                {sortedGroupbySet().map((header, index) =>
                    <MatchListItems
                        key={header}
                        header={header}
                        groupbyItem={groupbyItem}
                        matches={matches.filter(m => m[groupbyItem] === header)}
                        itemIsOpen={handleItemIsOpen(index)}
                    />
                )}
                </div>
            </div>
            }
        </div>
    )
}