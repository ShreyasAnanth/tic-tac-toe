// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Controls } from './Controls'

describe('Controls', () => {
  afterEach(cleanup)

  it('selects the requested game mode', () => {
    const onGameModeChange = vi.fn()
    render(
      <Controls
        gameMode="two-player"
        canUndo={false}
        gameStatus="InProgress"
        onGameModeChange={onGameModeChange}
        onResetGame={vi.fn()}
        onUndo={vi.fn()}
        onResetScoreboard={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Play Computer' }))
    expect(onGameModeChange).toHaveBeenCalledWith('computer')
  })

  it('disables undo when unavailable or when the game is complete', () => {
    const props = {
      gameMode: 'two-player',
      canUndo: false,
      gameStatus: 'InProgress',
      onGameModeChange: vi.fn(),
      onResetGame: vi.fn(),
      onUndo: vi.fn(),
      onResetScoreboard: vi.fn(),
    }
    const { rerender } = render(<Controls {...props} />)

    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
    rerender(<Controls {...props} canUndo gameStatus="Won" />)
    expect(screen.getByRole('button', { name: 'Undo' })).toBeDisabled()
  })
})
