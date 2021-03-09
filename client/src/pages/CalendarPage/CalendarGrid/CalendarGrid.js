import React, { useState } from 'react';
import moment from 'moment'
import {CalendarDay} from './../CalendarDay/CalendarDay'

import './css/style.css'

export const CalendarGrid = ({ startDay, today }) => {
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
                    daysArr.map((day) => (
                        <CalendarDay day={day} isCurrentDay={isCurrentDay} isSelectedMonth={isSelectedMonth} key={day}/>
                    ))
                }
            </div>
        </>
    )
}