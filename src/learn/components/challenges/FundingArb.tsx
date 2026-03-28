import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProgress } from '../../hooks/useProgress';
import { CHALLENGE_CONFIGS, FUNDING_SCENARIOS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

type Action = 'long' | 'short' | 'flat';
type Size = 'small' | 'medium' | 'large' | 'none';

const SIZE_MULTIPLIER = { none: 0, small: 1, medium: 2, large: 3 };
const BASE_POSITION = 1000; // £1,000 per unit

export default function FundingArb({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const config = CHALLENGE_CONFIGS[challengeId];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [action, setAction] = useState<Action | null>(null);
  const [size, setSize] = useState<Size>('small');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ pnl: number; optimalPnl: number; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = FUNDING_SCENARIOS[currentIdx];

  const chartData = scenario.fundingHistory.map((rate, i) => ({
    period: `${i * 8}h`,
    rate: rate * 100,
  }));

  function calcPnl(userAction: Action, userSize: Size, outcome: typeof scenario.outcome): number {
    const mult = SIZE_MULTIPLIER[userSize];
    const position = BASE_POSITION * mult;
    const direction = outcome.direction === 'up' ? 1 : outcome.direction === 'down' ? -1 : 0;
    const magnitude = parseFloat(outcome.magnitude) / 100;
    const actionDir = userAction === 'long' ? 1 : userAction === 'short' ? -1 : 0;
    return parseFloat((position * direction * magnitude * actionDir).toFixed(2));
  }

  function calcOptimalPnl(outcome: typeof scenario.outcome): number {
    const optAction: Action = scenario.optimalAction as Action;
    const optSize: Size = scenario.optimalSize as Size;
    const mult = SIZE_MULTIPLIER[optSize];
    const position = BASE_POSITION * mult;
    const direction = outcome.direction === 'up' ? 1 : outcome.direction === 'down' ? -1 : 0;
    const magnitude = parseFloat(outcome.magnitude) / 100;
    const actionDir = optAction === 'long' ? 1 : optAction === 'short' ? -1 : 0;
    return parseFloat((position * direction * magnitude * actionDir).toFixed(2));
  }

  function handleSubmit() {
    if (!action) return;
    const pnl = calcPnl(action, size, scenario.outcome);
    const optimalPnl = calcOptimalPnl(scenario.outcome);
    const correct = action === scenario.optimalAction;
    setResults(prev => [...prev, { pnl, optimalPnl, correct }]);
    setSubmitted(true);
  }

  function handleNext() {
    if (currentIdx === FUNDING_SCENARIOS.length - 1) {
      const allResults = results;
      const correctCount = allResults.filter(r => r.correct).length;
      const pct = Math.round((correctCount / FUNDING_SCENARIOS.length) * 100);
      const totalPnl = allResults.reduce((sum, r) => sum + r.pnl, 0);
      setScore(pct);
      setFinished(true);
      completeChallenge(challengeId, pct, pct >= 80 ? config.xpReward + config.xpPerfect : config.xpReward);
    } else {
      setCurrentIdx(i => i + 1);
      setAction(null);
      setSize('small');
      setSubmitted(false);
    }
  }

  function handleReset() {
    setCurrentIdx(0);
    setAction(null);
    setSize('small');
    setSubmitted(false);
    setResults([]);
    setFinished(false);
    setScore(0);
  }

  const lastResult = results[results.length - 1];

  if (finished) {
    const totalPnl = results.reduce((sum, r) => sum + r.pnl, 0);
    const totalOptimalPnl = results.reduce((sum, r) => sum + r.optimalPnl, 0);
    return (
      <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className={cn('rounded-xl p-5 border', score >= 67 ? 'bg-[#00d4a1]/08 border-[#00d4a1]/20' : 'bg-[#ffa502]/08 border-[#ffa502]/20')}>
          <div className="text-[16px] font-bold text-white mb-1">
            {results.filter(r => r.correct).length}/{FUNDING_SCENARIOS.length} correct direction calls
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-[#0a0b0d] rounded-lg p-3 text-center">
              <div className="text-[10px] text-white/30 mb-1">Your P&L</div>
              <div className={cn('text-[16px] font-bold', totalPnl >= 0 ? 'text-[#00d4a1]' : 'text-[#ff4757]')}>
                {totalPnl >= 0 ? '+' : ''}£{totalPnl.toFixed(0)}
              </div>
            </div>
            <div className="bg-[#0a0b0d] rounded-lg p-3 text-center">
              <div className="text-[10px] text-white/30 mb-1">Optimal P&L</div>
              <div className="text-[16px] font-bold text-[#00d4a1]">
                +£{totalOptimalPnl.toFixed(0)}
              </div>
            </div>
          </div>
          <div className="text-[13px] font-bold mt-3 text-center" style={{ color: modColor }}>
            +{config.xpReward} XP earned
          </div>
        </div>
        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-white/50 border border-white/[0.06] hover:text-white/80 transition-colors">
          <RefreshCw size={12} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-5">
      {/* Progress */}
      <div className="flex gap-1.5">
        {FUNDING_SCENARIOS.map((_, i) => (
          <div
            key={i}
            className={cn('flex-1 h-1.5 rounded-full', i < currentIdx ? 'bg-[#00d4a1]' : i === currentIdx ? '' : 'bg-white/[0.06]')}
            style={i === currentIdx ? { backgroundColor: modColor } : {}}
          />
        ))}
      </div>

      <div>
        <div className="text-[12px] font-bold text-white mb-0.5">{scenario.title}</div>
        <p className="text-[12px] text-white/40">{scenario.description}</p>
      </div>

      {/* Funding chart */}
      <div>
        <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Funding Rate History (% per 8h)</div>
        <div className="w-full h-32">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="period" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => `${v.toFixed(2)}%`} />
              <Tooltip
                contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6 }}
                formatter={(v: number) => [`${v.toFixed(3)}%`, 'Funding']}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke={scenario.fundingHistory[scenario.fundingHistory.length - 1] > 0 ? '#ff4757' : '#00d4a1'}
                fill={scenario.fundingHistory[scenario.fundingHistory.length - 1] > 0 ? 'rgba(255,71,87,0.1)' : 'rgba(0,212,161,0.1)'}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-[#0a0b0d] rounded-lg p-2 text-center">
          <div className="text-white/30 mb-0.5">Current Funding</div>
          <div className={cn('font-bold', scenario.fundingHistory[scenario.fundingHistory.length - 1] > 0.05 ? 'text-[#ff4757]' : scenario.fundingHistory[scenario.fundingHistory.length - 1] < -0.05 ? 'text-[#00d4a1]' : 'text-white')}>
            {(scenario.fundingHistory[scenario.fundingHistory.length - 1] * 100).toFixed(3)}%
          </div>
        </div>
        <div className="bg-[#0a0b0d] rounded-lg p-2 text-center">
          <div className="text-white/30 mb-0.5">OI Change</div>
          <div className="font-bold text-white">{scenario.oiChange}</div>
        </div>
        <div className="bg-[#0a0b0d] rounded-lg p-2 text-center">
          <div className="text-white/30 mb-0.5">Price Change</div>
          <div className={cn('font-bold', scenario.priceChange.startsWith('+') ? 'text-[#00d4a1]' : scenario.priceChange.startsWith('-') ? 'text-[#ff4757]' : 'text-white')}>
            {scenario.priceChange}
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="space-y-4">
          {/* Direction */}
          <div>
            <div className="text-[12px] font-semibold text-white mb-2">Your position direction for the next 8h period:</div>
            <div className="grid grid-cols-3 gap-2">
              {(['long', 'flat', 'short'] as Action[]).map(a => (
                <button
                  key={a}
                  onClick={() => setAction(a)}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2.5 rounded-lg border text-[12px] font-semibold transition-all',
                    action === a
                      ? a === 'long' ? 'bg-[#00d4a1]/15 border-[#00d4a1]/50 text-[#00d4a1]' :
                        a === 'short' ? 'bg-[#ff4757]/15 border-[#ff4757]/50 text-[#ff4757]' :
                        'bg-white/[0.1] border-white/30 text-white'
                      : 'bg-[#0a0b0d] border-white/[0.08] text-white/50 hover:border-white/20'
                  )}
                >
                  {a === 'long' && <TrendingUp size={13} />}
                  {a === 'short' && <TrendingDown size={13} />}
                  {a === 'flat' && <Minus size={13} />}
                  {a.charAt(0).toUpperCase() + a.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {action && action !== 'flat' && (
            <div>
              <div className="text-[12px] font-semibold text-white mb-2">Position size:</div>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as Size[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'py-2 rounded-lg border text-[11px] font-semibold transition-all',
                      size === s ? 'border-white/30 bg-white/[0.08] text-white' : 'bg-[#0a0b0d] border-white/[0.06] text-white/40 hover:border-white/20'
                    )}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                    <div className="text-[10px] text-white/30 font-normal">£{BASE_POSITION * SIZE_MULTIPLIER[s]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!action}
            className="w-full py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: modColor }}
          >
            Submit — go {action ?? '?'} {action && action !== 'flat' ? `(£${BASE_POSITION * SIZE_MULTIPLIER[size]} position)` : ''}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Outcome reveal */}
          <div className="bg-[#0a0b0d] rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/30">What happened</div>
            <div className="text-[13px] text-white">
              Price moved <span className={cn('font-bold', scenario.outcome.direction === 'up' ? 'text-[#00d4a1]' : scenario.outcome.direction === 'down' ? 'text-[#ff4757]' : 'text-white')}>
                {scenario.outcome.magnitude}
              </span> over the next {scenario.outcome.period}
            </div>
          </div>

          <div className={cn('rounded-xl p-4 border', lastResult?.correct ? 'bg-[#00d4a1]/05 border-[#00d4a1]/15' : 'bg-[#ff4757]/05 border-[#ff4757]/15')}>
            <div className="flex items-center justify-between mb-2">
              <div className={cn('text-[12px] font-bold', lastResult?.correct ? 'text-[#00d4a1]' : 'text-[#ff4757]')}>
                {lastResult?.correct ? '✓ Correct direction!' : `✗ Optimal: ${scenario.optimalAction}`}
              </div>
              <div className="text-right">
                <div className="text-[10px] text-white/30">Your P&L</div>
                <div className={cn('text-[14px] font-bold', (lastResult?.pnl ?? 0) >= 0 ? 'text-[#00d4a1]' : 'text-[#ff4757]')}>
                  {(lastResult?.pnl ?? 0) >= 0 ? '+' : ''}£{(lastResult?.pnl ?? 0).toFixed(0)}
                </div>
              </div>
            </div>
            <p className="text-[12px] text-white/60 leading-[1.7]">{scenario.explanation}</p>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: modColor }}
          >
            {currentIdx === FUNDING_SCENARIOS.length - 1 ? 'See final results' : 'Next scenario →'}
          </button>
        </div>
      )}
    </div>
  );
}
