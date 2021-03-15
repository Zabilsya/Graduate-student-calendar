import React, { useState, useContext } from 'react'
import {CalendarHeader} from './CalendarHeader/CalendarHeader'
import {CalendarGrid} from './CalendarGrid/CalendarGrid'
import moment from 'moment'

import './css/style.css'

export const CalendarPage = () => {
    moment.updateLocale('en', {week: {dow: 1}})
    const [today, setToday] = useState(moment())
    const startDay = today.clone().startOf('month').startOf('week')

    const onPrevMonth = () => {
        setToday(prev => prev.clone().subtract(1, 'month'))
    }

    const onNextMonth = () => {
        setToday(prev => prev.clone().add(1, 'month'))
    } 

    return (
        <div className="calendar">
            <CalendarHeader today={today} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth}/>
            <CalendarGrid startDay={startDay} today={today}/>
        </div>
    )
}