import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { useRequest } from '../../hooks/request.hook';
import { Student } from '../Student/Student'

import './css/style.css'

export const ModalStudent = ({ modalInfo, onClose }) => {
    const { data, title, buttonText } = modalInfo
    const request = useRequest()

    const onConfirmChanges = async form => {
        switch (buttonText) {
            case 'Добавить':
                await request('addUser', form)
                break
            case 'Сохранить':
                await request('updateUser', form)
                break
            case 'Удалить':
                await request('deleteUser', form)
                break
            default: break
        }
           onClose()
    }

    return (
        ReactDOM.createPortal(
            <div className="overlay" onClick={onClose}>
                <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <div className="modal-close" onClick={onClose}></div>
                    </div>
                        <Student data={data} buttonText={buttonText} onConfirm={onConfirmChanges} />
                </div>
            </div>,
            document.getElementById('modal')
        )
    )
}