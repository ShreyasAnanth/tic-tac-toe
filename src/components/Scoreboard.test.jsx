// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it } from 'vitest'
import { Scoreboard } from './Scoreboard'

describe('Scoreboard', () => {
  afterEach(cleanup)

  const scoreboard = { xWins: 2, oWins: 1, draws: 3 }

  it('shows the in-progress message and session totals', () => {
    render(<Scoreboard winner={null} gameStatus="InProgress" scoreboard={scoreboard} />)

    expect(screen.getByText('Ready when you are')).toBeInTheDocument()
    expect(screen.getByText('X wins').nextElementSibling).toHaveTextContent('2')
    expect(screen.getByText('O wins').nextElementSibling).toHaveTextContent('1')
    expect(screen.getByText('Draws').nextElementSibling).toHaveTextContent('3')
  })

  it('announces a winner or a draw', () => {
    const { rerender } = render(
      <Scoreboard winner="O" gameStatus="Won" scoreboard={scoreboard} />,
    )
    expect(screen.getByText('O wins!')).toBeInTheDocument()

    rerender(<Scoreboard winner={null} gameStatus="Draw" scoreboard={scoreboard} />)
    expect(screen.getByText('It’s a draw!')).toBeInTheDocument()
  })
})
