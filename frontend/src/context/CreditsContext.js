import { createContext, useReducer } from 'react'

export const CreditsContext = createContext()

export const creditsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CREDITS':
      return { 
        credits: action.payload
      }
    default:
      return state
  }
}

export const CreditsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(creditsReducer, { 
    credits: 0
  })
  
  return (
    <CreditsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </CreditsContext.Provider>
  )
}