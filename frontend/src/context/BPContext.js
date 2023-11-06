import { createContext, useReducer } from 'react'

export const BPContext = createContext()

export const bpReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BP':
      return { 
        bp: action.payload
      }
    default:
      return state
  }
}

export const BPContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bpReducer, { 
    bp: null
  })
  
  return (
    <BPContext.Provider value={{ ...state, dispatch }}>
      { children }
    </BPContext.Provider>
  )
}