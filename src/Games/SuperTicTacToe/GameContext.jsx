import { useContext } from "react"

import { createContext, useReducer } from "react";

const GameContext = createContext();

const gameReducer = (state, action) => {
  switch (action.type) {
    case "MOVE":
      if (!state.actives[Math.floor(action.payload.board/3)][action.payload.board%3] 
      || state.boards[Math.floor(action.payload.board/3)][action.payload.board%3] !== -1 
      || state.superBoard[action.payload.board][action.payload.y][action.payload.x] !== -1
      ) return state;

      let newActives = [
        [false, false, false],
        [false, false, false],
        [false, false, false],
      ];
      state.superBoard[action.payload.board][action.payload.y][
        action.payload.x
      ] = state.turn; //add cell
      if (checkWin(state.superBoard[action.payload.board], state.turn)) {
        //check if board won
        state.boards[Math.floor(action.payload.board / 3)][
          action.payload.board % 3
        ] = state.turn; //win board
        if (checkWin(state.boards, state.turn)) {
          //check if game won
          state.winner = state.turn; //declare winner
          state.actives = [
            [false, false, false],
            [false, false, false],
            [false, false, false],
          ]; //win game
        } else if (boardFilled(state.boards)) {
          state.winner = (state.turn+1)%2; //declare winner
          state.actives = [
            [false, false, false],
            [false, false, false],
            [false, false, false],
          ]; //win game
        }
      }
      else if (boardFilled(state.superBoard[action.payload.board])) {
        if (checkWin(state.superBoard[action.payload.board], (state.turn+1)%2)) {
          //check if board won
          state.boards[Math.floor(action.payload.board / 3)][
            action.payload.board % 3
          ] = (state.turn+1)%2; //win board
          if (checkWin(state.boards, (state.turn+1)%2)) {
            //check if game won
            state.winner = (state.turn+1)%2; //declare winner
            state.actives = [
              [false, false, false],
              [false, false, false],
              [false, false, false],
            ]; //win game
          } 
        }
      }
      if (state.winner === -1) {
        if (state.boards[action.payload.y][action.payload.x] !== -1) {
          for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
              newActives[row][col] = state.boards[row][col] === -1;
            }
          }
        } else {
          newActives[action.payload.y][action.payload.x] = true;
        }
      }
      return {
        ...state,
        lastMove: {...action.payload},
        superBoard: state.superBoard,
        boards: state.boards,
        actives: newActives,
        winner: state.winner,
        turn: (state.turn+1)%2,
        moves: state.moves+1
      };
    case "RESET":
      return JSON.parse(JSON.stringify(defaultState));
    default:
      return state;
  }
};

const defaultState = {
  lastMove: {},
  moves: 0,
  turn: 0,
  superBoard: [
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
    [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ],
  ],
  boards: [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ],
  actives: [
    [true, true, true],
    [true, true, true],
    [true, true, true],
  ],
  winner: -1,
}

export const TicTacToeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, JSON.parse(JSON.stringify(defaultState)));

  return (
    <GameContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

const boardFilled = (board) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === -1) return false
    }
  }
  return true;
}

const checkWin = (board, turn) => {
  for (let row = 0; row < 3; row++) {
    let found = true;
    for (let i = 0; i < 3; i++) {
      if (board[row][i] !== turn) found = false;
    }
    if (found) return true;
  }

  for (let col = 0; col < 3; col++) {
    let found = true;
    for (let i = 0; i < 3; i++) {
      if (board[i][col] !== turn) found = false;
    }
    if (found) return true;
  }

  let found = true;
  for (let offset = 0; offset < 3; offset++) {
    if (board[offset][offset] !== turn) found = false;
  }
  if (found) return true;

  found = true;
  for (let offset = 0; offset < 3; offset++) {
    if (board[2 - offset][offset] !== turn) found = false;
  }
  if (found) return true;

  let count = 0;
  found = true;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === turn) count++;
      if (board[row][col] === -1) return false;
    }
  }
  return count >= 5;
};


export const useGameContext = () => {
    const context = useContext(GameContext)

    if (!context) {
        throw Error("GameContext used outside provider")
    }

    return context
}