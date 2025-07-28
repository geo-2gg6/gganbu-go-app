import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HostPage() {
  const [questions, setQuestions] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    console.log('The API URL is:', import.meta.env.VITE_API_URL); // <-- ADD THIS LINE
    const parsedQuestions = questions.split('\n').filter(line => line.includes(';')).map(line => {
      const [question, answer] = line.split(';');
      return { question: question.trim(), answer: answer.trim() };
    });

    if (parsedQuestions.length < 2) {
      alert('Please provide at least 2 questions in the format "Question;Answer" on separate lines.');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: parsedQuestions }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate(`/game/${data.gameCode}?host=true`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to create game. Is the server running?');
    }
  };

  return (
    <div className="app-container">
      <h2>Host a Game</h2>
      <p>Enter questions and answers, one per line.<br/>Format: <strong>Question;Answer</strong></p>
      <textarea
        rows="10"
        placeholder="What is the capital of France?;Paris&#10;What is 5x5?;25"
        value={questions}
        onChange={(e) => setQuestions(e.target.value)}
      ></textarea>
      <button className="btn" onClick={handleCreateGame}>Create Game</button>
    </div>
  );
}
export default HostPage;