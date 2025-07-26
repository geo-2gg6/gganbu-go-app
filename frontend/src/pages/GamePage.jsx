import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import WaitingRoom from '../components/WaitingRoom';
import TeamReveal from '../components/TeamReveal';
import QuestionView from '../components/QuestionView';
import AnswerView from '../components/AnswerView';

const socket = io(import.meta.env.VITE_SOCKET_URL);

function GamePage() {
  const { gameCode } = useParams();
  const location = useLocation();
  const isHost = new URLSearchParams(location.search).get('host') === 'true';

  const [gameState, setGameState] = useState('waiting'); // waiting, reveal, playing, over
  const [players, setPlayers] = useState([]);
  const [teamInfo, setTeamInfo] = useState({});
  const [scores, setScores] = useState([]);
  const [winners, setWinners] = useState([]);
  
  const playerNameRef = useRef(sessionStorage.getItem('playerName'));

  useEffect(() => {
    if (isHost) socket.emit('host:join', { gameCode });
    else if (playerNameRef.current) socket.emit('player:join', { gameCode, playerName: playerNameRef.current });
    
    socket.on('update:players', (updatedPlayers) => setPlayers(updatedPlayers));
    socket.on('game:started', (data) => { setTeamInfo(data); setGameState('reveal'); });
    socket.on('update:scores', (updatedScores) => setScores(updatedScores));
    socket.on('update:data', (data) => setTeamInfo(prev => ({ ...prev, ...data })));
    socket.on('game:over', (finalWinners) => { setWinners(finalWinners); setGameState('over'); });
    socket.on('error:game_not_found', () => alert('Game not found!'));
    
    return () => {
      socket.off('update:players'); socket.off('game:started'); socket.off('update:scores');
      socket.off('update:data'); socket.off('game:over'); socket.off('error:game_not_found');
    };
  }, [gameCode, isHost]);

  const handleStartGame = () => socket.emit('host:start-game', { gameCode });
  const handleScan = (scannedData) => socket.emit('player:scan', { gameCode, scannedData });

  if (gameState === 'waiting') return <WaitingRoom players={players} gameCode={gameCode} isHost={isHost} onStart={handleStartGame} />;
  if (gameState === 'reveal') return <TeamReveal teamInfo={teamInfo} onRevealEnd={() => setGameState('playing')} />;
  if (gameState === 'playing') {
    return (
      <div className="game-screen" style={{ backgroundColor: teamInfo.team === 'red' ? 'var(--red-team)' : 'var(--blue-team)'}}>
        <h2>{teamInfo.role}</h2>
        {teamInfo.role === 'question' ? <QuestionView question={teamInfo.question} onScan={handleScan} /> : <AnswerView answer={teamInfo.answer} />}
      </div>
    );
  }
  if (gameState === 'over') {
    return (
        <div className="app-container">
            <h1>Game Over!</h1>
            <h2>Winners:</h2>
            <ol>{winners.map(w => <li key={w.id}>{w.rank}. {w.name}</li>)}</ol>
        </div>
    );
  }
  return <div>Loading...</div>;
}
export default GamePage;