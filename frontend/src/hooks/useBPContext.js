import { BPContext } from "../context/BPContext"
import { useContext } from "react"

export const useBPContext = () => {
  const context = useContext(BPContext)

  if(!context) {
    throw Error('useBPContext must be used inside an BPContextProvider')
  }

  return context
}