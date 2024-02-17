import { Outlet, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import { Home } from "./components/Home"
import { Lobby } from "./components/Lobby"
import { QuaridorMenu } from "./Games/Quaridor/Menu"
import { Quaridor } from "./Games/Quaridor/Game"
import { SuperTicTacToe } from "./Games/SuperTicTacToe/Game"
import { TicTacToeContextProvider } from "./Games/SuperTicTacToe/GameContext"
import { SuperTicTacToeMenu } from "./Games/SuperTicTacToe/Menu"
import { ConnectKMenu } from "./Games/ConnectK/Menu"
import { ConnectK } from "./Games/ConnectK/Game"


export const debugMode = false
export const serverURL = debugMode ? "http://localhost:4000" : "https://games-backend-8gxe.onrender.com"
export const clientURL = debugMode ? "http://localhost:5173" : "https://games-tahashah.netlify.app"

const RootLayout = () => {
  
  return (
    <Outlet />
  )
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Home />} />
      <Route path="/lobby/:game" element={<Lobby />} />
      <Route path="/quaridor" element={<QuaridorMenu />}/>
      <Route path="/supertictactoe" element={<SuperTicTacToeMenu />}/>
      <Route path="/connectk" element={<ConnectKMenu />}/>
      <Route path="/quaridor/play/:room?" element={<Quaridor />} />
      <Route path="/connectk/play/:room?" element={<ConnectK />} />
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
