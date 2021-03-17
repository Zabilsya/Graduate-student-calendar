import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { CalendarPage } from './pages/CalendarPage/CalendarPage'
import { PersonalInfoPage } from './pages/PersonalInfoPage/PersonalInfoPage'
import { SupportPage } from './pages/SupportPage/SupportPage'
import { AuthPage } from './pages/AuthPage/AuthPage'
import { PostgraduatesInfoPage } from './pages/PostgraduatesInfoPage/PostgraduatesInfoPage'

export const useRoutes = (isAuthenticated, userId) => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/calendar" exact>
                    <CalendarPage />
                </Route>
                <Route path="/personalInfo" exact>
                    <PersonalInfoPage />
                </Route>
                {userId === '604fb74012c7d21c984aed35' &&
                    <Route path="/postgraduatesInfo" exact>
                        <PostgraduatesInfoPage />
                    </Route>
                }
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