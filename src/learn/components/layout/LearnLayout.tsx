import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../../hooks/useProgress';
import { getLevelFromXP, getNextLevel, getXPProgress, LEVELS } from '../../data/levels';
import { MODULES } from '../../data/modules';
import { cn } from '@/lib/utils';
import { Menu, X, Flame, Trophy, ChevronRight } from 'lucide-react';

interface Props { children: React.ReactNode }

export default function LearnLayout({ children }: Props) {
  const { progress, getModuleProgress, isModuleUnlocked } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const level = getLevelFromXP(progress.totalXP);
  const nextLevel = getNextLevel(progress.totalXP);
  const xpProg = getXPProgress(progress.totalXP);

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white font-sans flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 bg-[#0f1117] border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-200',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <Link to="/learn" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <span className="text-[15px] font-bold tracking-tight">
              <span className="text-white">Crypto</span>
              <span className="text-[#00d4a1]">Edge</span>
            </span>
            <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest border border-white/10 rounded px-1.5 py-0.5">Beta</span>
          </Link>
          <button className="lg:hidden text-white/40" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Level + XP */}
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#00d4a1]/10 flex items-center justify-center">
                <Trophy size={13} className="text-[#00d4a1]" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-white">{level.name}</div>
                <div className="text-[10px] text-white/40">Level {level.level}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#ffa502]">
              <Flame size={12} />
              <span className="font-semibold">{progress.streak}</span>
            </div>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00d4a1] to-[#00b4d8] transition-all duration-500"
              style={{ width: `${xpProg.pct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-white/30">{progress.totalXP} XP total</span>
            {nextLevel && (
              <span className="text-[10px] text-white/30">{nextLevel.xpRequired - progress.totalXP} to {nextLevel.name}</span>
            )}
          </div>
        </div>

        {/* Module nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25 px-3 mb-2">Modules</div>
          {MODULES.map(mod => {
            const unlocked = isModuleUnlocked(mod.id);
            const pct = getModuleProgress(mod.id);
            const isActive = location.pathname.startsWith(`/learn/module/${mod.id}`);

            return (
              <Link
                key={mod.id}
                to={unlocked ? `/learn/module/${mod.id}` : '#'}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors group',
                  unlocked ? 'hover:bg-white/[0.04]' : 'opacity-40 cursor-not-allowed pointer-events-none',
                  isActive && 'bg-white/[0.06]'
                )}
              >
                <span className="text-base w-6 text-center">{mod.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-white truncate">{mod.title}</div>
                  {unlocked && pct > 0 && pct < 100 && (
                    <div className="w-full bg-white/[0.06] rounded-full h-0.5 mt-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: mod.color }}
                      />
                    </div>
                  )}
                  {pct === 100 && (
                    <div className="text-[10px] font-medium" style={{ color: mod.color }}>Complete ✓</div>
                  )}
                </div>
                {!unlocked && (
                  <span className="text-[10px] text-white/25">🔒</span>
                )}
                {unlocked && isActive && (
                  <ChevronRight size={12} className="text-white/30" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom badges count */}
        <div className="px-5 py-4 border-t border-white/[0.06]">
          <div className="text-[11px] text-white/30">
            {progress.badges.length} badge{progress.badges.length !== 1 ? 's' : ''} earned
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0f1117] border-b border-white/[0.06] sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60">
            <Menu size={20} />
          </button>
          <span className="text-[13px] font-bold">
            <span className="text-white">Crypto</span>
            <span className="text-[#00d4a1]">Edge</span>
          </span>
          <div className="flex items-center gap-1 text-[11px] text-[#ffa502]">
            <Flame size={12} />
            <span className="font-semibold">{progress.streak}</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
