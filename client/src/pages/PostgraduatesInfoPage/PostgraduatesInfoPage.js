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
        data: '', directions: [], title: '', buttonText: ''
    })

    students = students.filter(user => user._id != '604fb74012c7d21c984aed35')

    const makeDirectionsArray = () => {
        const directions = []
        students.forEach(student => {
            if (!directions.includes(student.direction))
                directions.push(student.direction)
        });
        return directions 
    }

    const chooseStudent = student => {
        setChosenStudent(student)
    }

    const addStudent = () => {
        const directions = makeDirectionsArray()
        setModalInfo({
            data: false, directions, title: 'Добавление аспиранта', buttonText: 'Добавить'
        })
        setIsOpenModal(true)
    }

    const editStudent = () => {
        const directions = makeDirectionsArray()
        setModalInfo({
            data: chosenStudent, directions, title: 'Редактирование информации об аспиранте', buttonText: 'Сохранить'
        })
        setIsOpenModal(true)
    }

    const deleteStudent = () => {
        const directions = makeDirectionsArray()
        setModalInfo({
            data: chosenStudent, directions, title: 'Удаление аспиранта', buttonText: 'Удалить'
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
                {chosenStudent && <button type="button" className="button" onClick={editStudent}>Редактировать информацию об аспиранте</button>}
                    <button type="button" className="button" onClick={addStudent}>Добавить аспиранта</button>
                {chosenStudent && <button type="button" className="button" onClick={deleteStudent}>Удалить аспиранта</button>}
                </div>
            {isOpenModal && 
                <ModalStudent modalInfo={modalInfo} onClose={closeModal}/>
            }
        </div>
    )
}
