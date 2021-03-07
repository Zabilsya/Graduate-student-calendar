import React from 'react'
import {useRoutes} from './routes'
import {BrowserRouter} from 'react-router-dom'
import {Navigation} from './Components/Navigation/Navigation'

import './style.css'

function App() {
  const isAuthenticated = true
  const routes = useRoutes(isAuthenticated)
  return (
    <BrowserRouter>
    { isAuthenticated && <Navigation/> }
    <div className="container">
      {routes}
    </div>
    </BrowserRouter>
  )
}

export default App;
