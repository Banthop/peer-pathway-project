#!/bin/bash
# Run this script to copy all portfolio screenshots to the portfolio-screenshots folder
# Usage: bash copy-screenshots.sh

SRC="$HOME/.gemini/antigravity/brain/a4eab272-a970-4c7d-b541-f262f33447d3"
DST="./portfolio-screenshots"

mkdir -p "$DST"

cp "$SRC/01_homepage_hero_1774901655346.png" "$DST/01_homepage_hero.png" 2>/dev/null && echo "✓ 01_homepage_hero.png" || echo "✗ 01_homepage_hero.png"
cp "$SRC/02_browse_coaches_1774901670154.png" "$DST/02_browse_coaches.png" 2>/dev/null && echo "✓ 02_browse_coaches.png" || echo "✗ 02_browse_coaches.png"  
cp "$SRC/03_webinar_landing_1774901678370.png" "$DST/03_webinar_landing.png" 2>/dev/null && echo "✓ 03_webinar_landing.png" || echo "✗ 03_webinar_landing.png"
cp "$SRC/05_cold_email_checklist_1774901688198.png" "$DST/05_cold_email_checklist.png" 2>/dev/null && echo "✓ 05_cold_email_checklist.png" || echo "✗ 05_cold_email_checklist.png"
cp "$SRC/06_cold_email_guide_1774901697238.png" "$DST/06_cold_email_guide.png" 2>/dev/null && echo "✓ 06_cold_email_guide.png" || echo "✗ 06_cold_email_guide.png"
cp "$SRC/07_guarantee_page_1774901706178.png" "$DST/07_guarantee_page.png" 2>/dev/null && echo "✓ 07_guarantee_page.png" || echo "✗ 07_guarantee_page.png"
cp "$SRC/08_login_page_1774901715552.png" "$DST/08_login_page.png" 2>/dev/null && echo "✓ 08_login_page.png" || echo "✗ 08_login_page.png"

echo ""
echo "Done! Screenshots saved to $DST/"
echo "The EARLYEDGE_PORTFOLIO_BRIEF.md is already in that folder."
