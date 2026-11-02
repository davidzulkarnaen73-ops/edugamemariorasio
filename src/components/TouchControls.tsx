import React, { useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface TouchControlsProps {
  onInput: (control: 'left' | 'right' | 'up' | 'down' | 'jump', active: boolean) => void;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput, disabled = false }) => {
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: boolean }>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
  });

  const handleControl = useCallback(
    (control: 'left' | 'right' | 'up' | 'down' | 'jump', active: boolean) => {
      if (disabled) return;
      setActiveKeys((prev) => {
        if (prev[control] === active) return prev;
        return { ...prev, [control]: active };
      });
      onInput(control, active);
    },
    [disabled, onInput]
  );

  // Keyboard desktop event listeners
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        handleControl('left', true);
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        handleControl('right', true);
      } else if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        handleControl('up', true);
        handleControl('jump', true);
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        handleControl('down', true);
      } else if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        handleControl('jump', true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        handleControl('left', false);
      } else if (key === 'arrowright' || key === 'd') {
        handleControl('right', false);
      } else if (key === 'arrowup' || key === 'w') {
        handleControl('up', false);
        handleControl('jump', false);
      } else if (key === 'arrowdown' || key === 's') {
        handleControl('down', false);
      } else if (key === ' ' || key === 'spacebar') {
        handleControl('jump', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Release all on unmount
      ['left', 'right', 'up', 'down', 'jump'].forEach((c) =>
        handleControl(c as 'left' | 'right' | 'up' | 'down' | 'jump', false)
      );
    };
  }, [disabled, handleControl]);

  // Pointer event helper for smooth touch/hold
  const bindPointer = (control: 'left' | 'right' | 'up' | 'down' | 'jump') => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      handleControl(control, true);
    },
    onPointerUp: (e: React.PointerEvent) => {
      e.preventDefault();
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
      handleControl(control, false);
    },
    onPointerLeave: () => {
      handleControl(control, false);
    },
    onPointerCancel: () => {
      handleControl(control, false);
    },
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
    },
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-15 select-none overflow-hidden">
      {/* 
        DIRECTIONAL PAD (Bottom Left)
        Arrangement strictly following prompt D:
                 [ ATAS ]
        [ KIRI ] [ BAWAH ] [ KANAN ]
      */}
      <div
        className="absolute bottom-5 sm:bottom-6 left-4 sm:left-6 pointer-events-auto flex flex-col items-center gap-1.5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Row 1: [ ATAS ] */}
        <div className="flex justify-center">
          <button
            {...bindPointer('up')}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-75 shadow-md active:scale-95 cursor-pointer touch-none ${
              activeKeys.up
                ? 'bg-amber-400 border-white text-slate-950 scale-95 shadow-inner'
                : 'bg-slate-900/75 border-amber-400/70 text-amber-300 hover:bg-slate-800/85 hover:border-amber-300'
            }`}
            aria-label="Atas / Lompat"
          >
            <ArrowUp className="w-8 h-8 stroke-[3]" />
          </button>
        </div>

        {/* Row 2: [ KIRI ] [ BAWAH ] [ KANAN ] */}
        <div className="flex items-center gap-1.5">
          {/* KIRI */}
          <button
            {...bindPointer('left')}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-75 shadow-md active:scale-95 cursor-pointer touch-none ${
              activeKeys.left
                ? 'bg-amber-400 border-white text-slate-950 scale-95 shadow-inner'
                : 'bg-slate-900/75 border-amber-400/70 text-amber-300 hover:bg-slate-800/85 hover:border-amber-300'
            }`}
            aria-label="Gerak Kiri"
          >
            <ArrowLeft className="w-8 h-8 stroke-[3]" />
          </button>

          {/* BAWAH */}
          <button
            {...bindPointer('down')}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-75 shadow-md active:scale-95 cursor-pointer touch-none ${
              activeKeys.down
                ? 'bg-amber-400 border-white text-slate-950 scale-95 shadow-inner'
                : 'bg-slate-900/75 border-amber-400/70 text-amber-300 hover:bg-slate-800/85 hover:border-amber-300'
            }`}
            aria-label="Bawah / Jongkok"
          >
            <ArrowDown className="w-8 h-8 stroke-[3]" />
          </button>

          {/* KANAN */}
          <button
            {...bindPointer('right')}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-75 shadow-md active:scale-95 cursor-pointer touch-none ${
              activeKeys.right
                ? 'bg-amber-400 border-white text-slate-950 scale-95 shadow-inner'
                : 'bg-slate-900/75 border-amber-400/70 text-amber-300 hover:bg-slate-800/85 hover:border-amber-300'
            }`}
            aria-label="Gerak Kanan"
          >
            <ArrowRight className="w-8 h-8 stroke-[3]" />
          </button>
        </div>
      </div>

      {/* 
        JUMP BUTTON (Bottom Right)
        Size 64-72px, distinct action button with gold glow
      */}
      <div
        className="absolute bottom-5 sm:bottom-6 right-4 sm:right-6 pointer-events-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <button
          {...bindPointer('jump')}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center border-3 transition-all duration-75 shadow-xl active:scale-95 cursor-pointer touch-none ${
            activeKeys.jump
              ? 'bg-emerald-400 border-white text-slate-950 scale-95 shadow-inner'
              : 'bg-linear-to-b from-amber-500/90 to-yellow-600/90 border-amber-200 text-white hover:brightness-110'
          }`}
          aria-label="Lompat"
        >
          <Zap className="w-7 h-7 sm:w-8 sm:h-8 fill-current stroke-[2.5]" />
          <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase font-mono mt-0.5">
            JUMP
          </span>
        </button>
      </div>

      {/* Keyboard Helper badge on desktop */}
      <div className="hidden lg:flex absolute bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/80 border border-slate-700/80 rounded-lg px-3 py-1 text-[11px] text-slate-300 gap-3 items-center">
        <span>🎮 Kontrol Keyboard:</span>
        <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">A / D / ← →</span> Gerak
        <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">W / Spasi / ↑</span> Lompat
      </div>
    </div>
  );
};
