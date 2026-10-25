// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(cleanup)

  it('shows an accepted move on the board and in move history', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Row 1, column 1: empty' }))

    expect(screen.getByRole('button', { name: 'Row 1, column 1: X' })).toBeDisabled()
    expect(screen.getByRole('cell', { name: 'Row 1, Column 1' })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('O to move')).toBeInTheDocument()
  })
})
