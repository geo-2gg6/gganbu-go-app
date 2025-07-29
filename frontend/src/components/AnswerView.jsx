// frontend/src/components/AnswerView.jsx

import QRCode from "react-qr-code";

function AnswerView({ player }) {
  return (
    <div className="answer-view" style={{ backgroundColor: '#0D47A1', color: 'white', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
        <h2>You are an ANSWER</h2>
        <p>Your Score: {player.score}</p>
        <hr />
        <h3 style={{ marginTop: '20px' }}>Your Answer Is:</h3>
        <h1 style={{ fontSize: '2rem', margin: '20px' }}>{player.currentAnswer}</h1>
        <p>Show this QR Code to a Question player!</p>
        <div style={{ background: 'white', padding: '16px', marginTop: '20px', display: 'inline-block' }}>
            <QRCode value={player.currentAnswer} size={256} />
        </div>
    </div>
  );
}

export default AnswerView;