import React, { useEffect, useState } from "react"

export const useSchedule = socket => {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    if (socket) {

      socket.on('mes', message => {
          setEvents(message)
      })
    }

  }, [socket])

  return events
}