import React from 'react';
import { Play, HelpCircle, Layers, Sparkles, BookOpen, GraduationCap, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenInstructions: () => void;
  onOpenLevelSelect: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenInstructions,
  onOpenLevelSelect,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xs select-none overflow-y-auto">
      {/* Top Learning Configuration Badge */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-amber-500/50 rounded-2xl p-2.5 sm:p-3 text-xs shadow-lg">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-amber-300/80 font-mono block">
              MATA PELAJARAN & KELAS/FASE:
            </span>
            <span className="font-bold text-white text-xs sm:text-sm">
              Matematika — SD Kelas 6, Fase C
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-md">
          <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-cyan-300/80 font-mono block">
              MATERI PEMBELAJARAN:
            </span>
            <span className="font-semibold text-slate-200 text-[11px] sm:text-xs">
              Konsep & Bahasa Rasio • Tabel Rasio • Rasio Satuan • Bagian ke Keseluruhan
            </span>
          </div>
        </div>
      </div>

      {/* Main Title & Hero Banner */}
      <div className="my-auto flex flex-col items-center text-center max-w-2xl px-2">
        {/* Voxel Gold Coin Icon Emblem */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-b from-amber-400 via-yellow-500 to-amber-600 border-4 border-yellow-200 shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <span className="text-3xl sm:text-4xl font-black text-amber-950 font-mono drop-shadow">
              CQ
            </span>
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-7 h-7 text-yellow-300 drop-shadow" />
          <Award className="absolute -bottom-2 -left-2 w-6 h-6 text-amber-200 drop-shadow" />
        </div>

        {/* Game Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-amber-300 via-yellow-400 to-amber-600 drop-shadow-md uppercase">
          COIN QUEST 3D
        </h1>

        {/* Tagline */}
        <div className="mt-2 inline-block bg-amber-500/20 border border-amber-400/60 rounded-full px-4 py-1">
          <p className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wider uppercase font-mono">
            “LOMPAT, KUMPULKAN KOIN, TAKLUKKAN ILMU!”
          </p>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
          Petualangan platformer 3D voxel pixel art edukasi matematika! Kumpulkan koin emas, pecahkan blok misteri, dan selesaikan 15 soal kuis rasio & perbandingan untuk mencapai Kastel Juara!
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          {/* MULAI BERMAIN */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onStartGame();
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-linear-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-base shadow-xl border-2 border-yellow-200 flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-150 active:scale-95 hover:shadow-amber-500/30"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>MULAI BERMAIN</span>
          </button>

          {/* PILIH LEVEL */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onOpenLevelSelect();
            }}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-bold text-base border-2 border-amber-500/60 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-150 active:scale-95"
          >
            <Layers className="w-5 h-5 text-amber-400" />
            <span>PILIH LEVEL</span>
          </button>
        </div>

        {/* Secondary: PETUNJUK */}
        <button
          onClick={() => {
            sounds.playButtonClick();
            onOpenInstructions();
          }}
          className="mt-3 py-2 px-5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>PETUNJUK PERMAINAN</span>
        </button>
      </div>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl text-center py-2 text-[11px] text-slate-400 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-1">
        <span>© COIN QUEST 3D — Universal Educational Platformer</span>
        <span>Standar Kurikulum Merdeka Fase C (Kelas 6 SD)</span>
      </footer>
    </div>
  );
};
