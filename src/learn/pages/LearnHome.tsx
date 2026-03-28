import React from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { MODULES } from '../data/modules';
import { getLevelFromXP, getNextLevel, getXPProgress, BADGES } from '../data/levels';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle2, Flame, Trophy, Zap } from 'lucide-react';

export default function LearnHome() {
  const { progress, isModuleUnlocked, getModuleProgress } = useProgress();
  const level = getLevelFromXP(progress.totalXP);
  const nextLevel = getNextLevel(progress.totalXP);
  const xpProg = getXPProgress(progress.totalXP);
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const doneLessons = progress.completedLessons.length;

  return (
    <div className="space-y-8">
      {/* Hero stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Trophy size={16} className="text-[#00d4a1]" />}
          label="Level"
          value={level.name}
          sub={`Lvl ${level.level}`}
          color="#00d4a1"
        />
        <StatCard
          icon={<Zap size={16} className="text-[#ffa502]" />}
          label="Total XP"
          value={`${progress.totalXP.toLocaleString()} XP`}
          sub={nextLevel ? `${nextLevel.xpRequired - progress.totalXP} to ${nextLevel.name}` : 'Max level!'}
          color="#ffa502"
        />
        <StatCard
          icon={<Flame size={16} className="text-[#ff4757]" />}
          label="Streak"
          value={`${progress.streak} day${progress.streak !== 1 ? 's' : ''}`}
          sub="Keep it going"
          color="#ff4757"
        />
        <StatCard
          icon={<CheckCircle2 size={16} className="text-[#3d84f7]" />}
          label="Lessons"
          value={`${doneLessons}/${totalLessons}`}
          sub={`${Math.round((doneLessons / totalLessons) * 100)}% complete`}
          color="#3d84f7"
        />
      </div>

      {/* XP progress bar */}
      {nextLevel && (
        <div className="bg-[#0f1117] rounded-xl border border-white/[0.06] p-4">
          <div className="flex justify-between text-[11px] text-white/40 mb-2">
            <span>{level.name} · Level {level.level}</span>
            <span>{xpProg.current}/{xpProg.next} XP → {nextLevel.name}</span>
          </div>
          <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00d4a1] to-[#00b4d8] transition-all duration-700"
              style={{ width: `${xpProg.pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Welcome blurb — shown until first lesson done */}
      {doneLessons === 0 && (
        <div className="bg-gradient-to-br from-[#00d4a1]/10 to-transparent border border-[#00d4a1]/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Welcome to your hyperbolic time chamber 🏋️</h2>
          <p className="text-[13px] text-white/60 leading-relaxed">
            This isn't a normal trading course. There are no indicators to memorise. No magic patterns to copy. Instead, you're going to learn to think like a quant — in probabilities, expected values, and risk-adjusted returns.
            <br /><br />
            Each module builds on the last. Complete the lessons, crush the challenges, earn XP. By the time you're done, you won't just understand crypto trading — you'll understand why most traders lose, and exactly how to be different.
          </p>
          <div className="mt-4">
            <Link
              to="/learn/module/1"
              className="inline-flex items-center gap-2 bg-[#00d4a1] text-black text-[13px] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#00d4a1]/90 transition-colors"
            >
              Start Module 1 →
            </Link>
          </div>
        </div>
      )}

      {/* Module grid */}
      <div>
        <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-widest mb-4">Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODULES.map(mod => {
            const unlocked = isModuleUnlocked(mod.id);
            const pct = getModuleProgress(mod.id);
            const complete = pct === 100;

            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                unlocked={unlocked}
                progress={pct}
                complete={complete}
              />
            );
          })}
        </div>
      </div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <div>
          <h2 className="text-[13px] font-semibold text-white/50 uppercase tracking-widest mb-4">Badges Earned</h2>
          <div className="flex flex-wrap gap-3">
            {BADGES.filter(b => progress.badges.includes(b.id)).map(badge => (
              <div
                key={badge.id}
                className="flex items-center gap-2 bg-[#0f1117] border border-white/[0.06] rounded-lg px-3 py-2"
                title={badge.description}
              >
                <span className="text-base">{badge.icon}</span>
                <span className="text-[12px] font-medium text-white">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{label}</span>
      </div>
      <div className="text-[15px] font-bold text-white">{value}</div>
      <div className="text-[11px] text-white/30 mt-0.5">{sub}</div>
    </div>
  );
}

function ModuleCard({
  mod, unlocked, progress, complete,
}: {
  mod: typeof MODULES[0];
  unlocked: boolean;
  progress: number;
  complete: boolean;
}) {
  const Wrapper = unlocked ? Link : 'div';
  const wrapperProps = unlocked ? { to: `/learn/module/${mod.id}` } : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        'block bg-[#0f1117] border rounded-xl p-5 transition-all duration-200 group',
        unlocked
          ? 'border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-lg cursor-pointer'
          : 'border-white/[0.04] opacity-60 cursor-not-allowed'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${mod.color}15` }}
          >
            {mod.icon}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: mod.color }}>
              Module {mod.id}
            </div>
            <div className="text-[14px] font-semibold text-white leading-tight">{mod.title}</div>
          </div>
        </div>
        {!unlocked && <Lock size={14} className="text-white/25 mt-1" />}
        {complete && <CheckCircle2 size={16} style={{ color: mod.color }} />}
      </div>

      <p className="text-[12px] text-white/50 leading-relaxed mb-4 line-clamp-2">{mod.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-[11px] text-white/30">
          {mod.lessons.length} lessons · {mod.xpPool} XP
        </div>
        {unlocked && progress > 0 && (
          <div className="text-[11px] font-medium" style={{ color: mod.color }}>
            {complete ? 'Complete ✓' : `${progress}% done`}
          </div>
        )}
        {!unlocked && (
          <div className="text-[11px] text-white/25">{mod.unlockCondition}</div>
        )}
      </div>

      {unlocked && progress > 0 && !complete && (
        <div className="w-full bg-white/[0.06] rounded-full h-1 mt-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: mod.color }}
          />
        </div>
      )}
    </Wrapper>
  );
}
