import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="app-container">
      <h1>Gganbu Go</h1>
      <p>○ △ □</p>
      <Link to="/host" className="btn">Start a Game</Link>
      <Link to="/join" className="btn btn-secondary">Join a Game</Link>
    </div>
  );
}
export default HomePage;