import React, { useEffect, useState } from 'react';
import { useRequest } from './../../../hooks/request.hook'
import {PostgraduatesTableElement} from './PostgraduatesTableElement/PostgraduatesTableElement'

import './css/style.css'

export const PostgraduatesTable = ({students, chooseStudent, chosenStudent}) => {
    
    return (
        <>
            {students &&
                <div className="main-table">
                    <h2 className="main-table-title">Список аспирантов</h2>
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr className="main-table-header">
                                <th className="main-table-header-item">id</th>
                                <th className="main-table-header-item">Фамилия</th>
                                <th className="main-table-header-item">Имя</th>
                                <th className="main-table-header-item">Отчество</th>
                                <th className="main-table-header-item">Электронная почта</th>
                                <th className="main-table-header-item">Год поступления</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                students.map(student => (
                                    <PostgraduatesTableElement key={student._id} student={student} chosenStudent={chosenStudent} onChooseStudent={() => chooseStudent(student)} />
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }
            {students === '' && <h1 className="error-title">Не найдено ни одного аспиранта!</h1>}
        </>
    )
}