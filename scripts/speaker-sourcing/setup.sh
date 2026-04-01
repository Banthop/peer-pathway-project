#!/bin/bash
# =============================================================
# SETUP — Run this ONCE on Uthman's laptop
# =============================================================
set -e

echo "================================================"
echo "  EarlyEdge Speaker Sourcer — Setup"
echo "================================================"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 not found."
    echo "Install it: https://www.python.org/downloads/"
    exit 1
fi

echo "[1/3] Installing Python packages..."
pip3 install browser-use langchain-anthropic requests --quiet

echo "[2/3] Checking for API key..."
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo ""
    echo "  You need an Anthropic API key to run the AI sourcer."
    echo "  Don will give you one. Once you have it, add this line"
    echo "  to your ~/.zshrc (or ~/.bashrc):"
    echo ""
    echo "    export ANTHROPIC_API_KEY='sk-ant-your-key-here'"
    echo ""
    echo "  Then restart your terminal and run this setup again."
    echo ""
else
    echo "  ANTHROPIC_API_KEY is set. Good."
fi

# Optional: Attio key for CRM sync
if [ -z "$ATTIO_API_KEY" ]; then
    echo ""
    echo "  (Optional) For Attio CRM sync, also add:"
    echo "    export ATTIO_API_KEY='your-attio-key'"
    echo ""
else
    echo "  ATTIO_API_KEY is set. Good."
fi

echo "[3/3] Verifying scripts..."
python3 -m py_compile config.py
python3 -m py_compile 01_linkedin_sourcer.py
python3 -m py_compile 02_scorer.py
python3 -m py_compile 03_dm_generator.py
python3 -m py_compile 04_attio_sync.py
python3 -m py_compile 05_panel_optimizer.py
python3 -m py_compile 06_daily_dashboard.py
echo "  All scripts OK."

echo ""
echo "================================================"
echo "  Setup complete!"
echo ""
echo "  To start sourcing, run:"
echo "    ./run.sh"
echo "================================================"
