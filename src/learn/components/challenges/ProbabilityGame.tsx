import React, { useState } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { CHALLENGE_CONFIGS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { ChevronRight, RefreshCw } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

const SCENARIOS = [
  {
    id: 1,
    prior: 50,
    priorLabel: "50% chance BTC goes up today",
    evidence: "The funding rate just spiked to +0.15% (very high positive funding — extremely crowded longs)",
    evidenceType: 'bearish',
    correctPosterior: 32,
    explanation: "High positive funding means longs are over-crowded and paying a premium to stay long. This is a bearish signal that should significantly lower the probability of a sustained upward move. The posterior should be around 30-35%.",
  },
  {
    id: 2,
    prior: 50,
    priorLabel: "50% chance BTC goes up today",
    evidence: "A major exchange just moved 25,000 BTC off exchanges (large outflow to cold storage)",
    evidenceType: 'bullish',
    correctPosterior: 68,
    explanation: "Large exchange outflows mean holders are moving crypto to cold storage — they're not selling. This reduces circulating supply and is a bullish signal. The posterior should be meaningfully above 50%.",
  },
  {
    id: 3,
    prior: 50,
    priorLabel: "50% chance BTC goes up in the next hour",
    evidence: "BTC just made a new high on the 1-hour chart but CVD is making a lower high (bearish divergence)",
    evidenceType: 'bearish',
    correctPosterior: 35,
    explanation: "CVD divergence means price is moving up but buyers aren't aggressively pushing it — sellers are stepping back rather than buyers pushing forward. This is a warning sign and should reduce the probability of continued upside.",
  },
  {
    id: 4,
    prior: 60,
    priorLabel: "60% chance ETH outperforms BTC this week (based on recent momentum)",
    evidence: "BTC just broke to a new all-time high — historically, BTC dominance rises during ATH breakouts",
    evidenceType: 'bearish',
    correctPosterior: 38,
    explanation: "BTC ATH breakouts historically draw capital from altcoins into BTC. This is strong evidence against ETH outperformance and should significantly reduce the probability.",
  },
  {
    id: 5,
    prior: 40,
    priorLabel: "40% chance the market rallies this week (you're slightly bearish based on macro)",
    evidence: "The Federal Reserve just announced an unexpected pause in rate hikes (risk-on signal)",
    evidenceType: 'bullish',
    correctPosterior: 65,
    explanation: "An unexpected Fed dovish surprise is a significant risk-on catalyst. It should substantially update your prior toward a rally. The posterior should be meaningfully above your prior.",
  },
];

export default function ProbabilityGame({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const config = CHALLENGE_CONFIGS[challengeId];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [posterior, setPosterior] = useState(50);
  const [answers, setAnswers] = useState<{ posterior: number; correct: number; error: number }[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentIdx];

  function handleSubmitAnswer() {
    setAnswered(true);
  }

  function handleNext() {
    const error = Math.abs(posterior - scenario.correctPosterior);
    const newAnswers = [...answers, { posterior, correct: scenario.correctPosterior, error }];

    if (currentIdx === SCENARIOS.length - 1) {
      const avgError = newAnswers.reduce((sum, a) => sum + a.error, 0) / newAnswers.length;
      const pct = Math.max(0, Math.round(100 - avgError * 2.5));
      setScore(pct);
      setAnswers(newAnswers);
      setSubmitted(true);
      const badges: string[] = [];
      if (avgError < 10) badges.push('calibrated');
      completeChallenge(challengeId, pct, pct >= 80 ? config.xpReward + config.xpPerfect : config.xpReward, badges);
    } else {
      setAnswers(newAnswers);
      setCurrentIdx(i => i + 1);
      setPosterior(SCENARIOS[currentIdx + 1].prior);
      setAnswered(false);
    }
  }

  function handleReset() {
    setCurrentIdx(0);
    setPosterior(50);
    setAnswers([]);
    setSubmitted(false);
    setAnswered(false);
    setScore(0);
  }

  const error = Math.abs(posterior - scenario.correctPosterior);

  if (submitted) {
    const avgError = answers.reduce((sum, a) => sum + a.error, 0) / answers.length;
    return (
      <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className={cn(
          'rounded-xl p-5 text-center border',
          avgError < 10 ? 'bg-[#00d4a1]/08 border-[#00d4a1]/20' : avgError < 20 ? 'bg-[#ffa502]/08 border-[#ffa502]/20' : 'bg-[#ff4757]/08 border-[#ff4757]/20'
        )}>
          <div className="text-2xl mb-2">{avgError < 10 ? '⚖️' : avgError < 20 ? '📊' : '🎲'}</div>
          <div className="text-[16px] font-bold text-white">
            Average error: {avgError.toFixed(1)} percentage points
          </div>
          <div className="text-[12px] text-white/50 mt-1">
            {avgError < 10
              ? "Excellent calibration — you're updating on evidence like a Bayesian rationalist."
              : avgError < 20
              ? 'Good probabilistic thinking. Keep practising updating incrementally on new evidence.'
              : 'Your updates are too large or too small. Remember: evidence should shift the posterior proportional to its strength, not flip it completely.'}
          </div>
          <div className="text-[13px] font-bold mt-3" style={{ color: modColor }}>
            +{config.xpReward} XP earned
          </div>
        </div>
        <div className="space-y-2">
          {answers.map((a, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-[#0a0b0d] rounded-lg text-[11px]">
              <span className="text-white/50 truncate flex-1">{SCENARIOS[i].evidence.slice(0, 50)}…</span>
              <span className="text-white/40 mx-3">You: {a.posterior}%</span>
              <span className="font-medium" style={{ color: modColor }}>Ideal: {a.correct}%</span>
              <span className={cn('ml-3 font-bold', a.error < 10 ? 'text-[#00d4a1]' : a.error < 20 ? 'text-[#ffa502]' : 'text-[#ff4757]')}>
                ±{a.error}
              </span>
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
      <div className="text-[12px] text-white/50 leading-relaxed">
        <strong className="text-white/80">How this works:</strong> You start with a prior probability. New evidence arrives. Update your probability estimate using the slider. There's no single 'right' answer — but there are better and worse updates. This tests your Bayesian intuition.
      </div>

      {/* Progress */}
      <div className="flex gap-1.5">
        {SCENARIOS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex-1 h-1.5 rounded-full',
              i < currentIdx ? 'bg-[#00d4a1]' : i === currentIdx ? '' : 'bg-white/[0.06]'
            )}
            style={i === currentIdx ? { backgroundColor: modColor } : {}}
          />
        ))}
      </div>

      {/* Prior */}
      <div className="bg-[#0a0b0d] rounded-xl p-4 border border-white/[0.06]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/30 mb-2">Starting probability (prior)</div>
        <div className="text-[14px] font-semibold text-white">{scenario.priorLabel}</div>
        <div className="text-[18px] font-bold mt-1" style={{ color: modColor }}>{scenario.prior}%</div>
      </div>

      {/* Evidence */}
      <div
        className="rounded-xl p-4 border"
        style={{
          borderColor: scenario.evidenceType === 'bullish' ? 'rgba(0,212,161,0.3)' : 'rgba(255,71,87,0.3)',
          backgroundColor: scenario.evidenceType === 'bullish' ? 'rgba(0,212,161,0.06)' : 'rgba(255,71,87,0.06)',
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{
          color: scenario.evidenceType === 'bullish' ? '#00d4a1' : '#ff4757',
        }}>
          New Evidence
        </div>
        <p className="text-[13px] text-white/80 leading-[1.7]">{scenario.evidence}</p>
      </div>

      {/* Posterior slider */}
      {!answered && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12px] font-semibold text-white">Your updated probability</label>
            <span className="text-[18px] font-bold text-white">{posterior}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={99}
            step={1}
            value={posterior}
            onChange={e => setPosterior(parseInt(e.target.value))}
            className="w-full"
            style={{ accentColor: modColor }}
          />
          <div className="flex justify-between text-[10px] text-white/20 mt-1">
            <span>1% (very unlikely)</span>
            <span>99% (near certain)</span>
          </div>
          <div className="text-[11px] text-white/40 mt-2">
            You're shifting the probability by {posterior > scenario.prior ? '+' : ''}{posterior - scenario.prior} percentage points.
          </div>
          <button
            onClick={handleSubmitAnswer}
            className="w-full mt-4 py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: modColor }}
          >
            Submit — my updated probability is {posterior}%
          </button>
        </div>
      )}

      {/* Result */}
      {answered && (
        <div className="space-y-3">
          <div className={cn(
            'rounded-xl p-4 border',
            error < 10 ? 'bg-[#00d4a1]/05 border-[#00d4a1]/15' : error < 20 ? 'bg-[#ffa502]/05 border-[#ffa502]/15' : 'bg-[#ff4757]/05 border-[#ff4757]/15'
          )}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[12px] text-white/40">Your answer: </span>
                <span className="text-[14px] font-bold text-white">{posterior}%</span>
              </div>
              <div>
                <span className="text-[12px] text-white/40">Ideal range: </span>
                <span className="text-[14px] font-bold" style={{ color: modColor }}>
                  {scenario.correctPosterior - 8}–{scenario.correctPosterior + 8}%
                </span>
              </div>
            </div>
            <p className="text-[12px] text-white/65 leading-[1.7]">{scenario.explanation}</p>
          </div>
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: modColor }}
          >
            {currentIdx === SCENARIOS.length - 1 ? 'See final results' : 'Next scenario'}
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
