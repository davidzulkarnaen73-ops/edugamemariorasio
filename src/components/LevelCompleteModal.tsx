import React, { useEffect } from 'react';
import { Trophy, ArrowRight, RotateCcw, Home, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';
import { LEVEL_CONFIG } from '../data/questionBank';

interface LevelCompleteModalProps {
  completedLevel: 1 | 2 | 3;
  score: number;
  coinsCount: number;
  solvedCount: number;
  onEnterNextLevel: () => void;
  onReplayLevel: () => void;
  onReturnToMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  completedLevel,
  score,
  coinsCount,
  solvedCount,
  onEnterNextLevel,
  onReplayLevel,
  onReturnToMenu,
}) => {
  const currentConfig = LEVEL_CONFIG[completedLevel];
  const nextLevel = (completedLevel < 3 ? completedLevel + 1 : 3) as 1 | 2 | 3;
  const nextConfig = LEVEL_CONFIG[nextLevel];

  useEffect(() => {
    sounds.playLevelComplete();
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#fbbf24', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="absolute inset-0 z-35 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-slate-900 border-3 border-amber-400 rounded-3xl shadow-2xl p-5 sm:p-7 text-white flex flex-col items-center text-center animate-fadeIn">
        
        {/* Emblem & Sparks */}
        <div className="relative mb-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-b from-amber-400 via-yellow-500 to-amber-600 border-2 border-yellow-200 flex items-center justify-center shadow-xl">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950 drop-shadow" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin" />
        </div>

        {/* Title */}
        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
          GERBANG KASTEL TERBUKA!
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight uppercase mt-1">
          {currentConfig.name} SELESAI!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Hebat! Kamu telah menaklukkan rintangan di <strong>{currentConfig.title}</strong>!
        </p>

        {/* Level Stats Summary */}
        <div className="w-full grid grid-cols-3 gap-2 my-4 text-xs">
          <div className="bg-slate-800/90 border border-amber-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-amber-300 block">SKOR</span>
            <span className="text-base sm:text-lg font-mono font-black text-amber-400">
              {score}
            </span>
          </div>

          <div className="bg-slate-800/90 border border-amber-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-amber-300 block">KOIN</span>
            <span className="text-base sm:text-lg font-mono font-black text-yellow-300">
              {coinsCount}
            </span>
          </div>

          <div className="bg-slate-800/90 border border-emerald-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-emerald-400 block">SOAL SELESAI</span>
            <span className="text-base sm:text-lg font-mono font-black text-emerald-400">
              {solvedCount} / 15
            </span>
          </div>
        </div>

        {/* Next Level Preview Banner */}
        {completedLevel < 3 ? (
          <div className="w-full bg-slate-800/70 border border-slate-700 rounded-2xl p-3 mb-4 text-left flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-400 block font-bold">
                Level Selanjutnya:
              </span>
              <strong className="text-sm font-extrabold text-white">
                {nextConfig.name} — {nextConfig.title}
              </strong>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {nextConfig.subtitle}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 text-base shadow">
              {nextLevel}
            </div>
          </div>
        ) : (
          <div className="w-full bg-emerald-950/70 border border-emerald-500/60 rounded-2xl p-3 mb-4 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Seluruh 3 level petualangan telah berhasil kamu selesaikan dengan gemilang!</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Main Action: Enter Next Level or View Results */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onEnterNextLevel();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-xl border-2 border-yellow-200 flex items-center justify-center gap-2.5 cursor-pointer transition-transform active:scale-95"
          >
            <span>
              {completedLevel < 3
                ? `MASUK GERBANG KE ${nextConfig.name} ➔`
                : 'LIHAT HASIL AKHIR & NILAI JUARA 🏆'}
            </span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>

          {/* Secondary Actions */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => {
                sounds.playButtonClick();
                onReplayLevel();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ulangi Level Ini</span>
            </button>

            <button
              onClick={() => {
                sounds.playButtonClick();
                onReturnToMenu();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menu Utama</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
