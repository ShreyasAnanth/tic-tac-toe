import { describe, expect, it } from 'vitest'
import { getComputerMove, getGameResult, getWinningCells } from './gameLogic'

describe('getWinningCells', () => {
  it.each([
    ['Row win (top row)', [0, 1, 2], [0, 1, 2]],
    ['Row win (middle row)', [3, 4, 5], [3, 4, 5]],
    ['Row win (bottom row)', [6, 7, 8], [6, 7, 8]],
    ['Column win (left column)', [0, 3, 6], [0, 3, 6]],
    ['Column win (middle column)', [1, 4, 7], [1, 4, 7]],
    ['Column win (right column)', [2, 5, 8], [2, 5, 8]],
    ['Diagonal win (top-left to bottom-right)', [0, 4, 8], [0, 4, 8]],
    ['Diagonal win (top-right to bottom-left)', [2, 4, 6], [2, 4, 6]],
  ])('%s recognizes its winning cells', (_case, indices, expected) => {
    const board = Array(9).fill(null)
    indices.forEach((index) => { board[index] = 'X' })

    expect(getWinningCells(board, 'X')).toEqual(expected)
    expect(getWinningCells(board, 'O')).toEqual([])
  })
})

describe('getGameResult', () => {
  it('returns InProgress for an unfinished board', () => {
    expect(getGameResult(['X', null, 'O', null, 'X', null, null, null, 'O'])).toEqual({
      status: 'InProgress',
      winner: null,
      winningCells: [],
    })
  })

  it('returns the winner and cells for a Row win', () => {
    expect(getGameResult(['X', 'O', 'X', 'O', 'O', 'O', 'X', null, 'X'])).toEqual({
      status: 'Won',
      winner: 'O',
      winningCells: [3, 4, 5],
    })
  })

  it('checks a Row win before a full-board Draw', () => {
    expect(getGameResult(['X', 'X', 'X', 'O', 'O', 'X', 'X', 'O', 'O'])).toEqual({
      status: 'Won',
      winner: 'X',
      winningCells: [0, 1, 2],
    })
  })

  it('returns Draw for a full board without a winning line', () => {
    expect(getGameResult(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toEqual({
      status: 'Draw',
      winner: null,
      winningCells: [],
    })
  })
})

describe('Computer move selection', () => {
  it('takes an O winning move before blocking X', () => {
    expect(getComputerMove(['O', 'O', null, 'X', 'X', null, null, null, null])).toBe(2)
  })

  it('blocks X before taking the center', () => {
    expect(getComputerMove(['X', 'X', null, null, null, null, null, null, 'O'])).toBe(2)
  })

  it('takes the center when no immediate win or block exists', () => {
    expect(getComputerMove([null, null, null, null, null, null, null, null, 'X'])).toBe(4)
  })

  it('takes the lowest-index open corner before an edge', () => {
    expect(getComputerMove([null, 'X', null, 'O', 'X', 'O', null, 'O', null])).toBe(0)
  })

  it('takes the lowest-index remaining open cell when no corner is available', () => {
    expect(getComputerMove(['X', 'O', 'X', null, 'X', null, 'O', 'X', 'O'])).toBe(3)
  })

  it('selects the lowest-index winning move when several are available', () => {
    expect(getComputerMove(['O', 'O', null, 'O', 'X', null, null, null, null])).toBe(2)
  })

  it('returns null when the board is full', () => {
    expect(getComputerMove(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])).toBeNull()
  })
})
