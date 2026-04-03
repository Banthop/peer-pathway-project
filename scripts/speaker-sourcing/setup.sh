#!/bin/bash
# =============================================================
# SETUP — Run this ONCE on Uthman's laptop
# =============================================================
set -e

cd "$(dirname "$0")"

echo "================================================"
echo "  EarlyEdge Speaker Sourcer — Setup"
echo "================================================"
echo ""

# Check for uv or pip
if command -v uv &> /dev/null; then
    PKG_MGR="uv"
    echo "[1/4] Found uv package manager."
elif command -v pip3 &> /dev/null; then
    PKG_MGR="pip"
    echo "[1/4] Found pip."
else
    echo "ERROR: No Python package manager found."
    echo "Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Create venv
echo "[2/4] Creating Python virtual environment..."
if [ ! -d ".venv" ]; then
    if [ "$PKG_MGR" = "uv" ]; then
        uv venv --python 3.12 .venv 2>/dev/null || uv venv .venv
    else
        python3 -m venv .venv
    fi
    echo "  Created .venv"
else
    echo "  .venv already exists"
fi

# Install deps
echo "[3/4] Installing Python packages..."
source .venv/bin/activate
if [ "$PKG_MGR" = "uv" ]; then
    uv pip install browser-use langchain-anthropic requests playwright --quiet
else
    pip install browser-use langchain-anthropic requests playwright --quiet
fi
playwright install chromium --with-deps 2>/dev/null || playwright install chromium
echo "  Packages installed."

# Check API key
echo "[4/4] Checking API key..."
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo ""
    echo "  You need an Anthropic API key for the AI sourcer."
    echo "  Don will send you one. Add this line to your ~/.zshrc:"
    echo ""
    echo "    export ANTHROPIC_API_KEY='sk-ant-your-key-here'"
    echo ""
    echo "  Then restart Terminal and run ./run.sh"
    echo ""
else
    echo "  ANTHROPIC_API_KEY is set. Good."
fi

echo ""
echo "================================================"
echo "  Setup complete!"
echo ""
echo "  To start: ./run.sh"
echo "================================================"
