import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Games } from "./Games"

export const Home = () => {

  useEffect(() => {
    sessionStorage.clear()
  }, [])

  return (
    <Games />
  )
}
