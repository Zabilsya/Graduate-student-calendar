import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { useRequest } from '../../hooks/request.hook';
import { Event } from '../Event/Event'

// import './css/style.css'

export const ModalEvents = ({ title, dayEvents, onClose }) => {
    const [isAdding, setIsAdding] = useState(false)
    const request = useRequest()

    const changeModalMode = () => {
        setIsAdding(isAdding => !isAdding)
    }


    const onConfirmChanges = async (type, form) => {
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
                    {dayEvents.length !== 0 &&
                        dayEvents.map(data => (
                            <Event data={data} reveal={false} changeModalMode={changeModalMode} onConfirmChanges={onConfirmChanges} key={data._id}/>
                        ))
                    }
                    {isAdding && <Event data={''} reveal={true} changeModalMode={changeModalMode} onConfirmChanges={onConfirmChanges} />}
                    {(!isAdding && dayEvents.length === 0) &&

                        <div className="modal-body">
                            <h2 className="event-title">Мероприятий в данный день не запланировано</h2>
                        </div>

                    }
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