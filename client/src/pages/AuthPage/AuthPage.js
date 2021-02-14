import React, { useState } from 'react'

import './css/style.css'

export const AuthPage = () => {
    const [form, setForm] = useState({
        email: '', password: ''
    });

    const changeInputHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const signIn = () => {

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
                    <div class="form-floating form-floating-last">
                        <input type="password" className="form-control" name="password" value={form.password} onChange={changeInputHandler} id="floatingPassword" placeholder="Password" />
                        <label htmlFor="floatingPassword">Пароль</label>
                    </div>
                    <button type="button" className="btn-sign" onClick={signIn}>Войти</button>
                </div>
            </div>
        </div>
    )
}