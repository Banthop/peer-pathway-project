import React, { useState, useCallback, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useProgress } from '../../hooks/useProgress';
import { CHALLENGE_CONFIGS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { Play, RefreshCw } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

const SCENARIOS = [
  {
    id: 'normal',
    label: 'Scenario 1: Normal Market',
    desc: '200 trades, realistic variance. A genuine test of your sizing.',
    winRate: 0.52,
    rrRatio: 1.8,
    trades: 200,
    seed: 42,
  },
  {
    id: 'drawdown',
    label: 'Scenario 2: 12-Trade Losing Streak',
    desc: 'Includes a brutal 12-loss run in the middle. Can your sizing survive it?',
    winRate: 0.52,
    rrRatio: 1.8,
    trades: 200,
    seed: 99,
    injectLosses: { at: 80, count: 12 },
  },
  {
    id: 'volatile',
    label: 'Scenario 3: Crypto Crash Event',
    desc: 'High volatility, expanded stops, erratic results. Real crypto conditions.',
    winRate: 0.48,
    rrRatio: 2.2,
    trades: 150,
    seed: 7,
    injectLosses: { at: 50, count: 8 },
  },
];

function seededRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff);
  };
}

function runSim(
  riskPct: number,
  scenario: typeof SCENARIOS[0],
  startingCapital = 10000
): { equity: number[]; ruined: boolean; finalPnl: number } {
  const rand = seededRandom(scenario.seed);
  const equity: number[] = [startingCapital];
  let capital = startingCapital;

  for (let i = 0; i < scenario.trades; i++) {
    if (capital <= 0) break;

    const riskAmt = capital * (riskPct / 100);
    const isInjectedLoss =
      scenario.injectLosses &&
      i >= scenario.injectLosses.at &&
      i < scenario.injectLosses.at + scenario.injectLosses.count;

    const win = isInjectedLoss ? false : rand() < scenario.winRate;
    capital = win
      ? capital + riskAmt * scenario.rrRatio
      : capital - riskAmt;

    equity.push(Math.max(0, capital));
  }

  return {
    equity,
    ruined: capital <= startingCapital * 0.1,
    finalPnl: capital - startingCapital,
  };
}

export default function RiskRuin({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const config = CHALLENGE_CONFIGS[challengeId];
  const alreadyDone = isChallengeComplete(challengeId);

  const [riskPct, setRiskPct] = useState(2);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [results, setResults] = useState<ReturnType<typeof runSim> | null>(null);
  const [scenarioResults, setScenarioResults] = useState<Record<number, ReturnType<typeof runSim>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(false);

  const scenario = SCENARIOS[currentScenario];

  function handleRun() {
    setRunning(true);
    setTimeout(() => {
      const res = runSim(riskPct, scenario);
      setResults(res);
      setScenarioResults(prev => ({ ...prev, [currentScenario]: res }));
      setRunning(false);
    }, 50);
  }

  function handleNext() {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(s => s + 1);
      setResults(null);
    } else {
      // All done — score
      const allResults = { ...scenarioResults };
      if (results) allResults[currentScenario] = results;

      const ruinedCount = Object.values(allResults).filter(r => r.ruined).length;
      const score = ruinedCount === 0 ? 100 : ruinedCount === 1 ? 60 : 30;

      const badges: string[] = [];
      if (ruinedCount === 0) badges.push('zero-ruin');
      completeChallenge(challengeId, score, score === 100 ? config.xpReward + config.xpPerfect : config.xpReward, badges);
      setSubmitted(true);
    }
  }

  function handleReset() {
    setCurrentScenario(0);
    setResults(null);
    setScenarioResults({});
    setSubmitted(false);
    setRunning(false);
  }

  const chartData = results
    ? results.equity.map((v, i) => ({ trade: i, equity: v }))
    : [];

  const startingCapital = 10000;
  const maxDrawdown = results
    ? (() => {
        let peak = startingCapital;
        let maxDD = 0;
        for (const v of results.equity) {
          if (v > peak) peak = v;
          const dd = (peak - v) / peak;
          if (dd > maxDD) maxDD = dd;
        }
        return maxDD;
      })()
    : 0;

  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-5">
      <div className="text-[12px] text-white/50 leading-relaxed">
        <strong className="text-white/80">How this works:</strong> You start with <strong className="text-white/80">£10,000</strong>. Choose a risk percentage per trade. Run each scenario and see what happens to your capital. Survive all three scenarios to pass.
      </div>

      {!submitted ? (
        <>
          {/* Scenario indicator */}
          <div className="flex gap-2">
            {SCENARIOS.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  'flex-1 h-1.5 rounded-full transition-colors',
                  i < currentScenario ? 'bg-[#00d4a1]' : i === currentScenario ? '' : 'bg-white/[0.06]'
                )}
                style={i === currentScenario ? { backgroundColor: modColor } : {}}
              />
            ))}
          </div>

          <div>
            <div className="text-[11px] font-semibold text-white/50 mb-0.5 uppercase tracking-wider">
              {scenario.label}
            </div>
            <div className="text-[12px] text-white/40">{scenario.desc}</div>
          </div>

          {/* Risk selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-semibold text-white">Risk per trade</label>
              <div className="flex items-center gap-2">
                <span
                  className="text-[18px] font-bold"
                  style={{ color: riskPct <= 2 ? '#00d4a1' : riskPct <= 5 ? '#ffa502' : '#ff4757' }}
                >
                  {riskPct}%
                </span>
                <span className="text-[11px] text-white/30">= £{(startingCapital * riskPct / 100).toFixed(0)}/trade</span>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={25}
              step={0.5}
              value={riskPct}
              onChange={e => { setRiskPct(parseFloat(e.target.value)); setResults(null); }}
              className="w-full accent-current"
              style={{ accentColor: modColor }}
            />
            <div className="flex justify-between text-[10px] text-white/25 mt-1">
              <span>0.5% (ultra safe)</span>
              <span>25% (ruin territory)</span>
            </div>
            <div className="mt-2 text-[11px] text-white/40">
              {riskPct <= 1 ? '🛡️ Very conservative. Slow but almost zero ruin risk.' :
               riskPct <= 2 ? '✅ Professional range. Industry standard.' :
               riskPct <= 5 ? '⚡ Aggressive. Higher returns but drawdowns will hurt.' :
               riskPct <= 10 ? '⚠️ Dangerous. Most accounts blow up here long-term.' :
               '☠️ This is gambling, not trading.'}
            </div>
          </div>

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={running}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: modColor }}
          >
            <Play size={14} />
            {running ? 'Simulating...' : `Run ${scenario.label}`}
          </button>

          {/* Results chart */}
          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <StatPill
                  label="Final P&L"
                  value={`${results.finalPnl >= 0 ? '+' : ''}£${results.finalPnl.toFixed(0)}`}
                  color={results.finalPnl >= 0 ? '#00d4a1' : '#ff4757'}
                />
                <StatPill
                  label="Max Drawdown"
                  value={`-${(maxDrawdown * 100).toFixed(1)}%`}
                  color={maxDrawdown < 0.15 ? '#00d4a1' : maxDrawdown < 0.30 ? '#ffa502' : '#ff4757'}
                />
                <StatPill
                  label="Status"
                  value={results.ruined ? 'Ruined ☠️' : 'Survived ✓'}
                  color={results.ruined ? '#ff4757' : '#00d4a1'}
                />
              </div>

              <div className="w-full h-48">
                <ResponsiveContainer>
                  <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="trade" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} />
                    <YAxis
                      tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                      tickFormatter={v => `£${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                      formatter={(v: number) => [`£${v.toFixed(0)}`, 'Equity']}
                    />
                    <ReferenceLine y={startingCapital} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" label={{ value: 'Start', fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke={results.ruined ? '#ff4757' : modColor}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {results.ruined && (
                <div className="bg-[#ff4757]/10 border border-[#ff4757]/20 rounded-lg p-3 text-[12px] text-[#ff4757]">
                  ☠️ Your account hit ruin territory. Try a smaller risk percentage — the difference between 5% and 1% risk is not 5× safer, it's exponentially safer due to compound drawdowns.
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full py-2.5 rounded-lg font-semibold text-[13px] transition-all hover:opacity-90"
                style={{
                  backgroundColor: currentScenario === SCENARIOS.length - 1 ? modColor : 'transparent',
                  color: currentScenario === SCENARIOS.length - 1 ? '#000' : modColor,
                  border: currentScenario === SCENARIOS.length - 1 ? 'none' : `1px solid ${modColor}50`,
                }}
              >
                {currentScenario === SCENARIOS.length - 1 ? 'Submit results' : 'Next scenario →'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl p-5 bg-[#00d4a1]/08 border border-[#00d4a1]/20 text-center">
            <div className="text-2xl mb-2">
              {Object.values(scenarioResults).filter(r => r.ruined).length === 0 ? '🛡️' : '⚠️'}
            </div>
            <div className="text-[16px] font-bold text-white mb-1">
              {Object.values(scenarioResults).filter(r => r.ruined).length === 0
                ? 'Survived all 3 scenarios!'
                : `Survived ${3 - Object.values(scenarioResults).filter(r => r.ruined).length}/3 scenarios`}
            </div>
            <div className="text-[12px] text-white/50 mb-3">
              With {riskPct}% risk per trade on a £10,000 account
            </div>
            <div className="text-[13px] font-bold" style={{ color: modColor }}>
              +{config.xpReward} XP earned
            </div>
          </div>
          <div className="bg-[#0a0b0d] rounded-lg p-4 text-[12px] text-white/60 leading-relaxed">
            <strong className="text-white/80">The lesson:</strong> Small risk per trade is the only long-run survival strategy. A 1% risk player and a 10% risk player with identical edge will diverge catastrophically over 200 trades. The 10% player hits a losing streak and can never fully recover.
          </div>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-white/50 border border-white/[0.06] hover:text-white/80 transition-colors"
          >
            <RefreshCw size={12} /> Try different risk settings
          </button>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0a0b0d] rounded-lg p-3 text-center">
      <div className="text-[10px] text-white/30 mb-1">{label}</div>
      <div className="text-[14px] font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
