require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Connect to Redis
const pubClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
});
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log("Connected to Redis and using Redis adapter.");
}).catch(err => {
    console.error("Failed to connect to Redis:", err);
});

const redis = pubClient; // Use the main client for commands
const GAME_TTL = 4 * 60 * 60; // Games expire after 4 hours

const getGame = async (gameCode) => {
  const gameJSON = await redis.get(`game:${gameCode}`);
  return gameJSON ? JSON.parse(gameJSON) : null;
};

const saveGame = async (gameCode, gameData) => {
  await redis.set(`game:${gameCode}`, JSON.stringify(gameData), { EX: GAME_TTL });
};

app.post('/api/create', async (req, res) => {
  const { questions } = req.body;
  if (!questions || questions.length < 2) {
    return res.status(400).json({ message: 'Minimum 2 questions are required.' });
  }

  const gameCode = nanoid(6).toUpperCase();
  const game = {
    hostId: null,
    players: [],
    questions: questions,
    gameStarted: false,
    winners: [],
  };
  await saveGame(gameCode, game);
  res.status(201).json({ gameCode });
});

io.on('connection', (socket) => {

  const joinGame = async (gameCode, isHost = false, playerName = null) => {
    try {
      const game = await getGame(gameCode);
      if (!game) {
        socket.emit('error:game_not_found');
        return null;
      }

      if (isHost) {
        game.hostId = socket.id;
      } else {
        if (game.gameStarted) {
          socket.emit('error:game_already_started');
          return null;
        }
        game.players.push({ id: socket.id, name: playerName, score: 0 });
      }
      
      socket.join(gameCode);
      await saveGame(gameCode, game);
      io.to(gameCode).emit('update:players', game.players);
      return game;
    } catch (err) {
      console.error("Error joining game:", err);
    }
  };

  socket.on('host:join', ({ gameCode }) => joinGame(gameCode, true));
  socket.on('player:join', ({ gameCode, playerName }) => joinGame(gameCode, false, playerName));

  socket.on('host:start-game', async ({ gameCode }) => {
    try {
        const game = await getGame(gameCode);
        if (!game || game.hostId !== socket.id || game.players.length < 2) return;

        game.gameStarted = true;
        const shuffledPlayers = [...game.players].sort(() => 0.5 - Math.random());
        const midpoint = Math.ceil(shuffledPlayers.length / 2);
        const teamRedPlayers = shuffledPlayers.slice(0, midpoint);
        const teamBluePlayers = shuffledPlayers.slice(midpoint);

        const shuffledQuestions = [...game.questions].sort(() => 0.5 - Math.random());

        game.players.forEach(p => {
            const isRed = teamRedPlayers.some(rp => rp.id === p.id);
            const teamIndex = isRed ? teamRedPlayers.findIndex(rp => rp.id === p.id) : teamBluePlayers.findIndex(bp => bp.id === p.id);
            
            p.team = isRed ? 'red' : 'blue';
            p.role = isRed ? 'question' : 'answer';

            const questionPair = shuffledQuestions[teamIndex];
            if(questionPair) {
                p.currentQuestion = isRed ? questionPair.question : null;
                p.currentAnswer = isRed ? null : questionPair.answer;
            }
        });
        
        await saveGame(gameCode, game);

        game.players.forEach(player => {
        io.to(player.id).emit('game:started', {
            team: player.team,
            role: player.role,
            question: player.currentQuestion,
            answer: player.currentAnswer,
        });
        });
        
        io.to(gameCode).emit('update:scores', game.players.map(p => ({id: p.id, name: p.name, score: p.score})));
    } catch(err) {
        console.error("Error starting game:", err);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));