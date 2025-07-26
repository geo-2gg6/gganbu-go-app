import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
function QuestionView({ question, onScan }) {
  const [showScanner, setShowScanner] = useState(false);
  useEffect(() => {
    if (!showScanner) return;
    let scanner;
    try {
        scanner = new Html5QrcodeScanner('qr-scanner', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
        const onScanSuccess = (decodedText) => {
          scanner.clear().then(() => {
            setShowScanner(false);
            onScan(decodedText);
          });
        };
        scanner.render(onScanSuccess, console.warn);
    } catch (e) {
        console.error("QR Scanner failed to start", e);
    }
    return () => { if (scanner) try { scanner.clear(); } catch(e) {} };
  }, [showScanner, onScan]);

  return (
    <div className="game-content">
      <h3>Your Question:</h3>
      <p style={{ fontSize: '1.5rem' }}>{question || 'Waiting for new question...'}</p>
      {showScanner ? (
        <><div id="qr-scanner"></div><button className="btn" onClick={() => setShowScanner(false)}>Cancel</button></>
      ) : (
        <button className="btn scan-btn" onClick={() => setShowScanner(true)}>Scan Answer</button>
      )}
    </div>
  );
}
export default QuestionView;