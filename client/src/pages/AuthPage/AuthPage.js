import axios from 'axios';
import React, {useState, useContext, useRef} from 'react'
import { useRequest } from '../../hooks/request.hook';
import {AuthContext} from './../../context/AuthContext'
import URLs from './../../URLs';

import './css/style.css'

//  superuser@mail.ru 2l7xrqaf

// kvchernikov33@gmail.com xneer344


export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const [form, setForm] = useState({
        email: '', password: ''
    });

    const preloader = useRef()

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async () => {
        preloader.current.style.visibility = 'visible'
        let response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
          })
        const result = await response.json()
        preloader.current.style.visibility = 'hidden'
        if(!response.ok) {
            window.M.toast({html: result.message, classes: "message", displayLength: 2000})
            return
        }
        auth.login(result.token, result.userId)
    }

    return (
        <>
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
        <div className="preloader" ref={preloader}><img src="preloader.svg" alt="" /></div>
        </>
    )
}