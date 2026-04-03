#!/bin/bash
# =============================================================
# UTHMAN'S DAILY SOURCING SCRIPT
# Run this every day. It does everything.
#
# Usage:
#   ./run.sh              # Full run (source + score + DMs + dashboard)
#   ./run.sh quick        # Just dashboard (no sourcing)
#   ./run.sh source       # Just source new candidates
#   ./run.sh dm           # Just generate DMs
#   ./run.sh score        # Just score existing candidates
# =============================================================

cd "$(dirname "$0")"

# Activate venv if it exists
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi

MODE="${1:-full}"

echo ""
echo "================================================"
echo "  EarlyEdge Speaker Sourcing"
echo "  $(date '+%A %d %B %Y, %H:%M')"
echo "================================================"
echo ""

# ─────────────────────────────────────
# QUICK MODE — just show the dashboard
# ─────────────────────────────────────
if [ "$MODE" = "quick" ] || [ "$MODE" = "dashboard" ]; then
    if [ -z "$ATTIO_API_KEY" ]; then
        python3 06_daily_dashboard.py --offline
    else
        python3 06_daily_dashboard.py
    fi
    exit 0
fi

# ─────────────────────────────────────
# SCORE MODE — just score candidates
# ─────────────────────────────────────
if [ "$MODE" = "score" ]; then
    if [ -f candidates.json ]; then
        python3 02_scorer.py
    else
        echo "No candidates.json found. Scoring existing speakers..."
        python3 02_scorer.py --existing
    fi
    exit 0
fi

# ─────────────────────────────────────
# DM MODE — just generate DMs
# ─────────────────────────────────────
if [ "$MODE" = "dm" ]; then
    if [ ! -f scored_candidates.json ]; then
        echo "No scored candidates yet. Running scorer first..."
        python3 02_scorer.py --existing
    fi
    python3 03_dm_generator.py --all
    exit 0
fi

# ─────────────────────────────────────
# SOURCE MODE — just run LinkedIn sourcer
# ─────────────────────────────────────
if [ "$MODE" = "source" ]; then
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        echo "ERROR: ANTHROPIC_API_KEY not set."
        echo "Add to ~/.zshrc:  export ANTHROPIC_API_KEY='sk-ant-...'"
        exit 1
    fi
    python3 01_linkedin_sourcer.py --resume
    exit 0
fi

# ─────────────────────────────────────
# FULL MODE — everything
# ─────────────────────────────────────

# Step 1: Show dashboard first
echo "────────────────────────────────────────────────"
echo "  STEP 1: Current status"
echo "────────────────────────────────────────────────"
if [ -z "$ATTIO_API_KEY" ]; then
    python3 06_daily_dashboard.py --quick --offline
else
    python3 06_daily_dashboard.py --quick
fi

# Step 2: Source new candidates
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo ""
    echo "────────────────────────────────────────────────"
    echo "  STEP 2: SKIPPED — LinkedIn sourcing"
    echo "  (ANTHROPIC_API_KEY not set)"
    echo "────────────────────────────────────────────────"
else
    echo ""
    echo "────────────────────────────────────────────────"
    echo "  STEP 2: LinkedIn sourcing"
    echo "  Chrome opens. Log in to LinkedIn (60 sec)."
    echo "  Then sit back — takes 5-10 min per search."
    echo "────────────────────────────────────────────────"
    echo ""
    read -p "  Start sourcing? (y/n): " START
    if [ "$START" = "y" ] || [ "$START" = "Y" ]; then
        python3 01_linkedin_sourcer.py --resume
    else
        echo "  Skipped."
    fi
fi

# Step 3: Score candidates
echo ""
echo "────────────────────────────────────────────────"
echo "  STEP 3: Scoring candidates"
echo "────────────────────────────────────────────────"
if [ -f candidates.json ]; then
    python3 02_scorer.py
else
    echo "  No new candidates yet. Scoring existing speakers..."
    python3 02_scorer.py --existing
fi

# Step 4: Generate DMs
echo ""
echo "────────────────────────────────────────────────"
echo "  STEP 4: Generating DMs"
echo "────────────────────────────────────────────────"
python3 03_dm_generator.py --all

# Step 5: Optimize panel split
echo ""
echo "────────────────────────────────────────────────"
echo "  STEP 5: Panel optimizer"
echo "────────────────────────────────────────────────"
python3 05_panel_optimizer.py --all

# Step 6: Final dashboard
echo ""
echo "────────────────────────────────────────────────"
echo "  STEP 6: Updated dashboard"
echo "────────────────────────────────────────────────"
if [ -z "$ATTIO_API_KEY" ]; then
    python3 06_daily_dashboard.py --offline
else
    python3 06_daily_dashboard.py
fi

echo ""
echo "================================================"
echo "  DONE! Now:"
echo "  1. Copy DMs from above and paste into LinkedIn"
echo "  2. After sending, run:"
echo "     python3 04_attio_sync.py --advance \"Name\" \"DM Sent\""
echo "  3. Screenshot the dashboard and send to Don"
echo "================================================"
