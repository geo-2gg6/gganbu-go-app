// frontend/src/pages/GamePage.jsx

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import WaitingRoom from '../components/WaitingRoom';
import QuestionView from '../components/QuestionView';
import AnswerView from '../components/AnswerView';

// Initialize the socket connection
const socket = io(import.meta.env.VITE_API_URL);

function GamePage() {
  const { gameCode } = useParams();
  const [isStarted, setIsStarted] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  
  useEffect(() => {
    const playerName = sessionStorage.getItem('playerName');

    // Join the game room
    socket.emit('player:join', { gameCode, playerName });

    // Listen for when the host starts the game
    socket.on('game:started', (data) => {
      setGameData(data);
      const me = data.players.find(p => p.name === playerName);
      setCurrentPlayer(me);
      setIsStarted(true);
    });
    
    // Listen for score updates after a scan
    socket.on('update:scores', (updatedPlayers) => {
        setGameData(prevData => ({ ...prevData, players: updatedPlayers }));
        const me = updatedPlayers.find(p => p.name === playerName);
        setCurrentPlayer(me);
    });

    // Cleanup listeners
    return () => {
      socket.off('game:started');
      socket.off('update:scores');
    };
  }, [gameCode]);

  const handleScan = (scannedData) => {
    const playerName = sessionStorage.getItem('playerName');
    socket.emit('player:scan', { gameCode, playerName, scannedData });
  };
  
  if (!isStarted) {
    // We are in the waiting room
    return <WaitingRoom socket={socket} gameCode={gameCode} />;
  }

  if (!currentPlayer) {
    // Game has started, but we are still identifying the player
    return <div>Loading your role...</div>;
  }
  
  // The game is playing, render the correct view
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