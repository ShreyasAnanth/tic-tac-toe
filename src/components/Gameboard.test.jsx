// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Gameboard } from './Gameboard'

const defaultProps = {
  board: Array(9).fill(null),
  winningCells: [],
  gameStatus: 'InProgress',
  gameMode: 'two-player',
  currentPlayer: 'X',
  isComputerThinking: false,
  onMove: vi.fn(),
}

describe('Gameboard', () => {
  afterEach(cleanup)

  it('renders nine labeled cells and reports the selected index', () => {
    const onMove = vi.fn()
    render(<Gameboard {...defaultProps} onMove={onMove} />)

    fireEvent.click(screen.getByRole('button', { name: 'Row 2, column 3: empty' }))

    expect(screen.getAllByRole('button')).toHaveLength(9)
    expect(onMove).toHaveBeenCalledWith(5)
  })

  it('disables occupied cells and every cell after completion', () => {
    const board = ['X', null, null, null, null, null, null, null, null]
    const { rerender } = render(<Gameboard {...defaultProps} board={board} />)

    expect(screen.getByRole('button', { name: 'Row 1, column 1: X' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Row 1, column 2: empty' })).toBeEnabled()

    rerender(<Gameboard {...defaultProps} board={board} gameStatus="Won" />)
    expect(screen.getAllByRole('button').every((cell) => cell.disabled)).toBe(true)
  })

  it('disables the board while the computer is thinking and highlights winning cells', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null]
    render(
      <Gameboard
        {...defaultProps}
        board={board}
        winningCells={[0, 1, 2]}
        gameStatus="Won"
        isComputerThinking
      />,
    )

    expect(screen.getAllByRole('button', { name: /winning cell/ })[0]).toHaveClass('game-cell--winning')
    expect(screen.getAllByRole('button').every((cell) => cell.disabled)).toBe(true)
  })

  it('prevents a computer-mode move when O is the active player', () => {
    render(<Gameboard {...defaultProps} gameMode="computer" currentPlayer="O" />)

    expect(screen.getAllByRole('button').every((cell) => cell.disabled)).toBe(true)
  })

})
