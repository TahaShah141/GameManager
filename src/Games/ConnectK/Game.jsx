import { useEffect, useReducer } from "react"
import { SocketProvider } from "../../components/SocketProvidor"
import { ConnectKBoard } from "./Board"
import { defaultState, gameReducer } from "./gameReducer"

export const ConnectK = () => {

  const settings = JSON.parse(sessionStorage.getItem("settings"))
  const {rows, cols, K} = settings ? settings : {}
  const [state, dispatch] = useReducer(gameReducer, defaultState(
    rows || 6,
    cols || 7,
    K || 4
  ))

  useEffect(() => {
    document.title = "ConnectK"
  }, [])


  return (
    <div className='flex flex-col h-screen w-screen bg-black items-center justify-center gap-2 text-white'>
      <SocketProvider 
      state={state} 
      dispatch={dispatch}>
        <ConnectKBoard />
      </SocketProvider>
    </div>
  )
}
