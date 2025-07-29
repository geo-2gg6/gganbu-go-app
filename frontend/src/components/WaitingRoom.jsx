// frontend/src/components/WaitingRoom.jsx

import { useLocation } from 'react-router-dom';

function WaitingRoom({ socket, gameCode, players }) { // Receive players as a prop
  const location = useLocation();
  const isHost = new URLSearchParams(location.search).get('host') === 'true';

  const handleStartGame = () => {
    socket.emit('host:start-game', { gameCode });
  };

  return (
    <div className="app-container">
      <h2>Game Code: {gameCode}</h2>
      <h3>Waiting for players...</h3>
      {/* Safely map over the players array */}
      <ul className="player-list">
        {players && players.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
      {isHost && (
        <button 
          className="btn" 
          onClick={handleStartGame} 
          disabled={!players || players.length < 2}
        >
          {(!players || players.length < 2) ? 'Need at least 2 players' : 'Start Game'}
        </button>
      )}
    </div>
  );
}

export default WaitingRoom;