export const defaultState = (rows, cols, K) => {

  const board = []
  for (let row = 0; row < rows; row++) {
    board.push([])
    for (let col = 0; col < cols; col++) {
      board[row].push(-1)
    }
  }

  return ({
    winner: -1,
    turn: 0,
    rows,
    cols, 
    K,
    board
  })
}

export const gameReducer = (state, action) => {
  
  switch (action.type) {
    case "RESET": {
      return defaultState(action.payload.rows, action.payload.cols, action.payload.K)
    }
    case "MOVE": {
      if (state.winner !== -1) return state;
      const { col } = action.payload
      if (state.board[0][col] !== -1) return state;
      
      let row = 0;
      while (row+1 !== state.rows && state.board[row+1][col] === -1) row++;

      state.board[row][col] = state.turn;

      let winningSequence = getWinningSequence(state.board, row, col, state.turn, state.K, 
        checkWin(state.board, row, col, state.K, state.turn))

      if (winningSequence.length >= state.K) {
        for (const [x, y] of winningSequence) {
          state.board[y][x] = 2
        }
        state.winner = state.turn
      } else {
        let found = false
        for (let i = 0; i < state.cols; i++) {
          if (state.board[0][i] === -1) found = true
        }
        if (!found) state.winner = 2
      }

      return {...state, turn: (state.turn+1) % 2}
    }
    default: {
      return state;
    }
  }
}

const getWinningSequence = (board, row, col, turn, K, [dx, dy]) => {

  if (dy === 0 && dx === 0) return [];

  const rows = board.length
  const cols = board[0].length
  let sequence = []
  for (let offset = 1-K; offset <= K-1; offset++) {
    if (inRange(col+dx*offset, 0, cols)
     && inRange(row+dy*offset, 0, rows)
     && board[row+dy*offset][col+dx*offset] === turn) {
      sequence.push([col+dx*offset, row+dy*offset])
    } 
    else if (sequence.length >= K) {
      return sequence;
    } else sequence = []
  }

  return sequence
}

const checkWin = (board, row, col, K, turn) => {
  
  //check Row
  if (inRow(K, turn, getSequence(board, row, col, K, 1, 0))) return [1, 0]
  //check Col
  if (inRow(K, turn, getSequence(board, row, col, K, 0, 1))) return [0, 1]
  //check Diagonal
  if (inRow(K, turn, getSequence(board, row, col, K, 1, 1))) return [1, 1]
  //check AntiDiagonal
  if (inRow(K, turn, getSequence(board, row, col, K, 1, -1))) return [1, -1]

  return [0, 0]
}

const inRow = (K, turn, sequence) => {
  let count = 0
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i] !== turn) count = 0
    else if (++count >= K) return true;
  }

  return false
}

const getSequence = (board, row, col, K, dx, dy) => {

  const rows = board.length
  const cols = board[0].length
  const sequence = []
  for (let offset = 1-K; offset <= K-1; offset++) {
    if (inRange(col+dx*offset, 0, cols) && inRange(row+dy*offset, 0, rows)) {
      sequence.push(board[row+dy*offset][col+dx*offset])
    } 
    else sequence.push(-1)
  }

  return sequence
}

const inRange = (n, min, max) => {
  return n >= min && n < max
}