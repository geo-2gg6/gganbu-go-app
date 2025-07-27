// Filename: frontend/src/components/AnswerView.jsx

import QRCode from "react-qr-code";

function AnswerView({ answer }) {
  return (
    <div className="game-content">
      <h3>Show this QR Code:</h3>
      {answer ? (
          <div className="qr-code-container">
            <QRCode value={answer} />
          </div>
      ) : (
          <p>You've answered all questions!</p>
      )}
    </div>
  );
}
export default AnswerView;