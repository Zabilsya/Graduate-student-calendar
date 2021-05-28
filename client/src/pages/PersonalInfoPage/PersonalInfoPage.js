import React, { useContext, useEffect, useState, useRef } from 'react'
import { StudentContext } from '../../context/StudentContext'
import { AuthContext } from '../../context/AuthContext'
import { useRequest } from '../../hooks/request.hook'

import './css/style.css'

export const PersonalInfoPage = () => {
    const { userId } = useContext(AuthContext)
    const { students } = useContext(StudentContext)
    const preloader = useRef()
    const request = useRequest()
    const [form, setForm] = useState({
        _id: userId, name: '', secondName: '', thirdName: '', email: '', direction: '', admissionYear: ''
    })
    const isAdmin = userId == '604fb74012c7d21c984aed35'

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const saveChanges = async () => {
        preloader.current.style.visibility = 'visible'
        await request('updateUser', form)
        preloader.current.style.visibility = 'hidden'
    }

    useEffect(() => {
        const student = students.filter(item => item._id == userId)[0]
        setForm({
            _id: student._id,
            name: student.name,
            secondName: student.secondName,
            thirdName: student.thirdName,
            email: student.email,
            direction: student.direction,
            admissionYear: student.admissionYear
        })

    }, [students])


    return (
        <>
        <div className="personal-info-wrapper">
            <h1 className="personail-info-title">Мой профиль</h1>
            <div className="personal-info">
            <div className="form-floating mb-3">
                <input type="text" className="form-control" name="name" value={form.name} onChange={changeInputHandler} id="name" disabled={!isAdmin} />
                <label htmlFor="name">Имя</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" name="secondName" value={form.secondName} onChange={changeInputHandler} id="secondName" disabled={!isAdmin} />
                <label htmlFor="secondName">Фамилия</label>
            </div>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" name="thirdName" value={form.thirdName} onChange={changeInputHandler} id="thirdName" disabled={!isAdmin} />
                <label htmlFor="thirdName">Отчество</label>
            </div>
            <div className="form-floating mb-3">
                <input type="email" className="form-control" name="email" value={form.email} onChange={changeInputHandler} id="email" />
                <label htmlFor="email">Электронная почта</label>
            </div>
            {!isAdmin  &&
                <div className="form-floating mb-3">
                    <input type="number" className="form-control" name="admissionYear" onChange={changeInputHandler} value={form.admissionYear} id="admissionYear" disabled />
                    <label htmlFor="admissionYear">Год поступления</label>
                </div>
            }
              <div className="form-floating form-floating-last">
                    <button className="button" onClick={saveChanges}>Сохранить данные</button>
              </div>
              </div>
        </div>
        <div className="preloader" ref={preloader}><img src="preloader.svg" alt="" /></div>
        </>
    )
}