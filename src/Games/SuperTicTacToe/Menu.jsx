import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const SuperTicTacToeMenu = () => {

  useEffect(() => {
    document.title = "Super TicTacToe"
  }, [])

  return (
    <div className='flex flex-col h-screen w-screen bg-black items-center justify-center gap-2 text-white'>
      <div className='flex portrait:w-4/5 landscape:w-2/3 lg:landscape:w-1/3 flex-col gap-2 sm:gap-4'>
        <div className='flex flex-col gap-2 sm:gap-4'>
          <h1 className='text-3xl xs:text-6xl font-mono font-bold'>Super TicTacToe</h1>
          <h2 className='text-lg xs:text-2xl font-semibold'>By Taha Shah</h2>
        </div>
        <div className='flex gap-2 sm:gap-4 w-full'>
          <Link to={`/lobby/supertictactoe`} className='flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-red-500 hover:bg-red-600'>Online</Link>
          <Link to={"play"} className='flex justify-center items-center flex-1 p-2 text-xl sm:p-4 xs:text-3xl font-bold border-4 rounded-xl border-black bg-blue-500 hover:bg-blue-600'>Offline</Link>
        </div>
      </div>
    </div>
  )
}
