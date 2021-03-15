import React, { useRef, useState } from 'react';
import moment from 'moment'
import {ModalEvents} from '../../../Components/ModalEvents/ModalEvents'

import './css/style.css'

export const CalendarDay = ({day, dayEvents, isCurrentDay, isSelectedMonth}) => {
    const [isOpenModal, setIsOpenModal] = useState(false)
    const events = checkNumberOfEvents()

    const openModal = () => {
        setIsOpenModal(true)
    }

    const closeModal = () => {
        setIsOpenModal(false)
    }

    function checkNumberOfEvents() {
        if (dayEvents.length === 0) {
            return ''
        }
        if (dayEvents.length <= 3) {
            return dayEvents.map(event => (
                <div className="event">
                    {event.name}
                </div>))
        }
        let temp
        for (let i = 0; i < 3; i++) {
            temp += <div className="event">{dayEvents[i].name}</div>
        }
        return temp
    }

    return (
        <>
            <div className="day" onClick={isSelectedMonth(day) ? openModal : ''} key={day.unix()}>
                <div className={isCurrentDay(day) ? "number-wrapper current" : "number-wrapper"}>
                    <div className={isSelectedMonth(day) ? "number" : "number not-current"}>
                        {day.format('D')}
                    </div>
                </div>
                {events}
            </div>
            {isOpenModal && 
                <ModalEvents title={day.format('LL')} onClose={closeModal} dayEvents={dayEvents}/>
            }
        </>
    )
}