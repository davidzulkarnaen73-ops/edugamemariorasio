import React, { useState } from 'react';
import { Question } from '../types/game';
import { sounds } from '../utils/soundEffects';
import { CheckCircle2, AlertCircle, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizPanelProps {
  question: Question;
  onCorrectAnswer: (questionId: string, isFirstTry: boolean) => void;
  onIncorrectAttempt: (questionId: string) => void;
  onContinue: () => void;
}

export const QuizPanel: React.FC<QuizPanelProps> = ({
  question,
  onCorrectAnswer,
  onIncorrectAttempt,
  onContinue,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const handleSelectOption = (idx: number) => {
    if (isLocked) return;

    sounds.playButtonClick();
    setSelectedIdx(idx);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (idx === question.correctIndex) {
      // Correct!
      setIsCorrect(true);
      setIsLocked(true);
      sounds.playCorrectAnswer();

      // Trigger celebratory mini confetti blast
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.3 },
          colors: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6'],
        });
      } catch {
        // ignore
      }

      const isFirstTry = newAttempts === 1;
      onCorrectAnswer(question.id, isFirstTry);
    } else {
      // Incorrect attempt
      setIsCorrect(false);
      sounds.playWrongAnswer();
      onIncorrectAttempt(question.id);
    }
  };

  return (
    <>
      {/* 
        Light overlay with opacity ~0.2 as specified in Section H 
        to keep 3D world and player character vibrant & clearly visible
      */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-18 pointer-events-none" />

      {/* 
        Quiz Panel strictly following Section G & H:
        - Position: absolute, top: 74px, centered horizontally
        - Width: min(420px, calc(100% - 24px))
        - Dark navy background, pixel-style border, gold accents
      */}
      <div
        className="quiz-panel absolute top-[72px] sm:top-[76px] left-1/2 -translate-x-1/2 z-20 w-[min(420px,calc(100%-24px))] max-h-[calc(100%-150px)] overflow-y-auto bg-slate-900 border-3 border-amber-400 rounded-2xl shadow-2xl p-3 sm:p-4 text-white select-none transition-all duration-300"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px 2px rgba(245, 158, 11, 0.4)',
        }}
      >
        {/* Header: Level & Question Number */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/80">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-500/20 border border-amber-400/60 text-amber-300 px-2 py-0.5 rounded text-[11px] font-black font-mono uppercase tracking-wider">
              LEVEL {question.level}
            </span>
            <span className="bg-indigo-500/20 border border-indigo-400/50 text-indigo-300 px-2 py-0.5 rounded text-[11px] font-bold font-mono">
              SOAL #{question.questionNumber}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-200/80 font-medium truncate max-w-[150px]">
            {question.subtopic}
          </span>
        </div>

        {/* Question Text */}
        <div className="my-2">
          <p className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
            {question.question}
          </p>
        </div>

        {/* 4 Options Grid (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5">
          {question.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border-slate-600';

            if (selectedIdx === idx) {
              if (idx === question.correctIndex) {
                btnStyle = 'bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400 font-black';
              } else {
                btnStyle = 'bg-rose-700 text-white border-rose-400 ring-2 ring-rose-400';
              }
            } else if (isCorrect && idx === question.correctIndex) {
              btnStyle = 'bg-emerald-600 text-white border-emerald-300';
            }

            return (
              <button
                key={idx}
                disabled={isLocked}
                onClick={() => handleSelectOption(idx)}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-xl border-2 text-xs sm:text-sm font-semibold text-left transition-all duration-150 flex items-center justify-between shadow-sm cursor-pointer active:scale-97 ${btnStyle}`}
              >
                <span>{opt}</span>
                {selectedIdx === idx && idx === question.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0 ml-1" />
                )}
                {selectedIdx === idx && idx !== question.correctIndex && (
                  <AlertCircle className="w-4 h-4 text-rose-200 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback & Hints */}
        {isCorrect === true && (
          <div className="bg-emerald-950/80 border border-emerald-500/80 rounded-xl p-2.5 my-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>{question.feedbackCorrect}</span>
            </div>
            <div className="mt-1 text-[11px] sm:text-xs text-emerald-100/90 leading-relaxed border-t border-emerald-800/60 pt-1">
              <span className="font-bold text-amber-300">💡 Pembahasan: </span>
              {question.explanation}
            </div>
          </div>
        )}

        {isCorrect === false && (
          <div className="bg-rose-950/80 border border-rose-500/80 rounded-xl p-2.5 my-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-rose-300 font-extrabold text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
              <span>{question.feedbackIncorrect}</span>
            </div>
            <div className="mt-1 text-[11px] text-amber-200 flex items-start gap-1 border-t border-rose-900/60 pt-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-300">Petunjuk:</strong> {question.hint}
              </span>
            </div>
          </div>
        )}

        {/* Action Button: LANJUTKAN */}
        {isCorrect === true && (
          <div className="mt-2.5 pt-1.5 border-t border-slate-700/80 flex justify-end">
            <button
              onClick={() => {
                sounds.playButtonClick();
                onContinue();
              }}
              className="w-full sm:w-auto bg-linear-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-4 py-2 rounded-xl border border-yellow-200 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 text-xs sm:text-sm"
            >
              <span>LANJUTKAN PETUALANGAN</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
