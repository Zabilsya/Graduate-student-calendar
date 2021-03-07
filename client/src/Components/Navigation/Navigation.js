import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'

import './css/style.css'

export const Navigation = () => {
    const history = useHistory()

    const logoutHandler = event => {
        event.preventDefault()

        history.push('/')
    }

    return (
        <nav>
            <div className="nav">
                <ul className="nav-links">
                    <li className="nav-links-item"><NavLink className='link' to="/calendar">Календарь</NavLink></li>
                    <li className="nav-links-item"><NavLink className='link' to="/personalInfo">Личная информация</NavLink></li>
                    <li className="nav-links-item"><NavLink className='link' to="/support">Поддержка</NavLink></li>
                    <li className="nav-links-item"><a className='link link-logout' href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}