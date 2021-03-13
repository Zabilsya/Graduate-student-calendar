import React, { useEffect, useState, useContext } from "react"
import { ScheduleContext } from './../context/ScheduleContext'
import { useRequest } from "./request.hook"

export const useStudents = () => {
  const request = useRequest()
  const context = useContext(ScheduleContext)
  const socket = context.socket
  const [students, setStudents] = useState(getStudents())

  useEffect(() => {
    if (socket) {

      socket.on('mes', message => {
          setStudents(message)
      })
    }

  }, [socket])

  async function getStudents() {
      let users = false
      users = await request('getUsers')
     return users
  }

  return students
}