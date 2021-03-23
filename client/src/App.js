import React from 'react'
import { useRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Components/Navigation/Navigation'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { ScheduleContext } from './context/ScheduleContext'
import { useSchedule } from './hooks/schedule.hook'
import { NotificationMenu } from './Components/NotificationMenu/NotificationMenu'
import { useNotifications } from './hooks/notification.hook'

import './style.css'
import 'materialize-css'

function App() {
  const { socket, token, login, logout, userId } = useAuth()
  const isAuthenticated = !!token

  const events = useSchedule(socket)
  const notifications = useNotifications(socket)
  const routes = useRoutes(isAuthenticated, userId)

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <ScheduleContext.Provider value={{socket, events}}>
      {isAuthenticated && <NotificationMenu notifications={notifications}/>}
        <BrowserRouter>
          {isAuthenticated && <Navigation/>}
          <div className="container">
            {routes}
          </div>
        </BrowserRouter>
      </ScheduleContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;
