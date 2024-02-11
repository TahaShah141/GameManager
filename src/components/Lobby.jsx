import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { v4 as ID } from "uuid"
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { clientURL, serverURL } from "../App"

export const Lobby = ({reload=0}) => {
  const {game, playerCount} = useParams()
  const [room, setRoom] = useState("")
  const [socket, setSocket] = useState()
  const [ready, setReady] = useState(false)
  const [buttonText, setButtonText] = useState("Copy Link")
  const navigate = useNavigate()

  useEffect(() => {
    if (buttonText !== "Copy Link")
    setTimeout(() => setButtonText("Copy Link"), 1000)
  }, [buttonText])

  const generateNewRoom = () => {
    const newRoom = ID() 
    setRoom(newRoom)
  }
  
  useEffect(() => {
    generateNewRoom()
    setSocket(io(serverURL))
    let interval 
    if (reload !== 0)
      interval = setInterval(generateNewRoom, 3000)
    return () => {
      if (socket) socket.disconnect()
      if (interval) clearInterval(interval)
    }

  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on("connect", () => {
      let count = +playerCount || 2
      socket.emit("makeRoom", room, count, () => setReady(true))
    })

    socket.on("joinRoom", (roomID) => {
      if (roomID !== room) return;
      
      socket.disconnect()
      setTimeout(()=>navigate(`/${game}/play/${room}`), 1000)
    })

  }, [socket])

  return (
    <div className='flex flex-col h-screen w-screen bg-black items-center justify-center gap-2 text-white'>
      <h1 className="text-3xl">Scan the QR Code:</h1>
      <div className="bg-white m-2 p-2 w-2/3 xs:w-1/2 sm:w-1/3 lg:w-1/4 aspect-square flex justify-center items-center">
        {ready ? <QRCode className="w-full h-full" value={`${clientURL}/${game}/play/${room}`} /> : <p className="text-2xl text-center text-black animate-pulse">Connecting to Server</p>}
      </div>
      {ready && <button className="text-white font-semibold bg-neutral-700 p-2 w-1/2 sm:w-1/3 lg:w-1/4 rounded-lg hover:bg-neutral-800" onClick={() => {navigator.clipboard.writeText(`${clientURL}/${game}/play/${room}`); setButtonText("Copied !!")}}>{buttonText}</button>}
    </div>
  )
}
