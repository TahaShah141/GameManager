import { useEffect } from "react"
import { Link } from "react-router-dom"

export const Home = () => {
  useEffect(() => {
    sessionStorage.clear()
    document.title = "Games by Taha Shah"
  }, [])

  const games = [
    {
      name: "Super TicTacToe",
      link: "/supertictactoe",
      desc: "Imagine Tic Tac Toe, but better. This game plays by the normal rules of tictactoe, but on a bigger board. Players take turn to place their tiles on the highlighted boards, but there is a twist...The next player plays on the corresponding board of your turn. Win Boards to claim them and win the super board !!"
    },
    {
      name: "Quaridor",
      link: "/quaridor",
      desc: "Quaridor is a game of strategy and patience. The goal is to get your player to the other side of the board. You can either move your piece or place a fence to block the way. Each player has limited number of fences and once placed, they can't be picked up again. First one to make it to the other side wins"
    },
    {
      name: "Poke-memo",
      link: "https://poke-memo141.netlify.app",
      desc: "Poke-memo was my first project using the React. It is a memory-based game about pokemon you have already selected before. If you 'Catch-em-all!!', you win the game. It is a basic demo of how React can make repetitive components easy with the integration of javascript and html in one place"
    },
    {
      name: "Battle Ship",
      link: "https://battleship141.netlify.app",
      desc: "Battleship was my first project using DOM-manipulation and vanilla CSS. It is a game where two players try to sink each other's ships by hitting a grid/board. A hit grants you another turn while a miss switches to the other player. Be the first to sink all the ships to win."
    },
  ] 
  return (
    <div className="flex w-full flex-col gap-2" >
      <h2 className="text-white text-3xl font-bold border-b-2 border-white w-max mx-auto p-2">Games by Taha Shah</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 md:px-12 xs:p-6">
        {games.map(game => <GameCard game={game} key={game.name} />)}
      </div>
    </div>
  )
}

const GameCard = ({game}) => {

  
  return (
    <Link to={game.link} className="relative h-72 w-full overflow-y-hidden rounded-xl glow-white border-4 border-black group">
      <div className="h-full w-full flex items-center justify-center bg-[#0c0c0c] peer">
        <p className='text-white font-serif text-4xl group-hover:opacity-30 duration-500'>{game.name}</p>
      </div>
      <div className="absolute bottom-0 w-full h-1/2 translate-y-full bg-black bg-opacity-30 peer-hover:translate-y-0 hover:translate-y-0 text-neutral-50 peer-hover:opacity-100 hover:opacity-100 duration-500">
        <p className="p-4">
          {game.desc}
        </p>
      </div>
    </Link>
  )
}
