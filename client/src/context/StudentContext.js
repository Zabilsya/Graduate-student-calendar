import {createContext} from 'react'

function noop() {}

export const StudentContext = createContext({
  students: null,
  chosenStudent: null,
  setChosenStudent: noop
})