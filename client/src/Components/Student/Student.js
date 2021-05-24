import React, { useEffect, useState } from 'react'

// import directions from '../../data/directions'

export const Student = ({ data, directions, buttonText, onConfirm }) => {
    const [form, setForm] = useState({
        _id: '', name: '', secondName: '', thirdName: '', direction: '', email: '', admissionYear: ''
    })
    const [newDirection, setNewDirection] = useState(false)

    const disabledInput = buttonText === 'Удалить'

    useEffect(() => {
        if (data) {
            setForm({
                _id: data._id,
                name: data.name,
                secondName: data.secondName,
                thirdName: data.thirdName,
                direction: data.direction,
                email: data.email,
                admissionYear: data.admissionYear
            })
        }
    }, [data])

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const changeDirectionHandler = event => {
        if (event.target.value === 'New') {
            setForm({ ...form, [event.target.name]: '' })
            setNewDirection(true)
        } else {
            setForm({ ...form, [event.target.name]: event.target.value })
        }
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
                {
                    newDirection ?
                        <div className="form-floating mb-3">
                            <input autoFocus type="text" className="form-control" name="direction" value={form.direction} onChange={changeInputHandler} id="direction" />
                            <label htmlFor="direction">Направление</label>
                        </div>
                        :
                        <div className="select">
                            <label htmlFor="direction">Направление</label>
                            <select className="custom-select" name="direction" value={form.direction} onChange={changeDirectionHandler} disabled={disabledInput}>
                                {
                                    directions.map((item, index) => (
                                        <option key={index} value={item}>{item}</option>
                                    ))
                                }
                                <option value="New">Добавить новое</option>
                            </select>
                        </div>
                }

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