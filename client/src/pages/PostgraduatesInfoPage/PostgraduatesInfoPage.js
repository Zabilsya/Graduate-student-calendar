import React, { useState, useEffect, useContext } from 'react'
import { PostgraduatesTable } from './PostgraduatesTable/PostgraduatesTable'
import { ModalStudent } from '../../Components/ModalStudent/ModalStudent'

import './css/style.css'
import { useStudents } from '../../hooks/students.hook'

export const PostgraduatesInfoPage = () => {
    const { students, chosenStudent, setChosenStudent } = useStudents()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [modalInfo, setModalInfo] = useState({
        data: '', title: '', buttonText: ''
    })

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

    const deleteStudent = () => {
        setModalInfo({
            data: chosenStudent, title: 'Удаление аспиранта', buttonText: 'Удалить'
        })
        setIsOpenModal(true)
    }

    const closeModal = () => {
        setIsOpenModal(false)
    }

    return (
        <div className="info">
            <div className="content-elements">
                <PostgraduatesTable students={students} chooseStudent={chooseStudent} chosenStudent={chosenStudent}/>
            </div>
            <div>
                <button type="button" id="" onClick={editStudent}>Редактировать информацию об аспиранте</button>
                <button type="button" onClick={addStudent}>Добавить аспиранта</button>
                <button type="button"onClick={deleteStudent}>Удалить аспиранта</button>
            </div>
            {isOpenModal && 
                <ModalStudent modalInfo={modalInfo} onClose={closeModal}/>
            }
        </div>
    )
}
