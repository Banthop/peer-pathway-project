import React, { useState, useMemo } from 'react';
import { useProgress } from '../../hooks/useProgress';
import { EV_SETUPS_EASY, EV_SETUPS_ADVANCED } from '../../data/challenges';
import { CHALLENGE_CONFIGS } from '../../data/challenges';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, CheckCircle2, RefreshCw } from 'lucide-react';

interface Props { challengeId: string; modColor: string }

type Setup = typeof EV_SETUPS_EASY[0];

function calcEV(setup: Setup): number {
  return (setup.winRate * setup.winAmt) - ((1 - setup.winRate) * setup.lossAmt);
}

export default function EVCalculator({ challengeId, modColor }: Props) {
  const { completeChallenge, isChallengeComplete } = useProgress();
  const isAdvanced = challengeId === 'ev-calculator';
  const setups = isAdvanced ? EV_SETUPS_ADVANCED : EV_SETUPS_EASY;
  const config = CHALLENGE_CONFIGS[challengeId];

  const correctRanking = useMemo(() => {
    return [...setups]
      .sort((a, b) => calcEV(b) - calcEV(a))
      .map(s => s.id);
  }, [setups]);

  const [playerRanking, setPlayerRanking] = useState<string[]>(setups.map(s => s.id));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const alreadyDone = isChallengeComplete(challengeId);

  function moveItem(idx: number, direction: -1 | 1) {
    if (submitted) return;
    const newRanking = [...playerRanking];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newRanking.length) return;
    [newRanking[idx], newRanking[targetIdx]] = [newRanking[targetIdx], newRanking[idx]];
    setPlayerRanking(newRanking);
  }

  function handleSubmit() {
    let correct = 0;
    for (let i = 0; i < playerRanking.length; i++) {
      if (playerRanking[i] === correctRanking[i]) correct++;
    }
    const pct = Math.round((correct / setups.length) * 100);
    setScore(pct);
    setSubmitted(true);

    const badges: string[] = [];
    if (!alreadyDone && pct >= 80) badges.push('ev-positive');
    completeChallenge(challengeId, pct, pct === 100 ? config.xpReward + config.xpPerfect : config.xpReward, badges);
  }

  function handleReset() {
    setPlayerRanking(setups.map(s => s.id));
    setSubmitted(false);
    setScore(0);
  }

  const evMap = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of setups) m[s.id] = calcEV(s);
    return m;
  }, [setups]);

  return (
    <div className="bg-[#0f1117] border border-white/[0.06] rounded-xl p-5 space-y-5">
      <div className="text-[12px] text-white/50 leading-relaxed">
        <strong className="text-white/80">Instructions:</strong> Rank these 5 trade setups from best (top) to worst (bottom) by expected value. Use the arrows to reorder. Only the EV matters — not win rate or size alone.
      </div>

      {/* EV explanation */}
      <div className="bg-[#0a0b0d] rounded-lg p-3 text-[11px] font-mono text-white/60">
        EV = (Win Rate × Win Amount) − (Loss Rate × Loss Amount)
      </div>

      {/* Ranking list */}
      <div className="space-y-2">
        {playerRanking.map((id, idx) => {
          const setup = setups.find(s => s.id === id)!;
          const ev = evMap[id];
          const isCorrect = submitted && playerRanking[idx] === correctRanking[idx];
          const isWrong = submitted && playerRanking[idx] !== correctRanking[idx];
          const correctPos = submitted ? correctRanking.indexOf(id) + 1 : null;

          return (
            <div
              key={id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-colors',
                isCorrect ? 'border-[#00d4a1]/40 bg-[#00d4a1]/05' : '',
                isWrong ? 'border-[#ff4757]/30 bg-[#ff4757]/05' : '',
                !submitted ? 'border-white/[0.06] bg-[#0a0b0d]' : '',
              )}
            >
              {/* Position */}
              <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center text-[11px] font-bold text-white/50 shrink-0">
                {idx + 1}
              </div>

              {/* Setup info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-white">{setup.label}</span>
                  <span className="text-[10px] text-white/30 truncate">{setup.description}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-white/40">
                  <span>Win: {(setup.winRate * 100).toFixed(0)}%</span>
                  <span>+£{setup.winAmt} / -£{setup.lossAmt}</span>
                  {submitted && (
                    <span
                      className={cn(
                        'font-bold',
                        ev > 0 ? 'text-[#00d4a1]' : ev === 0 ? 'text-white/50' : 'text-[#ff4757]'
                      )}
                    >
                      EV: {ev > 0 ? '+' : ''}£{ev.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Correct position on submit */}
              {submitted && isWrong && (
                <div className="text-[10px] text-[#ff4757] shrink-0">
                  Should be #{correctPos}
                </div>
              )}
              {submitted && isCorrect && (
                <CheckCircle2 size={14} className="text-[#00d4a1] shrink-0" />
              )}

              {/* Move buttons */}
              {!submitted && (
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === playerRanking.length - 1}
                    className="p-1 rounded text-white/30 hover:text-white/70 disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit / result */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg font-semibold text-[13px] text-black transition-opacity hover:opacity-90"
          style={{ backgroundColor: modColor }}
        >
          Submit ranking
        </button>
      ) : (
        <div className="space-y-3">
          <div className={cn(
            'rounded-lg p-4 text-center',
            score === 100 ? 'bg-[#00d4a1]/10 border border-[#00d4a1]/20' : score >= 60 ? 'bg-[#ffa502]/10 border border-[#ffa502]/20' : 'bg-[#ff4757]/10 border border-[#ff4757]/20'
          )}>
            <div className="text-2xl font-bold text-white mb-1">{score}%</div>
            <div className="text-[12px] text-white/60">
              {score === 100 ? 'Perfect! You understand EV at a deep level.' :
               score >= 80 ? 'Excellent — almost there. Review the EV of each setup above.' :
               score >= 60 ? 'Good start. The key insight: win rate alone means nothing without checking the £ sizes.' :
               "Review the lesson — focus on how EV combines win rate AND the size of wins/losses together."}
            </div>
            <div className="text-[13px] font-bold mt-2" style={{ color: modColor }}>
              +{score === 100 ? config.xpReward + config.xpPerfect : config.xpReward} XP earned
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] text-white/50 border border-white/[0.06] hover:text-white/80 hover:border-white/[0.12] transition-colors"
          >
            <RefreshCw size={12} /> Try again
          </button>
        </div>
      )}
    </div>
  );
}
