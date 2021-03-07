import React, {useRef} from 'react'

import './css/style.css'

export const CalendarHeader = ({today, onPrevMonth, onNextMonth}) => {
    const next = useRef();
    const prev = useRef();

    const currentMonth = `${today.format('MMMM')} ${today.format('YYYY')}`
    const newStyleForButton = `
        width: 150px;
        height: 30px;
        font-size: 12px;`
    const defaultStyleForButton = `
         width: 100%;
        height: 100%;
        font-size: 15px;`

    const prevMonthHandler = () => {
        prev.current.style.cssText = newStyleForButton
        setTimeout(() => {
            prev.current.style.cssText = defaultStyleForButton
        }, 100)

        onPrevMonth()
    }

    const nextMonthHandler = () => {
        next.current.style.cssText = newStyleForButton
        setTimeout(() => {
            next.current.style.cssText = defaultStyleForButton
        }, 100)

        onNextMonth()
    }
    
    return (
        <div className="calendar-header">
            <div className="button-wrapper" onClick={prevMonthHandler}>
                <div className="button prev" ref={prev}>
                    Предыдущий месяц
                    <div className="arrow"></div>
                </div>
            </div>
            <div className="title">
                {currentMonth}
            </div>
            <div className="button-wrapper" onClick={nextMonthHandler}>
                <div className="button next" ref={next}>
                    Следующий месяц
                    <div className="arrow"></div>
                </div>
            </div>
        </div>
    )
}