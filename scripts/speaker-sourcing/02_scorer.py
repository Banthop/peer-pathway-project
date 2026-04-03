#!/usr/bin/env python3
"""
Score and rank speaker candidates based on panel needs.
Reads candidates.json (from LinkedIn sourcer or manual input), outputs scored_candidates.json.

Usage:
  python3 02_scorer.py                    # Score candidates from candidates.json
  python3 02_scorer.py --existing         # Score the 13 existing speakers from config
  python3 02_scorer.py --input FILE.json  # Score from a custom input file
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import config


def score_candidate(candidate):
    """Score a single candidate on a 100-point scale."""
    score = 0
    reasons = []
    gap_firms_filled = []

    firms = candidate.get("firms", [])
    uni = (candidate.get("university") or "").strip()
    gender = candidate.get("gender_signal") or candidate.get("gender") or "unknown"
    has_conversion = candidate.get("has_conversion") or candidate.get("confirmed", False)
    conversion_detail = candidate.get("conversion_detail") or candidate.get("conversion") or ""
    followers = candidate.get("follower_count") or 0

    # 1. FIRM GAP COVERAGE (0-30 pts)
    gap_firms_lower = [g.lower() for g in config.GAP_FIRMS]
    for firm in firms:
        if firm.lower() in gap_firms_lower:
            gap_firms_filled.append(firm)
    if gap_firms_filled:
        score += min(30, 15 * len(gap_firms_filled))
        reasons.append(f"FILLS GAPS: {', '.join(gap_firms_filled)}")

    # 2. CONFIRMED CONVERSION (0-25 pts)
    if has_conversion:
        score += 25
        detail = conversion_detail if conversion_detail else "confirmed"
        reasons.append(f"CONVERSION: {detail}")

    # 3. GENDER DIVERSITY (0-15 pts)
    if gender.upper() in ("F", "FEMALE"):
        score += 15
        reasons.append("GENDER DIVERSITY")

    # 4. UNIVERSITY DIVERSITY (0-10 pts or -5 penalty)
    if uni:
        is_lse = any(lse.lower() in uni.lower() for lse in config.LSE_NAMES)
        is_high_value = any(hv.lower() in uni.lower() for hv in config.HIGH_VALUE_UNIS)
        if is_lse:
            score += config.WEIGHTS["lse_penalty"]
            reasons.append("LSE (penalty)")
        elif is_high_value:
            score += 7
            reasons.append(f"TARGET UNI: {uni}")
        else:
            score += 10
            reasons.append(f"UNI DIVERSITY: {uni}")

    # 5. DARK HORSE BONUS (0-10 pts)
    is_non_target = uni and not any(
        t.lower() in uni.lower() for t in config.HIGH_VALUE_UNIS + config.LSE_NAMES
    )
    has_top_firm = bool(gap_firms_filled) or any(
        f.lower() in [g.lower() for g in config.GAP_FIRMS] for f in firms
    )
    if is_non_target and (has_top_firm or has_conversion):
        score += 10
        reasons.append(f"DARK HORSE: {uni}")

    # 6. SECTOR GAP (0-5 pts)
    covered = config.get_covered_sectors()
    candidate_sectors = config.get_sectors_for_firms(firms)
    new_sectors = candidate_sectors - covered
    if new_sectors:
        score += 5
        reasons.append(f"NEW SECTOR: {', '.join(new_sectors)}")

    # 7. MULTI-FIRM BONUS (0-20 pts) — more spring weeks = fewer speakers needed
    finance_firms = [f for f in firms if f.lower() not in (
        "investment banking", "not specified", "not mentioned", ""
    )]
    if len(finance_firms) >= 4:
        score += 20
        reasons.append(f"MULTI-FIRM ({len(finance_firms)} firms)")
    elif len(finance_firms) >= 3:
        score += 15
        reasons.append(f"MULTI-FIRM ({len(finance_firms)} firms)")
    elif len(finance_firms) >= 2:
        score += 8
        reasons.append(f"TWO FIRMS ({len(finance_firms)})")

    # 8. FOLLOWER COUNT (0-5 pts)
    if followers >= 5000:
        score += 5
        reasons.append(f"HIGH FOLLOWERS: {followers}")
    elif followers >= 1000:
        score += 3
        reasons.append(f"GOOD FOLLOWERS: {followers}")

    priority = "HIGH" if score >= 50 else "MEDIUM" if score >= 30 else "LOW"

    return {
        **candidate,
        "score": score,
        "reasons": reasons,
        "gap_firms_filled": gap_firms_filled,
        "priority": priority,
    }


def print_ranked(scored):
    """Print a human-readable ranked list."""
    print("\n" + "=" * 70)
    print("SPEAKER CANDIDATES (Ranked by Score)")
    print("=" * 70)

    for i, c in enumerate(scored, 1):
        firms_str = ", ".join(c.get("firms", [])) or "Unknown"
        uni = c.get("university") or "Unknown"
        priority_icon = {"HIGH": ">>>", "MEDIUM": " >>", "LOW": "  >"}
        icon = priority_icon.get(c["priority"], "  >")

        print(f"\n#{i} [{c['priority']}] Score: {c['score']}  {c['name']}")
        print(f"   Firms: {firms_str}")
        print(f"   University: {uni}")
        if c.get("reasons"):
            print(f"   Why: {' | '.join(c['reasons'])}")
        if c.get("linkedin_url"):
            print(f"   LinkedIn: {c['linkedin_url']}")
        if c["priority"] == "HIGH":
            print(f"   {icon} ACTION: DM immediately")
        elif c["priority"] == "MEDIUM":
            print(f"   {icon} ACTION: DM this week")

    # Summary
    high = sum(1 for c in scored if c["priority"] == "HIGH")
    med = sum(1 for c in scored if c["priority"] == "MEDIUM")
    low = sum(1 for c in scored if c["priority"] == "LOW")
    print(f"\n{'=' * 70}")
    print(f"SUMMARY: {high} HIGH | {med} MEDIUM | {low} LOW")

    # Gap report
    filled = set()
    for c in scored:
        for f in c.get("gap_firms_filled", []):
            filled.add(f)
    remaining = [g for g in config.GAP_FIRMS if g not in filled]
    if remaining:
        print(f"\nSTILL UNFILLED: {', '.join(remaining)}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Score and rank speaker candidates")
    parser.add_argument("--existing", action="store_true", help="Score existing speakers from config")
    parser.add_argument("--input", type=str, help="Input JSON file (default: candidates.json)")
    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))

    if args.existing:
        candidates = config.EXISTING_SPEAKERS
    else:
        input_file = args.input or os.path.join(script_dir, "candidates.json")
        if not os.path.exists(input_file):
            print(f"No input file found at {input_file}")
            print("Run with --existing to score the 13 known speakers, or run 01_linkedin_sourcer.py first.")
            sys.exit(1)
        with open(input_file) as f:
            candidates = json.load(f)

    scored = [score_candidate(c) for c in candidates]
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Save to file
    output_file = os.path.join(script_dir, "scored_candidates.json")
    with open(output_file, "w") as f:
        json.dump(scored, f, indent=2)

    print_ranked(scored)
    print(f"\nSaved to {output_file}")


if __name__ == "__main__":
    main()
