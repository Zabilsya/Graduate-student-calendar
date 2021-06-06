import React, { useEffect, useRef, useState } from 'react';
import { PostgraduatesTableElement } from './PostgraduatesTableElement/PostgraduatesTableElement'

import './css/style.css'

export const PostgraduatesTable = ({ students, chooseStudent, chosenStudent }) => {
    const [sort, setSort] = useState({ field: 'admissionYear', orderAsc: true })
    const [filter, setFilter] = useState({
        direction: 'default', year: 'default'
    })
    const [years, setYears] = useState([])
    const [directions, setDirections] = useState([])
    const currentSort = useRef()

    let listOfStudents = students

    if (filter.year != 'default') {
        listOfStudents = listOfStudents.filter(student => student.admissionYear == filter.year)
    }
    if (filter.direction != 'default') {
        listOfStudents = listOfStudents.filter(student => student.direction == filter.direction)
    }

    sort.orderAsc
        ? listOfStudents.sort((a, b) => a[sort.field] > b[sort.field] ? 1 : -1)
        : listOfStudents.sort((a, b) => a[sort.field] > b[sort.field] ? -1 : 1)


    const applySort = event => {
        currentSort.current.style.background = '#ffffff'
        currentSort.current = event.target
        currentSort.current.style.background = '#ff0000'
        event.target.id === sort.field
            ? setSort({ ...sort, orderAsc: !sort.orderAsc })
            : setSort({ ...sort, field: event.target.id })
    }

    const changeFilterHandler = event => {
        setFilter({ ...filter, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        if (listOfStudents && listOfStudents.length > 0)
            chooseStudent(listOfStudents[0])
        else
            chooseStudent(false)
    }, [filter])

    useEffect(() => {
        if (students && students.length > 0) {
            let yearsStudents = []
            let directionsStudents = []
            students.forEach(element => {
                if (!yearsStudents.includes(element.admissionYear))
                yearsStudents.push(element.admissionYear)
                if (!directionsStudents.includes(element.direction))
                directionsStudents.push(element.direction)
            });
            yearsStudents = yearsStudents.sort((a, b) => a - b)
            directionsStudents = directionsStudents.sort((a, b) => a - b)
            setYears(yearsStudents)
            setDirections(directionsStudents)
        } else {
            setYears([])
            setDirections([])
        }
    }, [students])

    useEffect(() => {
        currentSort.current.style.background = '#ff0000'
    }, [])

    return (
        <>
            {listOfStudents &&
                <>
                    <h1 className="main-table-title">Список аспирантов</h1>
                    <div className="filters-wrapper">
                        <div className="filters-title">Фильтры</div>
                        <div className="filters">
                            <div className="year-filter filter">
                                <label htmlFor="year-filter">Год поступления:</label>
                                <select className="custom-select" name="year" id="year-filter" value={filter.year} onChange={changeFilterHandler}>
                                <option value='default'>Все</option>
                                    {
                                        years.map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="direction-filter filter">
                                <label htmlFor="direction-filter">Специальность:</label>
                                <select className="custom-select" name="direction" id="direction-filter" value={filter.direction} onChange={changeFilterHandler}>
                                    <option value='default'>Все</option>
                                    {
                                        directions.map((direction, index) => (
                                            <option key={index} value={direction}>{direction}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="main-table-header">
                        <table className="table-header table-bordered">
                            <tr className="main-table-header-row">
                                <th className="main-table-header-item" id="id">id</th>
                                <th className="main-table-header-item" id="secondName" onClick={applySort}>Фамилия</th>
                                <th className="main-table-header-item" id="name" onClick={applySort}>Имя</th>
                                <th className="main-table-header-item" id="thirdName" onClick={applySort}>Отчество</th>
                                <th className="main-table-header-item" id="direction" onClick={applySort}>Специальность</th>
                                <th className="main-table-header-item" id="email" onClick={applySort}>Электронная почта</th>
                                <th ref={currentSort} className="main-table-header-item" id="admissionYear" onClick={applySort}>Год поступления</th>
                            </tr>
                        </table>
                    </div>
                    <div className="main-table-wrapper">
                        <table className="table table-bordered">
                            <tbody>
                                {
                                    listOfStudents.map((student, count) => (
                                        <PostgraduatesTableElement key={student._id} student={student} count={count + 1} chosenStudent={chosenStudent} onChooseStudent={() => chooseStudent(student)} />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }
            {listOfStudents === '' && <h1 className="error-title">Не найдено ни одного аспиранта!</h1>}
        </>
    )
}