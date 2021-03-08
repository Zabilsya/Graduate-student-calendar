import React, { useEffect } from 'react'
import ReactDOM from 'react-dom';

import './css/style.css'

export const Modal = ({ title, onClose }) => {

    return (
        ReactDOM.createPortal(
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h1 className="modal-title">{title}</h1>
                    <div className="modal-close" onClick={onClose}></div>
                </div>
                <div className="modal-body">

                </div>
                <div className="modal-footer">
                    <button className="button">Добавить событие</button>
                </div>
            </div>
        </div>,
        document.getElementById('modal')
        )
    )
}