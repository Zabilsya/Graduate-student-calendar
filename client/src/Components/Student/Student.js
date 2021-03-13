import React, { useEffect, useState } from 'react'

export const Student = ({ data, buttonText, onConfirm }) => {
    const [form, setForm] = useState({
        _id: '', name: '', secondName: '', thirdName: '', email: '', admissionYear: ''
    })

    const disabledInput = buttonText === 'Удалить'

    useEffect(() => {
        if (data) {
            setForm({
                _id : data._id,
                name: data.name,
                secondName: data.secondName,
                thirdName: data.thirdName,
                email: data.email,
                admissionYear: data.admissionYear
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
                    <input type="text" className="form-control" name="name" value={form.name} onChange={changeInputHandler} id="name" disabled={disabledInput} />
                    <label htmlFor="name">Имя</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="secondName" value={form.secondName} onChange={changeInputHandler} id="secondName" disabled={disabledInput} />
                    <label htmlFor="secondName">Фамилия</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="thirdName" value={form.thirdName} onChange={changeInputHandler} id="thirdName" disabled={disabledInput} />
                    <label htmlFor="thirdName">Отчество</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" name="email" value={form.email} onChange={changeInputHandler} id="email" disabled={disabledInput} />
                    <label htmlFor="email">Электронная почта</label>
                </div>
                <div className="form-floating form-floating-last">
                    <input type="number" className="form-control" name="admissionYear" value={form.admissionYear} onChange={changeInputHandler} id="admissionYear" disabled={disabledInput} />
                    <label htmlFor="admissionYear">Год поступления</label>
                </div>
            </div>
            <div className="modal-footer">
                <button className="modal-footer-button" onClick={() => onConfirm(form)}>{buttonText}</button>
            </div>

        </>
    )
}