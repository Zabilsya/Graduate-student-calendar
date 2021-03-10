import React, { useEffect, useState } from "react"

export const useSchedule = socket => {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    if (socket) {
      socket.emit('mes', 'darova server')

      socket.on('mes', message => {
      
      })
    }

  }, [socket])

  return events
}