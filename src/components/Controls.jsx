export function Controls({
  gameMode,
  canUndo,
  gameStatus,
  isComputerThinking,
  onGameModeChange,
  onResetGame,
  onUndo,
  onResetScoreboard
}) {
  return (
    <div className="game-controls" aria-label="Game controls">
      <div className="mode-picker" role="group" aria-label="Choose game mode">
        <button
          className="mode-button"
          type="button"
          aria-pressed={gameMode === "two-player"}
          onClick={() => onGameModeChange("two-player")}
        >
          Two Player
        </button>
        <button
          className="mode-button"
          type="button"
          aria-pressed={gameMode === "computer"}
          onClick={() => onGameModeChange("computer")}
        >
          Play Computer
        </button>
      </div>

      <div className="action-row">
        <button
          className="action-button action-button--primary"
          type="button"
          onClick={onResetGame}
        >
          Reset Game
        </button>
        <button
          className="action-button"
          type="button"
          onClick={onUndo}
          disabled={!canUndo || gameStatus !== "InProgress"}
        >
          Undo
        </button>
        <button
          className="action-button action-button--quiet"
          type="button"
          onClick={onResetScoreboard}
        >
          Reset Scoreboard
        </button>
      </div>

      {isComputerThinking && (
        <p className="thinking-note" role="status">
          The computer is choosing a move…
        </p>
      )}
    </div>
  );
}
