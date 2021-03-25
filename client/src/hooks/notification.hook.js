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
  
  const viewNotification = item => {
    if (!item.viewers.includes(userId))
    socket.emit('viewNotification', item)
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
            const index = notifications.findIndex(item => item._id === message._id)
            const before = notifications.slice(0, index);
            const after = notifications.slice(index + 1);
            const newList = [...before, message, ...after];
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
        item = createNotificationMessage(item)
        if (!item.viewers.includes(userId)) {
          toast(`${item.type}: ${item.eventName}`, {
            position: toast.POSITION.TOP_LEFT
        })
        }
      })
      setNotifications(notifications)
  }

  function createNotificationMessage(item) {
      switch (item.type) {
        case 'insert':
          item.type = 'Добавлено новое событие'
        break
        case 'update':
          item.type = 'Изменена информация о событии'
          break
        case 'delete':
          item.type = 'Было удалено событие'
          break
        default:
          item.type = 'Напоминание о событии'
          if (item.daysLeft)
            item.message = `Дней до начала события: ${item.daysLeft}`
          else
            item.message = `Остался 1 час до начала события!`
      }
      return item
  }

  return {notifications, viewNotification}
}