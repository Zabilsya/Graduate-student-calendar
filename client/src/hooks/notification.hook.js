import { useContext, useEffect, useState } from "react"
import { useRequest } from "./request.hook"
import moment from "moment";
import { ScheduleContext } from "../context/ScheduleContext";
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure()

export const useNotifications = (socket, userId) => {
  const [notifications, setNotifications] = useState([])
  const request = useRequest(socket)
  
  const viewNotification = async item => {
    await request('viewNotification', item)
  }

  useEffect(() => {
    if (socket) {
        getNotifications()
        socket.on('newNotification', message => {
            message.createDt = moment(message.createDt)
            message.type = createNotificationMessage(message)
            setNotifications(notifications => ([message, ...notifications]))
            toast(`${message.type}: ${message.eventName}`, {
              position: toast.POSITION.TOP_LEFT
          })
        })
        socket.on('viewNotification', message => {
          message.createDt = moment(message.createDt)
          message.type = createNotificationMessage(message)
          setNotifications(notifications => {
            const index = notifications.findIndex(item => item._id === notifications._id)
            const before = notifications.slice(0, index);
            const after = notifications.slice(index + 1);
            const newList = [...before, notifications, ...after];
            return newList
          })
        })
    }
      
    }, [socket])

  async function getNotifications() {
      let notifications = false
      notifications = await request('getNotifications')
      notifications.forEach(item => {
        item.createDt = moment(item.createDt)
        item.type = createNotificationMessage(item)
        // if (!item.viewers.contains(userId)) {
        //   toast(`${item.type}: ${item.eventName}`, {
        //     position: toast.POSITION.TOP_LEFT
        // })
        // }
      })
      setNotifications(notifications)
  }

  function createNotificationMessage(item) {
    let message
      switch (item.type) {
        case 'insert':
          message = 'Добавлено новое событие'
        break
        case 'update':
          message = 'Изменена информация о событии'
          break
        case 'delete':
          message = 'Было удалено событие'
          break
        default:
          message = `Напоминание. Осталось ${item.daysLeft} дней до начала события`
      }
      return message
  }

  return {notifications, viewNotification}
}