# Uthman - Speaker Sourcing Setup (Updated April 2)

Hey Uthman, follow these steps to get the AI sourcer running. Should take 10 min.

---

## Step 1: Get the code

Open Terminal (search "Terminal" in Spotlight) and run:

```bash
cd ~/Desktop
git clone https://github.com/dongraham/peer-pathway-project.git
cd peer-pathway-project/scripts/speaker-sourcing
```

If you already have the repo, just pull the latest:

```bash
cd ~/Desktop/peer-pathway-project
git pull
cd scripts/speaker-sourcing
```

---

## Step 2: Add API keys

Don will send you two keys. Run these in Terminal (paste the real keys):

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-PASTE-YOUR-KEY-HERE"' >> ~/.zshrc
echo 'export ATTIO_API_KEY="PASTE-ATTIO-KEY-HERE"' >> ~/.zshrc
source ~/.zshrc
```

To check they work:

```bash
echo $ANTHROPIC_API_KEY
echo $ATTIO_API_KEY
```

Both should print the keys back.

---

## Step 3: Run setup

```bash
cd ~/Desktop/peer-pathway-project/scripts/speaker-sourcing
chmod +x setup.sh run.sh
./setup.sh
```

This creates a Python environment and installs everything. Takes ~2 min.

---

## Step 4: Run it

```bash
./run.sh
```

Here's what happens:

1. Shows you the dashboard (who's confirmed, what gaps exist)
2. Asks if you want to start sourcing, press `y`
3. Chrome opens and goes to LinkedIn Sales Navigator
4. **Log in to LinkedIn when it asks** (you have 60 seconds)
5. AI searches through 17 Sales Navigator filters automatically
6. Extracts names/firms/unis/LinkedIn URLs from each search
7. Each search takes ~5 min, total run ~60-90 min for all 17
8. When done, it scores everyone and gives you copy-paste DMs
9. **NEW: automatically syncs scored candidates to Attio CRM**

---

## Using Sales Navigator (IMPORTANT)

The script is built for Sales Nav. Make sure:

1. You have LinkedIn Sales Navigator access (Premium or team plan)
2. When the browser opens, log into your LinkedIn account that HAS Sales Nav
3. The script will use Sales Nav filters (Past Company, Geography, School) to find better candidates than regular LinkedIn search
4. If you DON'T have Sales Nav, run with `--regular` flag instead (see Quick Commands below)

### Sales Nav Tips
- The script searches by "Past company" filter to find people who did spring weeks at specific firms
- It checks first 2 pages of results per search
- There's a built-in delay between searches (20-45 seconds) to avoid LinkedIn flagging
- If LinkedIn blocks you, wait 24 hours then run with `--max-searches 5`

---

## Quick Commands

| What you want | Command |
|---|---|
| Full run (everything) | `./run.sh` |
| Just see the dashboard | `./run.sh quick` |
| Just source new people | `./run.sh source` |
| Just generate DMs | `./run.sh dm` |
| Just score candidates | `./run.sh score` |
| Run only 3 searches (quick test) | `source .venv/bin/activate && python3 01_linkedin_sourcer.py --max-searches 3` |
| Use regular LinkedIn (no Sales Nav) | `source .venv/bin/activate && python3 01_linkedin_sourcer.py --regular` |
| See optimal panel recommendation | `source .venv/bin/activate && python3 07_optimal_panel.py` |
| Sync all candidates to Attio | `source .venv/bin/activate && python3 04_attio_sync.py --add-new --sourced-by Uthman` |

---

## After Sourcing: Auto-Sync to Attio

After the sourcer runs and scores everyone, sync them straight to Attio:

```bash
source .venv/bin/activate
python3 04_attio_sync.py --add-new --sourced-by Uthman
```

This creates a Person record in Attio for each new candidate and adds them to the Speaker Recruitment pipeline at the "Sourced" stage. Each record gets a note with their firms, university, AI score, and LinkedIn URL.

---

## After Sending DMs

When you've sent a DM to someone on LinkedIn:

```bash
source .venv/bin/activate
python3 04_attio_sync.py --advance "TheirName" "DM Sent"
```

When they reply:

```bash
python3 04_attio_sync.py --advance "TheirName" "Replied"
```

When they say they're interested:

```bash
python3 04_attio_sync.py --advance "TheirName" "Interested"
```

When they confirm they'll be on the panel:

```bash
python3 04_attio_sync.py --advance "TheirName" "Confirmed"
```

Check the full pipeline status anytime:

```bash
python3 04_attio_sync.py --status
```

---

## Priority Targets (WHO TO DM FIRST)

The AI scored everyone. Here are the TOP PRIORITY candidates, DM these FIRST:

### ALREADY AVAILABLE (Don's friends, no DM needed):
- **Ayo Odeyingbo** - Morgan Stanley, Evercore, HSBC, PWP, Deutsche Bank, Insight Investment. LSE.
- **Joel Fadahunsi** - Jane Street, Bank of America, EY, Bain Capital. LSE.
- **Serena Popovici** - Nomura, RBC, SIG, Barings, Houlihan Lokey, ARC Associates. LSE. Female.
- **Aashay Deole** - Barclays, Houlihan Lokey, J O Hambro, Earth Capital. LSE.
- **Matthias Schunemann** - Citi, SIG, Bloomberg, KPMG, JPMorgan, Freshfields. LSE.
- **Dylan Dhariwal** - Morgan Stanley, Maven Securities. LSE. (confirmed)

### Tier 1: DM TODAY - CRITICAL GAPS
1. **Kishan Patel** (score 82) - Goldman Sachs, Evercore, Lazard + 6 others. UCL. LinkedIn: linkedin.com/in/kishan-patel-y23/
2. **Rothschild speaker** - Run sourcing script with `--max-searches 3` targeting Rothschild. April 23 spring week, NOBODY covers this firm.
3. **BlackRock speaker** - Run sourcing script targeting BlackRock. April spring week, NOBODY covers this firm.

### Tier 2: DM THIS WEEK - CONVERSION STORIES + LAW
4. **Mya Raithatha** (score 75) - Deutsche Bank IB Analyst, return offer. Female. LinkedIn: linkedin.com/in/mya-raithatha-8963b8218/
5. **Law vac scheme speaker** - Run sourcing with law queries. Need someone from Linklaters/Latham/White & Case. Prefer NON-LSE uni.
6. **Law vac scheme speaker #2** - Prefer female, different firm from #5.

### Also chase (existing unconfirmed):
- **Jibril** - PwC, Millennium, Citadel, Morgan Stanley. Covers Quant/Trading.
- **Yuyao Xie** - Barclays, Optiver, Bank of America, Millennium. Female. Quant/Trading.

---

## What the AI looks for

Priority order (it scores everyone automatically):

1. **Multi-firm people** - someone with Goldman + Barclays + Lazard spring weeks covers 3 firms in one speaker slot
2. **Gap firms** - Goldman, JPMorgan, Deutsche Bank, Rothschild, Lazard, Evercore, BNP, KPMG, Jane Street, BlackRock, Pimco
3. **Converters** - turned spring week into return offer or summer internship
4. **Women** - panel is 4M/1F right now, we need more female speakers
5. **Dark horses** - non-LSE students who got top spring weeks (Exeter, Bath, Durham, Nottingham etc.)
6. **Sector coverage** - still need Law and Tech

The scripts handle all the scoring and prioritising. Just run them, copy the DMs, and send.

---

## If Something Goes Wrong: Use Claude Online

If a script errors out and you can't fix it, use **Claude** (the AI) to help:

### Option A: Claude.ai (easiest)
1. Go to **claude.ai** in your browser
2. Copy-paste the error message
3. Say: "I'm running a Python script for speaker sourcing and got this error. How do I fix it?"
4. Claude will tell you exactly what to do

### Option B: Claude Code (if Don sets it up for you)
If Don gives you Claude Code access:
1. Open Terminal
2. Type `claude` and press Enter
3. It opens an AI assistant right in your terminal
4. Say: "I ran ./run.sh and got this error: [paste error]"
5. It can read the files and fix things directly

**No extensions or plugins needed.** Claude.ai works in any browser. Just go to claude.ai, log in with the account Don gives you, and paste your error.

---

## If something goes wrong (quick fixes)

| Problem | Fix |
|---------|-----|
| "ANTHROPIC_API_KEY not set" | Run `source ~/.zshrc` and try again |
| "ATTIO_API_KEY not set" | Run `source ~/.zshrc` and try again |
| Browser doesn't open | Run `./setup.sh` again |
| LinkedIn blocks the searches | Wait 24 hours. Next time run with `--max-searches 5` |
| Script crashes halfway | Just run `./run.sh` again, it picks up where it left off |
| "No module named browser_use" | Run `source .venv/bin/activate` first, then try again |
| Python version error | Run `python3 --version`. Need 3.10+. If not, install from python.org |
| "requests not found" | Run `source .venv/bin/activate && pip install requests` |
| Attio sync fails | Check your ATTIO_API_KEY is set. Run `echo $ATTIO_API_KEY` |
| Anything else | Screenshot the error and send to Don, or paste it into claude.ai |
