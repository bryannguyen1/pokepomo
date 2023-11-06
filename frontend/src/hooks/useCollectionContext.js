import { CollectionContext } from "../context/CollectionContext"
import { useContext } from "react"

export const useCollectionContext = () => {
  const context = useContext(CollectionContext)

  if(!context) {
    throw Error('useCollectionContext must be used inside an CollectionContextProvider')
  }

  return context
}