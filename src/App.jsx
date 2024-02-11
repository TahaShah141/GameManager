import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Home } from "./components/Home"
import { Lobby } from "./components/Lobby"
import { QuaridorMenu } from "./Games/Quaridor/Menu"
import { Quaridor } from "./Games/Quaridor/Game"
import { SuperTicTacToe } from "./Games/SuperTicTacToe/Game"
import { TicTacToeContextProvider } from "./Games/SuperTicTacToe/GameContext"
import { SuperTicTacToeMenu } from "./Games/SuperTicTacToe/Menu"


export const debugMode = true
export const serverURL = debugMode ? "http://localhost:4000" : "https://quaridor.onrender.com"
export const clientURL = debugMode ? "http://localhost:5173" : "https://quaridor.netlify.app"

const RootLayout = () => {
  
  return (
    <div className='flex flex-col h-screen bg-black items-center justify-center gap-2 text-white'>
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Home />} />
      <Route path="/lobby/:game/:playerCount?" element={<Lobby />} />
      <Route path="/quaridor" element={<QuaridorMenu />}/>
      <Route path="/supertictactoe" element={<SuperTicTacToeMenu />}/>
      <Route path="/quaridor/play/:room?" element={<Quaridor />} />
      <Route path="/supertictactoe/play/:room?" element={<TicTacToeContextProvider><SuperTicTacToe /></TicTacToeContextProvider>} />
    </Route>
  )
)

function App() {

  return (
      <RouterProvider router={router} />      
  )
}

export default App
