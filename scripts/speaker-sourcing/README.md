# Speaker Sourcing — Uthman's Guide

## First Time Setup (5 min)

1. Open Terminal
2. Run:
```bash
cd ~/Desktop/peer-pathway-project/scripts/speaker-sourcing
chmod +x setup.sh run.sh
./setup.sh
```
3. Don will give you an API key. Add it to your terminal config:
```bash
echo "export ANTHROPIC_API_KEY='sk-ant-YOUR-KEY'" >> ~/.zshrc
source ~/.zshrc
```

## Daily Workflow

### Option A: Full run (recommended)
```bash
cd ~/Desktop/peer-pathway-project/scripts/speaker-sourcing
./run.sh
```
This will:
1. Show you today's status (gaps, who to chase)
2. Open LinkedIn Sales Navigator and source candidates automatically (30-60 min, hands-off)
3. Score and rank all candidates
4. Generate copy-paste DMs for each candidate
5. Show the optimal panel split
6. Show the final dashboard

### Option B: Quick check
```bash
./run.sh quick
```
Just shows the dashboard — no sourcing.

### Option C: Just get DMs
```bash
./run.sh dm
```
Generates DMs for all scored candidates.

## After Sending DMs

When you send a DM on LinkedIn, update the pipeline:
```bash
python3 04_attio_sync.py --advance "PersonName" "DM Sent"
```

When they reply:
```bash
python3 04_attio_sync.py --advance "PersonName" "Replied"
```

When they confirm:
```bash
python3 04_attio_sync.py --advance "PersonName" "Confirmed"
```

## Pipeline Stages

Sourced → DM Sent → Replied → Interested → Terms Agreed → Confirmed → Webinar Done → Active Coach

## What Each Script Does

| Script | What | When |
|--------|------|------|
| `01_linkedin_sourcer.py` | AI searches LinkedIn Sales Nav for candidates | Daily (automated) |
| `02_scorer.py` | Ranks candidates by priority | After sourcing |
| `03_dm_generator.py` | Creates copy-paste DMs | Before DMing |
| `04_attio_sync.py` | Updates Attio CRM pipeline | After each DM/reply |
| `05_panel_optimizer.py` | Finds best Part 1 vs Part 2 split | When 6+ confirmed |
| `06_daily_dashboard.py` | Shows full status and gaps | Anytime |

## If Something Breaks

- **"ANTHROPIC_API_KEY not set"** — Run `source ~/.zshrc` or add the key again
- **Browser doesn't open** — Run `pip3 install browser-use` again
- **LinkedIn blocks you** — Wait 24 hours, reduce searches: `./run.sh source --max-searches 3`
- **Script crashes mid-run** — Just run `./run.sh` again, it resumes where it left off
- **Ask Don** — Screenshot the error and send it
