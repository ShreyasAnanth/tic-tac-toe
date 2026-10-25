export function MoveHistory({ history }) {
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
              {history.map(({ moveNumber, player, position, index }) => (
                <tr key={`${moveNumber}-${index}`}>
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
