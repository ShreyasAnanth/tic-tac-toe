// @vitest-environment jsdom

import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTicTacToe } from './useTicTacToe'

describe('useTicTacToe', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('Valid move places a mark and records its move coordinates', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => result.current.playMove(0))

    expect(result.current.board[0]).toBe('X')
    expect(result.current.history).toEqual([
      { moveNumber: 1, player: 'X', index: 0, position: 'Row 1, Column 1' },
    ])
  })

  it('Turn switching alternates between X and O after each valid move', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => result.current.playMove(0))
    expect(result.current.currentPlayer).toBe('O')
    act(() => result.current.playMove(4))

    expect(result.current.board).toEqual(['X', null, null, null, 'O', null, null, null, null])
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.history.map(({ player }) => player)).toEqual(['X', 'O'])
  })

  it('Invalid move ignores occupied, out-of-range, and non-integer positions', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => result.current.playMove(0))
    const stateAfterMove = result.current
    act(() => result.current.playMove(0))
    act(() => result.current.playMove(9))
    act(() => result.current.playMove(1.5))

    expect(result.current.board).toEqual(stateAfterMove.board)
    expect(result.current.currentPlayer).toBe(stateAfterMove.currentPlayer)
    expect(result.current.history).toHaveLength(1)
  })

  it('Undo in two-player mode removes one move and restores that player turn', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => {
      result.current.playMove(0)
      result.current.playMove(1)
    })
    act(() => result.current.undoMove())

    expect(result.current.board[1]).toBeNull()
    expect(result.current.currentPlayer).toBe('O')
    expect(result.current.history.map(({ player }) => player)).toEqual(['X'])
  })

  it('Undo in computer mode removes the human and computer move together', () => {
    const { result } = renderHook(() => useTicTacToe('computer'))

    act(() => result.current.playMove(0))
    act(() => vi.advanceTimersByTime(600))
    expect(result.current.history).toHaveLength(2)

    act(() => result.current.undoMove())

    expect(result.current.board).toEqual(Array(9).fill(null))
    expect(result.current.history).toEqual([])
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.canUndo).toBe(false)
  })

  it('Undo in computer mode removes a pending human move and cancels the response', () => {
    const { result } = renderHook(() => useTicTacToe('computer'))

    act(() => result.current.playMove(0))
    expect(result.current.isComputerThinking).toBe(true)
    act(() => result.current.undoMove())
    act(() => vi.advanceTimersByTime(600))

    expect(result.current.board).toEqual(Array(9).fill(null))
    expect(result.current.history).toEqual([])
    expect(result.current.isComputerThinking).toBe(false)
  })

  it('Scoreboard update counts a win once and disables undo after completion', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 3, 1, 4, 2].forEach((index) => result.current.playMove(index))
    })

    expect(result.current.gameStatus).toBe('Won')
    expect(result.current.winner).toBe('X')
    expect(result.current.canUndo).toBe(false)
    expect(result.current.scoreboard).toEqual({ xWins: 1, oWins: 0, draws: 0 })
  })

  it('Scoreboard update counts a Draw once', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((index) => result.current.playMove(index))
    })

    expect(result.current.gameStatus).toBe('Draw')
    expect(result.current.scoreboard).toEqual({ xWins: 0, oWins: 0, draws: 1 })
  })

  it('Reset game preserves the scoreboard across reset and mode changes', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 3, 1, 4, 2].forEach((index) => result.current.playMove(index))
    })
    const firstGameId = result.current.gameId

    act(() => result.current.resetGame())
    expect(result.current.scoreboard.xWins).toBe(1)
    expect(JSON.parse(localStorage.getItem('tic-tac-toe:scoreboard:v1'))).toEqual({
      xWins: 1,
      oWins: 0,
      draws: 0,
    })
    expect(result.current.gameId).not.toBe(firstGameId)
    expect(result.current.board).toEqual(Array(9).fill(null))

    act(() => result.current.setGameMode('computer'))
    expect(result.current.gameMode).toBe('computer')
    expect(result.current.scoreboard.xWins).toBe(1)
    expect(result.current.board).toEqual(Array(9).fill(null))
  })

  it('loads a valid persisted scoreboard on mount', () => {
    localStorage.setItem(
      'tic-tac-toe:scoreboard:v1',
      JSON.stringify({ xWins: 4, oWins: 2, draws: 1 }),
    )

    const { result } = renderHook(() => useTicTacToe())

    expect(result.current.scoreboard).toEqual({ xWins: 4, oWins: 2, draws: 1 })
  })

  it('restores the board, mode, next player, and move history after remount', () => {
    const { result, unmount } = renderHook(() => useTicTacToe())

    act(() => result.current.playMove(0))
    act(() => result.current.playMove(4))
    unmount()

    const restored = renderHook(() => useTicTacToe())

    expect(restored.result.current.board).toEqual(['X', null, null, null, 'O', null, null, null, null])
    expect(restored.result.current.currentPlayer).toBe('X')
    expect(restored.result.current.gameMode).toBe('two-player')
    expect(restored.result.current.history).toHaveLength(2)
    expect(restored.result.current.history[1].position).toBe('Row 2, Column 2')
  })

  it('restores a completed game and keeps undo disabled', () => {
    const { result, unmount } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 3, 1, 4, 2].forEach((index) => result.current.playMove(index))
    })
    unmount()

    const restored = renderHook(() => useTicTacToe())

    expect(restored.result.current.gameStatus).toBe('Won')
    expect(restored.result.current.winner).toBe('X')
    expect(restored.result.current.winningCells).toEqual([0, 1, 2])
    expect(restored.result.current.canUndo).toBe(false)
    expect(restored.result.current.scoreboard).toEqual({ xWins: 1, oWins: 0, draws: 0 })
  })

  it('resumes a saved pending computer turn after the delay', () => {
    const { result, unmount } = renderHook(() => useTicTacToe('computer'))

    act(() => result.current.playMove(0))
    expect(result.current.isComputerThinking).toBe(true)
    unmount()

    const restored = renderHook(() => useTicTacToe())
    expect(restored.result.current.isComputerThinking).toBe(true)
    act(() => vi.advanceTimersByTime(600))

    expect(restored.result.current.history).toHaveLength(2)
    expect(restored.result.current.board[4]).toBe('O')
    expect(restored.result.current.currentPlayer).toBe('X')
  })

  it('Reset game writes a clean snapshot while retaining mode and scoreboard', () => {
    const { result } = renderHook(() => useTicTacToe('computer'))

    act(() => result.current.playMove(0))
    act(() => result.current.resetGame())

    const savedGame = JSON.parse(localStorage.getItem('tic-tac-toe:game:v1'))
    expect(savedGame.board).toEqual(Array(9).fill(null))
    expect(savedGame.history).toEqual([])
    expect(savedGame.currentPlayer).toBe('X')
    expect(savedGame.gameMode).toBe('computer')
    expect(savedGame.gameStatus).toBe('InProgress')
    expect(savedGame.isComputerThinking).toBe(false)
    expect(result.current.scoreboard).toEqual({ xWins: 0, oWins: 0, draws: 0 })
  })

  it.each([
    ['malformed JSON', '{invalid'],
    ['invalid board', JSON.stringify({ gameId: 'bad', board: ['X'], currentPlayer: 'X' })],
  ])('starts a fresh game from %s saved game data', (_label, savedValue) => {
    localStorage.setItem('tic-tac-toe:game:v1', savedValue)

    const { result } = renderHook(() => useTicTacToe())

    expect(result.current.board).toEqual(Array(9).fill(null))
    expect(result.current.history).toEqual([])
    expect(result.current.currentPlayer).toBe('X')
  })

  it('continues playing when localStorage reads and writes throw', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage read denied')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage write denied')
    })

    const { result } = renderHook(() => useTicTacToe())
    act(() => result.current.playMove(0))

    expect(result.current.board[0]).toBe('X')
    expect(result.current.history).toHaveLength(1)
  })

  it('Scoreboard update persists completed-game scores and restores them after remount', () => {
    const { result, unmount } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 3, 1, 4, 2].forEach((index) => result.current.playMove(index))
    })

    expect(JSON.parse(localStorage.getItem('tic-tac-toe:scoreboard:v1'))).toEqual({
      xWins: 1,
      oWins: 0,
      draws: 0,
    })
    unmount()

    const remounted = renderHook(() => useTicTacToe())
    expect(remounted.result.current.scoreboard).toEqual({ xWins: 1, oWins: 0, draws: 0 })
  })

  it.each([
    ['not-json', '{invalid'],
    ['invalid-shape', JSON.stringify({ xWins: -1, oWins: 0, draws: 0 })],
    ['invalid-count', JSON.stringify({ xWins: 1.5, oWins: 0, draws: 0 })],
    ['not-object', JSON.stringify([1, 2, 3])],
  ])('uses zero counts when saved scoreboard data is %s', (_label, value) => {
    localStorage.setItem('tic-tac-toe:scoreboard:v1', value)

    const { result } = renderHook(() => useTicTacToe())

    expect(result.current.scoreboard).toEqual({ xWins: 0, oWins: 0, draws: 0 })
  })

  it('resets the scoreboard separately from the current game', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 3, 1, 4, 2].forEach((index) => result.current.playMove(index))
    })
    act(() => result.current.resetScoreboard())

    expect(result.current.scoreboard).toEqual({ xWins: 0, oWins: 0, draws: 0 })
    expect(localStorage.getItem('tic-tac-toe:scoreboard:v1')).toBeNull()
    expect(result.current.gameStatus).toBe('Won')
    expect(result.current.board.slice(0, 3)).toEqual(['X', 'X', 'X'])
  })

  it('Computer move selection waits 600 ms before the computer replies', () => {
    const { result } = renderHook(() => useTicTacToe('computer'))

    act(() => result.current.playMove(0))
    act(() => vi.advanceTimersByTime(599))
    expect(result.current.history).toHaveLength(1)
    expect(result.current.isComputerThinking).toBe(true)

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.history).toHaveLength(2)
    expect(result.current.board[4]).toBe('O')
    expect(result.current.currentPlayer).toBe('X')
    expect(result.current.isComputerThinking).toBe(false)
  })

  it('Move after game completion leaves the board, history, and scoreboard unchanged', () => {
    const { result } = renderHook(() => useTicTacToe())

    act(() => {
      ;[0, 3, 1, 4, 2].forEach((index) => result.current.playMove(index))
    })
    const boardAfterWin = [...result.current.board]
    const historyAfterWin = [...result.current.history]
    const scoreboardAfterWin = { ...result.current.scoreboard }

    act(() => result.current.playMove(8))

    expect(result.current.board).toEqual(boardAfterWin)
    expect(result.current.history).toEqual(historyAfterWin)
    expect(result.current.scoreboard).toEqual(scoreboardAfterWin)
  })

  it.each(['reset', 'mode change'])(
    'cancels the computer response when the game is changed by %s',
    (action) => {
      const { result } = renderHook(() => useTicTacToe('computer'))

      act(() => result.current.playMove(0))
      act(() => {
        if (action === 'reset') result.current.resetGame()
        else result.current.setGameMode('two-player')
      })
      act(() => vi.advanceTimersByTime(600))

      expect(result.current.history).toEqual([])
      expect(result.current.board).toEqual(Array(9).fill(null))
      expect(result.current.isComputerThinking).toBe(false)
    },
  )
})
