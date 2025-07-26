function WaitingRoom({ players, gameCode, isHost, onStart }) {
  return (
    <div className="app-container">
      <h2>Game Code: {gameCode}</h2>
      <h3>Waiting for players...</h3>
      <ul className="player-list">{players.map(p => <li key={p.id}>{p.name}</li>)}</ul>
      {isHost && players.length >= 2 && <button className="btn" onClick={onStart}>Start Game</button>}
      {isHost && players.length < 2 && <p>Need at least 2 players to start.</p>}
    </div>
  );
}
export default WaitingRoom;