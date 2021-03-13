import { useCallback, useContext } from 'react'
import { ScheduleContext } from '../context/ScheduleContext'

export const useRequest = () => {
    const context = useContext(ScheduleContext)
    const socket = context.socket

    const request = async (type, info = null) => {
        let answer
        socket.emit(type, info)
        await new Promise(resolve => {
            socket.on(type, response => {
                resolve(response)
            })
        })
        .then(response => {
            socket.removeAllListeners(type)
            if (typeof response !== 'string') {
                answer = response
                return
            } 
            console.log(response)
        })
        return answer
    }

    return request
}