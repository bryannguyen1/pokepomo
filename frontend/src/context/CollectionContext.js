import { createContext, useReducer } from 'react'

export const CollectionContext = createContext()

export const collectionReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COLLECTION':
      return { 
        collection: action.payload
      }
    default:
      return state
  }
}

export const CollectionContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(collectionReducer, { 
    collection: []
  })
  
  return (
    <CollectionContext.Provider value={{ ...state, dispatch }}>
      { children }
    </CollectionContext.Provider>
  )
}