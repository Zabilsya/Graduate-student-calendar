import React, { useState, useEffect } from 'react'
import { useRequest } from './../../hooks/request.hook'
import { PostgraduatesTable } from './PostgraduatesTable/PostgraduatesTable'
import {Modal} from './../../Components/Modal/Modal'

import './css/style.css'

export const PostgraduatesInfoPage = () => {
    const [students, setStudents] = useState(false)
    const [chosenStudent, setChosenStudent] = useState(false)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [modalInfo, setModalInfo] = useState({
        title: '', buttonText: ''
    })
    const request = useRequest()

    useEffect(() => {
        const response = request()
        if (response && response.success) {
            setStudents(response.message)
            setChosenStudent(response.message[0])
        } else if (!response.success) {
            setStudents('')
        }
    }, [])

    const chooseStudent = student => {
        setChosenStudent(student)
    }

    const addStudent = () => {
        setModalInfo({
            data: false, title: 'Добавление аспиранта', buttonText: 'Добавить'
        })
        setIsOpenModal(true)
    }

    const editStudent = () => {
        setModalInfo({
            data: chosenStudent, title: 'Редактирование информации об аспиранте', buttonText: 'Сохранить'
        })
        setIsOpenModal(true)
    }

    const closeModal = () => {
        setIsOpenModal(false)
    }

    return (
        <div className="info">
            <div className="content-elements">
                <PostgraduatesTable students={students} chooseStudent={chooseStudent}/>
            </div>
            <div>
                <button type="button" onClick={editStudent}>Редактировать информацию об аспиранте</button>
                <button type="button" onClick={addStudent}>Добавить аспиранта</button>
                <button type="button">Удалить аспиранта</button>
            </div>
            {isOpenModal && 
                <Modal modalInfo={modalInfo} onClose={closeModal} type='student'/>
            }
        </div>
    )
}
