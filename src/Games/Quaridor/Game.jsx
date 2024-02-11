import { useEffect, useReducer } from "react"
import { SocketProvider } from "../../components/SocketProvidor"
import { defaultState, gameReducer } from "./gameReducer"
import { QuaridorBoard } from "./Board"

export const Quaridor = () => {

  useEffect(() => {
    document.title = "Quaridor"
  }, [])

  const sessionPlayerCount = sessionStorage.getItem("playerCount")
  const [state, dispatch] = useReducer(gameReducer, defaultState(+sessionPlayerCount ? +sessionPlayerCount : 2))

  const onCollapseChange = (collapsed) =>{
    if (collapsed && state.fenceMode) dispatch({type: "SHOW"})
  }

  return (
    <div className='flex flex-col h-screen w-screen bg-black items-center justify-center gap-2 text-white'>
      <SocketProvider 
      state={state} 
      dispatch={dispatch} 
      onCollapseChange={onCollapseChange}>
        <QuaridorBoard />
      </SocketProvider>
    </div>
  )
}
