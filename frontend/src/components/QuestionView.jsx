// frontend/src/components/QuestionView.jsx
// Make sure you have run "npm install html5-qrcode"
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function QuestionView({ player, onScan }) {
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        if (!showScanner) return;
        
        const scanner = new Html5QrcodeScanner(
            'qr-scanner', 
            { fps: 10, qrbox: { width: 250, height: 250 } }, 
            false
        );

        const onScanSuccess = (decodedText) => {
            scanner.clear();
            setShowScanner(false);
            onScan(decodedText);
        };

        scanner.render(onScanSuccess, console.warn);
      
        return () => {
          if (scanner) {
            try { scanner.clear(); } catch(e) { console.error("Failed to clear scanner", e); }
          }
        };
      }, [showScanner, onScan]);

    return (
        <div className="question-view" style={{ backgroundColor: '#B71C1C', color: 'white', minHeight: '100vh', padding: '20px', textAlign: 'center' }}>
            <h2>You are a QUESTION</h2>
            <p>Your Score: {player.score}</p>
            <hr/>
            <h3 style={{ marginTop: '20px' }}>Your Question Is:</h3>
            <h1 style={{ fontSize: '2rem', margin: '20px' }}>{player.currentQuestion}</h1>

            {!showScanner && <button className="btn" onClick={() => setShowScanner(true)}>Scan QR Code</button>}
            {showScanner && (
                <>
                    <div id="qr-scanner" style={{ width: '90vw', maxWidth: '500px', margin: 'auto' }}></div>
                    <button className="btn" onClick={() => setShowScanner(false)}>Cancel Scan</button>
                </>
            )}
        </div>
    );
}

export default QuestionView;