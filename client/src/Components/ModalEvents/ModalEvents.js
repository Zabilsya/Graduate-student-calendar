import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import moment from "moment";
import { useRequest } from '../../hooks/request.hook';
import { Event } from '../Event/Event'

import './css/style.css'

export const ModalEvents = ({ title, dayEvents, onClose, eventTarget }) => {
    const [isAdding, setIsAdding] = useState(false)
    const request = useRequest()

    const changeModalMode = () => {
        setIsAdding(isAdding => !isAdding)
    }


    const onConfirmChanges = async (type, form) => {
        // form.startDatetime = moment(form.startDatetime).subtract(5, 'h')
        await request(type, form)
    }

    return (
        ReactDOM.createPortal(
            <div className="overlay" onClick={onClose}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <div className="modal-close" onClick={onClose}></div>
                    </div>
                    <div className="modal-body">
                        {(dayEvents.length !== 0 && !isAdding) &&
                            dayEvents.map(data => (
                                <Event data={data} reveal={false} changeModalMode={changeModalMode} onConfirmChanges={onConfirmChanges} eventTarget={eventTarget} key={data._id} />
                            ))
                        }
                        {isAdding && <Event data={''} reveal={true} changeModalMode={changeModalMode} onConfirmChanges={onConfirmChanges} eventTarget={eventTarget} />}
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
            </div>,
            document.getElementById('modal')
        )
    )
}