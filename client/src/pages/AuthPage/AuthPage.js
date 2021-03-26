import axios from 'axios';
import React, {useState, useContext} from 'react'
import { useRequest } from '../../hooks/request.hook';
import {AuthContext} from './../../context/AuthContext'
import URLs from './../../URLs';

import './css/style.css'

//  superuser@mail.ru 2l7xrqaf


export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const [form, setForm] = useState({
        email: '', password: ''
    });

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async () => {
        let response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
          })
        const result = await response.json()
        if(!response.ok) {
            window.M.toast({html: result.message, classes: "message", displayLength: 2000})
            return
        }
        auth.login(result.token, result.userId)
    }

    return (
        <div className="auth">
            <div className="authorization">
                <h2 className='authorization-title'>Авторизация</h2>
                <div className="authorization-content">
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" name="email" value={form.email} onChange={changeInputHandler} id="floatingInput" placeholder="name@example.com" />
                        <label htmlFor="floatingInput">Email</label>
                    </div>
                    <div className="form-floating form-floating-last">
                        <input type="password" className="form-control" name="password" value={form.password} onChange={changeInputHandler} id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Пароль</label>
                    </div>
                    <button type="button" className="btn-sign" onClick={loginHandler}>Войти</button>
                </div>
            </div>
        </div>
    )
}