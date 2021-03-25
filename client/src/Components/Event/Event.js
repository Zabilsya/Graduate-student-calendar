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
import eventTypes from '../../data/eventTypes'

import './css/style.css'

export const Event = ({ data, day, reveal, changeModalMode, onConfirmChanges, eventTarget }) => {
    const [form, setForm] = useState({
        _id: '', name: '', description: '', startDt: day, priority: 'low', type: 'Проект', notificationPeriod: '1', info: '', target: eventTarget
    })
    const [eventVisibility, setEventVisibility] = useState(reveal)
    const [editingMode, setEditingMode] = useState(reveal)
    const toggleEventVisibility = () => {
        setEventVisibility(eventVisibility => !eventVisibility)
    }

    const turnOnEditingMode = () => {
        setEditingMode(true)
    }

    useEffect(() => {
        if (data) {
            setForm(prev => ({
                _id: data._id,
                name: data.name,
                description: data.description,
                startDt: data.startDt,
                priority: data.priority,
                type: data.type,
                notificationPeriod: data.notificationPeriod,
                info: data.info,
                target: prev.target
            }))
        }
        if (reveal) {
            setEventVisibility(true)
            turnOnEditingMode()
        }
    }, [data])

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const changeStartDateHandler = date => {
        setForm({ ...form, startDt: date })
    }

    const cancelAdding = () => {
        if (reveal) changeModalMode()
        else {
            setEditingMode(false)
            setForm({
                _id: data._id,
                name: data.name,
                description: data.description,
                startDt: data.startDt,
                priority: data.priority,
                type: data.type,
                notificationPeriod: data.notificationPeriod,
                info: data.info
            })
        }
    }

    const saveChanges = () => {
        if (reveal) {
            onConfirmChanges('addEvent', form)
            changeModalMode()
        }
        else {
            onConfirmChanges('updateEvent', form)
            setEditingMode(false)
        }
    }

    const deleteEvent = () => {
        onConfirmChanges('deleteEvent', form)
    }


    return (
        <>
            {!reveal ?
                <div className="event-line" onClick={toggleEventVisibility} style={{ background: eventTypes[form.type] }}>
                    <div className="event-time">
                        {moment(form.startDt).format('HH:mm')}
                    </div>
                    <div className="event-name">
                        {data.name}
                    </div>
                    <div className={eventVisibility ? 'arrow top' : 'arrow down'}></div>
                </div> :
                <h3>Новое мероприятие:</h3>
            }

            <div className={eventVisibility ? 'event-wrapper show' : 'event-wrapper hide'}>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" name="name" value={form.name} onChange={changeInputHandler} readOnly={!editingMode} />
                    <label htmlFor="name">Название события</label>
                </div>
                <div className="select">
                    <label htmlFor="type">Тип события</label>
                    <select className="custom-select" name="type" value={form.type} onChange={changeInputHandler} disabled={!editingMode}>
                        <option value="Проект">Проект</option>
                        <option value="Экзамен">Экзамен</option>
                        <option value="Зачет">Зачёт</option>
                        <option value="Практика">Практика</option>
                        <option value="Научное_исследование">Научное исследование</option>
                        <option value="Государственная_итоговая_аттестация">Государственная итоговая аттестация</option>
                        <option value="Конференция">Конференция</option>
                        <option value="Мастер_класс">Мастер-класс</option>
                        <option value="Другое">Другое</option>
                    </select>
                </div>

                <div className="form-floating mb-3 data time">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            readOnly={!editingMode}
                            variant="inline"
                            ampm={false}
                            label="Дата"
                            value={form.startDt}
                            onChange={changeStartDateHandler}
                            disablePast
                            format="dd/MM/yyyy"
                        />
                        <TimePicker
                            readOnly={!editingMode}
                            ampm={false}
                            label="Время"
                            value={form.startDt}
                            onChange={changeStartDateHandler}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <h6 className="label">Приоритет</h6>
                <div className="form-floating mb-3 data priority">
                    <div className="form-check low">
                        <input className="form-check-input" type="radio" onChange={changeInputHandler} value="low" checked={form.priority === "low"} name="priority" id="lowRadio" disabled={!editingMode} />
                        <label className="form-check-label" htmlFor="lowRadio">
                            Низкий
                    </label>
                    </div>
                    <div className="form-check medium">
                        <input className="form-check-input" type="radio" onChange={changeInputHandler} value="medium" checked={form.priority === "medium"} name="priority" id="mediumRadio" disabled={!editingMode} />
                        <label className="form-check-label" htmlFor="mediumRadio">
                            Средний
                    </label>
                    </div>
                    <div className="form-check high">
                        <input className="form-check-input" type="radio" onChange={changeInputHandler} value="high" checked={form.priority === "high"} name="priority" id="highRadio" disabled={!editingMode} />
                        <label className="form-check-label" htmlFor="highRadio">
                            Высокий
                    </label>
                    </div>
                </div>

                <div className="select">
                    <label htmlFor="notificationPeriod">Частота напоминания</label>
                    <select className="custom-select" name="notificationPeriod" id="notificationPeriod" value={form.notificationPeriod.toString()} onChange={changeInputHandler} disabled={!editingMode}>
                        <option value="1">Каждый день</option>
                        <option value="7">Каждую неделю</option>
                        <option value="30">Каждый месяц</option>
                    </select>
                </div>

                <div className={eventVisibility ? 'modal-buttons show' : 'modal-buttons hide'}>
                    <button className="modal-footer-button" onClick={editingMode ? saveChanges : turnOnEditingMode}>{editingMode ? 'Сохранить' : 'Редактировать'}</button>
                    <button className="modal-footer-button" onClick={editingMode ? cancelAdding : deleteEvent}>{editingMode ? 'Отменить' : 'Удалить'}</button>
                </div>

            </div>

        </>
    )
}