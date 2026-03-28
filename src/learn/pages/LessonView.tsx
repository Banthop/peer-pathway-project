import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MODULES } from '../data/modules';
import { CHALLENGE_CONFIGS } from '../data/challenges';
import { useProgress } from '../hooks/useProgress';
import type { LessonSection } from '../types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Zap, CheckCircle2 } from 'lucide-react';
import EVCalculator from '../components/challenges/EVCalculator';
import KellyCriterion from '../components/challenges/KellyCriterion';
import RiskRuin from '../components/challenges/RiskRuin';
import BiasDetector from '../components/challenges/BiasDetector';
import ProbabilityGame from '../components/challenges/ProbabilityGame';
import OrderBook from '../components/challenges/OrderBook';
import FundingArb from '../components/challenges/FundingArb';

export default function LessonView() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const navigate = useNavigate();
  const modId = parseInt(moduleId ?? '1', 10);
  const mod = MODULES.find(m => m.id === modId);
  const lesson = mod?.lessons.find(l => l.id === lessonId);
  const { isLessonComplete, completeLesson, isChallengeComplete } = useProgress();
  const [readComplete, setReadComplete] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const alreadyDone = lesson ? isLessonComplete(lesson.id) : false;
  const challengeDone = lesson?.challengeId ? isChallengeComplete(lesson.challengeId) : false;

  // Auto-detect scroll to bottom
  useEffect(() => {
    if (alreadyDone) { setReadComplete(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setReadComplete(true); },
      { threshold: 0.5 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [alreadyDone]);

  if (!mod || !lesson) return (
    <div className="text-white/40 text-center py-20">Lesson not found</div>
  );

  const lessons = mod.lessons;
  const currentIdx = lessons.findIndex(l => l.id === lessonId);
  const prevLesson = lessons[currentIdx - 1];
  const nextLesson = lessons[currentIdx + 1];

  function handleMarkRead() {
    if (alreadyDone) return;
    completeLesson(lesson!.id, lesson!.xp);
    setXpEarned(lesson!.xp);
    setReadComplete(true);
    setTimeout(() => setXpEarned(null), 3000);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] text-white/30">
        <Link to="/learn" className="hover:text-white/60 transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/learn/module/${modId}`} className="hover:text-white/60 transition-colors">{mod.title}</Link>
        <span>/</span>
        <span className="text-white/50 truncate">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color: mod.color, backgroundColor: `${mod.color}15` }}
          >
            Module {mod.id} · Lesson {currentIdx + 1}
          </span>
          <span className="text-[11px] text-white/30">{lesson.duration}</span>
          <span className="flex items-center gap-1 text-[11px] text-[#ffa502]">
            <Zap size={10} />
            {lesson.xp} XP
          </span>
          {alreadyDone && (
            <span className="flex items-center gap-1 text-[11px] text-[#00d4a1]">
              <CheckCircle2 size={11} /> Done
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
        <p className="text-[14px] text-white/50 mt-1">{lesson.subtitle}</p>
      </div>

      {/* XP notification */}
      {xpEarned && (
        <div className="fixed top-6 right-6 z-50 bg-[#00d4a1] text-black text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-2xl animate-fade-up">
          +{xpEarned} XP ⚡
        </div>
      )}

      {/* Lesson content */}
      <div className="space-y-4">
        {lesson.content.map((section, i) => (
          <SectionRenderer key={i} section={section} color={mod.color} />
        ))}
      </div>

      {/* Scroll target */}
      <div ref={bottomRef} className="h-1" />

      {/* Mark as read CTA */}
      {!alreadyDone && readComplete && (
        <div className="border-t border-white/[0.06] pt-6">
          <button
            onClick={handleMarkRead}
            className="w-full py-3 rounded-xl font-semibold text-[14px] text-black transition-all hover:opacity-90"
            style={{ backgroundColor: mod.color }}
          >
            ✓ Mark lesson complete — earn {lesson.xp} XP
          </button>
        </div>
      )}

      {/* Challenge section */}
      {lesson.challengeId && (alreadyDone || readComplete) && (
        <ChallengeSection
          challengeId={lesson.challengeId}
          done={challengeDone}
          modColor={mod.color}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
        {prevLesson ? (
          <Link
            to={`/learn/module/${modId}/lesson/${prevLesson.id}`}
            className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/70 transition-colors"
          >
            <ChevronLeft size={14} />
            <span>{prevLesson.title}</span>
          </Link>
        ) : (
          <Link
            to={`/learn/module/${modId}`}
            className="flex items-center gap-2 text-[12px] text-white/40 hover:text-white/70 transition-colors"
          >
            <ChevronLeft size={14} />
            Back to module
          </Link>
        )}

        {nextLesson ? (
          <Link
            to={`/learn/module/${modId}/lesson/${nextLesson.id}`}
            className="flex items-center gap-2 text-[12px] font-medium hover:opacity-80 transition-opacity"
            style={{ color: mod.color }}
          >
            <span>{nextLesson.title}</span>
            <ChevronRight size={14} />
          </Link>
        ) : (
          <Link
            to={`/learn/module/${modId}`}
            className="flex items-center gap-2 text-[12px] font-medium hover:opacity-80 transition-opacity"
            style={{ color: mod.color }}
          >
            <span>Module complete →</span>
          </Link>
        )}
      </div>
    </div>
  );
}

function SectionRenderer({ section, color }: { section: LessonSection; color: string }) {
  switch (section.type) {
    case 'heading':
      return (
        <h2 className="text-[17px] font-bold text-white mt-6 mb-1">{section.text}</h2>
      );

    case 'text':
      return (
        <p className="text-[14px] text-white/75 leading-[1.8]">{section.text}</p>
      );

    case 'analogy':
      return (
        <div
          className="rounded-xl p-4 border-l-[3px]"
          style={{ backgroundColor: `${color}08`, borderColor: color }}
        >
          {section.label && (
            <div
              className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2"
              style={{ color }}
            >
              {section.label}
            </div>
          )}
          <p className="text-[13px] text-white/80 leading-[1.75] italic">{section.text}</p>
        </div>
      );

    case 'keypoint':
      return (
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#ffa502] mb-2">Key Insight</div>
          <p className="text-[13px] text-white/80 font-medium leading-[1.75]">{section.text}</p>
        </div>
      );

    case 'formula':
      return (
        <div className="bg-[#0a0b0d] border border-white/[0.1] rounded-xl p-4 font-mono">
          {section.label && (
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#3d84f7] mb-2 font-sans">
              {section.label}
            </div>
          )}
          <pre className="text-[12px] text-white/80 leading-[1.8] whitespace-pre-wrap font-mono">
            {section.text}
          </pre>
        </div>
      );

    case 'warning':
      return (
        <div className="bg-[#ff4757]/08 border border-[#ff4757]/20 rounded-xl p-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#ff4757] mb-2">⚠ Watch Out</div>
          <p className="text-[13px] text-white/70 leading-[1.75]">{section.text}</p>
        </div>
      );

    case 'example':
      return (
        <div className="bg-[#3d84f7]/08 border border-[#3d84f7]/15 rounded-xl p-4">
          {section.label && (
            <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#3d84f7] mb-2">
              {section.label}
            </div>
          )}
          <p className="text-[13px] text-white/75 leading-[1.75]">{section.text}</p>
        </div>
      );

    case 'divider':
      return <hr className="border-white/[0.06]" />;

    default:
      return null;
  }
}

function ChallengeSection({
  challengeId, done, modColor,
}: {
  challengeId: string;
  done: boolean;
  modColor: string;
}) {
  const config = CHALLENGE_CONFIGS[challengeId];
  if (!config) return null;

  return (
    <div className="border-t border-white/[0.06] pt-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#ffa502] mb-1">
            ⚡ Challenge
          </div>
          <h2 className="text-lg font-bold text-white">{config.title}</h2>
          <p className="text-[12px] text-white/50 mt-0.5">{config.description}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <div className="text-[11px] text-white/30">Reward</div>
          <div className="text-[15px] font-bold" style={{ color: modColor }}>
            +{config.xpReward} XP
          </div>
          {done && (
            <div className="text-[10px] text-[#00d4a1] flex items-center justify-end gap-1">
              <CheckCircle2 size={10} /> Completed
            </div>
          )}
        </div>
      </div>

      <ChallengeRenderer challengeId={challengeId} modColor={modColor} />
    </div>
  );
}

function ChallengeRenderer({ challengeId, modColor }: { challengeId: string; modColor: string }) {
  const config = CHALLENGE_CONFIGS[challengeId];
  if (!config) return null;

  switch (config.type) {
    case 'ev-calculator':
      return <EVCalculator challengeId={challengeId} modColor={modColor} />;
    case 'kelly-criterion':
      return <KellyCriterion challengeId={challengeId} modColor={modColor} />;
    case 'risk-ruin':
      return <RiskRuin challengeId={challengeId} modColor={modColor} />;
    case 'bias-detector':
      return <BiasDetector challengeId={challengeId} modColor={modColor} />;
    case 'probability-game':
      return <ProbabilityGame challengeId={challengeId} modColor={modColor} />;
    case 'order-book':
      return <OrderBook challengeId={challengeId} modColor={modColor} />;
    case 'funding-arb':
      return <FundingArb challengeId={challengeId} modColor={modColor} />;
    default:
      return null;
  }
}
