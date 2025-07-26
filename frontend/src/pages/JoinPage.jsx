import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name || !code) {
      alert('Please enter your name and the game code.');
      return;
    }
    sessionStorage.setItem('playerName', name);
    navigate(`/game/${code.toUpperCase()}`);
  };

  return (
    <div className="app-container">
      <h2>Join Game</h2>
      <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="text"
        placeholder="Game Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength="6"
        style={{ textTransform: 'uppercase' }}
      />
      <button className="btn" onClick={handleJoin}>Enter</button>
    </div>
  );
}
export default JoinPage;