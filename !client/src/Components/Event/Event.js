import React, { useEffect, useState } from 'react'

import './css/style.css'

export const Event = () => {
    return (
        <>
            <div className="data">
                <label htmlFor="name">Название события</label>
                <input type="text" id="name" className="form-control" name="name" />
            </div>
            <div className="data">
                <div className="select" data-state="">
                    <div className="select-title" data-default="Option 0">Option 0</div>
                    <div className="select-content">
                        <input id="singleSelect0" className="select-input" type="radio" name="singleSelect" checked />
                        <label for="singleSelect0" className="select-label">Option 0</label>
                        <input id="singleSelect1" className="select-input" type="radio" name="singleSelect" />
                        <label for="singleSelect1" className="select-label">Option 1</label>
                        <input id="singleSelect2" className="select-input" type="radio" name="singleSelect" disabled />
                        <label for="singleSelect2" className="select-label">Option 2 (disabled)</label>
                        <input id="singleSelect3" className="select-input" type="radio" name="singleSelect" />
                        <label for="singleSelect3" className="select-label">Option 3</label>
                        <input id="singleSelect4" className="select-input" type="radio" name="singleSelect" />
                        <label for="singleSelect4" className="select-label">Option 4</label>
                    </div>
                </div>
            </div>
            <div className="data">
                <label htmlFor="name">Название события</label>
                <input type="text" id="name" className="form-control" name="name" />
            </div>
            <div className="data">
                <label htmlFor="name">Название события</label>
                <input type="text" id="name" className="form-control" name="name" />
            </div>
            <div className="data">
                <label htmlFor="name">Название события</label>
                <input type="text" id="name" className="form-control" name="name" />
            </div>
            <div className="data">
                <label htmlFor="name">Название события</label>
                <input type="text" id="name" className="form-control" name="name" />
            </div>
        </>
    )
}