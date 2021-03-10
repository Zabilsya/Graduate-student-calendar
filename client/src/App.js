import React, { useEffect, useState } from 'react'
import { useRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Components/Navigation/Navigation'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { ScheduleContext } from './context/ScheduleContext'
import { useSchedule } from './hooks/schedule.hook'
import io from 'socket.io-client'

import './style.css'

function App() {
  const { socket, token, login, logout, userId } = useAuth()
  const isAuthenticated = !!token

  const schedule = useSchedule(socket)
  const routes = useRoutes(isAuthenticated)

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <ScheduleContext.Provider value={{socket, schedule}}>
        <BrowserRouter>
          {isAuthenticated && <Navigation />}
          <div className="container">
            {routes}
          </div>
        </BrowserRouter>
      </ScheduleContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;
