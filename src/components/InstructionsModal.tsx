import React from 'react';
import { X, Play, ArrowRight, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface InstructionsModalProps {
  onClose: () => void;
  onStartGame: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose, onStartGame }) => {
  return (
    <div className="absolute inset-0 z-35 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xs select-none">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-amber-400 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
              PETUNJUK PERMAINAN COIN QUEST 3D
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

        {/* Content (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-200">
          {/* Section 1: Kontrol */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5">
            <h3 className="font-extrabold text-amber-400 text-sm mb-2 flex items-center gap-1.5">
              <span>🎮 KONTROL KARAKTER</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700">
                <span className="font-bold text-cyan-300 block mb-1">Sentuh Layar (On-Screen D-Pad):</span>
                <p>• <strong>KIRI (←) / KANAN (→):</strong> Bergerak ke kiri dan kanan.</p>
                <p>• <strong>ATAS (↑) / JUMP:</strong> Melompat ke platform atau menyundul blok.</p>
                <p>• <strong>BAWAH (↓):</strong> Jongkok / turun platform.</p>
              </div>
              <div className="bg-slate-900/70 p-2.5 rounded-xl border border-slate-700">
                <span className="font-bold text-cyan-300 block mb-1">Keyboard Desktop:</span>
                <p>• <strong>A / D atau Panah Kiri / Kanan:</strong> Bergerak.</p>
                <p>• <strong>W, Spasi, atau Panah Atas:</strong> Melompat.</p>
                <p>• <strong>S atau Panah Bawah:</strong> Jongkok.</p>
              </div>
            </div>
          </div>

          {/* Section 2: Koin & Blok Misteri */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5">
            <h3 className="font-extrabold text-amber-400 text-sm mb-2 flex items-center gap-1.5">
              <span>💰 KOIN & BLOK MISTERI</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 bg-slate-900/70 p-2.5 rounded-xl border border-slate-700">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center shrink-0 text-xs">
                  $
                </div>
                <div>
                  <strong className="text-amber-300">Koin Emas Biasa:</strong>
                  <p className="text-slate-300">Memberikan <strong>+10 poin</strong> dan menambah 1 koin. Tersebar di atas platform.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-900/70 p-2.5 rounded-xl border border-amber-500/40">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center shrink-0 text-xs border border-yellow-200 shadow">
                  ⭐
                </div>
                <div>
                  <strong className="text-amber-300">Koin Edukasi (Bintang Emas):</strong>
                  <p className="text-slate-300">Membuka <strong>Panel Kuis Soal Matematika</strong>. Karakter berhenti sementara dan tetap terlihat di dunia 3D. Menjawab benar menghasilkan <strong>+100 poin</strong>!</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-900/70 p-2.5 rounded-xl border border-slate-700">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white font-black flex items-center justify-center shrink-0 text-xs">
                  ?
                </div>
                <div>
                  <strong className="text-amber-300">Blok Misteri (?):</strong>
                  <p className="text-slate-300">Sundul dari bawah saat melompat untuk memunculkan koin emas atau kuis edukasi rahasia.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Tiga Level Petualangan */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3.5">
            <h3 className="font-extrabold text-amber-400 text-sm mb-2">
              🏆 STRUKTUR 3 LEVEL PETUALANGAN
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Level 1 — Dunia Eksplorasi:</strong> 5 Soal Pemahaman Konsep & Bahasa Rasio.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Level 2 — Jembatan Tantangan:</strong> 5 Soal Tabel Rasio, Rasio Senilai & Rasio Satuan.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Level 3 — Kastel Juara:</strong> 5 Soal Penalaran Rasio Bagian ke Bagian & Keseluruhan.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer with Start Button */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex justify-between items-center gap-3">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onClose();
            }}
            className="px-4 py-2 text-slate-300 hover:text-white font-semibold cursor-pointer text-xs sm:text-sm"
          >
            KEMBALI
          </button>
          <button
            onClick={() => {
              sounds.playButtonClick();
              onStartGame();
            }}
            className="px-6 py-2.5 bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black rounded-xl border border-yellow-200 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 text-xs sm:text-sm shadow-md"
          >
            <span>MULAI BERMAIN SEKARANG</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
