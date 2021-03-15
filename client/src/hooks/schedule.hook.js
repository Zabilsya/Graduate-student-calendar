import React, { useEffect, useState } from "react"
import { useRequest } from "./request.hook"

export const useSchedule = socket => {
  const [events, setEvents] = useState([])
  const request = useRequest(socket)

  useEffect(() => {
    if (socket) {
      getEvents()
      socket.on('newEvent', message => {
        setEvents(events => ([...events, message]))
      })
  
      socket.on('deletedEvent', message => {
        setEvents(events => {
          const newArr = [...events.filter(item => item._id !== message)]
          return newArr
        })
      })
  
      socket.on('updatedEvent', message => {
        setEvents(events => {
          const index = events.findIndex(item => item._id === message._id)
          const before = events.slice(0, index);
          const after = events.slice(index + 1);
          const newList = [...before, message, ...after];
          return newList
        })
      })
    }
    
  }, [socket])

  async function getEvents() {
      let events = false
      events = await request('getEvents')
      setEvents(events)
  }

  return events
}