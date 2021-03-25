import React, { useEffect, useState, useContext } from "react"
import { ScheduleContext } from './../context/ScheduleContext'
import { useRequest } from "./request.hook"

export const useStudents = socket => {
  const [students, setStudents] = useState([])
  const [chosenStudent, setChosenStudent] = useState(false)
  const request = useRequest(socket)

  useEffect(() => {
    if (socket) {
      getStudents()
      socket.on('newUser', message => {
        setStudents(students => ([...students, message]))
        setChosenStudent(message)
      })

      socket.on('deletedUser', message => {
        setStudents(students => {
          const newArr = [...students.filter(item => item._id !== message)]
          setChosenStudent(newArr[0])
          return newArr
        })
      })

      socket.on('updatedUser', message => {
        setStudents(students => {
          const index = students.findIndex(item => item._id === message._id)
          const before = students.slice(0, index);
          const after = students.slice(index + 1);
          const newList = [...before, message, ...after];
          if (message._id != '604fb74012c7d21c984aed35')
          setChosenStudent(message)
          return newList
        })
      })
    }

  }, [socket])

  async function getStudents() {
    let users = false
    users = await request('getUsers')
    setStudents(users)
    setChosenStudent(users[0])
  }

  return { students, chosenStudent, setChosenStudent }
}