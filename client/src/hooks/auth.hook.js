import {useState, useCallback, useEffect} from 'react'
import io from 'socket.io-client'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [socket, setSocket] = useState(null)

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken)
    setUserId(id)
    setSocket(io())

    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken
    }))
  }, [])


  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))

    if (data && data.token) {
      login(data.token, data.userId)
    }
  }, [login])

  useEffect(() => {
    if (socket) {
      socket.emit('enter', userId)
    }
  }, [socket])

  return {socket, login, logout, token, userId}
}