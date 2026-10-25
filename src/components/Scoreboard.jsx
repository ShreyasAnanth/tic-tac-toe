export function Scoreboard({ winner, gameStatus, scoreboard }) {
  let resultMessage = 'The next move is yours.'
  let resultTitle = 'Ready when you are'
  let bannerClass = 'result-banner'

  if (gameStatus === 'Won') {
    resultTitle = `${winner} wins!`
    resultMessage = 'Nice play. Start another round when you’re ready.'
    bannerClass += ' result-banner--won'
  } else if (gameStatus === 'Draw') {
    resultTitle = 'It’s a draw!'
    resultMessage = 'A close match. Try another round.'
  }

  return (
    <section className="scoreboard-panel" aria-labelledby="scoreboard-heading">
      <div className="panel-heading">
        <p className="eyebrow">Session totals</p>
        <h2 id="scoreboard-heading">Scoreboard</h2>
      </div>

      <div className={bannerClass} role="status" aria-live="polite">
        <strong>{resultTitle}</strong>
        <span>{resultMessage}</span>
      </div>

      <dl className="score-list">
        <div className="score-item">
          <dt>X wins</dt>
          <dd>{scoreboard.xWins}</dd>
        </div>
        <div className="score-item">
          <dt>O wins</dt>
          <dd>{scoreboard.oWins}</dd>
        </div>
        <div className="score-item">
          <dt>Draws</dt>
          <dd>{scoreboard.draws}</dd>
        </div>
      </dl>
    </section>
  )
}
