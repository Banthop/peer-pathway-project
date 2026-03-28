import React, { useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { BIAS_SCENARIOS } from '../../data/challenges';
import { CHALLENGE_CONFIGS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, ChevronRight, RefreshCw } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

export default function BiasDetector({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const config = CHALLENGE_CONFIGS[challengeId];
  const alreadyDone = isChallengeComplete(challengeId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = BIAS_SCENARIOS[currentIdx];
  const answered = selected !== null;

  function handleSelect(optIdx: number) {
    if (answered) return;
    setSelected(optIdx);
  }

  function handleNext() {
    const correct = selected === scenario.correct;
    const newAnswers = [...answers, correct];

    if (currentIdx === BIAS_SCENARIOS.length - 1) {
      const correctCount = newAnswers.filter(Boolean).length;
      const pct = Math.round((correctCount / BIAS_SCENARIOS.length) * 100);
      setScore(pct);
      setAnswers(newAnswers);
      setFinished(true);

      const badges: string[] = [];
      if (pct >= 80) badges.push('bias-free');
      completeChallenge(challengeId, pct, pct === 100 ? config.xpReward + config.xpPerfect : config.xpReward, badges);
    } else {
      setAnswers(newAnswers);
      setCurrentIdx(i => i + 1);
      setSelected(null);
    }
  }

  function handleReset() {
    setCurrentIdx(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setScore(0);
  }

  if (finished) {
    const correctCount = answers.filter(Boolean).length;
    return (
      <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className={cn(
          'rounded-xl p-5 text-center border',
          score >= 80 ? 'bg-[#00d4a1]/08 border-[#00d4a1]/20' : score >= 60 ? 'bg-[#ffa502]/08 border-[#ffa502]/20' : 'bg-[#ff4757]/08 border-[#ff4757]/20'
        )}>
          <div className="text-3xl mb-2">
            {score >= 80 ? '🧠' : score >= 60 ? '📚' : '💡'}
          </div>
          <div className="text-[18px] font-bold text-white">{correctCount}/{BIAS_SCENARIOS.length} correct</div>
          <div className="text-[13px] text-white/50 mt-1">
            {score >= 80 ? 'Excellent bias awareness. You understand the traps at a deep level.' :
             score >= 60 ? 'Good understanding. Review the explanations for the ones you missed.' :
             'These biases are subtle — most traders never learn to spot them. Review the explanations and try again.'}
          </div>
          <div className="text-[13px] font-bold mt-3" style={{ color: modColor }}>
            +{config.xpReward} XP earned
          </div>
        </div>

        {/* Answer review */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Review your answers</div>
          {BIAS_SCENARIOS.map((s, i) => (
            <div key={s.id} className={cn(
              'flex items-center gap-2 p-2.5 rounded-lg text-[11px]',
              answers[i] ? 'bg-[#00d4a1]/05' : 'bg-[#ff4757]/05'
            )}>
              {answers[i]
                ? <CheckCircle2 size={12} className="text-[#00d4a1] shrink-0" />
                : <XCircle size={12} className="text-[#ff4757] shrink-0" />}
              <span className="text-white/60 truncate">{s.scenario.slice(0, 80)}…</span>
              <span className="text-white/40 shrink-0 font-medium">{s.options[s.correct]}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-white/50 border border-white/[0.06] hover:text-white/80 transition-colors"
        >
          <RefreshCw size={12} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5 flex-1">
          {BIAS_SCENARIOS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-colors',
                i < currentIdx ? (answers[i] ? 'bg-[#00d4a1]' : 'bg-[#ff4757]') :
                i === currentIdx ? '' : 'bg-white/[0.06]'
              )}
              style={i === currentIdx ? { backgroundColor: modColor } : {}}
            />
          ))}
        </div>
        <span className="text-[11px] text-white/30 shrink-0">{currentIdx + 1}/{BIAS_SCENARIOS.length}</span>
      </div>

      {/* Scenario */}
      <div className="bg-[#0a0b0d] rounded-xl p-4 border border-white/[0.06]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">Scenario</div>
        <p className="text-[13px] text-white/80 leading-[1.75]">{scenario.scenario}</p>
      </div>

      {/* Question */}
      <div className="text-[13px] font-semibold text-white">What cognitive bias is this trader experiencing?</div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {scenario.options.map((opt, i) => {
          const isCorrect = i === scenario.correct;
          const isSelected = selected === i;
          const showResult = answered;

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(
                'p-3 rounded-lg text-[12px] font-medium text-left border transition-all',
                !showResult ? 'border-white/[0.08] bg-[#0a0b0d] hover:border-white/[0.2] hover:bg-white/[0.04] text-white/70' : '',
                showResult && isCorrect ? 'border-[#00d4a1]/50 bg-[#00d4a1]/08 text-[#00d4a1]' : '',
                showResult && isSelected && !isCorrect ? 'border-[#ff4757]/50 bg-[#ff4757]/08 text-[#ff4757]' : '',
                showResult && !isSelected && !isCorrect ? 'border-white/[0.04] bg-transparent text-white/30' : '',
              )}
            >
              <div className="flex items-center gap-2">
                {showResult && isCorrect && <CheckCircle2 size={12} />}
                {showResult && isSelected && !isCorrect && <XCircle size={12} />}
                {opt}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={cn(
          'rounded-xl p-4 border text-[12px] leading-[1.75]',
          selected === scenario.correct
            ? 'bg-[#00d4a1]/05 border-[#00d4a1]/15 text-white/70'
            : 'bg-[#ff4757]/05 border-[#ff4757]/15 text-white/70'
        )}>
          <div className={cn('font-bold mb-1', selected === scenario.correct ? 'text-[#00d4a1]' : 'text-[#ff4757]')}>
            {selected === scenario.correct ? '✓ Correct!' : `✗ The correct answer is: ${scenario.options[scenario.correct]}`}
          </div>
          {scenario.explanation}
        </div>
      )}

      {/* Next */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: modColor }}
        >
          {currentIdx === BIAS_SCENARIOS.length - 1 ? 'See results' : 'Next scenario'}
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
