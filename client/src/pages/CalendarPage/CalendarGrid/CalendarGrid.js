import React, { useState, useContext } from 'react';
import moment from 'moment'
import {CalendarDay} from './../CalendarDay/CalendarDay'
import {ScheduleContext} from '../../../context/ScheduleContext'

import './css/style.css'

export const CalendarGrid = ({ startDay, today }) => {
    const {events} = useContext(ScheduleContext)
    const filteredEvents = events.filter(event => event.startDatetime.isSame(today, 'month'))
    const totalDays = 42
    const day = startDay.clone().subtract(1, 'day')
    const daysArr = [...Array(totalDays)].map(() => day.add(1, 'day').clone())
    const isCurrentDay = day => moment().isSame(day, 'day')
    const isSelectedMonth = day => today.isSame(day, 'month')

    return (
        <>
            <div className="calendar-grid-header">
                {[...Array(7)].map((item, index) => (
                    <div className="day-of-week" key={index}>
                        {moment().day(index + 1).format('ddd')}
                    </div>
                ))}
            </div>
            <div className="calendar-grid">
                {
                    daysArr.map((day, index) => {
                        const dayEvents = filteredEvents.filter(event => event.startDatetime.isSame(day, 'day'))
                        return <CalendarDay day={day} dayEvents={dayEvents} isCurrentDay={isCurrentDay} isSelectedMonth={isSelectedMonth} key={index}/>
                    })
                }
            </div>
        </>
    )
}