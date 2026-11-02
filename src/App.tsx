/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CoinQuestEngine } from './game/CoinQuestEngine';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { QuizPanel } from './components/QuizPanel';
import { MainMenu } from './components/MainMenu';
import { InstructionsModal } from './components/InstructionsModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ResultsScreen } from './components/ResultsScreen';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { QUESTION_BANK, LEVEL_CONFIG } from './data/questionBank';
import { Question, ScreenType } from './types/game';
import { sounds } from './utils/soundEffects';

export default function App() {
  // Screen and Level State
  const [screen, setScreen] = useState<ScreenType>('menu');
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [unlockedLevels, setUnlockedLevels] = useState<{ 1: boolean; 2: boolean; 3: boolean }>({
    1: true,
    2: false,
    3: false,
  });

  // Gameplay Scoring & Tracking
  const [score, setScore] = useState<number>(0);
  const [coinsCount, setCoinsCount] = useState<number>(0);
  const [questionAttempts, setQuestionAttempts] = useState<{
    [id: string]: { solved: boolean; firstAttemptCorrect: boolean; attempts: number };
  }>({});

  // Active Quiz Modal
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Level Complete Modal Data
  const [levelCompleteData, setLevelCompleteData] = useState<(1 | 2 | 3) | null>(null);

  // Audio mute toggle
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Level Complete Banner notification state
  const [levelNotification, setLevelNotification] = useState<string | null>(null);

  // Refs
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CoinQuestEngine | null>(null);

  // Sync audio enabled state
  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sounds.enabled = next;
  };

  // Helper: Count solved questions
  const solvedCount = Object.values(questionAttempts).filter((q) => q.solved).length;
  const firstTryCount = Object.values(questionAttempts).filter((q) => q.solved && q.firstAttemptCorrect).length;
  const retriedCount = Object.values(questionAttempts).filter((q) => q.solved && !q.firstAttemptCorrect).length;

  // Initialize or re-init 3D engine when in playing mode
  const initEngine = useCallback(
    (lvl: 1 | 2 | 3) => {
      if (!canvasMountRef.current) return;

      // Clean up previous instance
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }

      const engine = new CoinQuestEngine(canvasMountRef.current, lvl, {
        onCoinCollected: (scoreAdd, coinAdd) => {
          setScore((prev) => prev + scoreAdd);
          setCoinsCount((prev) => prev + coinAdd);
        },
        onEducationalCoinTriggered: (qNum) => {
          const q = QUESTION_BANK.find((item) => item.questionNumber === qNum);
          if (q) {
            // Check if already solved
            setQuestionAttempts((prev) => {
              if (prev[q.id]?.solved) {
                // Already solved, don't trigger quiz again
                return prev;
              }
              // Pause engine and show Quiz Modal
              if (engineRef.current) {
                engineRef.current.isPaused = true;
              }
              setActiveQuestion(q);
              return prev;
            });
          }
        },
        onLevelCompleted: () => {
          // Level finished!
          handleLevelCompleted(lvl);
        },
        onPlayerFallOutOfBounds: () => {
          // Fallen into pit
          sounds.playWrongAnswer();
        },
      });

      engineRef.current = engine;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // When screen changes to 'playing' or level changes, initialize 3D scene
  useEffect(() => {
    if (screen === 'playing') {
      initEngine(level);
    } else {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [screen, level, initEngine]);

  // Handle Level Transition
  const handleLevelCompleted = (completedLvl: 1 | 2 | 3) => {
    sounds.playLevelComplete();

    if (completedLvl === 1) {
      setUnlockedLevels((prev) => ({ ...prev, 2: true }));
    } else if (completedLvl === 2) {
      setUnlockedLevels((prev) => ({ ...prev, 3: true }));
    }

    // Pause physics so character stays at the gate during celebration
    if (engineRef.current) {
      engineRef.current.isPaused = true;
    }

    // Open the Level Complete Modal so player can review and click to enter next level!
    setLevelCompleteData(completedLvl);
  };

  const handleEnterNextLevel = () => {
    if (!levelCompleteData) return;
    const current = levelCompleteData;
    setLevelCompleteData(null);
    if (current === 1) {
      setLevel(2);
    } else if (current === 2) {
      setLevel(3);
    } else {
      setScreen('results');
    }
  };

  const handleReplayCurrentLevel = () => {
    if (!levelCompleteData) return;
    const lvlToRetry = levelCompleteData;
    setLevelCompleteData(null);
    handleRetryLevel(lvlToRetry);
  };

  // Touch & Keyboard inputs forwarded to 3D engine
  const handleControlInput = (control: 'left' | 'right' | 'up' | 'down' | 'jump', active: boolean) => {
    if (engineRef.current && !activeQuestion) {
      engineRef.current.setInput(control, active);
    }
  };

  // Quiz Callbacks
  const handleCorrectAnswer = (questionId: string, isFirstTry: boolean) => {
    // Add 100 points
    setScore((prev) => prev + 100);

    setQuestionAttempts((prev) => {
      const existing = prev[questionId] || { attempts: 0 };
      return {
        ...prev,
        [questionId]: {
          solved: true,
          firstAttemptCorrect: isFirstTry,
          attempts: existing.attempts + 1,
        },
      };
    });

    // Trigger hero victory jump animation in 3D scene!
    if (engineRef.current) {
      engineRef.current.triggerCelebration(2.5);
    }
  };

  const handleIncorrectAttempt = (questionId: string) => {
    setQuestionAttempts((prev) => {
      const existing = prev[questionId] || { solved: false, firstAttemptCorrect: false, attempts: 0 };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          attempts: existing.attempts + 1,
        },
      };
    });
  };

  const handleContinueAfterQuiz = () => {
    setActiveQuestion(null);
    if (engineRef.current) {
      engineRef.current.isPaused = false;
    }

    // If all 15 questions solved, check if we should show results
    const currentSolved = Object.values(questionAttempts).filter((q) => q.solved).length;
    if (currentSolved >= 15) {
      setTimeout(() => {
        setScreen('results');
      }, 1000);
    }
  };

  // Game Reset / Retry Actions
  const handlePlayAgain = () => {
    setScore(0);
    setCoinsCount(0);
    setQuestionAttempts({});
    setLevel(1);
    setActiveQuestion(null);
    setScreen('playing');
  };

  const handleRetryLevel = (lvlToRetry: 1 | 2 | 3 = level) => {
    setLevel(lvlToRetry);
    setActiveQuestion(null);
    setScreen('playing');
    initEngine(lvlToRetry);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none">
      {/* 
        3D GAME VIEWPORT CONTAINER (16:9 responsive landscape canvas)
      */}
      <div
        ref={canvasMountRef}
        className="game-viewport absolute inset-0 w-full h-full z-0 overflow-hidden cursor-grab active:cursor-grabbing"
      />

      {/* Level Transition Toast */}
      {levelNotification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border-2 border-amber-400 text-amber-300 px-6 py-3 rounded-2xl shadow-2xl font-black text-sm sm:text-base animate-bounce flex items-center gap-2">
          <span>🌟</span>
          <span>{levelNotification}</span>
        </div>
      )}

      {/* IN-GAME HUD & CONTROLS (Only visible during 'playing' screen) */}
      {screen === 'playing' && (
        <>
          {/* Top HUD */}
          <HUD
            score={score}
            coinsCount={coinsCount}
            level={level}
            solvedCount={solvedCount}
            totalQuestions={15}
            onOpenMenu={() => setScreen('menu')}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
          />

          {/* On-screen Touch Controls (D-Pad bottom-left, Jump bottom-right) */}
          <TouchControls
            onInput={handleControlInput}
            disabled={activeQuestion !== null}
          />

          {/* Compact Upper-Center Quiz Panel (World and player remain visible in background) */}
          {activeQuestion && (
            <QuizPanel
              question={activeQuestion}
              onCorrectAnswer={handleCorrectAnswer}
              onIncorrectAttempt={handleIncorrectAttempt}
              onContinue={handleContinueAfterQuiz}
            />
          )}

          {/* Level Complete / Gate Passed Modal */}
          {levelCompleteData && (
            <LevelCompleteModal
              completedLevel={levelCompleteData}
              score={score}
              coinsCount={coinsCount}
              solvedCount={solvedCount}
              onEnterNextLevel={handleEnterNextLevel}
              onReplayLevel={handleReplayCurrentLevel}
              onReturnToMenu={() => {
                setLevelCompleteData(null);
                setScreen('menu');
              }}
            />
          )}
        </>
      )}

      {/* MAIN MENU SCREEN */}
      {screen === 'menu' && (
        <MainMenu
          onStartGame={() => setScreen('playing')}
          onOpenInstructions={() => setScreen('instructions')}
          onOpenLevelSelect={() => setScreen('level_select')}
        />
      )}

      {/* INSTRUCTIONS MODAL */}
      {screen === 'instructions' && (
        <InstructionsModal
          onClose={() => setScreen('menu')}
          onStartGame={() => setScreen('playing')}
        />
      )}

      {/* LEVEL SELECT MODAL */}
      {screen === 'level_select' && (
        <LevelSelectModal
          unlockedLevels={unlockedLevels}
          onSelectLevel={(selectedLvl) => {
            setLevel(selectedLvl);
            setScreen('playing');
          }}
          onClose={() => setScreen('menu')}
        />
      )}

      {/* FINAL RESULTS SCREEN */}
      {screen === 'results' && (
        <ResultsScreen
          score={score}
          coinsCount={coinsCount}
          solvedCount={solvedCount}
          firstTryCount={firstTryCount}
          retriedCount={retriedCount}
          onPlayAgain={handlePlayAgain}
          onRetryLevel={() => handleRetryLevel(level)}
          onReturnToMenu={() => setScreen('menu')}
        />
      )}
    </div>
  );
}
