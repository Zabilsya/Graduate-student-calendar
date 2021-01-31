import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {CalendarPage} from './pages/CalendarPage'
import {PersonalInfoPage} from './pages/PersonalInfoPage'
import {SupportPage} from './pages/SupportPage'
import {AuthPage} from './pages/AuthPage'


export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/calendar" exact>
                    <CalendarPage />
                </Route>
                <Route path="/personalInfo" exact>
                    <PersonalInfoPage />
                </Route>
                <Route path="/support" exact>
                    <SupportPage />
                </Route>
                <Redirect to="/calendar" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/" exact>
                    <AuthPage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}