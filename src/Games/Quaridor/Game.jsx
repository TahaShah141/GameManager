import { useReducer } from "react"
import { SocketProvider } from "../../components/SocketProvidor"
import { defaultState, gameReducer } from "./gameReducer"
import { QuaridorBoard } from "./Board"

export const Quaridor = () => {

  const sessionPlayerCount = sessionStorage.getItem("playerCount")
  const [state, dispatch] = useReducer(gameReducer, defaultState(+sessionPlayerCount ? +sessionPlayerCount : 2))

  const onCollapseChange = (collapsed) =>{
    if (collapsed && state.fenceMode) dispatch({type: "SHOW"})
  }

  return (
    <SocketProvider 
    state={state} 
    dispatch={dispatch} 
    onCollapseChange={onCollapseChange}>
      <QuaridorBoard />
    </SocketProvider>
  )
}
