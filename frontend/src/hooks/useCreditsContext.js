import { CreditsContext } from "../context/CreditsContext"
import { useContext } from "react"

export const useCreditsContext = () => {
  const context = useContext(CreditsContext)

  if(!context) {
    throw Error('useCreditsContext must be used inside an CreditsContextProvider')
  }

  return context
}