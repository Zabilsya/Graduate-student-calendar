import React from 'react'
import { useRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'
import { Navigation } from './Components/Navigation/Navigation'
import { useAuth } from './hooks/auth.hook'
import { useHttp } from './hooks/http.hook'
import { AuthContext } from './context/AuthContext'
import { ScheduleContext } from './context/ScheduleContext'
import { useSocket } from './hooks/socket.hook'

import './style.css'

function App() {
  const { token, login, logout, userId } = useAuth()
  const isAuthenticated = !!token
  // const isAuthenticated = true
  const routes = useRoutes(isAuthenticated)
  // const socket = useSocket()
  const request = useHttp()
  // try {
  //   const data = request(`${URLs.baseURL}/auth/login`, 'POST', {...form})
  // } catch (e) {
  //   alert('Не удалось получить список событий! Попробуйте позже')
  // }

  return (
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated
    }}>
      <ScheduleContext.Provider value={{}}>
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
