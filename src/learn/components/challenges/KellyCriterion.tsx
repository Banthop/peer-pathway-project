import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useProgress } from '../../hooks/useProgress';
import { CHALLENGE_CONFIGS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

const WIN_RATE = 0.56;
const WIN_PAYOFF = 1.8;
const BETS = 20;
const START = 10000;

// Kelly optimal: f* = (bp - q) / b = (1.8*0.56 - 0.44) / 1.8 ≈ 31.6%
const KELLY_OPTIMAL = ((WIN_PAYOFF * WIN_RATE - (1 - WIN_RATE)) / WIN_PAYOFF);
const HALF_KELLY = KELLY_OPTIMAL / 2;

// Fixed outcome sequence for reproducibility
const OUTCOMES = [1,0,1,1,0,1,1,0,0,1,1,0,1,0,1,1,0,1,1,0]; // 13/20 wins ≈ 65%

function runKelly(betFraction: number): { equity: number[]; finalValue: number } {
  const equity = [START];
  let capital = START;
  for (const win of OUTCOMES) {
    const bet = capital * betFraction;
    capital = win ? capital + bet * WIN_PAYOFF : capital - bet;
    equity.push(Math.max(0, capital));
  }
  return { equity, finalValue: capital };
}

export default function KellyCriterion({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const config = CHALLENGE_CONFIGS[challengeId];

  const [betFraction, setBetFraction] = useState(20);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const playerResult = useMemo(() => runKelly(betFraction / 100), [betFraction]);
  const kellyResult = useMemo(() => runKelly(KELLY_OPTIMAL), []);
  const halfKellyResult = useMemo(() => runKelly(HALF_KELLY), []);

  const kellyPct = Math.round(KELLY_OPTIMAL * 100);
  const halfKellyPct = Math.round(HALF_KELLY * 100);

  const chartData = useMemo(() => {
    return kellyResult.equity.map((_, i) => ({
      bet: i,
      'Your strategy': Math.round(playerResult.equity[i]),
      'Full Kelly': Math.round(kellyResult.equity[i]),
      'Half Kelly (recommended)': Math.round(halfKellyResult.equity[i]),
    }));
  }, [playerResult, kellyResult, halfKellyResult]);

  function handleSubmit() {
    const deviation = Math.abs(betFraction / 100 - HALF_KELLY) / HALF_KELLY;
    const pct = Math.max(0, Math.round((1 - deviation) * 100));
    setScore(pct);
    setSubmitted(true);
    const badges: string[] = [];
    if (deviation <= 0.1) badges.push('kelly-safe');
    completeChallenge(challengeId, pct, pct >= 90 ? config.xpReward + config.xpPerfect : config.xpReward, badges);
  }

  function handleReset() {
    setBetFraction(20);
    setSubmitted(false);
    setScore(0);
  }

  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-5">
      <div className="text-[12px] text-white/50 leading-relaxed">
        <strong className="text-white/80">The game:</strong> You have a coin flip where you win £1.80 for every £1 risked, with a 56% win rate. Starting capital: <strong className="text-white/80">£10,000</strong>. You have 20 bets. Choose what fraction of your capital to bet each time. The outcomes are fixed — only your sizing changes.
      </div>

      <div className="bg-[#0a0b0d] rounded-lg p-3 text-[11px] text-white/50 font-mono space-y-0.5">
        <div>Win rate: 56% | Payoff: +£1.80 per £1 risked | Bets: 20</div>
        <div>Kelly optimal: ~{kellyPct}% | Half Kelly: ~{halfKellyPct}%</div>
      </div>

      {/* Bet fraction slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-[12px] font-semibold text-white">Bet fraction per round</label>
          <span
            className="text-[18px] font-bold"
            style={{ color: betFraction <= halfKellyPct + 5 && betFraction >= halfKellyPct - 5 ? '#00d4a1' : betFraction > kellyPct * 1.5 ? '#ff4757' : '#ffa502' }}
          >
            {betFraction}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={80}
          step={1}
          value={betFraction}
          onChange={e => setBetFraction(parseInt(e.target.value))}
          className="w-full"
          style={{ accentColor: modColor }}
          disabled={submitted}
        />
        <div className="flex justify-between text-[10px] text-white/20 mt-1">
          <span>1% (very safe)</span>
          <span>80% (near certain ruin)</span>
        </div>
      </div>

      {/* Live projection */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0a0b0d] rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/30 mb-1">Your projected final</div>
          <div
            className="text-[16px] font-bold"
            style={{ color: playerResult.finalValue > START ? '#00d4a1' : '#ff4757' }}
          >
            £{Math.max(0, playerResult.finalValue).toFixed(0)}
          </div>
          <div className="text-[11px] text-white/30">
            {playerResult.finalValue > START ? '+' : ''}£{(playerResult.finalValue - START).toFixed(0)} P&L
          </div>
        </div>
        <div className="bg-[#0a0b0d] rounded-lg p-3 text-center">
          <div className="text-[10px] text-white/30 mb-1">Half Kelly (benchmark)</div>
          <div className="text-[16px] font-bold text-[#00d4a1]">
            £{halfKellyResult.finalValue.toFixed(0)}
          </div>
          <div className="text-[11px] text-white/30">
            +£{(halfKellyResult.finalValue - START).toFixed(0)} P&L
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="bet" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              formatter={(v: number) => [`£${v.toLocaleString()}`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }} />
            <Line type="monotone" dataKey="Your strategy" stroke={modColor} strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="Full Kelly" stroke="rgba(255,255,255,0.2)" strokeWidth={1} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="Half Kelly (recommended)" stroke="#00d4a1" strokeWidth={1.5} dot={false} strokeDasharray="6 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: modColor }}
        >
          Lock in {betFraction}% and see results
        </button>
      ) : (
        <div className="space-y-3">
          <div className={cn(
            'rounded-xl p-4 text-center border',
            score >= 85 ? 'bg-[#00d4a1]/08 border-[#00d4a1]/20' : score >= 60 ? 'bg-[#ffa502]/08 border-[#ffa502]/20' : 'bg-[#ff4757]/08 border-[#ff4757]/20'
          )}>
            <div className="text-[16px] font-bold text-white mb-1">
              You chose {betFraction}% · Half Kelly is {halfKellyPct}%
            </div>
            <div className="text-[12px] text-white/50">
              {Math.abs(betFraction - halfKellyPct) <= 5
                ? 'Almost perfect! You were very close to Half Kelly-optimal.'
                : betFraction < halfKellyPct
                ? `You were more conservative than optimal — still safe, but leaving money on the table. Half Kelly maximises long-run growth while staying survivable.`
                : betFraction <= kellyPct
                ? `Slightly above Half Kelly but within the safe zone. In practice, Half Kelly is preferred for uncertainty about your real edge.`
                : `Over-betting: you exceeded Full Kelly, which is the mathematical maximum. Above Kelly, your growth rate actually decreases and ruin risk spikes.`}
            </div>
            <div className="text-[13px] font-bold mt-2" style={{ color: modColor }}>
              +{config.xpReward} XP earned
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-white/50 border border-white/[0.06] hover:text-white/80 transition-colors"
          >
            <RefreshCw size={12} /> Try a different fraction
          </button>
        </div>
      )}
    </div>
  );
}
