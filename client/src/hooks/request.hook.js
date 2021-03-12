import { useCallback, useContext } from 'react'
import { io } from 'socket.io-client'
import { ScheduleContext } from '../context/ScheduleContext'

export const useRequest = () => {
    const schedule = useContext(ScheduleContext)
    let socket = schedule.socket

    const request = (type, info = null) => {
        return new Promise((resolve, reject) => {
            socket.emit(type, info)

        function responseHandler(message) {
            resolve(message)
            socket.removeListener(type, responseHandler)
        }

        socket.once(type, responseHandler);
        }) 
    }

    return request
}