import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Event } from './../Event/Event'
import { Student } from './../Student/Student'

import './css/style.css'

export const Modal = ({ modalInfo, onClose, type }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { data, title, buttonText } = modalInfo

    const changeModalMode = () => {
        setIsEditing(true)
    }

    const confirmChanges = info => {
        // отправка на сервер
    }

    return (
        ReactDOM.createPortal(
            <div className="overlay" onClick={onClose}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <div className="modal-close" onClick={onClose}></div>
                    </div>
                    {type === 'student' ?
                        <Student data={data} buttonText={buttonText} onConfirm={confirmChanges} />
                        : isEditing ?
                            <Event />
                            : ''
                    }
                </div>
            </div>,
            document.getElementById('modal')
        )
    )
}