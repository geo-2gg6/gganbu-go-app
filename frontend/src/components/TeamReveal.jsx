import { useState, useEffect } from 'react';
function TeamReveal({ teamInfo, onRevealEnd }) {
  const [countdown, setCountdown] = useState(10);
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onRevealEnd();
    }
  }, [countdown, onRevealEnd]);

  return (
    <div className="team-reveal-container" style={{ backgroundColor: teamInfo.team === 'red' ? 'var(--red-team)' : 'var(--blue-team)' }}>
      <div className="icon">{teamInfo.team === 'red' ? '🔪' : '🔑'}</div>
      <h1>{countdown}</h1>
    </div>
  );
}
export default TeamReveal;