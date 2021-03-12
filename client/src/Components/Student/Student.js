import React, { useEffect, useState } from 'react'

export const Student = ({ data, buttonText, onConfirm }) => {
    const [form, setForm] = useState({
        name: '', secondName: '', thirdName: '', email: '', year: ''
    })

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name,
                secondName: data.secondName,
                thirdName: data.thirdName,
                email: data.email,
                year: data.year
            })
        }
    }, [])

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    return (
        <>
            <div className="modal-body">
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="name" value={form.name} onChange={changeInputHandler} id="name" />
                    <label htmlFor="name">Имя</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="secondName" value={form.secondName} onChange={changeInputHandler} id="secondName" />
                    <label htmlFor="secondName">Фамилия</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="thirdName" value={form.thirdName} onChange={changeInputHandler} id="thirdName" />
                    <label htmlFor="thirdName">Отчество</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" name="email" value={form.email} onChange={changeInputHandler} id="email" placeholder="name@example.com" />
                    <label htmlFor="email">Электронная почта</label>
                </div>
                <div className="form-floating form-floating-last">
                    <input type="number" className="form-control" name="year" value={form.year} onChange={changeInputHandler} id="year" />
                    <label htmlFor="year">Год поступления</label>
                </div>
            </div>
            <div className="modal-footer">
                <button className="modal-footer-button" onClick={form => onConfirm(form)}>{buttonText}</button>
            </div>

        </>
    )
}