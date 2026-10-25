const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const CORNERS = [0, 2, 6, 8]

export function getWinningCells(board, player) {
  const winningLine = WINNING_LINES.find((line) =>
    line.every((index) => board[index] === player),
  )

  return winningLine ?? []
}

export function getGameResult(board) {
  for (const player of ['X', 'O']) {
    const winningCells = getWinningCells(board, player)

    if (winningCells.length > 0) {
      return { status: 'Won', winner: player, winningCells }
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { status: 'Draw', winner: null, winningCells: [] }
  }

  return { status: 'InProgress', winner: null, winningCells: [] }
}

function getImmediateWinningMove(board, player) {
  for (const line of WINNING_LINES) {
    const playerCells = line.filter((index) => board[index] === player)
    const emptyCells = line.filter((index) => board[index] === null)

    if (playerCells.length === 2 && emptyCells.length === 1) {
      return emptyCells[0]
    }
  }

  return null
}

export function getComputerMove(board) {
  const winningMove = getImmediateWinningMove(board, 'O')
  if (winningMove !== null) return winningMove

  const blockingMove = getImmediateWinningMove(board, 'X')
  if (blockingMove !== null) return blockingMove

  if (board[4] === null) return 4

  const openCorner = CORNERS.find((index) => board[index] === null)
  if (openCorner !== undefined) return openCorner

  const openCell = board.findIndex((cell) => cell === null)
  return openCell === -1 ? null : openCell
}
