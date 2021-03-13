import { useCallback, useContext } from 'react'
import { ScheduleContext } from '../context/ScheduleContext'

export const useRequest = () => {
    const context = useContext(ScheduleContext)
    const socket = context.socket

    const request = async (type, info = null) => {
        socket.emit(type, info)
        await new Promise(resolve => {
            // console.log('дождались')
            socket.on(type, response => {
                resolve(response)
            })
        })
        .then(response => {
            socket.removeAllListeners(type)
            if (typeof response !== String) return response
            console.log(response)
        })
    }

    return request
}