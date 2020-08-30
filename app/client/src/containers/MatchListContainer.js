import React, { useState } from 'react'
import './MatchListContainer.css';
import MatchListItems from './components/MatchListItemsComponent';

export default function MatchList(props) {

    const [groupbyItem, setGroupByItem] = useState('date')

    let groupbySet = new Set([])
    props.matches.map(match => {
        groupbySet.add(match[groupbyItem])
    })

    function sortedGroupbySet() {
        return groupbyItem === 'date' ? Array.from(groupbySet) : Array.from(groupbySet).sort()
    }

    return (
        <div className='container'>
            <div className='container-box'>
                <div
                    className='close-btn'
                    onClick={() => props.handleNaviChange('map')}
                >X</div>
                <div className='matchlist-container'>
                    <div className='matchlist-container--grouping'>
                        <form>
                            <label> {'Ryhmittely: '}
                                <select
                                    value={groupbyItem}
                                    onChange={(e) => setGroupByItem(e.target.value)}
                                >
                                    <option value="date">Päivämäärä</option>
                                    <option value="level">Sarjataso</option>
                                    <option value="city">Kaupunki</option>
                                    <option value="venue_name">Kenttä</option>
                                </select>
                            </label>
                        </form>
                    </div>
                    {sortedGroupbySet().map((header, index) =>
                        <MatchListItems
                            key={header}
                            header={header}
                            groupbyItem={groupbyItem}
                            matches={props.matches.filter(m => m[groupbyItem] === header)}
                            itemIsOpen={index === 0 ? true : false}
                        />
                    )}
                </div>
            </div>

        </div>
    )
}