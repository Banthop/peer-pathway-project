import type { ChallengeConfig } from '../types';

export const CHALLENGE_CONFIGS: Record<string, ChallengeConfig> = {
  'ev-intro': {
    id: 'ev-intro',
    type: 'ev-calculator',
    title: 'EV Ranking Challenge',
    description: 'Five trade setups. Rank them by expected value — best to worst.',
    xpReward: 100,
    xpPerfect: 25,
  },
  'ev-calculator': {
    id: 'ev-calculator',
    type: 'ev-calculator',
    title: 'Advanced EV Challenge',
    description: 'More complex setups including asymmetric risk/reward. Can you rank them correctly?',
    xpReward: 120,
    xpPerfect: 30,
  },
  'kelly-criterion': {
    id: 'kelly-criterion',
    type: 'kelly-criterion',
    title: 'Kelly Sizing Simulator',
    description: 'Size 10 sequential bets on a positive-EV game. Stay as close to Kelly-optimal as possible to maximise your final bankroll.',
    xpReward: 130,
    xpPerfect: 25,
  },
  'risk-ruin': {
    id: 'risk-ruin',
    type: 'risk-ruin',
    title: 'Survive the Market',
    description: 'Start with £10,000. Set your risk per trade and watch 200 simulated trades play out. Survive all three difficulty scenarios.',
    xpReward: 150,
    xpPerfect: 50,
  },
  'bias-detector': {
    id: 'bias-detector',
    type: 'bias-detector',
    title: 'Bias Detector',
    description: "Ten trading scenarios. Identify the cognitive bias — loss aversion, sunk cost, overconfidence, FOMO, tilt, or gambler's fallacy.",
    xpReward: 100,
    xpPerfect: 25,
  },
  'probability-game': {
    id: 'probability-game',
    type: 'probability-game',
    title: 'Probability Calibration',
    description: 'Test how well-calibrated your probability estimates are. Make predictions about market scenarios and see how accurate your confidence levels are.',
    xpReward: 110,
    xpPerfect: 30,
  },
  'order-book': {
    id: 'order-book',
    type: 'order-book',
    title: 'Order Book Reader',
    description: 'Read three live-updating order books. Calculate spread, identify liquidity pockets, and estimate slippage costs.',
    xpReward: 100,
    xpPerfect: 25,
  },
  'funding-arb': {
    id: 'funding-arb',
    type: 'funding-arb',
    title: 'Funding Rate Scenarios',
    description: 'Given funding rate charts and OI data, decide your position and size for each 8-hour period. See your P&L against the optimal decision.',
    xpReward: 120,
    xpPerfect: 30,
  },
};

// EV Calculator data
export const EV_SETUPS_EASY = [
  { id: 'a', label: 'Setup A', winRate: 0.55, winAmt: 200, lossAmt: 100, description: 'Breakout on BTC 4h — tight stop, medium target' },
  { id: 'b', label: 'Setup B', winRate: 0.30, winAmt: 600, lossAmt: 100, description: 'Counter-trend trade — wide target, tight stop' },
  { id: 'c', label: 'Setup C', winRate: 0.70, winAmt: 80,  lossAmt: 150, description: 'Scalp — high win rate but small wins and large losses' },
  { id: 'd', label: 'Setup D', winRate: 0.45, winAmt: 300, lossAmt: 200, description: 'Trend continuation — moderate win rate' },
  { id: 'e', label: 'Setup E', winRate: 0.40, winAmt: 100, lossAmt: 120, description: 'Random entry — no clear edge' },
];

export const EV_SETUPS_ADVANCED = [
  { id: 'a', label: 'Setup A', winRate: 0.35, winAmt: 450, lossAmt: 100, description: 'Aggressive trend trade — low win rate, large winners' },
  { id: 'b', label: 'Setup B', winRate: 0.60, winAmt: 150, lossAmt: 100, description: 'Mean reversion — good win rate, modest reward' },
  { id: 'c', label: 'Setup C', winRate: 0.80, winAmt: 50,  lossAmt: 200, description: 'Very high win rate but catastrophic losers' },
  { id: 'd', label: 'Setup D', winRate: 0.50, winAmt: 250, lossAmt: 200, description: 'Slightly positive EV with moderate sizing' },
  { id: 'e', label: 'Setup E', winRate: 0.45, winAmt: 200, lossAmt: 100, description: 'Seemingly reasonable but just barely negative EV' },
];

// Bias Detector scenarios
export const BIAS_SCENARIOS = [
  {
    id: 1,
    scenario: "You bought ETH at £3,000. It's now at £2,000. You say to yourself: 'I can't sell now — I'd lock in a £1,000 loss. I'll hold until I'm back to even.'",
    options: ['Loss Aversion', 'Sunk Cost Fallacy', 'Overconfidence', 'Gambler\'s Fallacy'],
    correct: 1,
    explanation: "This is the Sunk Cost Fallacy. The £1,000 loss has already happened — it exists whether you close the position or not. The only relevant question is: does this position have positive EV from £2,000? Past entry price is irrelevant to that decision.",
  },
  {
    id: 2,
    scenario: "After 5 losing trades in a row, you double your position size on the next trade thinking 'I'm due for a win — it can't keep going against me.'",
    options: ['Tilt', 'Gambler\'s Fallacy', 'Loss Aversion', 'Overconfidence'],
    correct: 1,
    explanation: "This is the Gambler's Fallacy — the belief that past outcomes affect future independent events. Each trade is independent. Five losses don't make the sixth trade more likely to win. And sizing up after losses is a tilt response that compounds the problem.",
  },
  {
    id: 3,
    scenario: "Your trade is up 8%. You close it immediately, thinking 'I should lock in profits before it reverses.' Your original target was +25%.",
    options: ['Sunk Cost Fallacy', 'Overconfidence', 'Loss Aversion', 'FOMO'],
    correct: 2,
    explanation: "Loss aversion is causing you to take a small win to avoid the psychological pain of watching a winner turn into a loser. By cutting your winner at 8% while losses potentially hit 20%, you're destroying your risk/reward ratio. This is how high-win-rate traders have negative EV.",
  },
  {
    id: 4,
    scenario: "BTC just jumped 15% in an hour. You buy at the top, worried about missing out, even though nothing in your system says to buy here.",
    options: ['Overconfidence', 'FOMO', 'Tilt', 'Sunk Cost Fallacy'],
    correct: 1,
    explanation: "FOMO (Fear Of Missing Out) caused you to abandon your system and chase a move that's already happened. FOMO trades systematically have terrible entries — you're buying when the crowd is most optimistic and the easy money has been made.",
  },
  {
    id: 5,
    scenario: "You've had three consecutive winning trades. You decide to triple your normal position size on the next trade because 'I'm clearly in sync with the market right now.'",
    options: ['Gambler\'s Fallacy', 'Tilt', 'Overconfidence', 'FOMO'],
    correct: 2,
    explanation: "This is Overconfidence — specifically, 'hot hand' bias. Three wins don't indicate special synchronisation with the market. They could be random variation around your edge. Tripling size after a winning streak is as dangerous as doubling size after a losing streak.",
  },
  {
    id: 6,
    scenario: "You've lost 3% of your account today. You feel frustrated and enter 4 more trades in quick succession, looking to make it back before market close.",
    options: ['Sunk Cost Fallacy', 'Loss Aversion', 'Tilt', 'Gambler\'s Fallacy'],
    correct: 2,
    explanation: "This is Tilt. Emotional distress from losses is driving impulsive, unplanned trading. The 'make it back' mentality is tilt in its purest form. This is when daily loss limits are essential — they remove the decision to keep trading when you're in the worst state to make decisions.",
  },
  {
    id: 7,
    scenario: "You're offered a certain £500 profit, or a 50% chance of £1,200. Even though the second option has better EV (£600 expected), you take the certain £500.",
    options: ['FOMO', 'Loss Aversion', 'Sunk Cost Fallacy', 'Overconfidence'],
    correct: 1,
    explanation: "Loss aversion makes certain gains feel more attractive than equivalent-or-better uncertain gains. In trading, this shows up as taking profits too early (certainty) instead of letting winners run to their statistically expected targets.",
  },
  {
    id: 8,
    scenario: "You say: 'I've analysed this trade for hours. I'm 95% sure BTC is going to £120k by December.' You put 40% of your account on it.",
    options: ['FOMO', 'Gambler\'s Fallacy', 'Overconfidence', 'Tilt'],
    correct: 2,
    explanation: "Overconfidence manifests as certainty language ('I'm 95% sure') on highly uncertain events, and inappropriate sizing (40% of account). Even a genuine 95% win probability doesn't justify 40% of account — Kelly math still says risk only a fraction of that.",
  },
  {
    id: 9,
    scenario: "You bought a memecoin for £200. It's now worth £10. You still hold it, thinking 'well, I've already lost most of it, might as well see if it recovers.'",
    options: ['Loss Aversion', 'Sunk Cost Fallacy', 'Tilt', 'FOMO'],
    correct: 1,
    explanation: "Sunk cost again — 'I've already lost most of it' is not a reason to keep holding. The only question is: does this position have positive EV? If the answer is no, the remaining £10 should be redeployed somewhere with actual edge.",
  },
  {
    id: 10,
    scenario: "A trade hits your stop loss. You immediately re-enter in the same direction, thinking 'the market tricked me once, it won't do it again.'",
    options: ['Overconfidence', 'Loss Aversion', 'Tilt + Gambler\'s Fallacy', 'FOMO'],
    correct: 2,
    explanation: "This combines Tilt (emotional reaction to the stop being hit) and Gambler's Fallacy (believing the market 'owes' you a win after a loss). Stop losses exist because the thesis was wrong. Re-entering immediately compounds the error.",
  },
];

// Funding Rate scenarios
export const FUNDING_SCENARIOS = [
  {
    id: 1,
    title: 'Crowded Long — High Funding',
    description: 'BTC has rallied 20% in 3 days. Funding rate is +0.15% per 8h (very high). OI has increased 40%. Price is at a key resistance level.',
    fundingHistory: [0.01, 0.02, 0.04, 0.08, 0.10, 0.12, 0.15],
    oiChange: '+40%',
    priceChange: '+20%',
    optimalAction: 'short',
    optimalSize: 'small',
    explanation: "High positive funding + extreme OI increase + price at resistance = crowded long trade. Longs are paying heavily to stay in. A small short or no position is the high-probability play. The market is set up for a flushing move lower to squeeze out overleveraged longs.",
    outcome: { direction: 'down', magnitude: '-8%', period: '8h' },
  },
  {
    id: 2,
    title: 'Capitulation — Extreme Negative Funding',
    description: 'BTC has dropped 35% from its high over 2 weeks. Funding is -0.12% per 8h (very negative — shorts are paying longs). OI has dropped 25%.',
    fundingHistory: [-0.02, -0.04, -0.07, -0.09, -0.11, -0.12, -0.12],
    oiChange: '-25%',
    priceChange: '-35%',
    optimalAction: 'long',
    optimalSize: 'small',
    explanation: "Extreme negative funding means shorts are crowded and paying heavily to stay short. A drop in OI suggests position closing (capitulation). This is a contrarian long setup — not because the market has bottomed, but because the short-squeeze risk is high and risk/reward favours longs.",
    outcome: { direction: 'up', magnitude: '+12%', period: '24h' },
  },
  {
    id: 3,
    title: 'Neutral Funding — Range Market',
    description: 'ETH has been ranging for 2 weeks. Funding is +0.01% (near neutral). OI flat. No clear directional catalyst.',
    fundingHistory: [0.01, 0.00, 0.01, 0.02, 0.01, 0.00, 0.01],
    oiChange: '+2%',
    priceChange: '+1%',
    optimalAction: 'flat',
    optimalSize: 'none',
    explanation: "Neutral funding, flat OI, and no directional catalyst = no edge in either direction. The correct answer is to sit on your hands. Not every market condition has a tradeable setup. Knowing when NOT to trade is as valuable as knowing when to trade.",
    outcome: { direction: 'flat', magnitude: '±2%', period: '8h' },
  },
];
