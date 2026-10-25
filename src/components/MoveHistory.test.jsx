// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it } from 'vitest'
import { MoveHistory } from './MoveHistory'

describe('MoveHistory', () => {
  afterEach(cleanup)

  it('shows an empty state before the first move', () => {
    render(<MoveHistory history={[]} />)

    expect(screen.getByText('Moves will appear here as you play.')).toBeInTheDocument()
  })

  it('renders move number, player, and position', () => {
    render(
      <MoveHistory
        history={[
          { moveNumber: 1, player: 'X', index: 0, position: 'Row 1, Column 1' },
          { moveNumber: 2, player: 'O', index: 4, position: 'Row 2, Column 2' },
        ]}
      />,
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Row 1, Column 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2, Column 2')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })
})
