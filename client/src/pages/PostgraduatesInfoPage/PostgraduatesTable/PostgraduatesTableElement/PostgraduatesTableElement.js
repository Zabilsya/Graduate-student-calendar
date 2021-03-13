import React, { useEffect, useState } from 'react';

import './css/style.css'

export const PostgraduatesTableElement = ({student, onChooseStudent, chosenStudent}) => {
    const {_id, name, secondName, thirdName, email, admissionYear} = student

    return (
        <tr className={chosenStudent ? chosenStudent._id === _id ? "student-info chosen-student" : "student-info" : "student-info" } onClick={onChooseStudent}>
            <th className="student-info-element">{_id}</th>
            <th className="student-info-element">{name}</th>
            <th className="student-info-element">{secondName}</th>
            <th className="student-info-element">{thirdName}</th>
            <th className="student-info-element">{email}</th>
            <th className="student-info-element">{admissionYear}</th>
        </tr>
    )
}