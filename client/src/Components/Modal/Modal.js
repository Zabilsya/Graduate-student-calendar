import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { useRequest } from '../../hooks/request.hook';
import { Event } from './../Event/Event'
import { Student } from './../Student/Student'

import './css/style.css'

export const Modal = ({ modalInfo, type, onClose }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { data, title, buttonText } = modalInfo
    const request = useRequest()

    const changeModalMode = () => {
        setIsEditing(true)
    }

    const onConfirmChanges = form => {
        let response
        switch (buttonText) {
            case 'Добавить':
                response = request('addUser', form)
                break
            case 'Сохранить':
                response = request('editUser', form)
                break
            case 'Удалить':
                response = request('deleteUser', form)
                break
            default: break
        }
        response.then(message => {
            console.log(message)
            onClose()
        })
        
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
                        <Student data={data} buttonText={buttonText} onConfirm={onConfirmChanges} />
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