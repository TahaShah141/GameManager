export const defaultState = (playerCount) => {

  const players = []
  const fenceCount = Math.floor(20/playerCount)
  for (let team = 0; team < playerCount; team++) players.push({x: -1, y: -1, team, fenceCount, won: false})

  const blocks = []
  for (let y = 0; y < 9; y++) {
    blocks.push([])
    for (let x = 0; x < 9; x++) {
      blocks[y].push({x, y, walls: [false, false, false, false], active: false, hasPlayer: false, team: -1})
    }
  }
  setMoves(players[0], blocks)

  const fences = []
  
  const occupied = []
  for (let y = 0; y < 19; y++) {
    occupied.push([])
    for (let x = 0; x < 19; x++) {
      occupied[y].push((x % 2 === 1 && y % 2 === 1))
    }
  }
  
  return (
    {
      moves: 0,
      turn: 0,
      fenceMode: false,
      hoverFence: {x: 7, y: 10, team: -1},
      winners: [],
      players,
      blocks,
      fences,
      occupied
    }
  )
}

export const gameReducer = (state, action) => {
  const currentPlayer = state.players[state.turn]
  const orientation = state.hoverFence.y % 2
  
  const yMin = orientation ? 1 : 0
  const yMax = orientation ? 15 : 18
  const xMin = orientation ? 0 : 1
  const xMax = orientation ? 18 : 15

  const isFree = (occupied, x, y) => {
    const orientation = y % 2
    const dx = orientation === 0 ? 1 : 0
    const dy = orientation === 1 ? 1 : 0

    return (!occupied[y][x] && !occupied[y+dy][x+dx] && !occupied[y+2*dy][x+2*dx])
  }

  if (state.winners.length + 1 === state.players.length && action.type !== "RESET") return state;
  
  switch (action.type) {
    case "RESET": {
      return defaultState(action.payload.playerCount);
    }
    case 'SHOW': {
      if (!state.fenceMode && currentPlayer.fenceCount === 0) return state;

      if (!state.fenceMode) resetMoves(state.blocks)
      else setMoves(currentPlayer, state.blocks)

      return deepCopy({...state, fenceMode: !state.fenceMode})
    }

    case 'UP': {
      if (!state.fenceMode && currentPlayer.fenceCount === 0) return state;
      if (!state.fenceMode) resetMoves(state.blocks)

      let y = state.hoverFence.y-2
      if (y < yMin) y = yMax

      while (!isFree(state.occupied, state.hoverFence.x, y)) {
        y -= 2

        if (y === state.hoverFence.y) return {...state, fenceMode: true};
        if (y < yMin) y = yMax
      }
      
      return {...state, hoverFence: {...state.hoverFence, y}, fenceMode: true};
    }
    
    case 'DOWN': {
      if (!state.fenceMode && currentPlayer.fenceCount === 0) return state;
      if (!state.fenceMode) resetMoves(state.blocks)
      
      let y = state.hoverFence.y+2
      if (y > yMax) y = yMin
      
      while (!isFree(state.occupied, state.hoverFence.x, y)) {
        y += 2
        if (y === state.hoverFence.y) return {...state, fenceMode: true};
        if (y > yMax) y = yMin
      }
      return {...state, hoverFence: {...state.hoverFence, y}, fenceMode: true};
    }
    
    case 'LEFT': {
      if (!state.fenceMode && currentPlayer.fenceCount === 0) return state;
      if (!state.fenceMode) resetMoves(state.blocks)

      let x = state.hoverFence.x-2
      if (x < xMin) x = xMax
      
      while (!isFree(state.occupied, x, state.hoverFence.y)) {
        x -= 2
        if (x === state.hoverFence.x) return {...state, fenceMode: true};
        if (x < xMin) x = xMax
      }
      return {...state, hoverFence: {...state.hoverFence, x}, fenceMode: true};
    }
    
    case 'RIGHT': {
      if (!state.fenceMode && currentPlayer.fenceCount === 0) return state;
      if (!state.fenceMode) resetMoves(state.blocks)
      
      let x = state.hoverFence.x+2
      if (x > xMax) x = xMin
      
      while (!isFree(state.occupied, x, state.hoverFence.y)) {
        x += 2
        if (x === state.hoverFence.x) return {...state, fenceMode: true};
        if (x > xMax) x = xMin
      }
      return {...state, hoverFence: {...state.hoverFence, x}, fenceMode: true};      
    }

    case 'FLIP': {
      if (!state.fenceMode) return state;
      
      const sign = orientation ? -1 : 1

      let newX = state.hoverFence.x+sign
      let newY = state.hoverFence.y-sign

      if (newX < yMin) newX = yMin
      if (newX > yMax) newX = yMax
      if (newY < xMin) newY = xMin
      if (newY > xMax) newY = xMax

      return {...state, hoverFence: {...state.hoverFence, x: newX, y: newY}}
    }

    case 'MOVE': {

      const {fenceMode, x, y} = action.payload

      if (!fenceMode) {
        
        if (currentPlayer.x !== -1 && currentPlayer.y !== -1) {
          const prevBlock = state.blocks[currentPlayer.y][currentPlayer.x] 
          prevBlock.hasPlayer = false
        }

        if (currentPlayer.team === 0 && x === 0 && !state.blocks[y][x].walls[3]) {
          state.winners.push(currentPlayer)
          currentPlayer.won = true
        } else if (currentPlayer.team === 1 && x === 8 && !state.blocks[y][x].walls[1]) {
          state.winners.push(currentPlayer)
          currentPlayer.won = true
        } else if (currentPlayer.team === 2 && y === 8 && !state.blocks[y][x].walls[2]) {
          state.winners.push(currentPlayer)
          currentPlayer.won = true
        } else if (currentPlayer.team === 3 && y === 0 && !state.blocks[y][x].walls[0]) {
          state.winners.push(currentPlayer)
          currentPlayer.won = true
        } else {
          state.blocks[y][x].hasPlayer = true
          state.blocks[y][x].team = currentPlayer.team
          currentPlayer.x = x
          currentPlayer.y = y
        }

        let i = 1
        while (state.players[(state.turn+i) % state.players.length].won) i++;
        const nextTurn = (state.turn+i) % state.players.length 

        resetMoves(state.blocks)
        setMoves(state.players[nextTurn], state.blocks)
        
        return ({
          ...state, 
          turn: nextTurn,
          moves: state.moves+1
        })
      }
      else {
                
        if (!isFree(state.occupied, x, y)) return state;
        
        const newOccupied = deepCopy(state.occupied)
        const orientation = y % 2
        const dx = orientation === 0 ? 1 : 0
        const dy = orientation === 1 ? 1 : 0

        const changes = placeFence(state.blocks, (x+dx)/2 - 1, (y+dy)/2 - 1, orientation)
        if (!playersFree(state.players, state.blocks)) {
          undoChanges(state.blocks, changes);
          return state;
        }
  
        for (let i = 0; i < 3; i++) newOccupied[y+i*dy][x+i*dx] = true
        currentPlayer.fenceCount -= 1

        let i = 1
        while (state.players[(state.turn+i) % state.players.length].won) i++;
        const nextTurn = (state.turn+i) % state.players.length 
        
        resetMoves(state.blocks)
        setMoves(state.players[nextTurn], state.blocks)

        return {
          ...state, 
          fences: [...state.fences, {x, y, team: state.turn}], 
          turn: nextTurn,
          occupied: newOccupied,
          fenceMode: false,
          moves: state.moves+1
        }
      }
    }

    default:
      return state;
  }
}

const playersFree = (players, blocks) => {
  const playerConstants = [
    {endX: 0, endY: -1, wallIndex: 3},
    {endX: 8, endY: -1, wallIndex: 1},
    {endX: -1, endY: 8, wallIndex: 2},
    {endX: -1, endY: 0, wallIndex: 0},
  ]

  for (const player of players) {
    const {endX, endY, wallIndex} = playerConstants[player.team]
    if (player.x === -1 && player.y === -1) continue
    if (!BFS(player.x, player.y, endX, endY, blocks, wallIndex)) return false
  }

  return true
}

const undoChanges = (blocks, changes) => {
  for (const change of changes) {
    blocks[change.y][change.x].walls[change.wall] = false
  }
}

const deepCopy = (toCopy) => {
  return JSON.parse(JSON.stringify(toCopy))
}

const placeFence = (blocks, x, y, orientation) => {
  const wallsIndex = orientation === 0 ? [2, 0] : [1, 3]
  const changes = []

  for (let i = 0; i < 4; i++) {
    let dx = i % 2
    let dy = Math.floor(i/2)
    if (inRange(x+dx, 0, 9) && inRange(y+dy, 0, 9)) {
      let wall = orientation === 0 ? wallsIndex[dy] : wallsIndex[dx]
      blocks[y+dy][x+dx].walls[wall] = true
      changes.push({x: x+dx, y: y+dy, wall})
    }
  }

  return changes
}

export const setMoves = (player, blocks) => {
  const x = player.x
  const y = player.y

  if (x === -1 && y === -1) {
    if (player.team === 0) 
      for (let i = 0; i < 9; i++) {
        if (blocks[i][8].hasPlayer) continue;
        blocks[i][8].active = true
        blocks[i][8].team = player.team
      }
    if (player.team === 1) 
      for (let i = 0; i < 9; i++) {
        if (blocks[i][0].hasPlayer) continue;
        blocks[i][0].active = true
        blocks[i][0].team = player.team
      }
    if (player.team === 2) 
      for (let i = 0; i < 9; i++) {
        if (blocks[0][i].hasPlayer) continue;
        blocks[0][i].active = true
        blocks[0][i].team = player.team
      }
    if (player.team === 3) 
      for (let i = 0; i < 9; i++) {
        if (blocks[8][i].hasPlayer) continue;
        blocks[8][i].active = true
        blocks[8][i].team = player.team
      }
  }

  for (let d = 0; d < 4; d++) {
    const [dx, dy] = getOffsets(d)
    if (inRange(x+dx, 0, 9) && inRange(y+dy, 0, 9) && !blocks[y][x].walls[d]) {
      const nextBlock = blocks[y+dy][x+dx] 
      if (nextBlock.hasPlayer) {
        if (dx === 0) {
          if (inRange(x+dx+1, 0, 9) && !nextBlock.walls[1] && !blocks[y+dy][x+dx+1].hasPlayer) {
            blocks[y+dy][x+dx+1].active = true
            blocks[y+dy][x+dx+1].team = player.team
          }
          if (inRange(x+dx-1, 0, 9) && !nextBlock.walls[3] && !blocks[y+dy][x+dx-1].hasPlayer) {
            blocks[y+dy][x+dx-1].active = true
            blocks[y+dy][x+dx-1].team = player.team
          }
        }
        if (dy === 0) {
          if (inRange(y+dy-1, 0, 9) && !nextBlock.walls[0] && !blocks[y+dy-1][x+dx].hasPlayer) {
            blocks[y+dy-1][x+dx].active = true
            blocks[y+dy-1][x+dx].team = player.team
          }
          if (inRange(y+dy+1, 0, 9) && !nextBlock.walls[2] && !blocks[y+dy+1][x+dx].hasPlayer) {
            blocks[y+dy+1][x+dx].active = true
            blocks[y+dy+1][x+dx].team = player.team
          }
        }
      } else {
        nextBlock.active = true
        nextBlock.team = player.team
      }
    }
  }
}

const getOffsets = (direction) => {
  const dxOptions = [0, 1, 0, -1]
  const dyOptions = [-1, 0, 1, 0]
  return [dxOptions[direction], dyOptions[direction]]
}

const resetMoves = (blocks) => {
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (!blocks[y][x].hasPlayer) {
        blocks[y][x].active = false
        blocks[y][x].team = -1
      }
    }
  }
}

const inRange = (i, min, max) => {
  return i >= min && i < max
}

const BFS = (startX, startY, endX, endY, grid, wallIndex) => {
  const moves = [
      { dx: 0, dy: -1, wallIndex: 0 },   // Up
      { dx: 1, dy: 0, wallIndex: 1 },   // Right
      { dx: 0, dy: 1, wallIndex: 2 },   // Down
      { dx: -1, dy: 0, wallIndex: 3 },  // Left
  ];

  const queue = [{ x: startX, y: startY }];
  const visited = new Set([`${startX},${startY}`]);

  while (queue.length > 0) {
      const { x, y } = queue.shift();

      if (((endY === -1 && x === endX) || (endX === -1 && y === endY)) && !grid[y][x].walls[wallIndex]) {
          return true;
      }

      for (const move of moves) {
          const newX = x + move.dx;
          const newY = y + move.dy;

          if (
              inRange(newX, 0, 9) && inRange(newY, 0, 9) &&
              !visited.has(`${newX},${newY}`) &&
              !grid[y][x].walls[move.wallIndex]
          ) {
              queue.push({ x: newX, y: newY });
              visited.add(`${newX},${newY}`);
          }
      }
  }

  return false;
};