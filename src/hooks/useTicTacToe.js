import { useEffect, useReducer } from 'react'
import { getComputerMove, getGameResult } from '../utils/gameLogic'

const COMPUTER_MOVE_DELAY = 600
const SCOREBOARD_STORAGE_KEY = 'tic-tac-toe:scoreboard:v1'
const GAME_STORAGE_KEY = 'tic-tac-toe:game:v1'
const EMPTY_SCOREBOARD = { xWins: 0, oWins: 0, draws: 0 }

let gameIdSequence = 0

function createGameId() {
  gameIdSequence += 1
  const randomId = globalThis.crypto?.randomUUID?.()
  return randomId ?? `game-${Date.now()}-${gameIdSequence}`
}

function readStoredScoreboard() {
  try {
    if (typeof window === 'undefined') return { ...EMPTY_SCOREBOARD }

    const storedValue = window.localStorage.getItem(SCOREBOARD_STORAGE_KEY)
    if (!storedValue) return { ...EMPTY_SCOREBOARD }

    const scoreboard = JSON.parse(storedValue)
    const isValid =
      scoreboard &&
      typeof scoreboard === 'object' &&
      ['xWins', 'oWins', 'draws'].every(
        (key) => Number.isInteger(scoreboard[key]) && scoreboard[key] >= 0,
      )

    return isValid ? {
      xWins: scoreboard.xWins,
      oWins: scoreboard.oWins,
      draws: scoreboard.draws,
    } : { ...EMPTY_SCOREBOARD }
  } catch {
    return { ...EMPTY_SCOREBOARD }
  }
}

function persistScoreboard(scoreboard) {
  try {
    if (typeof window === 'undefined') return

    const isEmpty = Object.values(scoreboard).every((count) => count === 0)
    if (isEmpty) {
      window.localStorage.removeItem(SCOREBOARD_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(SCOREBOARD_STORAGE_KEY, JSON.stringify(scoreboard))
  } catch {
    // Storage may be disabled or unavailable; the in-memory game remains playable.
  }
}

function isValidHistory(history, board) {
  if (!Array.isArray(history) || history.length > 9) return false

  const seenCells = new Set()
  for (const [index, move] of history.entries()) {
    const expectedPlayer = index % 2 === 0 ? 'X' : 'O'

    if (
      !move ||
      move.moveNumber !== index + 1 ||
      move.player !== expectedPlayer ||
      !Number.isInteger(move.index) ||
      move.index < 0 ||
      move.index > 8 ||
      seenCells.has(move.index) ||
      board[move.index] !== move.player ||
      move.position !== `Row ${Math.floor(move.index / 3) + 1}, Column ${(move.index % 3) + 1}`
    ) {
      return false
    }

    seenCells.add(move.index)
  }

  return seenCells.size === board.filter((cell) => cell !== null).length
}

function readStoredGameState() {
  try {
    if (typeof window === 'undefined') return null

    const storedValue = window.localStorage.getItem(GAME_STORAGE_KEY)
    if (!storedValue) return null

    const savedState = JSON.parse(storedValue)
    const isValidBoard =
      Array.isArray(savedState?.board) &&
      savedState.board.length === 9 &&
      savedState.board.every((cell) => cell === null || cell === 'X' || cell === 'O')
    const validStatus = ['InProgress', 'Won', 'Draw'].includes(savedState?.gameStatus)
    const validMode = ['two-player', 'computer'].includes(savedState?.gameMode)
    const validPlayer = ['X', 'O'].includes(savedState?.currentPlayer)

    if (
      !savedState ||
      typeof savedState.gameId !== 'string' ||
      !savedState.gameId ||
      !isValidBoard ||
      !validStatus ||
      !validMode ||
      !validPlayer ||
      !Array.isArray(savedState.winningCells) ||
      typeof savedState.isComputerThinking !== 'boolean' ||
      !isValidHistory(savedState.history, savedState.board)
    ) {
      return null
    }

    const result = getGameResult(savedState.board)
    const winningCellsMatch =
      JSON.stringify(savedState.winningCells) === JSON.stringify(result.winningCells)
    const isThinkingStateValid =
      !savedState.isComputerThinking ||
      (savedState.gameMode === 'computer' &&
        savedState.gameStatus === 'InProgress' &&
        savedState.currentPlayer === 'O' &&
        savedState.history.at(-1)?.player === 'X')
    const nextPlayer = savedState.history.length % 2 === 0 ? 'X' : 'O'
    const hasValidTurn = result.status === 'InProgress'
      ? savedState.currentPlayer === nextPlayer
      : savedState.currentPlayer === savedState.history.at(-1)?.player

    if (
      savedState.gameStatus !== result.status ||
      savedState.winner !== result.winner ||
      !winningCellsMatch ||
      !isThinkingStateValid ||
      !hasValidTurn
    ) {
      return null
    }

    return {
      gameId: savedState.gameId,
      board: savedState.board,
      currentPlayer: savedState.currentPlayer,
      gameMode: savedState.gameMode,
      gameStatus: savedState.gameStatus,
      winner: savedState.winner,
      winningCells: savedState.winningCells,
      history: savedState.history,
      isComputerThinking: savedState.isComputerThinking,
    }
  } catch {
    return null
  }
}

function persistGameState(state) {
  try {
    if (typeof window === 'undefined') return

    const {
      gameId,
      board,
      currentPlayer,
      gameMode,
      gameStatus,
      winner,
      winningCells,
      history,
      isComputerThinking,
    } = state

    window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify({
      gameId,
      board,
      currentPlayer,
      gameMode,
      gameStatus,
      winner,
      winningCells,
      history,
      isComputerThinking,
    }))
  } catch {
    // Storage may be disabled or unavailable; the in-memory game remains playable.
  }
}

function createInitialState(gameMode = 'two-player', gameId = createGameId(), scoreboard = readStoredScoreboard()) {
  return {
    gameId,
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameMode,
    gameStatus: 'InProgress',
    winner: null,
    winningCells: [],
    history: [],
    scoreboard,
    isComputerThinking: false,
  }
}

function initializeGameState(defaultGameMode) {
  const savedGame = readStoredGameState()
  if (savedGame) {
    return { ...savedGame, scoreboard: readStoredScoreboard() }
  }

  return createInitialState(defaultGameMode)
}

function updateScoreboard(scoreboard, result) {
  if (result.status === 'Won') {
    return {
      ...scoreboard,
      [result.winner === 'X' ? 'xWins' : 'oWins']:
        scoreboard[result.winner === 'X' ? 'xWins' : 'oWins'] + 1,
    }
  }

  if (result.status === 'Draw') {
    return { ...scoreboard, draws: scoreboard.draws + 1 }
  }

  return scoreboard
}

function applyMove(state, index, player) {
  if (
    state.gameStatus !== 'InProgress' ||
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8 ||
    state.board[index] !== null
  ) {
    return state
  }

  const board = [...state.board]
  board[index] = player

  const history = [
    ...state.history,
    {
      moveNumber: state.history.length + 1,
      player,
      index,
      position: `Row ${Math.floor(index / 3) + 1}, Column ${(index % 3) + 1}`,
    },
  ]
  const result = getGameResult(board)
  const completed = result.status !== 'InProgress'

  return {
    ...state,
    board,
    currentPlayer: completed
      ? player
      : state.gameMode === 'computer'
        ? player === 'X' ? 'O' : 'X'
        : player === 'X' ? 'O' : 'X',
    gameStatus: result.status,
    winner: result.winner,
    winningCells: result.winningCells,
    history,
    scoreboard: updateScoreboard(state.scoreboard, result),
    isComputerThinking:
      !completed && state.gameMode === 'computer' && player === 'X',
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'PLAY_MOVE': {
      if (
        state.gameMode === 'computer' &&
        (state.currentPlayer !== 'X' || state.isComputerThinking)
      ) {
        return state
      }

      return applyMove(state, action.index, state.currentPlayer)
    }
    case 'COMPUTER_MOVE': {
      if (
        state.gameMode !== 'computer' ||
        state.gameStatus !== 'InProgress' ||
        state.currentPlayer !== 'O' ||
        !state.isComputerThinking
      ) {
        return state
      }

      const index = getComputerMove(state.board)
      if (index === null) return { ...state, isComputerThinking: false }

      return {
        ...applyMove(state, index, 'O'),
        isComputerThinking: false,
      }
    }
    case 'UNDO': {
      if (state.gameStatus !== 'InProgress' || state.history.length === 0) {
        return state
      }

      const movesToRemove =
        state.gameMode === 'computer' &&
        !state.isComputerThinking &&
        state.history.at(-1).player === 'O'
          ? 2
          : 1
      const history = state.history.slice(0, -movesToRemove)
      const board = Array(9).fill(null)
      history.forEach(({ index, player }) => { board[index] = player })

      return {
        ...state,
        board,
        currentPlayer:
          state.gameMode === 'computer'
            ? 'X'
            : state.history.at(-movesToRemove).player,
        gameStatus: 'InProgress',
        winner: null,
        winningCells: [],
        history: history.map((move, index) => ({ ...move, moveNumber: index + 1 })),
        isComputerThinking: false,
      }
    }
    case 'RESET_GAME':
      return createInitialState(state.gameMode, action.gameId, state.scoreboard)
    case 'SET_GAME_MODE':
      if (action.gameMode === state.gameMode) return state

      return createInitialState(action.gameMode, action.gameId, state.scoreboard)
    case 'RESET_SCOREBOARD':
      return {
        ...state,
        scoreboard: { xWins: 0, oWins: 0, draws: 0 },
      }
    default:
      return state
  }
}

export function useTicTacToe(initialGameMode = 'two-player') {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialGameMode,
    initializeGameState,
  )

  useEffect(() => {
    persistScoreboard(state.scoreboard)
  }, [state.scoreboard])

  useEffect(() => {
    persistGameState(state)
  }, [state])

  useEffect(() => {
    if (!state.isComputerThinking) return undefined

    const timeoutId = setTimeout(() => {
      dispatch({ type: 'COMPUTER_MOVE' })
    }, COMPUTER_MOVE_DELAY)

    return () => clearTimeout(timeoutId)
  }, [state.gameId, state.gameMode, state.gameStatus, state.isComputerThinking])

  return {
    ...state,
    canUndo: state.gameStatus === 'InProgress' && state.history.length > 0,
    playMove: (index) => dispatch({ type: 'PLAY_MOVE', index }),
    undoMove: () => dispatch({ type: 'UNDO' }),
    resetGame: () => dispatch({ type: 'RESET_GAME', gameId: createGameId() }),
    resetScoreboard: () => dispatch({ type: 'RESET_SCOREBOARD' }),
    setGameMode: (gameMode) =>
      dispatch({ type: 'SET_GAME_MODE', gameMode, gameId: createGameId() }),
  }
}
