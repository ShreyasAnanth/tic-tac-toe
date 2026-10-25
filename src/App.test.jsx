// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('shows an accepted move on the board and in move history', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Row 1, column 1: empty' }))

    expect(screen.getByRole('button', { name: 'Row 1, column 1: X' })).toBeDisabled()
    expect(screen.getByRole('cell', { name: 'Row 1, Column 1' })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('O to move')).toBeInTheDocument()
  })

  it('shows the computer thinking status below the board while the reply is pending', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Play Computer' }))
    fireEvent.click(screen.getByRole('button', { name: 'Row 1, column 1: empty' }))

    const board = screen.getByRole('group', { name: 'Tic Tac Toe board' })
    const thinkingStatus = screen
      .getAllByRole('status')
      .find((status) => status.textContent.includes('The computer is choosing a move'))

    expect(thinkingStatus).toBeInTheDocument()
    expect(
      board.compareDocumentPosition(thinkingStatus) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })
})
