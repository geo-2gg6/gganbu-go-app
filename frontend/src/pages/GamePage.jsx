// frontend/src/pages/GamePage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import WaitingRoom from '../components/WaitingRoom';
import QuestionView from '../components/QuestionView';
import AnswerView from '../components/AnswerView';

const socket = io(import.meta.env.VITE_API_URL);

function GamePage() {
  const { gameCode } = useParams();
  const [players, setPlayers] = useState([]); // State to hold the list of players
  const [isStarted, setIsStarted] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  
  useEffect(() => {
    const playerName = sessionStorage.getItem('playerName');

    if (playerName) {
        socket.emit('player:join', { gameCode, playerName });
    }

    // Listen for the full player list when it's updated
    socket.on('update:players', (updatedPlayers) => {
        setPlayers(updatedPlayers);
    });

    socket.on('game:started', (data) => {
      setGameData(data);
      const me = data.players.find(p => p.name === playerName);
      setCurrentPlayer(me);
      setIsStarted(true);
    });
    
    socket.on('update:scores', (updatedPlayers) => {
        setGameData(prevData => ({ ...prevData, players: updatedPlayers }));
        const me = updatedPlayers.find(p => p.name === playerName);
        setCurrentPlayer(me);
    });

    return () => {
      socket.off('update:players');
      socket.off('game:started');
      socket.off('update:scores');
    };
  }, [gameCode]);

  const handleScan = (scannedData) => {
    const playerName = sessionStorage.getItem('playerName');
    socket.emit('player:scan', { gameCode, playerName, scannedData });
  };
  
  if (!isStarted) {
    // Pass the players list down to the WaitingRoom
    return <WaitingRoom socket={socket} gameCode={gameCode} players={players} />;
  }

  if (!currentPlayer) {
    return <div>Loading your role...</div>;
  }
  
  return (
    <div>
      {currentPlayer.role === 'question' ? (
        <QuestionView player={currentPlayer} onScan={handleScan} />
      ) : (
        <AnswerView player={currentPlayer} />
      )}
    </div>
  );
}

export default GamePage;