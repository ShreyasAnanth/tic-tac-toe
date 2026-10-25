export function Gameboard({
  board,
  winningCells,
  gameStatus,
  gameMode,
  currentPlayer,
  isComputerThinking,
  onMove,
}) {
  return (
    <div className="gameboard" role="group" aria-label="Tic Tac Toe board">
      {board.map((cell, index) => {
        const row = Math.floor(index / 3) + 1
        const column = (index % 3) + 1
        const isWinningCell = winningCells.includes(index)
        const disabled = Boolean(
          cell ||
          gameStatus !== 'InProgress' ||
          isComputerThinking ||
          (gameMode === 'computer' && currentPlayer === 'O'),
        )
        const classes = [
          'game-cell',
          cell === 'X' && 'game-cell--x',
          cell === 'O' && 'game-cell--o',
          isWinningCell && 'game-cell--winning',
        ].filter(Boolean).join(' ')

        return (
          <button
            key={index}
            className={classes}
            type="button"
            disabled={disabled}
            onClick={() => onMove(index)}
            aria-label={`Row ${row}, column ${column}: ${cell ?? 'empty'}${isWinningCell ? ', winning cell' : ''}`}
          >
            {cell}
          </button>
        )
      })}
    </div>
  )
}
