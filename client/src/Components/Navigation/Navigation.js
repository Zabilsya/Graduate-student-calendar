import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import './css/style.css'

export const Navigation = () => {
    const history = useHistory()
    const {userId, logout} = useContext(AuthContext)

    const logoutHandler = event => {
        event.preventDefault()
        logout()
        history.push('/')
    }

    return (
        <nav>
            <div className="nav">
                <ul className="nav-links">
                    <li className="nav-links-item"><NavLink className='link link-main' to="/calendar">Календарь</NavLink></li>
                    <li className="nav-links-item"><NavLink className='link' to="/personalInfo">Личная информация</NavLink></li>
                    {userId === '604fb74012c7d21c984aed35' && <li className="nav-links-item"><NavLink className='link' to="/postgraduatesInfo">Данные аспирантов</NavLink></li>}
                    <li className="nav-links-item"><NavLink className='link' to="/support">Помощь</NavLink></li>
                    <li className="nav-links-item"><a className='link link-logout' href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}