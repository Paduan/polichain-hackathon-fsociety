import React, { useState } from 'react';
import './App.css';




function App() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [message, setMessage] = useState(''); // Armazena a mensagem atual
  const [showMessage, setShowMessage] = useState(false); // Controla a visibilidade da mensagem

  const correctAnswer1 = 'resposta1';
  const correctAnswer2 = '1372 1656 776';

  const checkAnswers = () => {
    if (input1 === correctAnswer1 && input2 === correctAnswer2) {
      setMessage("Parabéns, as respostas estão corretas!");
      setShowMessage(true);
      setInput1('');
      setInput2('');
      setTimeout(() => setShowMessage(false), 3000); // Mensagem desaparece após 10 segundos
        //redireciona pro site
      window.location.href = "https://polichain-hackathon-fsociety-3.vercel.app/";
    } else {
      setMessage("Resposta incorreta. Tente novamente!");
      setShowMessage(true);
      setInput1('');
      setInput2('');
      setTimeout(() => setShowMessage(false), 3000); // Mensagem desaparece após 10 segundos
    }
  };

  return (
    <div className="container">
      <header className="header">
        <img src="mrrobot.jpg" alt="Descrição do Cabeçalho" className="header-image" />
      </header>

      <div className="question-container">
        <p>3a7bd3e2360a3d29ee6e6480d9c2e7b0247b4b7e2da6911919550c74db49deb1</p>
        <input 
          type="text" 
          value={input1} 
          onChange={(e) => setInput1(e.target.value)} 
          className="input-box"
        />
      </div>

      <div className="question-container">
        <p>Problem solve genius</p>
        <input 
          type="text" 
          value={input2} 
          onChange={(e) => setInput2(e.target.value)} 
          className="input-box"
        />
      </div>

      <button onClick={checkAnswers} className="confirm-button">Verificar</button>

      <p className={`message ${showMessage ? 'visible' : ''}`}>
        {message}
      </p>

    </div>
  );
}

export default App;


