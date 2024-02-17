import { useEffect, useState } from "react"

const getSize = (rows, cols) => {
  const Width = window.innerWidth*0.8
  const Height = window.innerHeight*0.8

  const w = Width/cols
  const h = Height/rows

  return Math.min(w, h)
}

export const ConnectKBoard = ({state, makeMove, newGame, playerNumber, collapsed}) => {

  console.log(state)
  const {board, rows, cols, winner} = state
  const [size, setSize] = useState(getSize(rows, cols))

  useEffect(() => {
    const resize = () => setSize(getSize(rows, cols))
    resize()
    window.addEventListener("resize", resize)

    return () => window.removeEventListener("resize", resize)
  }, [rows, cols])

  return (
    <>
    <div className={`flex portrait:flex-col gap-4 sm:gap-8 items-center justify-center landscape:h-4/5 portrait:w-4/5`} >
      <div className={`flex flex-col rounded-xl overflow-hidden p-4 border-4 bg-neutral-900
      ${playerNumber !== undefined ? playerNumber === 0 ? "border-sky-500" : "border-rose-500" : "border-black"}`}>
        {board.map((row, r) => 
        <div className="flex">
          {row.map((col, c) => <Cell size={size} value={col} makeMove={() => makeMove({col: c})}/>)}
        </div>)}    
      </div>
    </div>
    {winner !== -1 && <button className='text-white mt-4 text-2xl p-4 bg-neutral-700 font-mono font-semibold rounded-xl border-4 border-black' onClick={newGame}>New Game</button>}
    </>
  )
}

const Cell = ({size, value, makeMove}) => {

  const colors = [
    "border-neutral-800 bg-neutral-950",
    "border-sky-500 bg-sky-600",
    "border-rose-500 bg-rose-600",
    "border-neutral-200 bg-neutral-300",
  ]

  return (
  <div className="p-1 lg:p-2" style={{width: `${size}px`, height: `${size}px`}}>
    <div onClick={makeMove} className={`w-full h-full ${colors[value+1]} rounded-full border-4 md:border-8`}>

    </div>
  </div>
  )
}