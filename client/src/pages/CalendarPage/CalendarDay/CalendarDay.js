import React, { useRef, useState } from 'react';
import moment from 'moment'
import {Modal} from './../../../Components/Modal/Modal'

import './css/style.css'

export const CalendarDay = ({day, isCurrentDay, isSelectedMonth}) => {
    const [isOpenModal, setIsOpenModal] = useState(false)

    const openModal = () => {
        setIsOpenModal(true)
    }

    const closeModal = () => {
        setIsOpenModal(false)
    }

    return (
        <>
            <div className="day" onClick={isSelectedMonth(day) ? openModal : ''} key={day.unix()}>
                <div className={isCurrentDay(day) ? "number-wrapper current" : "number-wrapper"}>
                    <div className={isSelectedMonth(day) ? "number" : "number not-current"}>
                        {day.format('D')}
                    </div>
                </div>
            </div>
            {isOpenModal && 
                <Modal title={day.format('LL')} onClose={closeModal} type='event'/>
            }
        </>
    )
}