import React, { useEffect, useState } from 'react'

import './css/style.css'

export const Dropdown = ({options}) => {

    return (
        <div className="dropdown">
            <div className="control">
            <div className="selected-value">kek</div>
            <div className="arrow"/>
            </div>
            <div className="options">
                {
                    options.map(option => 
                        <div className="option">{option.name}</div>
                    )
                }
            </div>
           
        </div>
    )
}