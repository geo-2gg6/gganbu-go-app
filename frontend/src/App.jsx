import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HostPage from './pages/HostPage';
import JoinPage from './pages/JoinPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/host" element={<HostPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/game/:gameCode" element={<GamePage />} />
    </Routes>
  );
}
export default App;