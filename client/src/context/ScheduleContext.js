import {createContext} from 'react'

export const ScheduleContext = createContext({
  socket: null,
  schedule: null,
})