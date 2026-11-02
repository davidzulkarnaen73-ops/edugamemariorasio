import React from 'react';
import { X, Lock, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { LEVEL_CONFIG } from '../data/questionBank';
import { sounds } from '../utils/soundEffects';

interface LevelSelectModalProps {
  unlockedLevels: { 1: boolean; 2: boolean; 3: boolean };
  onSelectLevel: (lvl: 1 | 2 | 3) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  unlockedLevels,
  onSelectLevel,
  onClose,
}) => {
  const levels: (1 | 2 | 3)[] = [1, 2, 3];

  return (
    <div className="absolute inset-0 z-35 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
              PILIH TAHAP LEVEL
            </h2>
          </div>
          <button
            onClick={() => {
              sounds.playButtonClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Cards */}
        <div className="p-4 sm:p-6 space-y-3">
          {levels.map((lvl) => {
            const conf = LEVEL_CONFIG[lvl];
            const isUnlocked = unlockedLevels[lvl];

            return (
              <div
                key={lvl}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-slate-800/80 border-amber-400/70 hover:border-amber-300 hover:bg-slate-800 shadow-md cursor-pointer'
                    : 'bg-slate-900/50 border-slate-700/60 opacity-60 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    sounds.playButtonClick();
                    onSelectLevel(lvl);
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 shrink-0 ${
                      isUnlocked
                        ? 'bg-amber-400 border-amber-200 text-slate-950'
                        : 'bg-slate-800 border-slate-600 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? lvl : <Lock className="w-5 h-5 text-slate-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                        {conf.name}
                      </span>
                      {isUnlocked && (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/40">
                          TERBUKA
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      {conf.title}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      {conf.subtitle} (Soal #{conf.questionsRange[0]}–#{conf.questionsRange[1]})
                    </p>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sounds.playButtonClick();
                        onSelectLevel(lvl);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>MAINKAN</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Terkunci</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onClose();
            }}
            className="px-4 py-2 text-slate-300 hover:text-white font-semibold cursor-pointer text-xs sm:text-sm"
          >
            TUTUP
          </button>
        </div>
      </div>
    </div>
  );
};
