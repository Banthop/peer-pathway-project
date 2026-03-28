import React, { useState, useEffect, useCallback } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { CHALLENGE_CONFIGS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

interface Level { price: number; size: number }

function generateBook(midPrice: number, spread: number, seed: number) {
  const rand = (() => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return ((s >>> 0) / 0xffffffff); }; })();
  const asks: Level[] = [];
  const bids: Level[] = [];
  const askBase = midPrice + spread / 2;
  const bidBase = midPrice - spread / 2;
  for (let i = 0; i < 8; i++) {
    asks.push({ price: parseFloat((askBase + i * spread * 0.5).toFixed(1)), size: parseFloat((rand() * 20 + 1).toFixed(2)) });
    bids.push({ price: parseFloat((bidBase - i * spread * 0.5).toFixed(1)), size: parseFloat((rand() * 20 + 1).toFixed(2)) });
  }
  return { asks, bids };
}

const SCENARIOS = [
  {
    id: 1,
    asset: 'BTC/USDT',
    midPrice: 65000,
    spread: 10,
    orderSize: 5,
    desc: 'A liquid BTC market. Calculate the spread in USD and the slippage cost on a 5 BTC sell order.',
  },
  {
    id: 2,
    asset: 'SOL/USDT',
    midPrice: 180,
    spread: 0.5,
    orderSize: 1000,
    desc: 'SOL with a tighter spread but larger order. Calculate spread in basis points and slippage on 1,000 SOL.',
  },
  {
    id: 3,
    asset: 'ALTCOIN/USDT',
    midPrice: 2.50,
    spread: 0.04,
    orderSize: 50000,
    desc: 'A low-cap altcoin. Wide spread in basis points. A 50,000 unit sell will consume multiple book levels.',
  },
];

export default function OrderBook({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const config = CHALLENGE_CONFIGS[challengeId];

  const [currentScenario, setCurrentScenario] = useState(0);
  const [tick, setTick] = useState(0);
  const [userSpread, setUserSpread] = useState('');
  const [userSlippage, setUserSlippage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ spreadCorrect: boolean; slippageCorrect: boolean } | null>(null);
  const [allResults, setAllResults] = useState<{ spread: boolean; slippage: boolean }[]>([]);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = SCENARIOS[currentScenario];
  const book = generateBook(scenario.midPrice, scenario.spread, tick + currentScenario * 100);

  // Animate order book
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setTick(t => t + 1), 1500);
    return () => clearInterval(interval);
  }, [submitted]);

  const correctSpread = scenario.spread;
  const correctSpreadBps = Math.round((scenario.spread / scenario.midPrice) * 10000);

  // Calculate slippage: consume bids in order
  const correctSlippage = (() => {
    let remaining = scenario.orderSize;
    let totalValue = 0;
    const bids = book.bids;
    for (const level of bids) {
      if (remaining <= 0) break;
      const fill = Math.min(remaining, level.size);
      totalValue += fill * level.price;
      remaining -= fill;
    }
    if (remaining > 0) {
      totalValue += remaining * (bids[bids.length - 1]?.price ?? scenario.midPrice * 0.95);
    }
    const avgPrice = totalValue / scenario.orderSize;
    const slip = ((scenario.midPrice - scenario.spread / 2) - avgPrice) / (scenario.midPrice - scenario.spread / 2);
    return parseFloat((slip * 100).toFixed(3));
  })();

  function handleSubmit() {
    const spreadVal = parseFloat(userSpread);
    const slipVal = parseFloat(userSlippage);
    const spreadCorrect = !isNaN(spreadVal) && Math.abs(spreadVal - correctSpread) <= correctSpread * 0.2;
    const slippageCorrect = !isNaN(slipVal) && Math.abs(slipVal - correctSlippage) <= Math.max(0.05, correctSlippage * 0.3);
    setResults({ spreadCorrect, slippageCorrect });
    setSubmitted(true);
  }

  function handleNext() {
    const r = results!;
    const newAllResults = [...allResults, { spread: r.spreadCorrect, slippage: r.slippageCorrect }];
    if (currentScenario === SCENARIOS.length - 1) {
      const correct = newAllResults.reduce((sum, r) => sum + (r.spread ? 1 : 0) + (r.slippage ? 1 : 0), 0);
      const total = SCENARIOS.length * 2;
      const pct = Math.round((correct / total) * 100);
      setScore(pct);
      setAllResults(newAllResults);
      setFinished(true);
      completeChallenge(challengeId, pct, pct >= 80 ? config.xpReward + config.xpPerfect : config.xpReward);
    } else {
      setAllResults(newAllResults);
      setCurrentScenario(s => s + 1);
      setSubmitted(false);
      setResults(null);
      setUserSpread('');
      setUserSlippage('');
    }
  }

  function handleReset() {
    setCurrentScenario(0);
    setSubmitted(false);
    setResults(null);
    setAllResults([]);
    setFinished(false);
    setScore(0);
    setUserSpread('');
    setUserSlippage('');
  }

  const maxBidSize = Math.max(...book.bids.map(b => b.size));
  const maxAskSize = Math.max(...book.asks.map(a => a.size));

  if (finished) {
    return (
      <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-4">
        <div className={cn('rounded-xl p-5 text-center border', score >= 70 ? 'bg-[#00d4a1]/08 border-[#00d4a1]/20' : 'bg-[#ffa502]/08 border-[#ffa502]/20')}>
          <div className="text-[16px] font-bold text-white mb-1">{score}%</div>
          <div className="text-[12px] text-white/50">
            {score >= 80 ? 'You can read an order book like a market maker. Impressive.' : 'Good start — understanding spreads and slippage takes practice. The key insight: every trade has invisible costs.'}
          </div>
          <div className="text-[13px] font-bold mt-2" style={{ color: modColor }}>+{config.xpReward} XP earned</div>
        </div>
        <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-white/50 border border-white/[0.06] hover:text-white/80 transition-colors">
          <RefreshCw size={12} /> Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: modColor }}>
            {scenario.asset} · Scenario {currentScenario + 1}/{SCENARIOS.length}
          </div>
          <p className="text-[12px] text-white/50 mt-1">{scenario.desc}</p>
        </div>
        <div className="text-[10px] text-white/20">Live ●</div>
      </div>

      {/* Order book */}
      <div className="grid grid-cols-2 gap-3">
        {/* Asks */}
        <div>
          <div className="text-[10px] font-semibold text-[#ff4757] uppercase tracking-wider mb-2">Asks (Sell wall)</div>
          {[...book.asks].reverse().map((ask, i) => (
            <div key={i} className="flex items-center gap-2 mb-0.5 relative">
              <div
                className="absolute left-0 top-0 h-full bg-[#ff4757]/08 rounded-sm"
                style={{ width: `${(ask.size / maxAskSize) * 100}%` }}
              />
              <span className="text-[11px] text-[#ff4757] font-mono relative z-10 w-20">
                {ask.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-white/40 font-mono relative z-10">
                {ask.size.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Bids */}
        <div>
          <div className="text-[10px] font-semibold text-[#00d4a1] uppercase tracking-wider mb-2">Bids (Buy wall)</div>
          {book.bids.map((bid, i) => (
            <div key={i} className="flex items-center gap-2 mb-0.5 relative">
              <div
                className="absolute left-0 top-0 h-full bg-[#00d4a1]/08 rounded-sm"
                style={{ width: `${(bid.size / maxBidSize) * 100}%` }}
              />
              <span className="text-[11px] text-[#00d4a1] font-mono relative z-10 w-20">
                {bid.price.toLocaleString()}
              </span>
              <span className="text-[11px] text-white/40 font-mono relative z-10">
                {bid.size.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mid price indicator */}
      <div className="bg-[#0a0b0d] rounded-lg p-2 text-center">
        <span className="text-[11px] text-white/30">Mid price: </span>
        <span className="text-[13px] font-bold text-white">{scenario.midPrice.toLocaleString()}</span>
      </div>

      {/* Questions */}
      {!submitted ? (
        <div className="space-y-3">
          <div>
            <label className="text-[12px] font-medium text-white/70 block mb-1.5">
              Q1: What is the bid-ask spread in {scenario.midPrice > 100 ? 'USD' : 'USDT'}?
            </label>
            <input
              type="number"
              value={userSpread}
              onChange={e => setUserSpread(e.target.value)}
              placeholder={`Enter spread (e.g. ${correctSpread})`}
              className="w-full bg-[#0a0b0d] border border-white/[0.1] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-white/70 block mb-1.5">
              Q2: Estimate the slippage % on a {scenario.orderSize.toLocaleString()} {scenario.asset.split('/')[0]} market sell order.
            </label>
            <input
              type="number"
              step="0.001"
              value={userSlippage}
              onChange={e => setUserSlippage(e.target.value)}
              placeholder="Enter slippage % (e.g. 0.05)"
              className="w-full bg-[#0a0b0d] border border-white/[0.1] rounded-lg px-3 py-2 text-[13px] text-white placeholder-white/25 focus:outline-none focus:border-white/30"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!userSpread || !userSlippage}
            className="w-full py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: modColor }}
          >
            Submit answers
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <ResultRow
              label="Spread"
              userValue={`${userSpread}`}
              correctValue={`${correctSpread}`}
              correct={results!.spreadCorrect}
            />
            <ResultRow
              label="Slippage %"
              userValue={`${userSlippage}%`}
              correctValue={`~${correctSlippage}%`}
              correct={results!.slippageCorrect}
            />
          </div>
          <div className="bg-[#0a0b0d] rounded-lg p-3 text-[11px] text-white/50 leading-relaxed">
            The spread is {correctSpread} {scenario.midPrice > 100 ? 'USD' : 'USDT'} ({correctSpreadBps} basis points).
            On your {scenario.orderSize.toLocaleString()} unit order, you'd consume {
              correctSlippage < 0.05 ? 'very little' : correctSlippage < 0.2 ? 'some' : 'significant'
            } depth, resulting in ~{correctSlippage}% slippage.
            {correctSlippage > 0.3 ? ' This market lacks sufficient depth for this order size — you\'d need to split this across time.' : ''}
          </div>
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
            style={{ backgroundColor: modColor }}
          >
            {currentScenario === SCENARIOS.length - 1 ? 'See final score' : 'Next scenario →'}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultRow({ label, userValue, correctValue, correct }: {
  label: string; userValue: string; correctValue: string; correct: boolean;
}) {
  return (
    <div className={cn('flex items-center justify-between p-2.5 rounded-lg border', correct ? 'border-[#00d4a1]/20 bg-[#00d4a1]/05' : 'border-[#ff4757]/20 bg-[#ff4757]/05')}>
      <div className="flex items-center gap-2">
        {correct ? <CheckCircle2 size={12} className="text-[#00d4a1]" /> : <XCircle size={12} className="text-[#ff4757]" />}
        <span className="text-[12px] text-white/60">{label}</span>
      </div>
      <div className="text-[11px]">
        <span className="text-white/40">You: {userValue}</span>
        {!correct && <span className="ml-2 text-[#00d4a1] font-medium">Correct: {correctValue}</span>}
      </div>
    </div>
  );
}
