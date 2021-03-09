import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { Event } from './../Event/Event'

import './css/style.css'

export const Modal = ({ title, onClose }) => {
    const [isEditing, setIsEditing] = useState(false)

    const changeModalMode = () => {
        setIsEditing(true)
    }

    return (
        ReactDOM.createPortal(
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h1 className="modal-title">{title}</h1>
                    <div className="modal-close" onClick={onClose}></div>
                </div>
                <div className="modal-body">
                    {isEditing ? 
                        <Event/>
                     : ''

                    }
                
                </div>
                <div className="modal-footer">
                    <button className="modal-footer-button" onClick={changeModalMode}>Добавить событие</button>
                </div>
            </div>
        </div>,
        document.getElementById('modal')
        )
    )
}