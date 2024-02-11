import { useEffect } from "react"
import { SocketProvider } from "../../components/SocketProvidor"
import { SuperTicTacToeBoard } from "./Board"
import { useGameContext } from "./GameContext"

export const SuperTicTacToe = () => {
  const {turn, dispatch} = useGameContext()

  useEffect(() => {
    document.title = "Super TicTacToe"
  }, [])

  return (
    <SocketProvider
    state={{turn}} 
    dispatch={dispatch}>
      <SuperTicTacToeBoard />
    </SocketProvider>
  )
}
