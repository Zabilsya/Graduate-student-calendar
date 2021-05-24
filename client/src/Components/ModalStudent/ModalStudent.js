import React, { useRef } from 'react'
import ReactDOM from 'react-dom';
import { useRequest } from '../../hooks/request.hook';
import { Student } from '../Student/Student'

import './css/style.css'

export const ModalStudent = ({ modalInfo, onClose }) => {
    const { data, directions, title, buttonText } = modalInfo
    const preloader = useRef()
    const request = useRequest()

    const onConfirmChanges = async form => {
        preloader.current.style.visibility = 'visible'
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
        preloader.current.style.visibility = 'hidden'
        onClose()
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
                        <Student data={data} directions={directions} buttonText={buttonText} onConfirm={onConfirmChanges} />
                    </div>
                </div>
                <div className="preloader" ref={preloader}><img src="preloader.svg" alt="" /></div>
            </>,
            document.getElementById('modal')
        )
    )
}