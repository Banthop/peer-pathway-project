#!/usr/bin/env python3
"""
Optimize the Part 1 vs Part 2 speaker split for the Spring Week webinar.
Finds the best split that maximizes firm diversity, gender balance, and bundle incentive.

Usage:
  python3 05_panel_optimizer.py                    # Optimize from confirmed speakers in config
  python3 05_panel_optimizer.py --input FILE.json  # Optimize from a custom file
"""

import argparse
import json
import os
import sys
from itertools import combinations

sys.path.insert(0, os.path.dirname(__file__))
import config


def get_speaker_sectors(speaker):
    """Get sectors covered by a speaker's firms."""
    return config.get_sectors_for_firms(speaker.get("firms", []))


def score_split(part1, part2):
    """Score a Part 1 / Part 2 split. Higher = better."""
    score = 0
    reasons = []

    p1_firms = set(f.lower() for s in part1 for f in s.get("firms", []))
    p2_firms = set(f.lower() for s in part2 for f in s.get("firms", []))

    # Hard constraint: minimal firm overlap (penalize heavily)
    overlap = p1_firms & p2_firms
    if overlap:
        score -= 50 * len(overlap)
        reasons.append(f"FIRM OVERLAP: {overlap}")

    # Firm diversity (more unique firms per part = better)
    score += len(p1_firms) * 3 + len(p2_firms) * 3
    reasons.append(f"Firms: P1={len(p1_firms)} P2={len(p2_firms)}")

    # Sector diversity
    p1_sectors = set()
    p2_sectors = set()
    for s in part1:
        p1_sectors |= get_speaker_sectors(s)
    for s in part2:
        p2_sectors |= get_speaker_sectors(s)
    score += len(p1_sectors) * 5 + len(p2_sectors) * 5
    reasons.append(f"Sectors: P1={len(p1_sectors)} P2={len(p2_sectors)}")

    # Gender balance
    p1_women = sum(1 for s in part1 if s.get("gender", "").upper() in ("F", "FEMALE"))
    p2_women = sum(1 for s in part2 if s.get("gender", "").upper() in ("F", "FEMALE"))
    if p1_women > 0 and p2_women > 0:
        score += 20
        reasons.append("Gender balanced across both parts")
    elif p1_women > 0 or p2_women > 0:
        score += 10
        reasons.append("At least one part has female speaker")

    # Bundle incentive: IB firms split across parts
    ib_firms = [f.lower() for f in config.SECTORS.get("Investment Banking", [])]
    ib_p1 = len([f for f in p1_firms if f in ib_firms])
    ib_p2 = len([f for f in p2_firms if f in ib_firms])
    if ib_p1 > 0 and ib_p2 > 0:
        score += 15
        reasons.append("IB split across both parts (bundle incentive)")

    # Part 1 slightly stronger (first impression drives upgrades)
    p1_conversions = sum(1 for s in part1 if s.get("confirmed") or s.get("has_conversion"))
    p2_conversions = sum(1 for s in part2 if s.get("confirmed") or s.get("has_conversion"))
    if p1_conversions >= p2_conversions:
        score += 5
        reasons.append("P1 has more/equal conversions (good first impression)")

    return score, reasons


def optimize(speakers):
    """Find the best Part 1 / Part 2 split."""
    n = len(speakers)
    if n < 6:
        print(f"Warning: only {n} speakers. Need at least 6 for a 3+3 split.")
        if n < 4:
            print("Not enough speakers to optimize. Need at least 4.")
            return None

    best_split = None
    best_score = float("-inf")
    best_reasons = []

    # Try all valid group sizes
    valid_sizes = []
    for s1 in range(3, 5):
        s2 = n - s1
        if 3 <= s2 <= 4:
            valid_sizes.append(s1)

    if not valid_sizes:
        # Fallback: try 2+2 or 2+3
        for s1 in range(2, n - 1):
            s2 = n - s1
            if s2 >= 2:
                valid_sizes.append(s1)

    for size_p1 in valid_sizes:
        for p1_indices in combinations(range(n), size_p1):
            part1 = [speakers[i] for i in p1_indices]
            part2 = [speakers[i] for i in range(n) if i not in p1_indices]

            score, reasons = score_split(part1, part2)
            if score > best_score:
                best_score = score
                best_split = (part1, part2)
                best_reasons = reasons

    return best_split, best_score, best_reasons


def print_split(part1, part2, score, reasons):
    """Print the optimal split in a readable format."""
    print("\n" + "=" * 70)
    print("OPTIMAL PANEL SPLIT")
    print(f"Score: {score}")
    print("=" * 70)

    for label, part in [("PART 1", part1), ("PART 2", part2)]:
        print(f"\n{label}:")
        all_firms = set()
        all_sectors = set()
        for i, s in enumerate(part, 1):
            firms_str = ", ".join(s.get("firms", []))
            conv = f" ({s['conversion']})" if s.get("conversion") else ""
            gender = f" [{s.get('gender', '?')}]" if s.get("gender") else ""
            new_tag = " [NEW]" if not s.get("confirmed") else ""
            print(f"  {i}. {s['name']} - {firms_str}{conv}{gender}{new_tag}")
            for f in s.get("firms", []):
                all_firms.add(f)
            all_sectors |= get_speaker_sectors(s)
        print(f"  Sectors: {', '.join(sorted(all_sectors))}")
        print(f"  Firms: {', '.join(sorted(all_firms))}")

    # Bundle incentive analysis
    p1_firms = set(f for s in part1 for f in s.get("firms", []))
    p2_firms = set(f for s in part2 for f in s.get("firms", []))
    print(f"\nBUNDLE INCENTIVE:")
    print(f"  Part 1 buyer also wants: {', '.join(sorted(p2_firms))}")
    print(f"  Part 2 buyer also wants: {', '.join(sorted(p1_firms))}")

    print(f"\nSCORING REASONS:")
    for r in reasons:
        print(f"  - {r}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Optimize Part 1 / Part 2 speaker split")
    parser.add_argument("--input", type=str, help="JSON file with speakers to optimize")
    parser.add_argument("--all", action="store_true", help="Include unconfirmed speakers too")
    args = parser.parse_args()

    if args.input:
        with open(args.input) as f:
            speakers = json.load(f)
    else:
        if args.all:
            speakers = config.EXISTING_SPEAKERS
        else:
            speakers = [s for s in config.EXISTING_SPEAKERS if s.get("confirmed")]

    if len(speakers) < 4:
        print(f"Only {len(speakers)} speakers available. Need at least 4.")
        print("Run with --all to include unconfirmed speakers.")
        return

    print(f"Optimizing split for {len(speakers)} speakers...")
    result = optimize(speakers)
    if result:
        part1, part2 = result[0]
        score = result[1]
        reasons = result[2]
        print_split(part1, part2, score, reasons)

        # Save result
        script_dir = os.path.dirname(os.path.abspath(__file__))
        output = {
            "part1": [{"name": s["name"], "firms": s.get("firms", []), "gender": s.get("gender")} for s in part1],
            "part2": [{"name": s["name"], "firms": s.get("firms", []), "gender": s.get("gender")} for s in part2],
            "score": score,
            "reasons": reasons,
        }
        with open(os.path.join(script_dir, "panel_split.json"), "w") as f:
            json.dump(output, f, indent=2)
        print(f"\nSaved to panel_split.json")
    else:
        print("Could not find a valid split.")


if __name__ == "__main__":
    main()
