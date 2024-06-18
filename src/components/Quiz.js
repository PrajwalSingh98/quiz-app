// src/components/Quiz.js
import './Quiz.css';
import React, { useState, useEffect } from 'react';
import questions from '../questions.json'; // Assuming questions.json is in the public folder

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isFullScreen, setIsFullScreen] = useState(document.fullscreenElement !== null);

  useEffect(() => {
    // Load state from localStorage
    const savedQuestionIndex = localStorage.getItem('currentQuestion');
    const savedTimeLeft = localStorage.getItem('timeLeft');

    if (savedQuestionIndex) {
      setCurrentQuestion(parseInt(savedQuestionIndex));
    }
    if (savedTimeLeft) {
      setTimeLeft(parseInt(savedTimeLeft));
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          localStorage.setItem('timeLeft', prev - 1);
          return prev - 1;
        }
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const handleFullScreenChange = () => {
    setIsFullScreen(document.fullscreenElement !== null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      // handle correct answer logic if needed
    }
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
    localStorage.setItem('currentQuestion', nextQuestion);
    setSelectedOption(null);
  };

  const handleStartQuiz = () => {
    document.documentElement.requestFullscreen();
  };

  if (!isFullScreen) {
    return (
      <div className="fullscreen-prompt">
        <button onClick={handleStartQuiz}>Start Quiz in Full Screen</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
      <div className="question">
        <h2>{questions[currentQuestion].question}</h2>
        <div className="options">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={selectedOption === option ? 'selected' : ''}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleNextQuestion} disabled={selectedOption === null}>
        Next Question
      </button>
    </div>
  );
};

export default Quiz;
