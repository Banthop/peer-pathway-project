import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MODULES } from '../data/modules';
import { useProgress } from '../hooks/useProgress';
import { cn } from '@/lib/utils';
import { ChevronLeft, CheckCircle2, Lock, Clock, Zap } from 'lucide-react';

export default function ModuleView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const id = parseInt(moduleId ?? '1', 10);
  const mod = MODULES.find(m => m.id === id);
  const { isLessonComplete, isChallengeComplete, isModuleUnlocked, getModuleProgress } = useProgress();

  if (!mod) return <div className="text-white/40 text-center py-20">Module not found</div>;
  if (!isModuleUnlocked(id)) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="text-4xl">🔒</div>
        <h2 className="text-lg font-semibold text-white">Module Locked</h2>
        <p className="text-[13px] text-white/50">{mod.unlockCondition}</p>
        <Link to="/learn" className="inline-block text-[13px] text-[#00d4a1] underline">Back to home</Link>
      </div>
    );
  }

  const progress = getModuleProgress(id);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/learn" className="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/70 transition-colors">
        <ChevronLeft size={14} />
        All Modules
      </Link>

      {/* Header */}
      <div
        className="rounded-2xl p-6 border border-white/[0.06]"
        style={{ background: `linear-gradient(135deg, ${mod.color}12 0%, transparent 60%)` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${mod.color}20` }}
          >
            {mod.icon}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: mod.color }}>
              Module {mod.id}
            </div>
            <h1 className="text-xl font-bold text-white">{mod.title}</h1>
          </div>
        </div>
        <p className="text-[13px] text-white/60 leading-relaxed">{mod.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="text-[12px] text-white/40">
            <span className="text-white/70 font-medium">{mod.lessons.length}</span> lessons
          </div>
          <div className="text-[12px] text-white/40">
            <span className="text-white/70 font-medium">{mod.xpPool}</span> XP available
          </div>
          {progress > 0 && (
            <div className="text-[12px] font-medium" style={{ color: mod.color }}>
              {progress === 100 ? 'Complete ✓' : `${progress}% done`}
            </div>
          )}
        </div>
        {progress > 0 && progress < 100 && (
          <div className="w-full bg-white/[0.06] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: mod.color }}
            />
          </div>
        )}
      </div>

      {/* Lessons */}
      <div className="space-y-2">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-white/30 mb-3">Lessons</h2>
        {mod.lessons.map((lesson, idx) => {
          const done = isLessonComplete(lesson.id);
          const challengeDone = lesson.challengeId ? isChallengeComplete(lesson.challengeId) : null;
          const isFirst = idx === 0;
          const prevDone = idx === 0 || isLessonComplete(mod.lessons[idx - 1].id);

          return (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              moduleId={id}
              done={done}
              challengeDone={challengeDone}
              unlocked={prevDone || isFirst}
              modColor={mod.color}
              index={idx + 1}
            />
          );
        })}
      </div>
    </div>
  );
}

function LessonRow({
  lesson, moduleId, done, challengeDone, unlocked, modColor, index,
}: {
  lesson: typeof MODULES[0]['lessons'][0];
  moduleId: number;
  done: boolean;
  challengeDone: boolean | null;
  unlocked: boolean;
  modColor: string;
  index: number;
}) {
  const Wrapper = unlocked ? Link : 'div';
  const wrapperProps = unlocked ? { to: `/learn/module/${moduleId}/lesson/${lesson.id}` } : {};

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border transition-all duration-150',
        unlocked
          ? 'bg-[#0f1117] border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-px cursor-pointer'
          : 'bg-[#0f1117]/50 border-white/[0.03] opacity-50 cursor-not-allowed'
      )}
    >
      {/* Number / check */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0',
          done ? 'text-black' : 'text-white/30 bg-white/[0.04]'
        )}
        style={done ? { backgroundColor: modColor } : {}}
      >
        {done ? <CheckCircle2 size={16} /> : index}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-white truncate">{lesson.title}</div>
        <div className="text-[11px] text-white/40 truncate">{lesson.subtitle}</div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 shrink-0">
        {lesson.challengeId && (
          <div
            className={cn(
              'text-[10px] font-semibold px-2 py-0.5 rounded-full',
              challengeDone
                ? 'bg-[#00d4a1]/15 text-[#00d4a1]'
                : 'bg-white/[0.05] text-white/30'
            )}
          >
            {challengeDone ? '✓ Challenge' : '⚡ Challenge'}
          </div>
        )}
        <div className="flex items-center gap-1 text-[10px] text-white/30">
          <Clock size={10} />
          {lesson.duration}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Zap size={10} />
          {lesson.xp}
        </div>
        {!unlocked && <Lock size={12} className="text-white/20" />}
      </div>
    </Wrapper>
  );
}
