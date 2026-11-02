import React, { useEffect } from 'react';
import { Trophy, Star, RotateCcw, Home, RefreshCw, Award, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface ResultsScreenProps {
  score: number;
  coinsCount: number;
  solvedCount: number; // out of 15
  firstTryCount: number;
  retriedCount: number;
  onPlayAgain: () => void;
  onRetryLevel: () => void;
  onReturnToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  coinsCount,
  solvedCount,
  firstTryCount,
  retriedCount,
  onPlayAgain,
  onRetryLevel,
  onReturnToMenu,
}) => {
  const TOTAL_QUESTIONS = 15;

  // Formula as strictly defined in Section K:
  // First Try Success Rate = (firstTryCount / 15) * 100%
  const firstTryPercentage = Math.round((firstTryCount / TOTAL_QUESTIONS) * 100);

  // Final Completion Rate = (solvedCount / 15) * 100%
  const completionPercentage = Math.round((solvedCount / TOTAL_QUESTIONS) * 100);

  // Categories based on firstTryPercentage:
  // 90–100: SUPER CHAMPION!
  // 80–89: GOLD ADVENTURER!
  // 70–79: SMART EXPLORER!
  // < 70: KEEP PRACTICING!
  let categoryTitle = 'KEEP PRACTICING!';
  let categoryColor = 'text-amber-400';
  let stars = 1;
  let motivationalMessage = 'Teruslah berlatih! Setiap kesalahan adalah batu loncatan menuju pemahaman rasio yang lebih mantap!';

  if (firstTryPercentage >= 90) {
    categoryTitle = 'SUPER CHAMPION!';
    categoryColor = 'text-yellow-400';
    stars = 5;
    motivationalMessage = 'Luar biasa spektakuler! Kamu adalah Juara Sejati dalam menguasai konsep dan aplikasi rasio matematika SD Kelas 6!';
  } else if (firstTryPercentage >= 80) {
    categoryTitle = 'GOLD ADVENTURER!';
    categoryColor = 'text-amber-300';
    stars = 4;
    motivationalMessage = 'Hebat sekali! Pemahaman rasiomu sangat solid dan kamu mampu memecahkan masalah matematika dengan sangat teliti!';
  } else if (firstTryPercentage >= 70) {
    categoryTitle = 'SMART EXPLORER!';
    categoryColor = 'text-emerald-300';
    stars = 3;
    motivationalMessage = 'Bagus sekali! Kamu telah menyelesaikan petualangan rasio dengan pemahaman yang baik!';
  }

  useEffect(() => {
    sounds.playLevelComplete();
    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.4 },
        colors: ['#f59e0b', '#fbbf24', '#3b82f6', '#10b981', '#ec4899'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="absolute inset-0 z-35 flex items-center justify-center p-3 sm:p-6 bg-slate-950/92 backdrop-blur-md select-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border-3 border-amber-400 rounded-3xl shadow-2xl p-4 sm:p-6 text-white my-auto flex flex-col items-center text-center">
        
        {/* Trophy & Stars Header */}
        <div className="relative mb-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-b from-amber-400 to-yellow-600 border-2 border-yellow-200 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-slate-950 drop-shadow" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-spin" />
        </div>

        {/* Big Congratulation Title */}
        <h2 className="text-xl sm:text-3xl font-black text-amber-300 tracking-tight uppercase">
          SELAMAT! PETUALANGAN SELESAI!
        </h2>

        {/* Category Badge */}
        <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400 px-4 py-1 rounded-full">
          <Award className="w-4 h-4 text-amber-400" />
          <span className={`text-sm sm:text-base font-black tracking-wider uppercase font-mono ${categoryColor}`}>
            {categoryTitle}
          </span>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 my-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 sm:w-7 sm:h-7 ${
                i <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow'
                  : 'text-slate-700 fill-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Educational Identity Block */}
        <div className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-3 my-2 text-left text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-[10px] text-amber-300 font-mono uppercase block">Mata Pelajaran:</span>
              <strong className="text-white">Matematika</strong>
            </div>
            <div>
              <span className="text-[10px] text-amber-300 font-mono uppercase block">Kelas & Fase:</span>
              <strong className="text-white">SD Kelas 6, Fase C</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] text-amber-300 font-mono uppercase block">Materi Pelajaran:</span>
              <span className="text-slate-200">
                Memahami konsep & bahasa rasio, tabel rasio senilai, rasio satuan, dan rasio bagian terhadap keseluruhan.
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 my-2 text-xs">
          {/* Total Score */}
          <div className="bg-slate-800/90 border border-amber-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-amber-300 block">TOTAL SKOR</span>
            <span className="text-lg sm:text-xl font-mono font-black text-amber-400">
              {score}
            </span>
          </div>

          {/* Coins Collected */}
          <div className="bg-slate-800/90 border border-amber-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-amber-300 block">KOIN DIKUMPULKAN</span>
            <span className="text-lg sm:text-xl font-mono font-black text-yellow-300">
              {coinsCount}
            </span>
          </div>

          {/* First Try Correct */}
          <div className="bg-slate-800/90 border border-emerald-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-emerald-400 block">BENAR 1ST TRY</span>
            <span className="text-lg sm:text-xl font-mono font-black text-emerald-400">
              {firstTryCount} / {TOTAL_QUESTIONS}
            </span>
          </div>

          {/* Retried Questions */}
          <div className="bg-slate-800/90 border border-rose-500/40 p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-rose-300 block">SEMPAT SALAH</span>
            <span className="text-lg sm:text-xl font-mono font-black text-rose-300">
              {retriedCount}
            </span>
          </div>
        </div>

        {/* Key Educational Metrics (First Try % vs Completion %) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 my-1 text-xs">
          <div className="bg-indigo-950/70 border border-indigo-500/40 p-2.5 rounded-xl text-left flex items-center justify-between">
            <div>
              <span className="text-[11px] text-indigo-300 font-bold block">Keberhasilan Percobaan Pertama:</span>
              <span className="text-[10px] text-indigo-200/80">({firstTryCount} ÷ 15) × 100%</span>
            </div>
            <span className="text-lg sm:text-xl font-mono font-black text-indigo-200">
              {firstTryPercentage}%
            </span>
          </div>

          <div className="bg-emerald-950/70 border border-emerald-500/40 p-2.5 rounded-xl text-left flex items-center justify-between">
            <div>
              <span className="text-[11px] text-emerald-300 font-bold block">Nilai Penyelesaian Akhir:</span>
              <span className="text-[10px] text-emerald-200/80">({solvedCount} ÷ 15) × 100%</span>
            </div>
            <span className="text-lg sm:text-xl font-mono font-black text-emerald-300">
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Motivational Message */}
        <p className="mt-3 text-xs sm:text-sm text-slate-200 italic max-w-lg leading-relaxed bg-slate-800/50 p-2.5 rounded-xl border border-slate-700">
          “{motivationalMessage}”
        </p>

        {/* Three Required Action Buttons */}
        <div className="mt-5 w-full flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {/* MAIN LAGI (Reset Sesi Penuh) */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onPlayAgain();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md border border-yellow-200 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN LAGI</span>
          </button>

          {/* ULANGI LEVEL (Pilih Level) */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onRetryLevel();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/60 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>ULANGI LEVEL</span>
          </button>

          {/* KEMBALI KE MENU */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onReturnToMenu();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-95"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>KEMBALI KE MENU</span>
          </button>
        </div>

      </div>
    </div>
  );
};
