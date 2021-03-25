import React, { useState, useContext, useEffect } from 'react'
import { CalendarHeader } from './CalendarHeader/CalendarHeader'
import { CalendarGrid } from './CalendarGrid/CalendarGrid'
import { ScheduleContext } from './../../context/ScheduleContext'
import { AuthContext } from './../../context/AuthContext'
import { StudentContext } from '../../context/StudentContext'
import moment from 'moment'

import './css/style.css'

export const CalendarPage = () => {
    moment.updateLocale('en', { week: { dow: 1 } })
    const [years, setYears] = useState(false)
    const [today, setToday] = useState(moment())
    const { students } = useContext(StudentContext)
    let { events } = useContext(ScheduleContext)
    const { userId } = useContext(AuthContext)
    const [filter, setFilter] = useState({
        student: 'default', year: '', priority: 'default', eventType: 'default'
    })
    const isAdmin = userId == '604fb74012c7d21c984aed35'
    let eventTarget = userId
    let listOfStudents, listOfEvents

    if (isAdmin) {
        listOfStudents = students.filter(student => student.admissionYear == filter.year)

        if (filter.student == 'default') {
            listOfEvents = events.filter(event => event.target == filter.year)
            eventTarget = filter.year
        }

        else {
            listOfEvents = events.filter(event => event.target == filter.student)
            eventTarget = filter.student
        }
    }

    if (filter.priority !== 'default')
        listOfEvents = listOfEvents.filter(event => event.priority == filter.priority)
    if (filter.eventType !== 'default')
        listOfEvents = listOfEvents.filter(event => event.type == filter.eventType)

    const startDay = today.clone().startOf('month').startOf('week')

    const onPrevMonth = () => {
        setToday(prev => prev.clone().subtract(1, 'month'))
    }

    const onNextMonth = () => {
        setToday(prev => prev.clone().add(1, 'month'))
    }

    const changeFilterHandler = event => {
        setFilter({ ...filter, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        if (students && students.length > 0 && isAdmin) {
            let years = []
            students.forEach(element => {
                if (!years.includes(element.admissionYear) && element._id != '604fb74012c7d21c984aed35')
                    years.push(element.admissionYear)
            });
            years = years.sort((a, b) => a - b)
            setYears(years)
            setFilter({ ...filter, year: years[0] })
        }
    }, [students])

    return (
        <div className="main-page-wrapper">
        <div className="filters-wrapper">
            {((isAdmin && years && years.length > 0) || !isAdmin) &&
            <>
            <div className="filters-title">Фильтры</div>
            <div className="filters">
                {(isAdmin) &&
                    <>
                        <div className="year-filter filter">
                            <label htmlFor="year-filter">Год поступления:</label>
                            <select className="custom-select" name="year" id="year-filter" value={filter.year} onChange={changeFilterHandler}>
                                {years.map(year => (
                                    <option value={year} key={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="student-filter filter">
                            <label htmlFor="student-filter">Аспирант:</label>
                            <select className="custom-select" name="student" id="student-filter" value={filter.student} onChange={changeFilterHandler}>
                                <option value='default'>Все</option>
                                {listOfStudents.map(student => (
                                    <option value={student._id} key={student._id}>{`${student.secondName} ${student.name} ${student.thirdName}`}</option>
                                ))}
                            </select>
                        </div>
                    </>
                }
                <div className="priority-filter filter">
                    <label htmlFor="priority-filter">Приоритетность:</label>
                    <select className="custom-select" name="priority" id="priority-filter" value={filter.priority} onChange={changeFilterHandler}>
                       <option value="default">Все</option>
                       <option value="low">Низкий</option>
                       <option value="medium">Средний</option>
                       <option value="high">Высокий</option>
                    </select>
                </div>
                <div className="event-type-filter filter">
                    <label htmlFor="event-type-filter">Тип события:</label>
                    <select className="custom-select" name="eventType" id="event-type-filter" value={filter.eventType} onChange={changeFilterHandler}>
                        <option value="default">Все</option>
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
            </div>
            </>
            }
        </div>

            <div className="calendar">
                <CalendarHeader today={today} onPrevMonth={onPrevMonth} onNextMonth={onNextMonth} />
                <CalendarGrid startDay={startDay} today={today} events={listOfEvents} eventTarget={eventTarget} />
            </div>
        </div>
    )
}