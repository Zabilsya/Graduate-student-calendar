import React, { useEffect, useState } from 'react';
import { useRequest } from './../../../hooks/request.hook'
import { PostgraduatesTableElement } from './PostgraduatesTableElement/PostgraduatesTableElement'

import './css/style.css'

export const PostgraduatesTable = ({ students, chooseStudent, chosenStudent }) => {

    return (
        <>
            {students &&
                <>
                <h1 className="main-table-title">Список аспирантов</h1>
                <div className="main-table-header">
                    <table className="table-header table-bordered">
                        <tr className="main-table-header-row">
                            <th className="main-table-header-item">id</th>
                            <th className="main-table-header-item">Фамилия</th>
                            <th className="main-table-header-item">Имя</th>
                            <th className="main-table-header-item">Отчество</th>
                            <th className="main-table-header-item">Электронная почта</th>
                            <th className="main-table-header-item">Год поступления</th>
                        </tr>
                    </table>
                </div>
                    <div className="main-table-wrapper">
                        <table className="table table-bordered">
                            <tbody>
                                {
                                    students.map((student, count) => (
                                        <PostgraduatesTableElement key={student._id} student={student} count={count + 1} chosenStudent={chosenStudent} onChooseStudent={() => chooseStudent(student)} />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }
            {students === '' && <h1 className="error-title">Не найдено ни одного аспиранта!</h1>}
        </>
    )
}