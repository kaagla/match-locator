import React, { useState, useEffect } from 'react';
import './CalendarComponent.css'

export default function Calendar(props) {

    const today = new Date().toJSON().split('T')[0]

    //const [dateFrom, setDateFrom] = useState(today)
    //const [dateTo, setDateTo] = useState(today)
    const [showCalendar, setShowCalendar] = useState(false)
    const [dateRangeOption, setDateRangeOption] = useState('')

    function getCalData(years) {
        let calData = []
        years.map(year => {

            [1,2,3,4,5,6,7,8,9,10,11,12].map(month => {
                let yearData = {'year': year, 'month': month <= 9 ? '0'+month : month.toString()}
                yearData.monthDays = getCalforMonth(month, year)
                calData.push(yearData)
            })
            
        })
        return calData
    }

    function getCalforMonth(month, year) {
        let thisMonth =  month -1
        let thisYear = year
        let daysInMonth = new Date(thisYear, thisMonth+1, 0).getDate()
        
        let startDay = -(new Date(thisYear, thisMonth, 1).getDay() - 2)

        if (new Date(thisYear, thisMonth, 1).getDay() === 0) {
            startDay = -5
        }

        let endDay = daysInMonth + (7 - new Date(thisYear, thisMonth, daysInMonth).getDay())
        let data = []

        for (let i = startDay; i <= endDay; i++) {
            let theDay = new Date(thisYear, thisMonth, i)
            let day = theDay.getDate()
            day = day <= 9 ? '0'+day : day
            let weekDay = theDay.getDay()
            let theMonth = theDay.getMonth() + 1
            theMonth = theMonth <= 9 ? '0'+theMonth : theMonth
            let theYear = theDay.getFullYear()
            
            data.push({
                'date': theYear + '-' + theMonth + '-' + day
            })
        }

        let cal = []
        for (let j = 0; j < (data.length/7); j++) {
            cal.push(data.slice(j*7, (j+1)*7))
        }
        return cal
    }

    const isThisDay = (day) => {
        let getToday = new Date()
        let today = getToday.getFullYear() + '-' + (getToday.getMonth()+1) + '-' + getToday.getDate()

        return day === today ? true : false
    }

    function handleCalClick(item) {
        let day = new Date(item).getTime()
        let from = new Date(props.dateFrom).getTime()
        let to = new Date(props.dateTo).getTime()

        if (day < from || from !== to) {
            props.setDateFrom(item)
            props.setDateTo(item)
        } else if (from === to) {
            props.setDateTo(item)
        }
    }

    function isBetweenSelected(day) {
        if (props.dateTo === null) {
            if (day === props.dateFrom) {
                return true
            }
        } else {
            if (day >= props.dateFrom && day <= props.dateTo) {
                return true
            }
        }
        return false
    }

    function isOtherMonth(day, month) {
        return parseInt(day.split('-')[1]) !== parseInt(month) ? true : false
    }

    function isOtherYear(day, year) {
        return parseInt(day.split('-')[0]) !== parseInt(year) ? true : false
    }

    function handleDateRangeOption(value) {
        if (value === 'today') {
            props.setDateFrom(today)
            props.setDateTo(today)
        }
        if (value === 'this-week') {
            let tDay = new Date()
            props.setDateFrom(today)
            if (tDay.getDay() !== 0) {
               props.setDateTo(new Date(tDay.setDate(tDay.getDate() + (7 - new Date().getDay()))).toJSON().split('T')[0])
            } else {
                props.setDateTo(today)
            }
        }
        if (value === 'next-week') {
            let nwMonday = new Date(new Date().setDate(new Date().getDate() + (8 - new Date().getDay())))
            let nwSunday = new Date(nwMonday)
            nwSunday.setDate(nwSunday.getDate() + 6)
            props.setDateFrom(nwMonday.toJSON().split('T')[0])
            props.setDateTo(nwSunday.toJSON().split('T')[0])
        }
        if (value === 'this-month') {
            props.setDateFrom(today)
            let tday = new Date(today)
            let lastDayOfMonth = new Date(tday.setDate(32))
            lastDayOfMonth = new Date(tday.setDate(0)).toJSON().split('T')[0]
            props.setDateTo(lastDayOfMonth)
        }
        if (value === 'next-month') {
            let nmFirstday = new Date(new Date().setDate(32)).toJSON().split('T')[0]
            let nmLastDay = new Date(new Date(new Date().setDate(64)).setDate(0)).toJSON().split('T')[0]
            props.setDateFrom(nmFirstday)
            props.setDateTo(nmLastDay)
        }
        if (value === 'this-year') {
            let tyLastDay = new Date(new Date().getFullYear(), 11, 32).toJSON().split('T')[0]
            props.setDateFrom(today)
            props.setDateTo(tyLastDay)
        }
    }

    function displayMonth(month) {
        const names = {
            '01': 'tammikuu',
            '02': 'helmikuu',
            '03': 'maaliskuu',
            '04': 'huhtikuu',
            '05': 'toukokuu',
            '06': 'kesäkuu',
            '07': 'heinäkuu',
            '08': 'elokuu',
            '09': 'syyskuu',
            '10': 'lokakuu',
            '11': 'marraskuu',
            '12': 'joulukuu'
        }
        return names[month]
    }

    function displayDate(date) {
        let month = parseInt(date.split('-')[1])
        let day = parseInt(date.split('-')[2])
        return day + '.' + month + '.'
    }

    function displayDateWyear(date) {
        let year = date.split('-')[0]
        let month = parseInt(date.split('-')[1])
        let day = parseInt(date.split('-')[2])
        return day + '.' + month + '.' + year 
    }

    useEffect(() => {
        
        document.getElementById(props.dateTo.split('-').slice(0,2).join('-')).scrollIntoView({behavior: "auto", block: "center"})           
        
    }, []);

    useEffect(() => {
        
        document.getElementById(props.dateTo.split('-').slice(0,2).join('-')).scrollIntoView({behavior: "smooth", block: "center"})          
        
    }, [props.dateTo]);

    return (
        <div className='calendar-container'>
            <div className='calendar-component'>
                <div
                    className='calendar-component--display'
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    {props.dateFrom === props.dateTo ?
                    
                    <div>
                        {displayDateWyear(props.dateFrom)}
                    </div>
                    
                    :
                    <div>
                        {props.dateFrom.split('-')[0] === props.dateTo.split('-')[0] ?
                        <span>{displayDate(props.dateFrom)}</span>
                        :
                        <span>{displayDateWyear(props.dateFrom)}</span>
                        }
                        <span> &rarr; </span>
                        <span>{displayDateWyear(props.dateTo)}</span>
                    </div>
                    }
                </div>
                <div className='calendar-component--tables'>
                <div className='calendar-component--table-headings'>
                    <table>
                        <tr>
                            <th>MA</th>
                            <th>TI</th>
                            <th>KE</th>
                            <th>TO</th>
                            <th>PE</th>
                            <th>LA</th>
                            <th>SU</th>
                        </tr>
                    </table>
                </div>
                {getCalData([2019,2020,2021]).map(table =>
                <div
                    className='calendar-component--month'
                    key={table.year+'-'+table.month}
                    id={table.year+'-'+table.month}
                >
                    <h5>{displayMonth(table.month) + ' ' + table.year}</h5>
                    <table>
                        
                        {table.monthDays.map(week =>
                        <tr>
                            {week.map(day =>
                            isBetweenSelected(day.date) && !isOtherMonth(day.date, table.month) ?
                            day.date === props.dateFrom || day.date === props.dateTo ?
                            <td 
                                className='calendar-component--item-selected'
                                onClick={() => handleCalClick(day.date)}
                            >
                                
                                {day.date.split('-')[2]}
                            </td>
                            :
                            <td 
                                className='calendar-component--item-selected-range'
                                onClick={() => handleCalClick(day.date)}
                            >
                                
                                {day.date.split('-')[2]}
                            </td>
                            :
                            isOtherMonth(day.date, table.month) ?
                                isOtherYear(day.date, table.year) ?
                                <td></td>
                                :
                                <td
                                    className='calendar-component--item-difmonth'
                                    onClick={() => handleCalClick(day.date)}
                                >
                                    {day.date.split('-')[2]}
                                </td>
                            :
                            <td
                                className='calendar-component--item'
                                onClick={() => handleCalClick(day.date)}
                            >
                                {day.date.split('-')[2]}
                            </td>
                            )}
                        </tr>
                        )}
                    </table>
                </div>
                )}
                </div>
                <div className='calendar-component--shortcut'>
                    <form>
                        <label>
                            <select
                                value={dateRangeOption}
                                onChange={(e) => handleDateRangeOption(e.target.value)}
                            >
                                <option value="">Ajanjakson pikavalinta</option>
                                <option value="today">Tänään</option>
                                <option value="this-week">Tulevat tällä viikolla</option>
                                <option value="next-week">Ensi viikolla</option>
                                <option value="this-month">Tulevat tässä kuussa</option>
                                <option value="next-month">Ensi kuussa</option>
                                <option value="this-year">Tulevat tänä vuonna</option>
                            </select>
                        </label>
                    </form>
                </div>
                
            </div>
        </div>
    )
}