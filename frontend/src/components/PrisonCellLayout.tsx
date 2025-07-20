import React, { useState, useEffect } from 'react';
import '../styles/App.css'; 
import cellBgVideo from '../assets/jailcell2050.mp4';
import interviewerImg from '../assets/interviewer.png';
import { generateInterview } from '../api/gameApi';
import { useGameState } from '../state/GameStateContext';
import { startGame } from '../api/gameApi';
import { checkInterviewStatus } from '../api/gameApi';

//const { setGameState } = useGameState();


// const handleStart = async () => {
//     const data = await startGame();
//     setGameState({ sessionId: data.sessionId, currentState: 'DAY_1_INTRO', fullTranscriptHistory: [] });
//     localStorage.setItem('sessionId', data.sessionId);
//   };

  
// const { gameState, setGameState } = useGameState();
// const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!gameState?.sessionId) return;
//     let interval: NodeJS.Timeout;
//     const poll = async () => {
//       setLoading(true);
//       console.log('[InterviewScreen] Polling checkInterviewStatus for sessionId:', gameState.sessionId);
//       const data = await checkInterviewStatus(gameState.sessionId);
//       setLoading(false);
//       console.log('[InterviewScreen] checkInterviewStatus response:', data);
//       // Only end interview if currentState is NOT INTERVIEW_PENDING or DAY_X_INTERVIEW_PENDING
//       const isInterviewPending =
//         data.currentState === 'INTERVIEW_PENDING' ||
//         /^DAY_\d+_INTERVIEW_PENDING$/.test(data.currentState || '');
//       if (!isInterviewPending) {
//         // Interview is over, clear interviewLink and interviewId
//         console.log('[InterviewScreen] Interview ended, updating gameState:', { ...gameState, ...data, interviewLink: undefined, interviewId: undefined });
//         setGameState({ ...gameState, ...data, interviewLink: undefined, interviewId: undefined });
//       } else {
//         interval = setTimeout(poll, 3000);
//       }
//     };
//     poll();
//     return () => clearTimeout(interval);
//     // eslint-disable-next-line
//   }, [gameState?.sessionId]);

//   useEffect(() => {
//     console.log('[InterviewScreen] Rendered with gameState:', gameState);
//   }, [gameState]);

const interviewerLines = [
  "Welcome. Let's begin.",
  "Tell me about yourself.",
  "Why do you think you're here?",
];

const PrisonCellLayout: React.FC = () => {
  const { gameState, setGameState } = useGameState();
  const [loading, setLoading] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // Handle game start
  const handleStart = async () => {
    const data = await startGame();
    setGameState({
      sessionId: data.sessionId,
      currentState: 'DAY_1_INTRO',
      fullTranscriptHistory: [],
    });
    localStorage.setItem('sessionId', data.sessionId);
  };

  // Typewriter effect for text box
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(interviewerLines[currentLine].slice(0, i + 1));
      i++;
      if (i === interviewerLines[currentLine].length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [currentLine]);

  // Polling logic
  useEffect(() => {
    if (!gameState?.sessionId) return;
    let interval: NodeJS.Timeout;
    const poll = async () => {
      setLoading(true);
      const data = await checkInterviewStatus(gameState.sessionId);
      setLoading(false);
      const isInterviewPending =
        data.currentState === 'INTERVIEW_PENDING' ||
        /^DAY_\d+_INTERVIEW_PENDING$/.test(data.currentState || '');

      if (!isInterviewPending) {
        setGameState({
          ...gameState,
          ...data,
          interviewLink: undefined,
          interviewId: undefined,
        });
      } else {
        interval = setTimeout(poll, 3000);
      }
    };
    poll();
    return () => clearTimeout(interval);
  }, [gameState?.sessionId]);

  useEffect(() => {
    console.log('[InterviewScreen] Rendered with gameState:', gameState);
  }, [gameState]);

  return (
    <div className="prison-cell-bg">
      <video
        autoPlay 
        loop    //
        muted
        playsInline 
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          left: 0,
          top: 0,
          zIndex: 0,
        }}
      >
        <source src={cellBgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <div className="cell-graphics" /> */}
      <div className="interviewer-area">
        <div className="avatar-container">
          <div 
            className="interviewer-avatar" 
            style={{ backgroundImage: `url(${interviewerImg})` }}
          />
          <div className="speech-bubble animate-bubble">
            {displayedText}
          </div>
        </div>
      </div>
      <div className="game-iframe-container">
        <iframe
          //src={gameState.interviewLink}
          title="Ribbon Interview"
           width="600"
           height="400"
          className="border rounded"
          allow="camera; microphone; clipboard-write; display-capture; autoplay"
          allowFullScreen
        />
      </div>
      {/* Start Game Button */}
      <button className="start-game-btn"  onClick={handleStart}>
        Start Interrogation
      </button>
    </div>
  );
};

//} onClick={handleStart}
export default PrisonCellLayout;