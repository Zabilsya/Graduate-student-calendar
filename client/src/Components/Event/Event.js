import React, { useEffect, useState } from 'react'
import moment from "moment";
import MomentUtils from "@date-io/moment";
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import {
    MuiPickersUtilsProvider,
    DatePicker,
    TimePicker
} from '@material-ui/pickers'
import { Dropdown } from './../Dropdown/Dropdown'

import './css/style.css'

export const Event = ({ data, reveal, changeModalMode, onConfirmChanges }) => {
    const [form, setForm] = useState({
        _id: '', name: '', description: '', startDatetime: new Date(), priority: '', type: '', notificationFrequency: '', info: ''
    })
    const [eventVisibility, setEventVisibility] = useState(reveal) // тест при обновлении с другого компа мероприятия (ставим false если плохо)
    const [editingMode, setEditingMode] = useState(reveal) // тест при обновлении с другого компа мероприятия (ставим false если плохо)

    const turnOnEventVisibility = () => {
        setEventVisibility(true)
    }

    const turnOnEditingMode = () => {
        setEditingMode(true)
    }

    useEffect(() => {
        if (data) {
            setForm({
                _id: data._id,
                name: data.name,
                description: data.description,
                startDatetime: data.startDatetime,
                priority: data.priority,
                type: data.type,
                notificationFrequency: data.notificationFrequency,
                info: data.info
            })
        }
        if (reveal) {
            turnOnEventVisibility()
            turnOnEditingMode()
        }
    }, [data])

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const changeStartDateHandler = date => {
        setForm({ ...form, startDatetime: date })
    }

    const cancelAdding = () => {
        if (reveal) changeModalMode()
        else {
            setEditingMode(false)
            setForm({
                _id: data._id,
                name: data.name,
                description: data.description,
                startDatetime: data.startDatetime,
                priority: data.priority,
                type: data.type,
                notificationFrequency: data.notificationFrequency,
                info: data.info
            })
        }
    }

    const saveChanges = () => {
        if (reveal) {
            onConfirmChanges('addEvent', form)
            changeModalMode()
        }
        else onConfirmChanges('updateEvent', form)
    }


    return (
        <>
            {eventVisibility &&
                <>
                    <div className="modal-body">
                        <div className="form-floating mb-3">
                            <input type="text" id="name" className="form-control" name="name" value={form.name} onChange={changeInputHandler} readOnly={!editingMode} />
                            <label htmlFor="name">Название события</label>
                        </div>
                        {/* <div className="data">
               <Dropdown options={'k'}/>
            </div> */}
                        <div className="form-floating mb-3">
                            <textarea type="text" id="description" className="form-control" name="description" readOnly={!editingMode}>{form.description}</textarea>
                            <label htmlFor="description">Описание</label>
                        </div>
                        <div className="data">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DatePicker
                                    readOnly={!editingMode}
                                    variant="inline"
                                    ampm={false}
                                    label="Дата"
                                    value={form.startDatetime}
                                    onChange={changeStartDateHandler}
                                    disablePast
                                    format="dd/MM/yyyy"
                                />
                                <TimePicker
                                    readOnly={!editingMode}
                                    ampm={false}
                                    label="время"
                                    value={form.startDatetime}
                                    onChange={changeStartDateHandler}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </div>
                </>
            }

            {(eventVisibility && editingMode) &&
                <div className="modal-footer">
                    <button className="modal-footer-button" onClick={saveChanges}>Сохранить</button>
                    <button className="modal-footer-button" onClick={cancelAdding}>Отменить</button>
                </div>
            }
            {(eventVisibility && !editingMode) &&
                <div className="modal-footer">
                    <button className="modal-footer-button" onClick={turnOnEditingMode}>Редактировать</button>
                    <button className="modal-footer-button">Удалить</button>
                </div>
            }
            {!eventVisibility &&
                <div className="event-line" onClick={turnOnEventVisibility}>{data.name}</div>
            }

        </>
    )
}