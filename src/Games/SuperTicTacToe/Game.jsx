import { useEffect } from "react"
import { SocketProvider } from "../../components/SocketProvidor"
import { SuperTicTacToeBoard } from "./Board"
import { useGameContext } from "./GameContext"

export const SuperTicTacToe = () => {
  const {turn, winner, dispatch} = useGameContext()

  useEffect(() => {
    document.title = "Super TicTacToe"
  }, [])

  return (
    <div className={`flex flex-col h-screen w-screen ${winner === 0 ? "bg-blue-500" : winner === 1 ? "bg-red-500" : "bg-neutral-900"} items-center justify-center gap-2 text-white`}>
      <SocketProvider
      state={{turn}} 
      dispatch={dispatch}>
        <SuperTicTacToeBoard />
      </SocketProvider>
    </div>
  )
}
