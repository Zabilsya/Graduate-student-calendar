import React, { useEffect, useState } from 'react';

import './css/style.css'

export const PostgraduatesTableElement = ({student, onChooseStudent, chosenStudent, count}) => {
    const {_id, name, secondName, thirdName, email, admissionYear} = student

    return (
        <tr className={chosenStudent ? chosenStudent._id === _id ? "student-info chosen-student" : "student-info" : "student-info" } onClick={onChooseStudent}>
            <td className="student-info-item">{count}</td>
            <td className="student-info-item">{name}</td>
            <td className="student-info-item">{secondName}</td>
            <td className="student-info-item">{thirdName}</td>
            <td className="student-info-item">{email}</td>
            <td className="student-info-item">{admissionYear}</td>
        </tr>
    )
}