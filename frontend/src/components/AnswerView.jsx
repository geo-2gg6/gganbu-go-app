import { QRCode } from 'qrcode.react';
function AnswerView({ answer }) {
  return (
    <div className="game-content">
      <h3>Show this QR Code:</h3>
      {answer ? (
          <div className="qr-code-container"><QRCode value={answer} size={256} /></div>
      ) : (
          <p>You've answered all questions!</p>
      )}
    </div>
  );
}
export default AnswerView;