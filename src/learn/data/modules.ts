import type { Module } from '../types';

export const MODULES: Module[] = [
  // ─────────────────────────────────────────────
  // MODULE 1
  // ─────────────────────────────────────────────
  {
    id: 1,
    title: 'Why Edge Exists',
    subtitle: 'The foundation everything else is built on',
    description: 'Before a single chart, a single indicator, a single trade — you need to understand what separates a gambler from a trader. It comes down to one word: edge.',
    icon: '⚡',
    xpPool: 400,
    color: '#00d4a1',
    accentColor: '#00d4a1',
    lessons: [
      {
        id: 'm1-l1',
        title: 'The Casino Is Not Your Enemy',
        subtitle: 'Randomness vs. edge — why casinos always win',
        duration: '7 min',
        xp: 50,
        content: [
          {
            type: 'text',
            text: "Here's a question that sounds weird at first: how does a casino make money if every single game is random?",
          },
          {
            type: 'text',
            text: "The roulette wheel doesn't know who you are. It doesn't care if you've lost five times in a row. It has no memory. The outcome of each spin is completely independent of every spin before it.",
          },
          {
            type: 'analogy',
            label: 'THE CASINO ANALOGY',
            text: "A casino doesn't beat any individual player on any individual spin. It beats millions of players across millions of spins — because on every single bet, the casino has a tiny mathematical advantage baked in. In European roulette, that advantage is 2.7%. That's it. Less than 3%. But at scale, that 2.7% turns into billions in profit.",
          },
          {
            type: 'text',
            text: "That tiny, consistent advantage is called edge. And here's the key insight: the casino doesn't need to win every hand. It just needs a reliable edge and enough volume. Over time, that edge becomes inevitable.",
          },
          {
            type: 'heading',
            text: 'What This Means For Trading',
          },
          {
            type: 'text',
            text: "Most people approach trading like a player walking into a casino. They think: 'I just need to pick the right direction.' But the real question a trader should ask is: 'What is my edge, and how consistently can I apply it?'",
          },
          {
            type: 'text',
            text: "A trader without edge isn't trading — they're gambling. They might win. They might win a lot, early on. But without an edge, over time, randomness and trading costs will grind their account to zero. Just like a casino player who gets lucky at first.",
          },
          {
            type: 'keypoint',
            text: 'Edge = a systematic, repeatable advantage that means your wins are slightly bigger, slightly more frequent, or both compared to your losses — consistently over many trades.',
          },
          {
            type: 'heading',
            text: "The Law of Large Numbers — Why Edge Needs Volume",
          },
          {
            type: 'text',
            text: "Flip a fair coin 10 times. You might get 8 heads. Flip it 10,000 times — you'll get very close to 5,000 heads. The more flips, the closer the result gets to the 'true' probability.",
          },
          {
            type: 'text',
            text: "This is called the Law of Large Numbers. It's why the casino is comfortable giving you a lucky winning streak — because they know that in the long run, with enough volume, their edge always shows up.",
          },
          {
            type: 'text',
            text: "For you as a trader, this means: edge is only meaningful over many trades. A single winning trade proves nothing. A single losing trade proves nothing. What matters is: over 50, 100, 200 trades — does your edge show up consistently?",
          },
          {
            type: 'warning',
            text: "The most dangerous trap: a beginner gets lucky on their first 5 trades and thinks they have edge. Then they size up, and the law of large numbers kicks in. This is how accounts get destroyed. Evidence of edge requires a large sample.",
          },
          {
            type: 'keypoint',
            text: "The casino doesn't fear your lucky streak. It fears a player with genuine edge. Be the casino, not the player.",
          },
        ],
        challengeId: 'ev-intro',
      },
      {
        id: 'm1-l2',
        title: 'Expected Value — The Only Number That Matters',
        subtitle: 'How to think about every trade before you enter it',
        duration: '9 min',
        xp: 50,
        content: [
          {
            type: 'text',
            text: "Expected value (EV) is the single most important concept in trading. Everything else — indicators, strategies, news — is only useful insofar as it helps you find positive EV trades.",
          },
          {
            type: 'analogy',
            label: 'THE SURGEON ANALOGY',
            text: "A surgeon with a 95% success rate for a procedure doesn't guarantee your survival. What they're offering is a probability distribution: 95 times out of 100, you survive; 5 times, you don't. You don't pay for a guaranteed outcome — you pay for the best available probability. Trading works the same way. You're never buying certainty. You're buying a probability distribution.",
          },
          {
            type: 'heading',
            text: 'What Expected Value Actually Is',
          },
          {
            type: 'text',
            text: "Expected value is the average outcome if you repeated a decision an infinite number of times. It's not what will happen on any single trade — it's what your average outcome approaches over many trades.",
          },
          {
            type: 'formula',
            label: 'THE FORMULA',
            text: "EV = (Win Rate × Avg Win) − (Loss Rate × Avg Loss)\n\nExample: You win 40% of the time and make £200 when you win. You lose 60% of the time and lose £100 when you lose.\nEV = (0.40 × £200) − (0.60 × £100) = £80 − £60 = +£20 per trade",
          },
          {
            type: 'text',
            text: "That +£20 is your expected value per trade. It doesn't mean every trade makes £20. It means if you took this exact setup 1,000 times, your average result would be +£20 per trade.",
          },
          {
            type: 'heading',
            text: "You Don't Need to Win Most of the Time",
          },
          {
            type: 'text',
            text: "This is one of the most counterintuitive things about trading. Your win rate doesn't need to be above 50% to be profitable. What matters is the relationship between how much you win and how much you lose.",
          },
          {
            type: 'example',
            label: 'EXAMPLE',
            text: "A sniper only needs to hit their target 30% of the time if their shots win them the battle and misses cost almost nothing. A trader with a 30% win rate can be massively profitable if their average win is 3× their average loss.",
          },
          {
            type: 'text',
            text: "Conversely, you can win 70% of your trades and still go broke. If your average win is £50 but your average loss is £500, your EV is deeply negative.",
          },
          {
            type: 'keypoint',
            text: 'Win rate means almost nothing on its own. Risk/reward means almost nothing on its own. EV — which combines both — is the only number that actually tells you if a trade is worth taking.',
          },
          {
            type: 'heading',
            text: 'The Psychology Connection',
          },
          {
            type: 'text',
            text: "Here's where your psychology background becomes a superpower. Most traders win frequently (high win rate, small wins) because winning feels good and the brain craves it. But they let their losers run because closing a loss feels bad. The result: high win rate, negative EV.",
          },
          {
            type: 'text',
            text: "Understanding EV at a deep level lets you override that emotional wiring. You stop caring if you won or lost on any given trade, because you know your EV is positive. The individual outcome is just noise. The process is what matters.",
          },
          {
            type: 'warning',
            text: "EV calculation requires honest data about your actual win rate and actual average win/loss — not your best trades, your real average. Most traders inflate their mental win rate by selectively remembering wins.",
          },
        ],
        challengeId: 'ev-calculator',
      },
      {
        id: 'm1-l3',
        title: 'The Kelly Criterion — How Much to Bet',
        subtitle: "The mathematically optimal bet size — and why bigger isn't better",
        duration: '10 min',
        xp: 50,
        content: [
          {
            type: 'text',
            text: "You've found a trade with positive EV. Now the question is: how much of your capital should you put on it?",
          },
          {
            type: 'text',
            text: "Intuitively, you might think: if I have edge, I should bet as much as possible. More capital risked = more profit, right? Wrong. This thinking destroys more accounts than bad trades.",
          },
          {
            type: 'analogy',
            label: 'THE NASA ANALOGY',
            text: "NASA engineers designing a rocket don't put all the fuel in one tank to maximise payload. They distribute it across multiple redundant systems, sized to optimise for mission survival across all likely failure scenarios. Betting too much of your account on any single trade — even a great one — is the trading equivalent of putting all the fuel in one tank. One explosive failure ends the mission.",
          },
          {
            type: 'heading',
            text: 'The Ruin Problem',
          },
          {
            type: 'text',
            text: "Here's a maths fact that surprises almost everyone: if you risk 50% of your account on every trade — even with a 60% win rate and 1:1 risk/reward — you will eventually go broke.",
          },
          {
            type: 'text',
            text: "How? Because a sequence of losses compounds against you. Lose 50% then lose 50% again: you're at 25% of your starting capital. You now need a 300% gain to get back to even. The asymmetry of losses makes large bet sizes fatal over time.",
          },
          {
            type: 'heading',
            text: 'What the Kelly Criterion Tells You',
          },
          {
            type: 'text',
            text: "The Kelly Criterion is a formula developed by a Bell Labs scientist in 1956. It tells you the mathematically optimal fraction of your capital to risk on a positive-EV trade — the fraction that maximises your long-run growth rate.",
          },
          {
            type: 'formula',
            label: 'KELLY FORMULA (intuitive version)',
            text: "Kelly % = Edge ÷ Odds\n\nWhere Edge = Win Rate − Loss Rate, and Odds = the ratio of what you win to what you risk\n\nExample: 60% win rate, 1:1 risk/reward\nKelly % = (0.60 − 0.40) ÷ 1 = 20%\n\nThis says: risk 20% of your capital on this trade to maximise long-run growth.",
          },
          {
            type: 'text',
            text: "But here's the thing — Kelly is a maximum. Most professional traders use 'Half Kelly' (10% in the above example). The reason: Kelly assumes your edge estimate is perfectly accurate. In reality, it never is. Half Kelly gives up some upside for massive protection against miscalculation.",
          },
          {
            type: 'keypoint',
            text: "Kelly isn't about maximising profit on any single trade. It's about maximising the growth of your entire account over hundreds of trades while surviving the inevitable losing streaks.",
          },
          {
            type: 'heading',
            text: 'What Traders Actually Use',
          },
          {
            type: 'text',
            text: "Most retail traders risk 1-2% of their account per trade. Professional traders at funds often risk 0.1-0.5%. The logic: small risk per trade means a losing streak doesn't destroy your ability to keep trading. With 1% risk, you'd need to lose 100 trades in a row to blow up. That's almost impossible if you have any edge at all.",
          },
          {
            type: 'warning',
            text: "The most common way traders blow up is not bad strategy — it's correct strategy with way too much size. A great trade idea at 25% risk can kill your account. The same trade at 1% risk is just a small setback.",
          },
        ],
        challengeId: 'kelly-criterion',
      },
      {
        id: 'm1-l4',
        title: 'Why Crypto? The Volatility Premium',
        subtitle: "Volatility isn't the enemy — it's the raw material",
        duration: '6 min',
        xp: 50,
        content: [
          {
            type: 'text',
            text: "People often choose crypto for trading because it 'goes up and down a lot.' That's actually the right instinct for the wrong reason. Let's understand why volatility is the raw material of edge — and why crypto is a particularly good training ground.",
          },
          {
            type: 'analogy',
            label: 'THE BLACKSMITH ANALOGY',
            text: "A blacksmith needs fire to forge steel. Without intense heat, the metal won't move — you can't shape it, bend it, create anything with it. Volatility is the fire of markets. Without it, there's no opportunity to exploit an edge. A perfectly flat market is a dead market. Crypto runs hot.",
          },
          {
            type: 'heading',
            text: 'Why Crypto Is Psychologically Rich',
          },
          {
            type: 'text',
            text: "Unlike forex (driven heavily by institutional macroeconomic flows and central bank decisions), crypto is dominated by retail traders. That means the psychological patterns — fear, greed, herd behaviour, FOMO, panic selling — are amplified and more visible.",
          },
          {
            type: 'text',
            text: "For someone studying psychology, this is genuinely exciting. Market cycles in crypto closely mirror the Kübler-Ross model of grief: denial ('it's just a temporary dip'), anger ('this is a scam'), bargaining ('I'll just hold until I break even'), depression (capitulation), acceptance (market bottom). Every cycle, on repeat.",
          },
          {
            type: 'keypoint',
            text: "Crypto markets are, in a meaningful sense, a real-time psychological experiment run at global scale. The asset is less important than the crowd behaviour around it.",
          },
          {
            type: 'heading',
            text: 'The 24/7 Advantage',
          },
          {
            type: 'text',
            text: "Crypto trades 24/7, 365 days a year. No market open, no market close. This means overnight gaps (common in stocks and forex), weekend gaps, and illiquidity events at specific times create patterns that a prepared trader can exploit.",
          },
          {
            type: 'text',
            text: "It also means: the market doesn't care about your schedule. Discipline in when you trade, not just how you trade, is part of the edge.",
          },
          {
            type: 'heading',
            text: 'The On-Chain Advantage',
          },
          {
            type: 'text',
            text: "Unlike any other asset class, crypto is fully transparent on-chain. Every transaction, every whale wallet, every exchange deposit and withdrawal is publicly visible. Skilled traders use this data as an additional signal layer. It's like being able to see where all the institutional players are moving their chips before the hand is dealt.",
          },
          {
            type: 'warning',
            text: "High volatility is both the opportunity and the danger. The same volatility that creates big moves can wipe out an underprepared trader in hours. Volatility without edge + proper sizing = ruin.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // MODULE 2
  // ─────────────────────────────────────────────
  {
    id: 2,
    title: 'The Market Is a Probability Machine',
    subtitle: 'How price actually works at the micro level',
    description: 'Price is not a random walk and it\'s not a rigged game. It\'s a real-time vote — millions of participants expressing their probability estimates. Once you see it this way, everything changes.',
    icon: '🎲',
    xpPool: 500,
    color: '#3d84f7',
    accentColor: '#3d84f7',
    unlockCondition: 'Complete Module 1',
    lessons: [
      {
        id: 'm2-l1',
        title: 'Price Is a Prediction Market',
        subtitle: 'Every price quote is a probability estimate in disguise',
        duration: '8 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Here's a reframe that changes how you see every chart: price isn't a number. Price is a probability.",
          },
          {
            type: 'analogy',
            label: 'THE PREDICTION MARKET ANALOGY',
            text: "In a prediction market on a presidential election, the 'price' of a candidate is their implied probability of winning. If the market says 65%, that's the market's current best estimate given all available information. Bitcoin's price works exactly the same way. The current price of BTC is the market's aggregate estimate of its future value, discounted to today. When new information arrives — a regulatory announcement, a whale buying, a major exchange listing — that probability distribution shifts, and price moves to reflect it.",
          },
          {
            type: 'text',
            text: "This means: when you buy, you're betting the market's probability estimate is too low. When you sell, you're betting it's too high. Your edge comes from having a better estimate than the consensus — not from predicting the future, but from having a more accurate probability distribution.",
          },
          {
            type: 'heading',
            text: 'Efficient vs. Inefficient Markets',
          },
          {
            type: 'text',
            text: "In a perfectly efficient market, price always reflects all available information instantly. No edge exists because the moment an opportunity appears, it's traded away.",
          },
          {
            type: 'text',
            text: "Crypto markets are not efficient. They're dominated by retail participants who make systematic, predictable mistakes. Large information asymmetries exist. Panic and euphoria create temporary mispricings. This is where edge lives.",
          },
          {
            type: 'keypoint',
            text: "Your edge comes from the market being temporarily wrong about a probability — and you being approximately right. You don't need to be perfectly right, just better than the current consensus at the right moment.",
          },
          {
            type: 'heading',
            text: 'What Moves Price',
          },
          {
            type: 'text',
            text: "Price moves when new information arrives that changes the aggregate probability estimate — AND when a participant with enough capital acts on that estimate. A small trader being right moves price by nothing. A whale being right moves price significantly.",
          },
          {
            type: 'text',
            text: "This is why watching order flow and on-chain data matters. You're trying to detect when large, informed participants are expressing a new probability estimate through actual capital deployment.",
          },
        ],
      },
      {
        id: 'm2-l2',
        title: 'The Bid-Ask Spread Is a Tax You Pay Every Trade',
        subtitle: 'The invisible cost that kills most retail traders',
        duration: '7 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Every time you buy or sell a crypto asset, there's an invisible cost that almost no beginner accounts for. It's called the bid-ask spread, and it compounds into a significant drag on returns.",
          },
          {
            type: 'analogy',
            label: 'THE CURRENCY EXCHANGE ANALOGY',
            text: "Walk into an airport currency exchange. They'll buy your dollars at 1.18 and sell euros to you at 1.22. That gap is the spread — and it's their profit, your cost. You immediately lose money the moment you make the transaction. The crypto order book is the same: there's always a difference between the price you can buy at and the price you can sell at immediately.",
          },
          {
            type: 'heading',
            text: 'Makers vs. Takers',
          },
          {
            type: 'text',
            text: "There are two types of participants in any market: makers and takers. Makers post limit orders (they say 'I'll buy at X price' and wait). Takers use market orders (they say 'I'll buy immediately at whatever price is available' and pay the spread).",
          },
          {
            type: 'text',
            text: "Exchanges charge takers a fee (typically 0.05-0.1% on major exchanges like Binance) and reward makers with rebates or lower fees. Every time you hit a market order, you're paying the spread plus the taker fee.",
          },
          {
            type: 'formula',
            label: 'THE SPREAD COST',
            text: "On a £10,000 position with a 0.05% taker fee:\nEntry cost: £5\nExit cost: £5\nTotal round-trip cost: £10 (0.1% of position)\n\nDo this 50 times a month: £500 in friction costs before any profit or loss.\nThis is why frequent trading without edge is guaranteed to lose money.",
          },
          {
            type: 'keypoint',
            text: "Every trade has friction. Your edge must be larger than your transaction costs or you'll slowly bleed out. This is why patience — waiting for high-quality setups rather than trading constantly — is not just discipline but mathematics.",
          },
          {
            type: 'heading',
            text: 'Slippage on Large Orders',
          },
          {
            type: 'text',
            text: "There's a second, related problem called slippage. When you place a large market order, you consume all the liquidity at the best price — and then the next best price — and then the next. The larger your order relative to the available liquidity, the worse your average fill price.",
          },
          {
            type: 'analogy',
            label: 'THE BATHTUB ANALOGY',
            text: "Trying to sell £1 million of a coin with £500k in daily volume is like trying to empty a bathtub through a drinking straw. You'll move the price down against yourself before you're half done. This is why institutions break large orders into many smaller ones over time.",
          },
        ],
        challengeId: 'order-book',
      },
      {
        id: 'm2-l3',
        title: "Who's On The Other Side?",
        subtitle: 'Informed vs. uninformed order flow — and why it matters',
        duration: '8 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Every time you place a trade, someone is on the other side. When you buy, someone is selling to you. When you sell, someone is buying. One of you has a better read on the situation — or one of you is just getting out for non-information reasons.",
          },
          {
            type: 'heading',
            text: 'Two Types of Participants',
          },
          {
            type: 'text',
            text: "Informed traders: they have a genuine edge — better information, better analysis, better model. They're trading because they believe price will move in their favour.",
          },
          {
            type: 'text',
            text: "Uninformed/noise traders: they trade for other reasons — emotions, needing cash, following a tip, reacting to news. They're not necessarily making a considered probability bet.",
          },
          {
            type: 'analogy',
            label: 'THE POKER ANALOGY',
            text: "At a poker table, there's a saying: if you've been playing for 30 minutes and can't identify the fish (the weak player), you're the fish. In markets, the same logic applies. When you trade, you should ask: why is the person on the other side taking the opposite position? If you can't answer that, you may be the uninformed participant.",
          },
          {
            type: 'heading',
            text: 'Order Flow Analysis',
          },
          {
            type: 'text',
            text: "Advanced traders watch the tape — the real-time feed of all executed trades — to identify whether buying or selling pressure is dominated by informed or uninformed participants. Large aggressive market orders at key price levels suggest informed participants. Small, scattered orders suggest noise.",
          },
          {
            type: 'keypoint',
            text: "You don't need to identify every counterparty. You need to develop a sense for when the order flow is dominated by smart money moving with conviction vs. retail participants making emotional decisions. That sense comes from watching markets closely over time.",
          },
        ],
      },
      {
        id: 'm2-l4',
        title: 'Liquidity — Where the Market Can and Cannot Go',
        subtitle: 'Understanding why price moves the way it does',
        duration: '9 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Liquidity is one of the most important concepts in markets, and one of the least understood by beginners. It explains why price moves violently through some levels and grinds through others, why certain price targets attract and others repel.",
          },
          {
            type: 'analogy',
            label: 'THE RIVER ANALOGY',
            text: "Imagine price as water flowing through a landscape. Where the riverbed is deep and wide (high liquidity), water flows smoothly and fast. Where it narrows (low liquidity), the same volume of water creates a powerful rapid. Price behaves the same way: through liquid levels, it moves quickly. Through illiquid levels, it spikes violently — because there's not enough supply or demand to absorb the incoming flow.",
          },
          {
            type: 'heading',
            text: 'Where Liquidity Pools Form',
          },
          {
            type: 'text',
            text: "Liquidity concentrates at predictable locations. Round numbers (£50,000, £100,000) — because traders naturally place orders there. Recent highs and lows — because breakout traders and stop-loss orders cluster there. Consolidation zones — because orders accumulate while price moves sideways.",
          },
          {
            type: 'text',
            text: "This creates a dynamic where price often 'hunts' liquidity — moves to where orders are clustered to fill large positions before reversing. You'll often see price spike above a recent high or below a recent low, triggering everyone's stops, and then immediately reverse. This is not random. Large participants are filling their positions against the stops.",
          },
          {
            type: 'keypoint',
            text: "Think of price not as moving randomly but as moving toward where it can find orders to fill. Once you see markets through the lens of liquidity, 'weird' price action starts making logical sense.",
          },
          {
            type: 'warning',
            text: "This is advanced territory. You don't need to fully master liquidity analysis to start trading profitably. But understanding that round numbers attract stops and that price 'hunts' these levels will save you from the most common retail traps.",
          },
        ],
        challengeId: 'probability-game',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // MODULE 3
  // ─────────────────────────────────────────────
  {
    id: 3,
    title: 'Risk Is a Resource',
    subtitle: 'The module that separates survivors from casualties',
    description: 'More traders blow up from bad sizing than from bad ideas. Risk management is not about playing it safe — it\'s about staying in the game long enough for your edge to work.',
    icon: '🛡️',
    xpPool: 600,
    color: '#ff4757',
    accentColor: '#ff4757',
    unlockCondition: 'Complete Module 2',
    lessons: [
      {
        id: 'm3-l1',
        title: 'Drawdown Math Is Not Intuitive',
        subtitle: 'Why losing 50% means you need to gain 100%',
        duration: '7 min',
        xp: 70,
        content: [
          {
            type: 'text',
            text: "Here's a maths fact that destroys accounts when people don't understand it: percentage losses are not symmetrical with percentage gains.",
          },
          {
            type: 'formula',
            label: 'THE ASYMMETRY',
            text: "Lose 10% → need 11% to recover\nLose 25% → need 33% to recover\nLose 50% → need 100% to recover\nLose 75% → need 300% to recover\nLose 90% → need 900% to recover",
          },
          {
            type: 'analogy',
            label: 'THE ARMY ANALOGY',
            text: "Losing half your army doesn't mean you need to win half a battle to recover. You need to win a battle twice as large as the one you lost — but now with half the soldiers. The same dynamic plays out with trading capital. A 50% drawdown doesn't put you halfway back to zero; it puts you in a hole that requires a 100% gain to escape — and now you have less capital generating those gains.",
          },
          {
            type: 'heading',
            text: 'Drawdown and Time',
          },
          {
            type: 'text',
            text: "Drawdowns don't just cost you money — they cost you time. A trader in a 50% drawdown could spend months or years just trying to get back to their starting point. During that time, they're not making money; they're just trying not to lose more.",
          },
          {
            type: 'text',
            text: "Professional traders at hedge funds are often fired or have their capital reduced after a 15-20% drawdown. Not because 20% is catastrophic, but because the time to recover + the psychological damage to decision-making makes it rational to reset.",
          },
          {
            type: 'keypoint',
            text: "Protecting capital is not a conservative, boring risk management choice. It's a mathematically forced requirement. You cannot compound returns on capital you no longer have.",
          },
        ],
      },
      {
        id: 'm3-l2',
        title: 'Position Sizing — The Actual Skill',
        subtitle: 'How professional traders decide how much to risk',
        duration: '10 min',
        xp: 70,
        content: [
          {
            type: 'text',
            text: "Position sizing is where strategy meets execution. You can have a perfect trading system and destroy your account with wrong sizing. Or have an average system and compound steadily with correct sizing.",
          },
          {
            type: 'heading',
            text: 'The Fixed Fractional Method',
          },
          {
            type: 'text',
            text: "The simplest and most widely used approach: risk a fixed percentage of your current account balance on every trade. Most retail prop-firm-style traders use 1-2%.",
          },
          {
            type: 'formula',
            label: 'HOW TO CALCULATE POSITION SIZE',
            text: "Position Size = (Account × Risk%) ÷ (Entry Price − Stop Loss Price)\n\nExample:\nAccount: £10,000\nRisk per trade: 1% = £100\nEntry price: £500\nStop loss: £490 (£10 below entry)\n\nPosition size = £100 ÷ £10 = 10 units",
          },
          {
            type: 'text',
            text: "Notice what this does: it ties your position size to where your stop loss is. If your stop is very tight (£2 away), you can take a larger position. If your stop must be wide (£50 away), you take a smaller position. The risk in pounds stays constant regardless of the trade setup.",
          },
          {
            type: 'analogy',
            label: 'THE ENGINEER ANALOGY',
            text: "A structural engineer doesn't ask 'will this bridge hold?' — they calculate the maximum load it can bear under every realistic scenario and then build with a safety margin. Position sizing is your safety margin calculation. You're not hoping the trade works; you're specifying exactly how much damage you can absorb if it doesn't.",
          },
          {
            type: 'heading',
            text: 'Volatility-Adjusted Sizing',
          },
          {
            type: 'text',
            text: "More advanced traders adjust their position size based on current market volatility. In a highly volatile market, the same nominal position represents more risk. Volatility-adjusted sizing shrinks positions when markets are volatile and grows them when markets are calm.",
          },
          {
            type: 'text',
            text: "The simplest proxy for this: use ATR (Average True Range) as your stop distance instead of a fixed price level. ATR measures how much the asset typically moves per day. A 1× ATR stop means your stop is one average daily move away — scaling naturally with current volatility.",
          },
          {
            type: 'keypoint',
            text: "Professional sizing is not intuitive — it feels too small. A 1% risk per trade feels like nothing when you're excited about a setup. But across 100 trades, 1% risk with a 2:1 reward target compounds into meaningful returns with survivable drawdowns.",
          },
        ],
        challengeId: 'risk-ruin',
      },
      {
        id: 'm3-l3',
        title: 'Correlation Risk — When 10 Positions Are Really One',
        subtitle: "Portfolio-level thinking that most retail traders miss",
        duration: '7 min',
        xp: 70,
        content: [
          {
            type: 'text',
            text: "Here's a trap many traders fall into: they open 5 different crypto positions thinking they're diversified. Then the market dumps 15% across the board and all 5 positions lose simultaneously. They just had 5× the risk they thought they had.",
          },
          {
            type: 'analogy',
            label: 'THE UMBRELLA ANALOGY',
            text: "Imagine five different friends all saying 'I've got you covered if it rains' — but they all share one umbrella stored at the same house. That's correlated risk. The 'protection' looks like diversification but evaporates when you actually need it.",
          },
          {
            type: 'heading',
            text: 'Correlation in Crypto',
          },
          {
            type: 'text',
            text: "In crypto, virtually everything is correlated with Bitcoin during market panics. In a proper bull run, altcoins might diverge from Bitcoin (some outperform, some underperform). But in a sudden market-wide fear event, correlations spike toward 1.0 — everything falls together.",
          },
          {
            type: 'text',
            text: "This means: if your portfolio is all crypto, you don't have multiple independent bets. You have one macro bet on 'crypto goes up' expressed across multiple assets. Your actual risk is much higher than position sizing per trade suggests.",
          },
          {
            type: 'keypoint',
            text: "True diversification means assets that move independently (ideally, that move oppositely). Within crypto, genuine diversification is rare. Acknowledge this and size your total crypto exposure as one position.",
          },
          {
            type: 'heading',
            text: 'The Practical Rule',
          },
          {
            type: 'text',
            text: "A simple rule for beginners: never have more than 2-3 concurrent open positions in correlated assets. If you have 3 long BTC-correlated positions, you're effectively trading 3× the size of your per-trade risk.",
          },
        ],
      },
      {
        id: 'm3-l4',
        title: 'Ruin Theory — The Math of Blowing Up',
        subtitle: "Why even a winning system can destroy you with wrong sizing",
        duration: '9 min',
        xp: 70,
        content: [
          {
            type: 'text',
            text: "Gambler's ruin is a concept from probability theory with a brutal implication for trading: even with a positive edge, there exists a bet size large enough that you will eventually go broke with certainty.",
          },
          {
            type: 'analogy',
            label: 'THE DRUNK WALKING ANALOGY',
            text: "Imagine a drunk walking randomly — each step either one metre forward or one metre back, equally likely. If they're near a cliff edge with unlimited space behind them, they'll eventually fall off. Not because they're unlucky — because given enough time, a random walk will reach any given point. The cliff is your account hitting zero. Risk of ruin is the probability that your equity curve hits zero before reaching your profit target.",
          },
          {
            type: 'heading',
            text: 'The Ruin Probability Formula',
          },
          {
            type: 'text',
            text: "Without going deep into the maths: ruin probability decreases dramatically as bet size decreases relative to total capital, and as win rate and reward/risk improve.",
          },
          {
            type: 'example',
            label: 'EXAMPLE',
            text: "Bet 50% of your account each trade with 55% win rate: ruin probability is high within 20 trades.\nBet 2% of your account each trade with 55% win rate: ruin probability approaches zero over hundreds of trades.",
          },
          {
            type: 'text',
            text: "The key insight: ruin probability is not linear with bet size. It falls off a cliff as you reduce size. Going from 10% risk to 1% risk doesn't make you 10× safer — it makes you many thousands of times safer in terms of ruin probability.",
          },
          {
            type: 'keypoint',
            text: "This is why professional traders are obsessive about small position sizes. It's not timidity — it's the application of ruin theory. You cannot compound an account that reaches zero. Small size preserves optionality forever.",
          },
          {
            type: 'warning',
            text: "The most common psychology trap: after a losing streak, the temptation is to 'make it back' with a bigger trade. This is precisely backwards from what the math requires. Losing streaks are the highest-risk time to size up — your variance is at its worst.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // MODULE 4
  // ─────────────────────────────────────────────
  {
    id: 4,
    title: "Reading the Market's Signals",
    subtitle: 'The data layer that informed traders actually use',
    description: "Forget memorising indicators. Real edge comes from understanding what the market's structural signals are telling you about crowd positioning, funding dynamics, and on-chain reality.",
    icon: '📡',
    xpPool: 550,
    color: '#ffa502',
    accentColor: '#ffa502',
    unlockCondition: 'Complete Module 3',
    lessons: [
      {
        id: 'm4-l1',
        title: 'Funding Rates — The Crowdedness Gauge',
        subtitle: 'How perpetual futures mechanics reveal consensus positioning',
        duration: '10 min',
        xp: 65,
        content: [
          {
            type: 'text',
            text: "Most crypto trading happens through perpetual futures — a type of contract that lets you bet on price direction with leverage, without ever owning the underlying asset. Perpetual futures have a mechanism that most traders overlook: funding rates.",
          },
          {
            type: 'heading',
            text: 'How Perpetual Futures Work',
          },
          {
            type: 'text',
            text: "A perpetual future needs to stay close to the spot price of the underlying asset. But since traders can be leveraged long or short, the market can get 'crowded' in one direction, pushing the perpetual price away from spot.",
          },
          {
            type: 'text',
            text: "To fix this, exchanges use a funding mechanism: if more people are long than short (driving the perp above spot), longs pay a fee to shorts every 8 hours. If more people are short, shorts pay longs. This fee is the funding rate.",
          },
          {
            type: 'analogy',
            label: 'THE RENTAL MARKET ANALOGY',
            text: "Funding rate is the rental cost of a crowded trade. When everyone in the city wants to rent in the same neighbourhood, rent goes up — until it's expensive enough to push some of them elsewhere. When everyone is long crypto on leverage, funding rates rise — until it's too expensive to hold longs, and they close their positions. High positive funding = dangerously crowded long trade.",
          },
          {
            type: 'heading',
            text: 'What Funding Rates Tell You',
          },
          {
            type: 'text',
            text: "Consistently high positive funding: the market is consensus long. This means longs are paying shorts to stay in the trade. It also means there are many overleveraged longs who could be forced to close if price drops — creating a cascade.",
          },
          {
            type: 'text',
            text: "Negative funding: the market is consensus short. Shorts are paying longs. This is often a contrarian bullish signal — shorts are crowded and a squeeze could be incoming.",
          },
          {
            type: 'keypoint',
            text: "Extreme funding rates in either direction are a warning. Not a guaranteed reversal signal — but a red flag that the trade is too crowded and the risk/reward of following the crowd has deteriorated.",
          },
        ],
        challengeId: 'funding-arb',
      },
      {
        id: 'm4-l2',
        title: 'Open Interest — Pressure in the System',
        subtitle: 'The fuel tank of leverage-driven moves',
        duration: '8 min',
        xp: 65,
        content: [
          {
            type: 'text',
            text: "Open interest (OI) is the total value of all outstanding futures positions. When OI is rising, new money is entering the market. When OI falls, positions are being closed.",
          },
          {
            type: 'analogy',
            label: 'THE PRESSURE GAUGE ANALOGY',
            text: "Think of OI as pressure in a pipe. High OI with high leverage = the system is under enormous pressure. If something triggers a sentiment shift — a bad news event, a key price level breaking — that pressure releases violently. High OI environments are where liquidation cascades happen: falling prices force some longs to close, which drops price further, which forces more longs to close. The pipe bursts.",
          },
          {
            type: 'heading',
            text: 'OI + Price: Reading the Combination',
          },
          {
            type: 'text',
            text: "OI rising + price rising: genuine bullish strength. New money is entering long. Sustainable move.",
          },
          {
            type: 'text',
            text: "OI rising + price falling: new shorts entering. Potential for a short squeeze if price reverses.",
          },
          {
            type: 'text',
            text: "OI falling + price rising: short squeeze — shorts are being forced to close (buy back), driving price up. Can be violent but often short-lived.",
          },
          {
            type: 'text',
            text: "OI falling + price falling: longs capitulating. End of a move — often signals bottoming process.",
          },
          {
            type: 'keypoint',
            text: "OI alone tells you nothing. OI in combination with price direction and funding rates tells you the likely source and sustainability of a move.",
          },
        ],
      },
      {
        id: 'm4-l3',
        title: 'On-Chain Data — The Blockchain Is Transparent',
        subtitle: 'Reading the signals only crypto can provide',
        duration: '9 min',
        xp: 65,
        content: [
          {
            type: 'text',
            text: "Unlike any other asset class, crypto's entire transaction history is publicly visible. This creates a unique data layer that sophisticated traders use as an additional signal.",
          },
          {
            type: 'heading',
            text: 'SOPR — Are Sellers in Profit or Panic?',
          },
          {
            type: 'text',
            text: "SOPR (Spent Output Profit Ratio) measures whether coins being sold today are being sold at a profit or a loss. Above 1 = sellers are in profit. Below 1 = sellers are realising losses (typically panic selling).",
          },
          {
            type: 'analogy',
            label: 'THE PROPERTY MARKET ANALOGY',
            text: "Imagine you could see the purchase price of every house being sold. If most houses are selling at a profit, sellers are comfortable and the market is healthy. If most are selling at a loss, people are in distress — they're being forced to sell. SOPR below 1 in crypto is that distress signal: holders are so underwater they're selling at a loss. That's often where bottoms form.",
          },
          {
            type: 'heading',
            text: 'Exchange Flows — Are Whales Preparing to Sell?',
          },
          {
            type: 'text',
            text: "When large holders want to sell crypto, they move it from cold storage (off exchanges, secure) to exchanges (where it can be sold). Spikes in exchange inflows = large holders preparing to sell = potential supply increase = bearish signal.",
          },
          {
            type: 'text',
            text: "Exchange outflows = people moving crypto off exchanges into cold storage. They're not selling — they're holding long-term. Bullish signal: supply being removed from the market.",
          },
          {
            type: 'keypoint',
            text: "On-chain data is not a crystal ball. It's one layer of evidence in a probabilistic argument. The skill is synthesising multiple signals (price action + funding + OI + on-chain) into a coherent thesis.",
          },
        ],
      },
      {
        id: 'm4-l4',
        title: 'CVD — Who Is Winning the Battle?',
        subtitle: 'Reading the scoreboard of buyer vs. seller aggression',
        duration: '7 min',
        xp: 65,
        content: [
          {
            type: 'text',
            text: "Cumulative Volume Delta (CVD) is a running total of the difference between aggressive buy volume and aggressive sell volume. When buyers are more aggressive than sellers (using market orders), CVD rises. When sellers dominate, CVD falls.",
          },
          {
            type: 'text',
            text: "Why does this matter? Price can rise while CVD falls — which means price is rising not because buyers are aggressively buying, but because sellers are stepping back. That's a much weaker rally. And it suggests the move is fragile.",
          },
          {
            type: 'analogy',
            label: 'THE TUG OF WAR ANALOGY',
            text: "CVD is the scoreboard of a tug of war. Buyers pulling on one side, sellers on the other. If the rope is moving toward the buyers but they're barely pulling (CVD diverging from price), the buyers will eventually tire. Divergence between price and CVD is one of the more reliable warning signals in market microstructure.",
          },
          {
            type: 'heading',
            text: 'Divergences Are the Signal',
          },
          {
            type: 'text',
            text: "The most useful CVD signal is divergence with price: Price makes a new high, but CVD doesn't follow → sellers absorbing the move, weakness ahead. Price makes a new low, but CVD makes a higher low → buyers stepping in aggressively at lows, potential reversal.",
          },
          {
            type: 'keypoint',
            text: "Don't just watch price. Watch who is driving price. CVD tells you whether moves are driven by aggressive buyers or sellers, and divergences between the two often precede reversals.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // MODULE 5
  // ─────────────────────────────────────────────
  {
    id: 5,
    title: 'The Psychology of Losing Money',
    subtitle: 'Why brilliant people blow up, and how not to be one of them',
    description: "Your brain was not designed for trading. It was designed to survive the savanna. Every instinct that kept your ancestors alive will try to kill your trading account. This module is about knowing your enemy.",
    icon: '🧠',
    xpPool: 500,
    color: '#8b5cf6',
    accentColor: '#8b5cf6',
    unlockCondition: 'Complete Module 4',
    lessons: [
      {
        id: 'm5-l1',
        title: 'Loss Aversion — Why Losses Hurt Twice as Much as Wins Feel Good',
        subtitle: "Kahneman and Tversky's discovery that breaks most traders",
        duration: '9 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Daniel Kahneman and Amos Tversky won the Nobel Prize for discovering something traders desperately need to understand: humans weight losses approximately twice as heavily as equivalent gains. This is called loss aversion.",
          },
          {
            type: 'formula',
            label: 'THE ASYMMETRY',
            text: "Winning £100 creates about +1 unit of psychological utility.\nLosing £100 creates about -2 units of psychological pain.\n\nSo a coin flip for £100 win vs £100 loss feels like a bad deal even though it's mathematically neutral.",
          },
          {
            type: 'analogy',
            label: 'THE EVOLUTIONARY ANALOGY',
            text: "This isn't a design flaw — it's a survival feature. On the savanna, failing to avoid a predator was fatal. Missing a meal was temporary. Your ancestors who were twice as afraid of threats as they were excited by rewards survived more often. Those genes are yours. But evolution didn't anticipate a context where you'd be making 100+ probability-weighted decisions per month. Loss aversion is a survival trait in the wrong context.",
          },
          {
            type: 'heading',
            text: 'How Loss Aversion Destroys Trading Accounts',
          },
          {
            type: 'text',
            text: "Loss aversion creates two specific, devastating patterns in traders:",
          },
          {
            type: 'text',
            text: "1. Cutting winners early: a position goes up 5% and you feel the urge to lock in the win. You close it. Loss aversion is making 'locking in gains' feel good — but mathematically, you need to let winners run to compensate for losses.",
          },
          {
            type: 'text',
            text: "2. Letting losers run: a position goes down 8% and you can't bring yourself to close it. Closing would 'lock in' the loss, which feels terrible. Instead you hold, and it falls 20%. This is the single most common way retail traders destroy accounts.",
          },
          {
            type: 'keypoint',
            text: "The antidote is a pre-committed stop loss. Before you enter the trade, you decide exactly where you'll exit if wrong — and you do it regardless of how it feels. The decision is made when you're rational (pre-trade), not when you're emotional (mid-loss).",
          },
        ],
        challengeId: 'bias-detector',
      },
      {
        id: 'm5-l2',
        title: 'The Sunk Cost Fallacy',
        subtitle: "Why 'I can't sell — I'd lock in a loss' is mathematically irrational",
        duration: '7 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "\"I can't close this position — I'd lock in the loss.\" If you've ever thought this, you've experienced the sunk cost fallacy. It's one of the most expensive cognitive errors in trading.",
          },
          {
            type: 'analogy',
            label: 'THE CINEMA ANALOGY',
            text: "You paid £15 for a cinema ticket. Twenty minutes in, the film is terrible. You stay until the end anyway — because 'you paid for it.' But the £15 is gone whether you leave or stay. Your choice is only about the next two hours of your time, not the already-spent money. Staying is actually the worse decision — you're adding 2 hours of boredom to the £15 already lost.",
          },
          {
            type: 'text',
            text: "In trading, the sunk cost fallacy looks like this: BTC is down 30% from your entry. You stay in the trade because 'you can't lock in a 30% loss.' But the 30% is already lost — it doesn't exist in your account. Your choice is only about the future: does this position have positive EV from here? If yes, hold. If no, close. The past is completely irrelevant.",
          },
          {
            type: 'formula',
            label: 'THE ONLY QUESTION THAT MATTERS',
            text: "The only question that should determine whether to hold or close a losing position:\n'If I had no position here and could enter fresh, would I buy at this price?'\n\nIf yes → hold.\nIf no → close.\n\nYour entry price is completely irrelevant to this decision.",
          },
          {
            type: 'keypoint',
            text: "Every moment you hold a position, you are effectively re-entering it at the current price. Ask yourself: would you buy at today's price? If not, you shouldn't be holding.",
          },
        ],
      },
      {
        id: 'm5-l3',
        title: 'Overconfidence and Calibration',
        subtitle: "The difference between real confidence and ego confidence",
        duration: '8 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Overconfidence is the most well-documented bias in the psychology literature. Studies show that across almost every domain, people systematically overestimate their accuracy and skill. Traders are particularly susceptible.",
          },
          {
            type: 'analogy',
            label: 'THE WEATHER MODEL ANALOGY',
            text: "A weather model doesn't say '100% chance of rain tomorrow.' That claim is unfalsifiable — if it rains, you were right; if it doesn't, you'll find a reason why. A properly calibrated model says '73% chance of rain.' Calibration means: your 70% predictions are correct 70% of the time, your 90% predictions are correct 90% of the time. The uncertainty is honest and quantified. Most traders speak in certainties ('BTC is definitely going to £100k') when they should speak in probabilities ('I think there's a 65% chance BTC is above £80k in 3 months').",
          },
          {
            type: 'heading',
            text: 'How to Check Your Calibration',
          },
          {
            type: 'text',
            text: "Keep a trading journal where you record: trade idea, entry price, target, stop, and your confidence level (e.g. '70% confident this works'). Over time, track: when you said 70%, did it work 70% of the time? When you said 90%, was it right 90% of the time?",
          },
          {
            type: 'text',
            text: "Most people discover they are systematically overconfident — their '90% confident' calls succeed 55% of the time. This is valuable information. It tells you to shrink your size when you feel most certain.",
          },
          {
            type: 'keypoint',
            text: "Calibrated confidence is not pessimism — it's precision. A surgeon with calibrated confidence in a difficult procedure is more trustworthy than one who says 'I never lose patients.' The humility to be accurate about uncertainty is itself a skill.",
          },
        ],
      },
      {
        id: 'm5-l4',
        title: 'Tilt and Decision Fatigue',
        subtitle: "The emotional cascade that ends trading accounts in a single session",
        duration: '8 min',
        xp: 60,
        content: [
          {
            type: 'text',
            text: "Tilt is a term from poker — it describes the state where emotional distress causes a normally disciplined player to make irrational decisions. In trading, tilt usually follows a losing streak and results in the worst trades of a trader's career.",
          },
          {
            type: 'analogy',
            label: 'THE CHESS ENGINE ANALOGY',
            text: "A chess engine's evaluation doesn't get worse after a bad move. It doesn't feel frustration, urgency, or the need to 'make it back.' It simply recalculates from the current position with full rational capacity. Human traders need to be the chess engine — not the human throwing the board across the room after a blunder. But achieving this requires recognising when you're on tilt before you make the catastrophic trade.",
          },
          {
            type: 'heading',
            text: 'Tilt Warning Signs',
          },
          {
            type: 'text',
            text: "You might be on tilt when: you're increasing position size after a loss to 'make it back,' you're entering trades you wouldn't normally take, you're trading faster than usual, you feel a tight chest / racing heart while watching charts, you're angry at the market for 'going against you.'",
          },
          {
            type: 'text',
            text: "Decision fatigue is a related phenomenon. The quality of human decisions degrades after many decisions in a row. Judges give harsher sentences late in the afternoon. Traders make worse decisions in the evening after a full day of watching screens.",
          },
          {
            type: 'keypoint',
            text: "The professional response to tilt is not willpower — it's structural rules. A daily loss limit (e.g. 'I close all positions and stop trading if I lose more than 2% in a day') removes the decision in the moment when you're least capable of making it well.",
          },
          {
            type: 'warning',
            text: "The trades made on tilt are disproportionately destructive. A week of patient, disciplined trading can be wiped out in one tilted afternoon. Treat tilt as a stop signal, not a challenge to overcome with willpower.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // MODULE 6
  // ─────────────────────────────────────────────
  {
    id: 6,
    title: 'Building a System',
    subtitle: 'From understanding to repeatable edge',
    description: "Knowing the theory is not enough. The final step is encoding everything you've learned into a rules-based system — one that can be followed when emotions are running high and the market is moving fast.",
    icon: '⚙️',
    xpPool: 450,
    color: '#6366f1',
    accentColor: '#6366f1',
    unlockCondition: 'Complete Module 5 + 1,800 XP',
    lessons: [
      {
        id: 'm6-l1',
        title: 'What Real Edge Looks Like',
        subtitle: 'The bar your system needs to clear before you risk real money',
        duration: '8 min',
        xp: 55,
        content: [
          {
            type: 'text',
            text: "Edge is not a feeling. It's not 'I have a good sense for markets.' It's a quantifiable, tested, repeatable statistical advantage.",
          },
          {
            type: 'analogy',
            label: 'THE CARD COUNTER ANALOGY',
            text: "A card counter in blackjack doesn't win every hand. They have a +0.5% edge over the house — which means across 10,000 hands, they will be profitable. They can prove this edge exists through the math, through simulation, and through live results. Trading edge needs to be documented the same way. If you can't point to the data showing your edge across at least 50 trades, you don't know if your edge is real.",
          },
          {
            type: 'heading',
            text: 'The Minimum Requirements for Real Edge',
          },
          {
            type: 'text',
            text: "Positive expectancy: EV > 0 when averaged across all trades, including commissions and fees.",
          },
          {
            type: 'text',
            text: "Statistically significant sample size: At minimum 50 completed trades, ideally 100+. A 3-trade winning streak is noise.",
          },
          {
            type: 'text',
            text: "Out-of-sample performance: The edge works on data you didn't use to develop it. Finding a pattern that works on the same data you used to discover it is curve-fitting, not edge.",
          },
          {
            type: 'text',
            text: "Survivable drawdown profile: even in the worst historical losing streak your system experienced, your sizing would have kept you in the game.",
          },
          {
            type: 'keypoint',
            text: "The discipline of proving edge before deploying real capital protects you from what kills most beginner traders: treating a small sample of lucky trades as confirmed edge.",
          },
        ],
      },
      {
        id: 'm6-l2',
        title: 'System Design — The Complete Ruleset',
        subtitle: 'Entry, exit, sizing: every decision pre-committed',
        duration: '10 min',
        xp: 55,
        content: [
          {
            type: 'text',
            text: "A trading system is a set of rules specific enough that two different traders, given the same data, would make the same decision. If your system is 'buy when I feel the market is ready to go up' — that's not a system. That's an emotion.",
          },
          {
            type: 'analogy',
            label: 'THE PILOT CHECKLIST ANALOGY',
            text: "A commercial pilot has a pre-flight checklist not because they'll forget — they're experienced professionals who've done this thousands of times. It's because cognitive load in a cockpit at 35,000 feet is different from cognitive load on the ground. In high-stress, high-speed situations, systems override intuition. Your trading checklist works the same way. The decisions are made when you're calm, not when the market is moving and your heart rate is up.",
          },
          {
            type: 'heading',
            text: 'The Six Components of a Complete System',
          },
          {
            type: 'text',
            text: "1. SETUP: What conditions must be present before I even consider a trade? (e.g. 'price must be above the 20-period MA and funding must be below 0.01%')",
          },
          {
            type: 'text',
            text: "2. ENTRY TRIGGER: What specific event causes me to enter? (e.g. 'break and close above the previous 4h high')",
          },
          {
            type: 'text',
            text: "3. STOP LOSS: Where am I wrong, and at what price do I exit? This must be pre-defined — not moved after entry.",
          },
          {
            type: 'text',
            text: "4. TARGET: What is my profit target, and is it based on a realistic probability of price reaching it?",
          },
          {
            type: 'text',
            text: "5. POSITION SIZE: Calculated from stop distance and max risk per trade — not from how confident I feel.",
          },
          {
            type: 'text',
            text: "6. TRADE MANAGEMENT: Will I scale in/out? Will I move my stop? Under what exact conditions?",
          },
          {
            type: 'keypoint',
            text: "If any of these six are answered with 'it depends' or 'I'll feel it out,' your system is incomplete. Incomplete systems are where emotional decision-making fills the gap — and emotional decisions in live markets are almost always wrong.",
          },
        ],
        challengeId: 'ev-calculator',
      },
      {
        id: 'm6-l3',
        title: 'Backtesting and the Overfitting Trap',
        subtitle: "How to test a system without fooling yourself",
        duration: '8 min',
        xp: 55,
        content: [
          {
            type: 'text',
            text: "Backtesting is the process of applying your trading rules to historical data to see how they would have performed. Done correctly, it's invaluable. Done incorrectly — which is how most beginners do it — it creates false confidence that can be financially devastating.",
          },
          {
            type: 'analogy',
            label: 'THE EXAM ANALOGY',
            text: "Imagine you're studying for an exam and the teacher gives you the answer sheet in advance. You score 100%. But when the real exam has different questions, you fail. Backtesting on the same data you used to develop your strategy is exactly this: you've reverse-engineered an answer sheet. The real market is the exam with different questions.",
          },
          {
            type: 'heading',
            text: 'The Overfitting Problem',
          },
          {
            type: 'text',
            text: "Overfitting means your strategy fits the historical data perfectly but has no actual edge. It's happened to everyone who has 'optimised' a trading strategy by tweaking parameters until it looks profitable in the backtest.",
          },
          {
            type: 'text',
            text: "If you test 100 random indicators on the same dataset, several will appear profitable — by pure chance. The more parameters you tweak, the more certain you are to find a combination that worked in the past by coincidence.",
          },
          {
            type: 'heading',
            text: 'The Correct Approach: Walk-Forward Testing',
          },
          {
            type: 'text',
            text: "Develop your strategy on one period of data (in-sample). Lock it — no more changes. Test it on a completely separate, unseen period (out-of-sample). If it performs reasonably in out-of-sample testing (perhaps 50-70% as well as in-sample), you have evidence of genuine edge.",
          },
          {
            type: 'keypoint',
            text: "The only statistically meaningful test of edge is performance on data you haven't seen before. Everything else is pattern-matching to noise.",
          },
        ],
      },
      {
        id: 'm6-l4',
        title: 'The Trading Journal — Your Feedback Loop',
        subtitle: "Why every professional reviews every trade, and how to do it",
        duration: '7 min',
        xp: 55,
        content: [
          {
            type: 'text',
            text: "A trading journal is not a diary about your feelings (although noting your emotional state has value). It's a rigorous data collection instrument that lets you answer the question: is my edge still working, and am I executing it correctly?",
          },
          {
            type: 'analogy',
            label: 'THE SURGEON REVIEW ANALOGY',
            text: "Surgeons review their complications not to feel bad about them but to update their mental model. What went wrong? Was it a technique issue? Was it a case selection issue? What would I do differently? The review is not punishment — it's the feedback loop that separates a surgeon with 10 years of experience from one who has made the same mistakes for 10 years.",
          },
          {
            type: 'heading',
            text: 'What to Record',
          },
          {
            type: 'text',
            text: "Every trade: date/time, asset, direction, setup type, entry price, stop price, target, actual exit, outcome (£ and %). Confidence level going in (0-100%). Emotional state (scale of 1-10, with notes). Did you follow your rules? If not, why not?",
          },
          {
            type: 'text',
            text: "Review frequency: daily scan for execution quality. Weekly deep review: are you following your rules? Monthly analysis: is your EV tracking as expected? Are there setup types performing below expectation?",
          },
          {
            type: 'keypoint',
            text: "A journal converts trading from a purely emotional experience into a data-gathering exercise. Every loss is data. Every win is data. The process of reviewing forces you to confront mistakes before they become habits.",
          },
          {
            type: 'text',
            text: "You are at the beginning of what could be an exceptional trading career. The information in these modules has taken some professionals years to internalise. The speed at which you apply it, test it, and make it yours is what will determine how quickly your edge develops. Trade small. Journal everything. Trust the process.",
          },
        ],
      },
    ],
  },
];
