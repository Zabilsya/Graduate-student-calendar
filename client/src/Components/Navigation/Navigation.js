import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

import './css/style.css'

export const Navigation = () => {
    const history = useHistory()
    const {userId} = useContext(AuthContext)

    const makeActive = event => {
        
    }

    const logoutHandler = event => {
        event.preventDefault()
        history.push('/')
    }

    return (
        <nav>
            <div className="nav">
                <ul className="nav-links">
                    <li className="nav-links-item"><NavLink className='link link-main' onClick={makeActive} to="/calendar">Календарь</NavLink></li>
                    <li className="nav-links-item"><NavLink className='link' onClick={makeActive} to="/personalInfo">Личная информация</NavLink></li>
                    {userId === '604fb74012c7d21c984aed35' && <li className="nav-links-item"><NavLink className='link' onClick={makeActive} to="/postgraduatesInfo">Данные аспирантов</NavLink></li>}
                    <li className="nav-links-item"><NavLink className='link' onClick={makeActive} to="/support">Помощь</NavLink></li>
                    <li className="nav-links-item"><a className='link link-logout' href="/" onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}