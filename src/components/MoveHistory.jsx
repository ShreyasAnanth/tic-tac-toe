import { useEffect, useRef } from 'react'

export function MoveHistory({ history }) {
  const latestMoveRef = useRef(null)

  useEffect(() => {
    latestMoveRef.current?.scrollIntoView?.({
      block: 'nearest',
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    })
  }, [history.length])

  return (
    <section className="history-panel" aria-labelledby="history-heading">
      <div className="panel-heading">
        <p className="eyebrow">This round</p>
        <h2 id="history-heading">Move history</h2>
      </div>

      {history.length === 0 ? (
        <p className="empty-history">Moves will appear here as you play.</p>
      ) : (
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th scope="col">Move</th>
                <th scope="col">Player</th>
                <th scope="col">Position</th>
              </tr>
            </thead>
            <tbody>
              {history.map(({ moveNumber, player, position, index }, historyIndex) => (
                <tr
                  key={`${moveNumber}-${index}`}
                  ref={historyIndex === history.length - 1 ? latestMoveRef : null}
                >
                  <td>{moveNumber}</td>
                  <td className={`history-player history-player--${player.toLowerCase()}`}>
                    {player}
                  </td>
                  <td>{position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
