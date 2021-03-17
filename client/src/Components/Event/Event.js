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
import { Dropdown } from './../Dropdown/Dropdown'

import './css/style.css'

export const Event = ({ data, reveal, changeModalMode, onConfirmChanges, eventTarget }) => {
    const [form, setForm] = useState({
        _id: '', name: '', description: '', startDt: new Date(), priority: '', type: '', notificationPeriod: '', info: '', target: eventTarget 
    })
    const [eventVisibility, setEventVisibility] = useState(reveal) // тест при обновлении с другого компа мероприятия (ставим false если плохо)
    const [editingMode, setEditingMode] = useState(reveal) // тест при обновлении с другого компа мероприятия (ставим false если плохо)

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
                    <div className="event-name">
                        {data.name}
                    </div>
                    <div className={eventVisibility ? 'arrow top' : 'arrow down'}></div>
                </div> :
                <h3>Новое мероприятие:</h3>
            }
    
            <div className={eventVisibility ? 'event-wrapper show' : 'event-wrapper hide'}>
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
               
                <div className={eventVisibility ? 'modal-buttons show' : 'modal-buttons hide'}>
                    <button className="modal-footer-button" onClick={editingMode ? saveChanges : turnOnEditingMode}>{editingMode ? 'Сохранить' : 'Редактировать'}</button>
                    <button className="modal-footer-button" onClick={editingMode ? cancelAdding : deleteEvent}>{editingMode ? 'Отменить' : 'Удалить'}</button>
                </div>

            </div>

        </>
    )
}