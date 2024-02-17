import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { debugMode, serverURL } from "../App"
import { io } from "socket.io-client"

export const SocketProvider = ({state={}, dispatch, chat=true, children, onCollapseChange=()=>{}}) => {

  //get room from URL
  const { room } = useParams()
  const navigate = useNavigate()
  //if chat collapsed
  const [collapsed, setCollapsed] = useState(true)
  const [socket, setSocket] = useState()

  //get player count incase of reload
  const sessionPlayerCount = sessionStorage.getItem("playerCount")
  const [playerCount, setPlayerCount] = useState(+sessionPlayerCount ? +sessionPlayerCount : undefined)

  //get player number incase of reload
  const sessionPlayerNumber = sessionStorage.getItem("playerNumber")
  const [playerNumber, setPlayerNumber] = useState(sessionPlayerNumber !== null && room ? +sessionPlayerNumber : undefined)

  //if moves not allowed
  const [locked, setLocked] = useState(false)
  const [error, setError] = useState("")

  //chat messages
  const [messages, setMessages] = useState([])

  //generic function that dispatches moves on both side
  const makeMove = useCallback((payload) => {
      if (locked || !collapsed) return;
      if (socket) socket.emit("moveMade", room, payload)
      dispatch({type: "MOVE", payload})
    }, [room, socket, locked, collapsed])

  const syncMoves = (moveStack, playerCount) => {
    dispatch({type: "RESET", payload: {playerCount}})
    for (let i = 0; i < moveStack.length; i++) 
      dispatch({type: "MOVE", payload: moveStack[i]})
  }

  useEffect(() => {
    sessionStorage.setItem("playerCount", playerCount)
  }, [playerCount])

  //generic function that resets game state when playerCount changes
  const newGame = useCallback(() => {
    if (socket) socket.emit("newGame", room, playerCount)
    dispatch({type: "RESET", payload: {playerCount}})
  }, [socket, playerCount])

  //runs when chat shown/hidden
  useEffect(() => {
    onCollapseChange(collapsed)
  }, [collapsed])

  //saves playerNumber
  useEffect(() => {
    if (playerNumber !== undefined) sessionStorage.setItem("playerNumber", playerNumber)
  }, [playerNumber])
  
  //connects to socket if room present
  useEffect(() => {
    if (!room) setSocket(undefined)
    else setSocket(io(serverURL))
  }, [room])

  //binds basic events to socket
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      socket.emit("joinRoom", room, (size, playerCount) => {
        if (size <= playerCount) {
          setPlayerCount(playerCount)
          setPlayerNumber(p => p === undefined ? size - 1 : p)
          socket.emit("connected", room)
          socket.emit("sync", room, syncMoves)
        }
        else {
          setError("Room Full...Redirecting")
          setLocked(true)
          socket.emit("leaveRoom", room)
          setTimeout(() => navigate("/"), 3000)
        }
      })
    })

    socket.on("disconnect", () => {
      setLocked(true)
      setError("Reconnecting...")
    })

    socket.on("disconnected", (currentSize, playerLimit) => {
      if (currentSize === playerLimit) {
        setLocked(false)
        setError("")
      } else {
        setLocked(true)
        setError("Opponent Connecting...")
      } 
    })

    socket.on("connected", (currentSize, playerLimit) => {
      if (currentSize === playerLimit) {
        setLocked(false)
        setError("")
      } else {
        setLocked(true)
        setError("Opponent Connecting...")
      }
    })

    socket.on("moveMade", (payload) => {      
      dispatch({type: "MOVE", payload})
    })

    socket.on("newGame", (payload) => {
      dispatch({type: "RESET", payload})
    })

    return () => {
      socket.emit("leaveRoom", room)
      socket.disconnect()
    }
  }, [socket])

  const ChildrenWithProps = React.Children.map(children, (child) => 
  React.cloneElement(child, {
    state,
    dispatch,
    newGame,
    playerNumber,
    collapsed,
    makeMove: (payload) => {
      if (playerNumber === undefined || playerNumber === state.turn)
      makeMove(payload)
    }
  }))

  return (
    <>
      {((room && playerNumber !== undefined) || !room) ? 
      <>{ChildrenWithProps}</> : 
      <>{!locked && <p className='text-white font-mono text-xl sm:text-3xl animate-pulse'>Connecting</p>}</>}
      {error && <p className='text-white text-lg sm:text-3xl font-bold font-mono animate-pulse'>{error}</p>}
      {chat && !locked && room && <Chat socket={socket} room={room} collapsed={collapsed} setCollapsed={setCollapsed} messages={messages} setMessages={setMessages}/>}
      {debugMode && room && socket && 
      <button className="bg-white text-black text-xl p-2 rounded-md" 
      onClick={() => {socket.connected ? socket.disconnect() : socket.connect()}}>
        {socket.connected ? "Disconnect" : "Reconnect"}  
      </button>}
    </>
  )
}

const Message = ({message}) => {

  return (
    <div className={`w-full flex ${message.isNative ? "justify-end" : "justify-start"}`}>
      <p onClick={e => {e.preventDefault(); e.stopPropagation();}} className={`text-white whitespace-normal truncate max-w-[80%] rounded-lg text-sm sm:text-xl font-mono p-1 px-2 sm:p-2 sm:px-4 ${message.isNative ? "bg-neutral-800" : "bg-neutral-900"}`}>{message.text}</p>
    </div>
  )
}

const Chat = ({socket, room, collapsed, setCollapsed, messages, setMessages}) => {

  const [message, setMessage] = useState("")
  const [messageCount, setMessageCount] = useState(0)

  const newMessage = (text, isNative) => {
    setMessages(m => [{text, isNative}, ...m])
  }

  useEffect(() => {
    if (messages.length === 0) return;
    if (collapsed) setMessageCount(c => c+1)
  }, [messages])

  useEffect(() => {
    if (!socket) return;
    const addNewMessage = (message) => {
      newMessage(message, false)
    }
    socket.on("message", addNewMessage)

    return () => socket.off("message", addNewMessage)
  }, [socket])

  const sendMessage = () => {
    if (message.length === 0) return;
    if (!socket) return;
    socket.emit("message", room, message, () => {
      newMessage(message, true)
    })
    setMessage("")
  }

  return (
    <>
    {!collapsed && <div className="absolute flex items-center sm:p-4 h-screen w-full flex-col gap-2" onClick={() => setCollapsed(true)}>
      <div className="relative flex flex-col h-full gap-4 w-full md:w-4/5 lg:w-2/3 xl:w-1/2 bg-black/90 sm:rounded-2xl p-4">
        <div className="flex-1 flex flex-col-reverse gap-1 overflow-y-scroll">
          {messages.map(m => <Message message={m} />)}
        </div>
        <div onClick={e => {e.preventDefault(); e.stopPropagation();}} className="flex gap-2">
          <input 
          autoFocus
          onKeyDown={(e) => {if (e.key === "Enter") sendMessage()}} 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          type="text" 
          className="flex-1 rounded-xl p-2 focus:outline-none text-black" 
          placeholder="Message..."/>
          <button className="p-1 px-2 sm:px-4 sm:p-2 text-white font-semibold font-mono tracking-wider rounded-lg bg-red-700" onClick={sendMessage}>Send</button>
        </div>        
      </div>  
    </div>}
    {collapsed &&
    <div className="absolute right-0 flex flex-col justify-center items-center h-full">
      <button className={`relative text-xs sm:text-lg font-mono font-semibold text-white py-4 border-black bg-neutral-800 rounded-l-xl border-2 border-r-0`} onClick={() => {setCollapsed(false); setMessageCount(0)}}>
        <p className="upright">CHAT</p>
        {messageCount > 0 && <p className="absolute flex items-center justify-center top-0 left-0 rounded-full aspect-square -translate-x-1/2 -translate-y-1/2 w-6 text-xs bg-red-700">{messageCount >= 9 ? "9+" : messageCount}</p>}
      </button>
    </div>}
    </>
  )
}

