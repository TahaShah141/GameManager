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
    <div className='flex flex-col h-screen w-screen bg-black items-center justify-center gap-2 text-white'>
      <SocketProvider
      state={{turn}} 
      dispatch={dispatch}>
        <SuperTicTacToeBoard />
      </SocketProvider>
    </div>
  )
}
