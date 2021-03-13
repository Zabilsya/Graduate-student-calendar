import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom';
import { useRequest } from '../../hooks/request.hook';
import { Event } from '../Event/Event'

// import './css/style.css'

export const ModalEvents = ({ modalInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { data, title, buttonText } = modalInfo
    const request = useRequest()

    const changeModalMode = () => {
        setIsEditing(true)
    }

    const onConfirmChanges = async form => {
        switch (buttonText) {
            case 'Добавить':
                await request('addUser', form)
                break
            case 'Сохранить':
                await request('editUser', form)
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
                    {/* {
                        
                        : isEditing ?
                            <Event />
                            : ''
                    } */}
                </div>
            </div>,
            document.getElementById('modal')
        )
    )
}