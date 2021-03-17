import React, { useState, useContext } from 'react'
import { CalendarHeader } from './CalendarHeader/CalendarHeader'
import { CalendarGrid } from './CalendarGrid/CalendarGrid'
import { ScheduleContext } from './../../context/ScheduleContext'
import { AuthContext } from './../../context/AuthContext'
import moment from 'moment'

import './css/style.css'

export const CalendarPage = () => {
    moment.updateLocale('en', { week: { dow: 1 } })
    const [today, setToday] = useState(moment())
    const { events } = useContext(ScheduleContext)
    const { userId } = useContext(AuthContext)
    let eventTarget = userId

    if (userId === '604fb74012c7d21c984aed35') {
        // фильтруем events согласно state фильтров
        // eventTatget = значение фильтра года обучения/конкретного аспиранта
    }
    const startDay = today.clone().startOf('month').startOf('week')


    // здесь будут фильтры по типу события и конретному году обучения или аспиранту
    const onPrevMonth = () => {
        setToday(prev => prev.clone().subtract(1, 'month'))
    }

    const onNextMonth = () => {
        setToday(prev => prev.clone().add(1, 'month'))
    }

    return (
        <>
            {userId === '604fb74012c7d21c984aed35' && 'тут рендерим фильтры по годам и ИУП'}
            <div className="calendar">
                <CalendarHeader today={today} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
                <CalendarGrid startDay={startDay} today={today} events={events} eventTarget={eventTarget} />
            </div>
        </>
    )
}