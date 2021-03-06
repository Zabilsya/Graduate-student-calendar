import { useContext } from 'react'
import { ScheduleContext } from '../context/ScheduleContext'


export const useRequest = (transmittedSocket = null) => {
    let {socket} = useContext(ScheduleContext)
    if (!socket) socket = transmittedSocket

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
            window.M.toast({html: response, classes: "message", displayLength: 2000})
        })
        return answer
    }

    return request
}