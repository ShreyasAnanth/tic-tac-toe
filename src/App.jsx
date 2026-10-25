import { Controls } from './components/Controls'
import { Gameboard } from './components/Gameboard'
import { MoveHistory } from './components/MoveHistory'
import { Scoreboard } from './components/Scoreboard'
import { useTicTacToe } from './hooks/useTicTacToe'
import './App.css'

function App() {
  const game = useTicTacToe()

  return (
    <main className="game-shell">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">XO</div>
        <div>
          <p className="eyebrow">A little friendly competition</p>
          <h1>Tic Tac Toe</h1>
        </div>
      </header>

      <div className="game-layout">
        <section className="play-panel" aria-labelledby="play-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your match</p>
              <h2 id="play-heading">Make your move</h2>
            </div>
            <p className="turn-indicator" aria-live="polite">
              {game.gameStatus !== 'InProgress'
                ? 'Round complete'
                : game.isComputerThinking
                  ? 'Computer is thinking…'
                  : `${game.currentPlayer} to move`}
            </p>
          </div>

          <Controls
            gameMode={game.gameMode}
            canUndo={game.canUndo}
            gameStatus={game.gameStatus}
            isComputerThinking={game.isComputerThinking}
            onGameModeChange={game.setGameMode}
            onResetGame={game.resetGame}
            onUndo={game.undoMove}
            onResetScoreboard={game.resetScoreboard}
          />

          <Gameboard
            board={game.board}
            winningCells={game.winningCells}
            gameStatus={game.gameStatus}
            gameMode={game.gameMode}
            currentPlayer={game.currentPlayer}
            isComputerThinking={game.isComputerThinking}
            onMove={game.playMove}
          />
        </section>

        <aside className="support-panel" aria-label="Game details">
          <Scoreboard
            winner={game.winner}
            gameStatus={game.gameStatus}
            scoreboard={game.scoreboard}
          />
          <MoveHistory history={game.history} />
        </aside>
      </div>

      <footer className="app-footer">Take turns, play fair, have fun.</footer>
    </main>
  )
}

export default App
