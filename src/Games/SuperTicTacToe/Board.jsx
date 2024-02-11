import React from 'react'
import { useGameContext } from './GameContext'


export const SuperTicTacToeBoard = ({makeMove, playerNumber}) => {

  const { boards, winner, actives } = useGameContext()

  return (
    <>
      <div className={`w-max grid grid-cols-3 gap-2 sm:gap-3 p-2 rounded-xl ${playerNumber === 0 ? "border-2 border-blue-400" : playerNumber === 1 ? "border-2 border-red-500" : ""}`}>

      {boards.map((row, y) =>
      <>
        {row.map((col, x) => <Board key={`board${y*3+x}`} board={3*y+x} active={actives[y][x]} makeMove={makeMove}/>)}
      </>)}
      </div>
      {winner !== -1 && <button className='text-white text-2xl p-4 bg-neutral-700 font-mono font-semibold rounded-xl border-4 border-black' onClick={() => {dispatch({type: "RESET"}); if (socket) socket.emit("newGame", room)}}>New Game</button>}
    </>
  )
}

const Board = ({board, active=false, makeMove}) => {
  const { superBoard, boards, turn, lastMove } = useGameContext()

  return (
    <>
    {<div className={`grid grid-cols-3 w-max sm:border-4 xs:gap-2 p-2 xs:p-3 gap-1 border-2 sm:rounded-xl xs:border-1 rounded-lg border-black */}
    ${boards[Math.floor(board/3)][board %3] === 0 ? "bg-blue-600" : boards[Math.floor(board/3)][board %3] === 1 ? "bg-red-900" : active ? turn === 0 ? "bg-blue-400" : "bg-red-500" : "bg-neutral-900"}`}>
      {superBoard[board].map((row, y) =>
      <>
        {row.map((col, x) => <Cell key={`board${board}-Cell${y*3+x}`} makeMove={() => makeMove({board, x, y})} val={superBoard[board][y][x]} won={boards[Math.floor(board/3)][board %3]} last={lastMove.board === board && lastMove.x === x && lastMove.y === y}/>)}
      </>)}
    </div>}
    </>
  )
}


const Cell = ({makeMove, val, won=-1, last}) => {
  
  return (
    <> 
    {won === -1 ? 
    <div className={`w-6 h-6 rounded xs:w-8 xs:h-8 sm:w-12 sm:h-12 sm:rounded-lg xs:rounded-md flex justify-center items-center border-2 xs:border-4 border-neutral-950
    ${last ? "border-white" : "border-neutral-950"}
    ${val === 0 ? last ? "bg-blue-400" : "bg-blue-500" : val === 1 ? last ? "bg-red-400" : "bg-red-600" : "bg-neutral-950"}
    ${val === 0 ? "hover:bg-blue-400" : val === 1 ? "hover:bg-red-500" : "hover:bg-neutral-100"}`}
    onClick={makeMove}>
    </div> :
    <div className={`w-6 h-6 rounded xs:w-8 xs:h-8 sm:w-12 sm:h-12 sm:rounded-lg xs:rounded-md flex justify-center items-center
    ${won === 0 ? "bg-blue-500" : "bg-red-600"}`}>
    </div>
    }
    </>
  )
}


