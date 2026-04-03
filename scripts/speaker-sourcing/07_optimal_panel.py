#!/usr/bin/env python3
"""
Optimal Panel Selector - finds the best ~10 speakers for the Spring Week webinar.

Uses set-cover optimization to maximize:
  1. Gap firm coverage (fewer speakers covering more firms = better)
  2. Sector diversity (IB, Quant/Trading, Consulting, Big 4, AM, Tech, Law)
  3. Gender balance (target 40%+ female)
  4. Conversion stories (more compelling for ticket buyers)
  5. University diversity (spread across unis, not just LSE)
  6. Cost efficiency (fewer speakers = less to pay)

Usage:
  python3 07_optimal_panel.py              # Run optimization
  python3 07_optimal_panel.py --max 12     # Allow up to 12 speakers
  python3 07_optimal_panel.py --budget 8   # Cap at 8 new speakers
"""

import argparse
import json
import os
import sys
from itertools import combinations

sys.path.insert(0, os.path.dirname(__file__))
import config

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Spring week programme dates for 2026 (April context)
# Status: "upcoming" = hasn't started, "active" = running now, "done" = already happened
# Programmes happening later = more valuable for our audience
SPRING_WEEK_DATES = {
    "goldman sachs": {"status": "upcoming", "dates": "April 7-11", "note": "Get Set for GS still opening"},
    "jpmorgan": {"status": "active", "dates": "March-April", "note": "Spring week running now"},
    "morgan stanley": {"status": "upcoming", "dates": "April 8", "note": "Glasgow insight April 8"},
    "barclays": {"status": "active", "dates": "March-April", "note": "Discover Barclays running"},
    "hsbc": {"status": "active", "dates": "March-April", "note": "Spring insight running"},
    "citi": {"status": "upcoming", "dates": "April 2026", "note": "Banking & Markets Spring Insight"},
    "deutsche bank": {"status": "active", "dates": "March 24-26", "note": "Spring into Banking Frankfurt done, London TBC"},
    "ubs": {"status": "done", "dates": "March", "note": "Tomorrow's Talent completed"},
    "bnp paribas": {"status": "active", "dates": "March-April", "note": "Running now"},
    "rothschild": {"status": "active", "dates": "March-April", "note": "Spring insight running"},
    "lazard": {"status": "active", "dates": "March-April", "note": "Running now"},
    "evercore": {"status": "upcoming", "dates": "April", "note": "Still upcoming"},
    "kpmg": {"status": "upcoming", "dates": "April onwards", "note": "Applications STILL OPEN"},
    "blackrock": {"status": "done", "dates": "March", "note": "Deadline was Dec 5"},
    "jane street": {"status": "upcoming", "dates": "April-May", "note": "Typically later"},
    "deloitte": {"status": "active", "dates": "March-April", "note": "Running now"},
    "ey": {"status": "active", "dates": "March-April", "note": "Running now"},
    "pwc": {"status": "active", "dates": "March-April", "note": "Running now"},
    "mckinsey": {"status": "done", "dates": "March", "note": "Insight completed"},
    "citadel": {"status": "upcoming", "dates": "April", "note": "Still upcoming"},
    "millennium": {"status": "upcoming", "dates": "April", "note": "Still upcoming"},
    "optiver": {"status": "upcoming", "dates": "April", "note": "Still upcoming"},
}

# Value multiplier based on spring week timing
TIMING_VALUE = {
    "upcoming": 1.3,   # Spring week hasn't happened yet - students want to prepare
    "active": 1.0,     # Running now - still relevant
    "done": 0.7,       # Already happened - less urgency but still valuable for next year
}


def get_confirmed_speakers():
    """Get the 5 confirmed speakers."""
    return [s for s in config.EXISTING_SPEAKERS if s.get("confirmed")]


def get_unconfirmed_speakers():
    """Get the 8 unconfirmed existing speakers."""
    return [s for s in config.EXISTING_SPEAKERS if not s.get("confirmed")]


def load_sourced_candidates():
    """Load scored candidates from file."""
    path = os.path.join(SCRIPT_DIR, "scored_candidates.json")
    if not os.path.exists(path):
        return []
    with open(path) as f:
        return json.load(f)


def get_timing_value(firms):
    """Get average timing value for a speaker's firms."""
    if not firms:
        return 1.0
    values = []
    for firm in firms:
        firm_lower = firm.lower()
        for key, data in SPRING_WEEK_DATES.items():
            if key in firm_lower or firm_lower in key:
                values.append(TIMING_VALUE[data["status"]])
                break
    return sum(values) / len(values) if values else 1.0


def calculate_panel_score(confirmed, new_picks):
    """Score a complete panel (confirmed + new picks)."""
    all_speakers = confirmed + new_picks
    score = 0
    reasons = []

    # 1. FIRM COVERAGE (max 100 pts)
    all_firms = set()
    gap_firms_covered = set()
    gap_firms_lower = {g.lower() for g in config.GAP_FIRMS}

    for s in all_speakers:
        for f in s.get("firms", []):
            all_firms.add(f.lower())
            if f.lower() in gap_firms_lower:
                gap_firms_covered.add(f.lower())

    firm_score = len(gap_firms_covered) * 10
    score += min(100, firm_score)
    reasons.append(f"GAP FIRMS: {len(gap_firms_covered)}/{len(config.GAP_FIRMS)} covered")

    # 2. SECTOR DIVERSITY (max 40 pts)
    all_sectors = set()
    for s in all_speakers:
        all_sectors |= config.get_sectors_for_firms(s.get("firms", []))
    sector_score = len(all_sectors) * 6
    score += min(40, sector_score)
    reasons.append(f"SECTORS: {len(all_sectors)} ({', '.join(sorted(all_sectors))})")

    # 3. GENDER BALANCE (max 30 pts)
    total = len(all_speakers)
    women = sum(1 for s in all_speakers if (s.get("gender") or "").upper() in ("F", "FEMALE"))
    if total > 0:
        pct = women / total
        if pct >= 0.4:
            score += 30
            reasons.append(f"GENDER: {women}F/{total-women}M ({pct:.0%} female) - excellent")
        elif pct >= 0.3:
            score += 20
            reasons.append(f"GENDER: {women}F/{total-women}M ({pct:.0%} female) - good")
        elif pct >= 0.2:
            score += 10
            reasons.append(f"GENDER: {women}F/{total-women}M ({pct:.0%} female) - ok")
        else:
            reasons.append(f"GENDER: {women}F/{total-women}M ({pct:.0%} female) - needs improvement")

    # 4. CONVERSION STORIES (max 30 pts)
    conversions = sum(1 for s in all_speakers if s.get("has_conversion") or s.get("confirmed"))
    conv_score = conversions * 4
    score += min(30, conv_score)
    reasons.append(f"CONVERSIONS: {conversions}/{total} have conversion stories")

    # 5. UNIVERSITY DIVERSITY (max 20 pts)
    unis = set()
    for s in all_speakers:
        uni = (s.get("university") or "").strip()
        if uni and uni.lower() not in ("not specified", "not mentioned", "unknown", ""):
            unis.add(uni.lower())
    lse_count = sum(1 for u in unis if "lse" in u or "london school" in u)
    uni_score = len(unis) * 3 - lse_count * 2  # Penalize LSE concentration
    score += min(20, max(0, uni_score))
    reasons.append(f"UNIVERSITIES: {len(unis)} unique ({lse_count} LSE)")

    # 6. TIMING VALUE (max 20 pts)
    timing_sum = sum(get_timing_value(s.get("firms", [])) for s in new_picks) if new_picks else 0
    timing_avg = timing_sum / len(new_picks) if new_picks else 1.0
    timing_score = int(timing_avg * 15)
    score += min(20, timing_score)
    reasons.append(f"TIMING: avg {timing_avg:.2f}x value multiplier")

    # 7. COST EFFICIENCY BONUS (max 20 pts)
    # Fewer speakers covering more firms = better
    firms_per_speaker = len(all_firms) / total if total > 0 else 0
    if firms_per_speaker >= 3.0:
        score += 20
        reasons.append(f"EFFICIENCY: {firms_per_speaker:.1f} firms/speaker - excellent")
    elif firms_per_speaker >= 2.0:
        score += 15
        reasons.append(f"EFFICIENCY: {firms_per_speaker:.1f} firms/speaker - good")
    elif firms_per_speaker >= 1.5:
        score += 10
        reasons.append(f"EFFICIENCY: {firms_per_speaker:.1f} firms/speaker - ok")
    else:
        reasons.append(f"EFFICIENCY: {firms_per_speaker:.1f} firms/speaker")

    return score, reasons


def find_optimal_panel(confirmed, candidates, max_new=7, min_new=3):
    """Find the optimal set of new speakers to add to the confirmed panel."""
    print(f"\nSearching through {len(candidates)} candidates for {min_new}-{max_new} picks...")

    best_panels = []

    # Try different panel sizes
    for n_new in range(min_new, min(max_new + 1, len(candidates) + 1)):
        print(f"  Testing {n_new}-speaker combinations...", end=" ", flush=True)

        # If too many combinations, use greedy approach
        from math import comb
        total_combos = comb(len(candidates), n_new)

        if total_combos > 50000:
            # Greedy: start with top candidates, try swapping
            panel = greedy_select(confirmed, candidates, n_new)
            score, reasons = calculate_panel_score(confirmed, panel)
            best_panels.append((score, panel, reasons, n_new))
            print(f"(greedy) score={score}")
        else:
            best_score = float("-inf")
            best_combo = None
            best_reasons = []

            for combo in combinations(range(len(candidates)), n_new):
                picks = [candidates[i] for i in combo]
                score, reasons = calculate_panel_score(confirmed, picks)
                if score > best_score:
                    best_score = score
                    best_combo = picks
                    best_reasons = reasons

            if best_combo:
                best_panels.append((best_score, best_combo, best_reasons, n_new))
                print(f"score={best_score}")

    # Sort by score, then prefer fewer speakers at same score
    best_panels.sort(key=lambda x: (x[0], -x[3]), reverse=True)
    return best_panels


def greedy_select(confirmed, candidates, n):
    """Greedy selection: pick one at a time, always choosing what improves panel most."""
    selected = []
    remaining = list(candidates)

    for _ in range(n):
        best_score = float("-inf")
        best_pick = None
        best_idx = -1

        for i, c in enumerate(remaining):
            test_panel = selected + [c]
            score, _ = calculate_panel_score(confirmed, test_panel)
            if score > best_score:
                best_score = score
                best_pick = c
                best_idx = i

        if best_pick:
            selected.append(best_pick)
            remaining.pop(best_idx)

    return selected


def print_optimal_panel(confirmed, new_picks, score, reasons):
    """Print the full recommended panel."""
    all_speakers = confirmed + new_picks

    print("\n" + "=" * 80)
    print("  OPTIMAL PANEL RECOMMENDATION")
    print(f"  Total Score: {score}/260")
    print("=" * 80)

    # Confirmed speakers
    print("\n  CONFIRMED SPEAKERS (already locked in):")
    for i, s in enumerate(confirmed, 1):
        firms = ", ".join(s.get("firms", []))
        gender = f" [{s.get('gender', '?')}]" if s.get("gender") else ""
        conv = f" - {s.get('conversion', '')}" if s.get("conversion") else ""
        print(f"    {i}. {s['name']} - {firms}{gender}{conv}")

    # New picks
    print(f"\n  RECOMMENDED NEW SPEAKERS ({len(new_picks)} picks):")
    for i, s in enumerate(new_picks, len(confirmed) + 1):
        firms = ", ".join(s.get("firms", []))
        gender = f" [{s.get('gender', '?')}]" if s.get("gender") else ""
        conv = s.get("conversion_detail") or s.get("conversion") or ""
        conv_str = f" - {conv}" if conv else ""
        uni = s.get("university") or ""
        uni_str = f" ({uni})" if uni and uni.lower() not in ("not specified", "not mentioned") else ""
        linkedin = s.get("linkedin_url") or ""
        linkedin_str = f"\n       LinkedIn: {linkedin}" if linkedin else ""
        gap = s.get("gap_firms_filled", [])
        gap_str = f"\n       FILLS GAPS: {', '.join(gap)}" if gap else ""
        source = "EXISTING" if s.get("record_id") else "NEW"
        timing = get_timing_value(s.get("firms", []))
        timing_str = f" [timing: {timing:.1f}x]" if timing != 1.0 else ""

        print(f"    {i}. [{source}] {s['name']} - {firms}{gender}{uni_str}{conv_str}{timing_str}{gap_str}{linkedin_str}")

    # Coverage analysis
    print(f"\n  {'=' * 76}")
    print("  COVERAGE ANALYSIS:")
    all_firms = set()
    for s in all_speakers:
        for f in s.get("firms", []):
            all_firms.add(f)

    gap_covered = [g for g in config.GAP_FIRMS if g.lower() in {f.lower() for f in all_firms}]
    gap_missing = [g for g in config.GAP_FIRMS if g.lower() not in {f.lower() for f in all_firms}]

    print(f"    Total firms covered: {len(all_firms)}")
    print(f"    Gap firms filled: {len(gap_covered)}/{len(config.GAP_FIRMS)}")
    if gap_covered:
        print(f"      Covered: {', '.join(gap_covered)}")
    if gap_missing:
        print(f"      STILL MISSING: {', '.join(gap_missing)}")

    all_sectors = set()
    for s in all_speakers:
        all_sectors |= config.get_sectors_for_firms(s.get("firms", []))
    all_sector_names = set(config.SECTORS.keys())
    missing_sectors = all_sector_names - all_sectors
    print(f"    Sectors covered: {len(all_sectors)}/{len(all_sector_names)}")
    if missing_sectors:
        print(f"      MISSING SECTORS: {', '.join(missing_sectors)}")

    # Gender
    total = len(all_speakers)
    women = sum(1 for s in all_speakers if (s.get("gender") or "").upper() in ("F", "FEMALE"))
    print(f"    Gender: {women}F / {total - women}M ({women/total:.0%} female)")

    # Scoring breakdown
    print(f"\n  SCORING BREAKDOWN:")
    for r in reasons:
        print(f"    - {r}")

    # Cost estimate
    print(f"\n  COST ESTIMATE:")
    print(f"    {len(new_picks)} new speakers to recruit")
    print(f"    Estimated speaker rate: 50-100 per speaker")
    print(f"    Total new speaker cost: {len(new_picks) * 50}-{len(new_picks) * 100}")

    print("=" * 80)


def main():
    parser = argparse.ArgumentParser(description="Find the optimal speaker panel")
    parser.add_argument("--max", type=int, default=7, help="Max new speakers to add (default: 7)")
    parser.add_argument("--min", type=int, default=4, help="Min new speakers to add (default: 4)")
    args = parser.parse_args()

    confirmed = get_confirmed_speakers()
    unconfirmed = get_unconfirmed_speakers()
    sourced = load_sourced_candidates()

    print("=" * 80)
    print("  EARLYEDGE PANEL OPTIMIZER")
    print("=" * 80)
    print(f"  Confirmed speakers: {len(confirmed)}")
    print(f"  Unconfirmed existing: {len(unconfirmed)}")
    print(f"  Sourced candidates: {len(sourced)}")

    # Pool = unconfirmed existing + top sourced candidates
    # Only consider sourced candidates with score >= 30 (MEDIUM+ priority)
    viable_sourced = [c for c in sourced if c.get("score", 0) >= 30]
    print(f"  Viable sourced (score >= 30): {len(viable_sourced)}")

    # Combine pool: unconfirmed first (easier to reach), then sourced
    candidate_pool = unconfirmed + viable_sourced

    # Deduplicate by name
    seen_names = set()
    deduped = []
    for c in candidate_pool:
        name_lower = c.get("name", "").lower()
        if name_lower not in seen_names:
            seen_names.add(name_lower)
            deduped.append(c)
    candidate_pool = deduped

    print(f"  Total candidate pool (deduped): {len(candidate_pool)}")

    # Run optimizer
    results = find_optimal_panel(confirmed, candidate_pool, max_new=args.max, min_new=args.min)

    if not results:
        print("\nNo valid panels found!")
        return

    # Show top 3 options
    for rank, (score, picks, reasons, n_new) in enumerate(results[:3], 1):
        print(f"\n{'#' * 80}")
        print(f"  OPTION {rank} ({n_new} new speakers)")
        print(f"{'#' * 80}")
        print_optimal_panel(confirmed, picks, score, reasons)

    # Save best result
    best_score, best_picks, best_reasons, _ = results[0]
    output = {
        "confirmed": [{"name": s["name"], "firms": s.get("firms", []), "gender": s.get("gender")} for s in confirmed],
        "recommended_new": [
            {
                "name": s.get("name"),
                "firms": s.get("firms", []),
                "gender": s.get("gender"),
                "university": s.get("university"),
                "linkedin_url": s.get("linkedin_url"),
                "score": s.get("score"),
                "gap_firms_filled": s.get("gap_firms_filled", []),
                "conversion_detail": s.get("conversion_detail") or s.get("conversion"),
                "source": "existing_unconfirmed" if s.get("record_id") and not s.get("confirmed") else "new_candidate",
            }
            for s in best_picks
        ],
        "panel_score": best_score,
        "reasons": best_reasons,
    }

    output_path = os.path.join(SCRIPT_DIR, "optimal_panel.json")
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nSaved to {output_path}")


if __name__ == "__main__":
    main()
