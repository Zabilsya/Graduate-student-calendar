import React from 'react'
import { useRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Components/Navigation/Navigation'
import { useAuth } from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext'
import { ScheduleContext } from './context/ScheduleContext'
import { StudentContext } from './context/StudentContext'
import { useSchedule } from './hooks/schedule.hook'
import { NotificationMenu } from './Components/NotificationMenu/NotificationMenu'
import { useNotifications } from './hooks/notification.hook'
import { useStudents } from './hooks/students.hook'

import './style.css'
import 'materialize-css'

function App() {
  const { socket, token, login, logout, userId } = useAuth()
  const isAuthenticated = !!token

  const events = useSchedule(socket)
  const { notifications, viewNotification } = useNotifications(socket, userId)
  const { students, chosenStudent, setChosenStudent } = useStudents(socket)
  const routes = useRoutes(isAuthenticated, userId)

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <ScheduleContext.Provider value={{ socket, events }}>
        <StudentContext.Provider value={{ students, chosenStudent, setChosenStudent }}>
          {isAuthenticated && <NotificationMenu notifications={notifications} viewNotification={viewNotification} userId={userId} />}
          <BrowserRouter>
            {isAuthenticated && <Navigation />}
            <div className="container">
              {routes}
            </div>
          </BrowserRouter>
        </StudentContext.Provider>
      </ScheduleContext.Provider>
    </AuthContext.Provider>
  )
}

export default App;
