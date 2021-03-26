import React, { useState, useEffect, useContext } from 'react'
import { PostgraduatesTable } from './PostgraduatesTable/PostgraduatesTable'
import { ModalStudent } from '../../Components/ModalStudent/ModalStudent'
import { StudentContext } from '../../context/StudentContext'

import './css/style.css'
import { useStudents } from '../../hooks/students.hook'

export const PostgraduatesInfoPage = () => {
    let {students, chosenStudent, setChosenStudent} = useContext(StudentContext)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [modalInfo, setModalInfo] = useState({
        data: '', title: '', buttonText: ''
    })

    students = students.filter(user => user._id != '604fb74012c7d21c984aed35')

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
                <div className="buttons">
                {students.length > 0 && <button type="button" className="button" onClick={editStudent}>Редактировать информацию об аспиранте</button>}
                    <button type="button" className="button" onClick={addStudent}>Добавить аспиранта</button>
                {students.length > 0 && <button type="button" className="button" onClick={deleteStudent}>Удалить аспиранта</button>}
                </div>
            {isOpenModal && 
                <ModalStudent modalInfo={modalInfo} onClose={closeModal}/>
            }
        </div>
    )
}
