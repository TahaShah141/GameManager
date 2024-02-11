import { useEffect } from 'react'

const template = "1fr 6fr 1fr 6fr 1fr 6fr 1fr 6fr 1fr 6fr 1fr 6fr 1fr 6fr 1fr 6fr 1fr 6fr 1fr"

export const QuaridorBoard = ({state, dispatch, makeMove, newGame, playerNumber, collapsed}) => {

  const borderColors = [
    "border-sky-600",
    "border-rose-600",
    "border-yellow-600",
    "border-lime-600",
  ]

  const colors = [
    "border-sky-500 bg-sky-600",
    "border-rose-500 bg-rose-600",
    "border-yellow-500 bg-yellow-600",
    "border-lime-500 bg-lime-600",
  ]

  useEffect(() => {

    const {x, y} = state.hoverFence
    const fenceMode = state.fenceMode
    const pressedEnter = () => {fenceMode ? makeMove({fenceMode, x, y}) : dispatch({type: "SHOW"})}
    const keyPressed = (e) => onKeyPress(e, dispatch, pressedEnter)
    document.addEventListener('keyup', keyPressed)

    return () => document.removeEventListener('keyup', keyPressed)
  }, [state])

  return (
    <div className='flex portrait:flex-col gap-4 sm:gap-8 items-center justify-center landscape:h-4/5 portrait:w-4/5'>
      {playerNumber !== undefined && <div className={`flex w-full landscape:hidden gap-2 sm:gap-4 p-2 sm:p-4 rounded xs:rounded-lg border-2 sm:border-4 ${colors[playerNumber]}`}>
        <p className="flex justify-center w-full items-center font-mono text-sm xs:text-lg md:text-2xl font-bold">Player {playerNumber+1}</p>
      </div>}
      <div className={`grid gap-[1px] xs:gap-0.5 border-2 sm:border-4 rounded xs:rounded-lg ${borderColors[state.turn]} bg-neutral-950 landscape:h-full portrait:w-full aspect-square`}
      style={{gridTemplateColumns: template, gridTemplateRows: template}}>
        {state.blocks.map((row, y) => row.map((block, x) => <Block block={block} movePlayer={() => makeMove({fenceMode: false, x, y})}/>))}
        {state.fences.map(fence => <Fence fence={fence} />)}
        {collapsed && state.fenceMode && <Fence fence={state.hoverFence}/>}
      </div>
      <Controls state={state} dispatch={dispatch} makeMove={makeMove} newGame={newGame} playerNumber={playerNumber}/>
    </div>
  )
}

const Block = ({block, movePlayer}) => {

  const walls = "border-2 sm:border-4"

  const teamColors = [
    `border-sky-500 ${block.hasPlayer ? "bg-white" : "bg-sky-600" }`, 
    `border-rose-500 ${block.hasPlayer ? "bg-white" : "bg-rose-600" }`, 
    `border-yellow-500 ${block.hasPlayer ? "bg-white" : "bg-yellow-600" }`, 
    `border-lime-500 ${block.hasPlayer ? "bg-white" : "bg-lime-600" }`, 
  ]

  const playerColors = [
    "border-sky-500 bg-sky-600",
    "border-rose-500 bg-rose-600",
    "border-yellow-500 bg-yellow-600",
    "border-lime-500 bg-lime-600",
  ]

  const colors = block.active ? teamColors[block.team] : "bg-white border-neutral-400"

  return (
    <div className={`${walls} ${colors} rounded-sm xs:rounded hover:bg-white flex justify-center items-center`} 
    style={{gridColumn: 2*(block.x+1), gridRow: 2*(block.y+1)}}
    onClick={() => {if (block.active && !block.hasPlayer) movePlayer()}}>
      {block.hasPlayer && 
      <div className={`${playerColors[block.team]}
       w-4/5 aspect-square rounded-sm sm:rounded border-2 sm:border-4`}></div>}
    </div>
  )
}

const Fence = ({fence}) => {

  const orientation = (fence.y % 2)

  const fenceColors = [
    "border-sky-500 bg-sky-600",
    "border-rose-500 bg-rose-600",
    "border-yellow-500 bg-yellow-600",
    "border-lime-500 bg-lime-600",
  ]

  const color = `${fence.team === -1 ? "bg-white border-neutral-400" : fenceColors[fence.team]}`

  return (
    <div className={`border sm:border-2 ${color} xs:rounded-sm`} style={{
      gridColumn: orientation === 0 ? `${fence.x+1}/span 3` : `${fence.x+1}/span 1`,
      gridRow: orientation === 1 ? `${fence.y+1}/span 3` : `${fence.y+1}/span 1`
    }}>
    </div>
  )
}

const Controls = ({state, dispatch, makeMove, newGame, playerNumber}) => {

  const colors = [
    "border-sky-500 bg-sky-600",
    "border-rose-500 bg-rose-600",
    "border-yellow-500 bg-yellow-600",
    "border-lime-500 bg-lime-600",
  ]

  const borderColors = [
    "border-sky-600",
    "border-rose-600",
    "border-yellow-600",
    "border-lime-600",
  ]

  const buttonStyle = "flex justify-center items-center bg-neutral-200 border-2 sm:border-4 border-neutral-400 rounded-md"

  return (
    <div className={`flex flex-col portrait:flex-col order-2 justify-between gap-2 sm:gap-4 landscape:h-full portrait:w-full`}>
      {playerNumber !== undefined && <div className={`flex landscape:order-1 landscape:flex-col portrait:hidden gap-2 sm:gap-4 p-2 sm:p-4 rounded xs:rounded-lg border-2 sm:border-4 ${colors[playerNumber]}`}>
        <p className="flex justify-center w-full items-center font-mono text-sm xs:text-lg md:text-2xl font-bold">Player {playerNumber+1}</p>
      </div>}
      <div className={`flex landscape:order-1 landscape:flex-col gap-2 sm:gap-4 bg-neutral-900 p-2 sm:p-4 rounded xs:rounded-lg border-2 sm:border-4 ${borderColors[state.turn]}`}>
        {(playerNumber === undefined || state.players.length === 2) && <h1 className="text-2xl portrait:hidden hidden xl:block font-mono text-center">Fences</h1>}
        {state.players.map(player => 
        <div className="flex flex-1 gap-2 justify-center items-center">
          <div className={`flex justify-center items-center flex-1 rounded-sm sm:rounded-md md:rounded-lg border-2 sm:border-4 ${colors[player.team]}`}>
            <p className="flex justify-center items-center font-mono text-sm xs:text-lg font-bold">{player.fenceCount}</p>
          </div>
        </div>)}
      </div>
      {state.winners.length + 1 === state.players.length && <button onClick={newGame} 
      className='text-white landscape:order-2 font-mono tracking-widest text-sm xs:text-lg sm:text-xl p-1 px-2 xs:p-2 xs:px-4 bg-neutral-900 border-neutral-800 border-2 rounded-md'>New Game</button>}
      <div className={`flex landscape:order-3 landscape:flex-col-reverse justify-between items-center gap-2 xs:gap-4 bg-neutral-900 p-2 sm:p-4 rounded xs:rounded-lg border-2 sm:border-4 ${borderColors[state.turn]}`}>
        <div className="flex flex-1 portrait:h-full landscape:w-full portrait:flex-col-reverse flex-col gap-2 sm:gap-4">
          <div className="flex flex-1 portrait:flex-row-reverse gap-2 font-mono text-black text-sm xs:text-lg">
            <div tabIndex={-1} onClick={(e) => {e.preventDefault(); dispatch({type: "FLIP"})}} className={`${buttonStyle} flex-1 landscape:p-2 sm:tracking-widest`}>Rotate</div>
            <div tabIndex={-1} onClick={(e) => {e.preventDefault(); makeMove({fenceMode: true, x: state.hoverFence.x, y: state.hoverFence.y})}} className={`${buttonStyle} flex-1 landscape:p-2 sm:tracking-widest`}>Place</div>
          </div>
          <div tabIndex={-1} onClick={(e) => {e.preventDefault(); dispatch({type: "SHOW"})}} 
          className="bg-neutral-800 rounded-lg overflow-hidden flex flex-1 font-mono text-sm xs:text-lg border-2 border-neutral-700">
            <div className={`flex h-full landscape:p-2 justify-center items-center flex-1 ${state.fenceMode ? "bg-transparent" : colors[state.turn]}`}>Move</div>
            <div className={`flex h-full landscape:p-2 justify-center items-center flex-1 ${state.fenceMode ? colors[state.turn] : "bg-transparent"}`}>Fence</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex flex-1 justify-center items-center">
            <div tabIndex={-1} onClick={(e) => {e.preventDefault(); dispatch({type: "UP"})}} className={`${buttonStyle} text-neutral-700 sm:w-16 min-[500px]:w-12 xs:w-10 w-8 aspect-square`}>
              <svg className="h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-up-thin</title><path d="M7.03 9.97H11.03V18.89L13.04 18.92V9.97H17.03L12.03 4.97Z" fill="currentColor" /></svg>
            </div>
          </div>
          <div className="flex flex-1 gap-2 justify-center items-center">
            <div tabIndex={-1} onClick={(e) => {e.preventDefault(); dispatch({type: "LEFT"})}} className={`${buttonStyle} text-neutral-700 sm:w-16 min-[500px]:w-12 xs:w-10 w-8 aspect-square`}>
              <svg className="h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left-thin</title><path d="M10.05 16.94V12.94H18.97L19 10.93H10.05V6.94L5.05 11.94Z" fill="currentColor" /></svg>
            </div>
            <div tabIndex={-1} onClick={(e) => {e.preventDefault(); dispatch({type: "DOWN"})}} className={`${buttonStyle} text-neutral-700 sm:w-16 min-[500px]:w-12 xs:w-10 w-8 aspect-square`}>
              <svg className="h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-down-thin</title><path d="M7.03 13.92H11.03V5L13.04 4.97V13.92H17.03L12.03 18.92Z" fill="currentColor" /></svg>
            </div>
              <div tabIndex={-1} onClick={(e) => {e.preventDefault(); dispatch({type: "RIGHT"})}} className={`${buttonStyle} text-neutral-700 sm:w-16 min-[500px]:w-12 xs:w-10 w-8 aspect-square`}>
            <svg className="h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-right-thin</title><path d="M14 16.94V12.94H5.08L5.05 10.93H14V6.94L19 11.94Z" fill="currentColor" /></svg>
            </div>
          </div>
        </div>
        {(playerNumber === undefined || state.players.length === 2) && <h1 className="text-2xl portrait:hidden hidden xl:block font-mono text-center">Controls</h1>}
      </div>
    </div>
  )
}


const onKeyPress = (e, dispatch, pressedEnter) => {
  switch (e.key) {
    case 'f':
      dispatch({type: 'SHOW'})
      break;
    case 'd':
    case 'ArrowRight':
      dispatch({type: 'RIGHT'})
      break;
      
    case 'a':
    case 'ArrowLeft':
      dispatch({type: 'LEFT'})
      break;
    
    case 'w':
    case 'ArrowUp':
      dispatch({type: 'UP'})
      break;
    
    case 's':
    case 'ArrowDown':
      dispatch({type: 'DOWN'})
      break;
      
    case 'Control': 
    case ' ':
      dispatch({type: 'FLIP'})
      break;

    case 'Shift':
    case 'Enter':
      pressedEnter()
      break;
    default:
      console.log(e.key)
  }
}
