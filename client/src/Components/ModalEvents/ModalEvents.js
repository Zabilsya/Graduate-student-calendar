import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { useRequest } from '../../hooks/request.hook';
import { Event } from '../Event/Event'

import './css/style.css'

export const ModalEvents = ({ title, day, dayEvents, onClose, eventTarget }) => {
    const [isAdding, setIsAdding] = useState(false)
    const preloader = useRef()
    const request = useRequest()

    const changeModalMode = () => {
        setIsAdding(isAdding => !isAdding)
    }


    const onConfirmChanges = async (type, form) => {
        preloader.current.style.visibility = 'visible'
        await request(type, form)
        preloader.current.style.visibility = 'hidden'
    }

    return (
        ReactDOM.createPortal(
            <>
                <div className="overlay" onClick={onClose}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">{title}</h2>
                            <div className="modal-close" onClick={onClose}></div>
                        </div>
                        <div className="modal-body">
                            {(dayEvents.length !== 0 && !isAdding) &&
                                dayEvents.map(data => (
                                    <Event data={data} day={day} reveal={false} changeModalMode={changeModalMode} onConfirmChanges={onConfirmChanges} eventTarget={eventTarget} key={data._id} />
                                ))
                            }
                            {isAdding && <Event data={''} day={day} reveal={true} changeModalMode={changeModalMode} onConfirmChanges={onConfirmChanges} eventTarget={eventTarget} />}
                            {(!isAdding && dayEvents.length === 0) &&
                                <h4 className="event-title">Мероприятий на данный день не запланировано</h4>
                            }
                        </div>
                        {!isAdding &&
                            <div className="modal-footer">
                                <button className="modal-footer-button" onClick={changeModalMode}>Добавить мероприятие</button>
                            </div>
                        }
                    </div>
                </div>
                <div className="preloader" ref={preloader}><img src="preloader.svg" alt="" /></div>
            </>,
            document.getElementById('modal')
        )
    )
}