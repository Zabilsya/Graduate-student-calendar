import { useContext, useEffect, useState } from "react"
import { useRequest } from "./request.hook"
import moment from "moment";
import { ScheduleContext } from "../context/ScheduleContext";

export const useNotifications = socket => {
  const [notifications, setNotifications] = useState([])
  const request = useRequest(socket)

  useEffect(() => {
    if (socket) {
        getNotifications()
        socket.on('newNotification', message => {
            message.startDt = moment(message.startDt)
            setNotifications(notifications => ([message, ...notifications]))
          })
    }
      
    }, [socket])

  async function getNotifications() {
      let notifications = false
      notifications = await request('getNotifications')
      notifications.forEach(item => {
        item.startDt = moment(item.startDt)
      })
      setNotifications(notifications)
  }

  return notifications
}