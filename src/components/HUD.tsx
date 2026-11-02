import React from 'react';
import { Volume2, VolumeX, Menu, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HUDProps {
  score: number;
  coinsCount: number;
  level: 1 | 2 | 3;
  solvedCount: number;
  totalQuestions: number;
  onOpenMenu: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  coinsCount,
  level,
  solvedCount,
  totalQuestions,
  onOpenMenu,
  audioEnabled,
  onToggleAudio,
}) => {
  // Pad numbers cleanly
  const formattedScore = score.toString().padStart(6, '0');
  const formattedCoins = coinsCount.toString().padStart(2, '0');
  const formattedSolved = solvedCount.toString().padStart(2, '0');
  const levelText = `${level}-${level}`;

  const progressPercent = Math.min(100, (solvedCount / totalQuestions) * 100);

  return (
    <header className="absolute top-0 left-0 right-0 z-10 px-2 sm:px-4 py-2 pointer-events-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-1.5">
        {/* Top HUD Bar */}
        <div className="flex items-center justify-between gap-2 bg-slate-900/85 border-2 border-amber-400/80 rounded-xl px-3 py-1.5 shadow-lg backdrop-blur-xs text-xs sm:text-sm font-bold text-white select-none">
          
          {/* Player Identity */}
          <div className="hidden sm:flex items-center gap-1.5 text-amber-300 font-extrabold tracking-wide">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px] uppercase tracking-wider text-amber-200/90 font-mono">PLAYER:</span>
            <span className="text-white text-xs">EDU EXPLORER</span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-mono text-emerald-400 font-black">SCORE:</span>
            <span className="font-mono text-amber-300 tracking-wider text-xs sm:text-base font-black">
              {formattedScore}
            </span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 border border-amber-200 flex items-center justify-center text-[10px] text-amber-950 font-black shadow-inner">
              $
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-amber-400 font-bold">COIN:</span>
            <span className="font-mono text-amber-300 tracking-wider text-xs sm:text-base font-black">
              {formattedCoins}
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] sm:text-xs font-mono text-cyan-400 font-bold">LEVEL:</span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 px-2 py-0.5 rounded font-mono font-black text-xs sm:text-sm">
              {levelText}
            </span>
          </div>

          {/* Solved Questions Counter */}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-mono text-purple-300 font-bold">SOAL:</span>
            <span className="font-mono text-purple-200 font-black text-xs sm:text-sm">
              {formattedSolved}/{totalQuestions}
            </span>
          </div>

          {/* Audio & Menu Actions */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              onClick={() => {
                sounds.playButtonClick();
                onToggleAudio();
              }}
              title={audioEnabled ? 'Mute Suara' : 'Nyalakan Suara'}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-600 rounded-lg cursor-pointer transition-transform"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />}
            </button>
            <button
              onClick={() => {
                sounds.playButtonClick();
                onOpenMenu();
              }}
              title="Menu Game"
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-600 rounded-lg cursor-pointer transition-transform flex items-center gap-1 text-[11px]"
            >
              <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              <span className="hidden md:inline font-bold">MENU</span>
            </button>
          </div>

        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-900/90 border border-slate-700 rounded-full h-1.5 overflow-hidden shadow-inner">
          <div
            className="h-full bg-linear-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
