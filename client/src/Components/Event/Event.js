import React, { useEffect, useState } from 'react'
import {Dropdown} from './../Dropdown/Dropdown'

import './css/style.css'

export const Event = () => {
    return (
        <>
            <div className="data">
                <label htmlFor="name">Название события</label>
                <input type="text" id="name" className="form-control" name="name" />
            </div>
            <div className="data">
               <Dropdown options={'k'}/>
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