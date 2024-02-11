import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const QuaridorMenu = () => {
  const [playerCount, setPlayerCount] = useState(2)

  useEffect(()=> {
    sessionStorage.setItem("playerCount", playerCount)
  }, [playerCount])

  return (
    <div className='flex portrait:w-4/5 landscape:w-2/3 lg:landscape:w-1/3 flex-col gap-2 sm:gap-4'>
      <div className='flex flex-col gap-2 sm:gap-4'>
        <h1 className='text-3xl xs:text-6xl font-mono font-bold'>Quaridor</h1>
        <h2 className='text-lg xs:text-2xl font-semibold'>By Taha Shah</h2>
      </div>
      <div className='flex gap-4 justify-center items-center'>
        <button tabIndex={-1} onClick={() => setPlayerCount(p => p === 2 ? 4 : 2)} 
          className="bg-neutral-800 rounded-lg overflow-hidden flex flex-1 font-mono text-lg xs:text-2xl font-semibold border-2 border-neutral-700">
          <div className={`flex h-full p-1 landscape:p-2 justify-center items-center flex-1 ${playerCount === 2 ? "bg-white text-black" : "bg-neutral-800 text-white"}`}>2 Players</div>
          <div className={`flex h-full p-1 landscape:p-2 justify-center items-center flex-1 ${playerCount === 4 ? "bg-white text-black" : "bg-neutral-800 text-white"}`}>4 Players</div>
        </button>
      </div>
      <div className='flex gap-2 sm:gap-4 w-full'>
        <Link to={`/lobby/quaridor/${playerCount}`} className='flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-red-500 hover:bg-red-600'>Online</Link>
        <Link to={"play"} className='flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-blue-500 hover:bg-blue-600'>Offline</Link>
      </div>
    </div>
  )
}
