#!/usr/bin/env python3
"""
Generate personalized DMs for speaker candidates.
Reads scored_candidates.json, outputs dm_drafts.json and prints ready-to-paste DMs.

Usage:
  python3 03_dm_generator.py                       # Generate DMs for all HIGH/MEDIUM candidates
  python3 03_dm_generator.py --all                  # Generate for all candidates
  python3 03_dm_generator.py --type playbook        # Generate playbook contributor DMs instead
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import config


def generate_dm(candidate, template_type="panel_speaker"):
    """Generate a personalized DM for a candidate."""
    name = candidate.get("name", "")
    first_name = name.split()[0] if name else "there"
    firms = candidate.get("firms", [])
    primary_firm = firms[0] if firms else "your firm"
    reasons = candidate.get("reasons", [])

    # Build conversion note
    conversion_note = ""
    conversion = candidate.get("conversion_detail") or candidate.get("conversion") or ""
    has_conversion = candidate.get("has_conversion") or candidate.get("confirmed", False)
    if has_conversion and conversion:
        conversion_note = f" and converted it into a {conversion}"
    elif has_conversion:
        conversion_note = " and converted"

    # Determine their specific value proposition
    reasons_str = " ".join(str(r) for r in reasons)
    if "DARK HORSE" in reasons_str:
        uni = candidate.get("university", "a non-traditional background")
        their_value = f"your perspective from {uni}"
    elif "GENDER DIVERSITY" in reasons_str:
        their_value = "a female perspective on the panel, we want students to see themselves in our speakers"
    elif "FILLS GAPS" in reasons_str:
        gap_firms = candidate.get("gap_firms_filled", [primary_firm])
        their_value = f"someone from {gap_firms[0]}, it's a firm our audience really wants to hear about"
    else:
        their_value = f"your {primary_firm} experience"

    if template_type == "playbook":
        template = config.DM_PLAYBOOK_CONTRIBUTOR
    else:
        template = config.DM_PANEL_SPEAKER

    return template.format(
        first_name=first_name,
        primary_firm=primary_firm,
        conversion_note=conversion_note,
        their_value=their_value,
    )


def main():
    parser = argparse.ArgumentParser(description="Generate personalized DMs for speaker candidates")
    parser.add_argument("--all", action="store_true", help="Generate DMs for all candidates (not just HIGH/MEDIUM)")
    parser.add_argument("--type", choices=["panel", "playbook"], default="panel", help="DM type")
    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_file = os.path.join(script_dir, "scored_candidates.json")

    if not os.path.exists(input_file):
        print("No scored_candidates.json found. Run 02_scorer.py first.")
        sys.exit(1)

    with open(input_file) as f:
        candidates = json.load(f)

    if not args.all:
        candidates = [c for c in candidates if c.get("priority") in ("HIGH", "MEDIUM")]

    template_type = "playbook" if args.type == "playbook" else "panel_speaker"
    drafts = []

    print("\n" + "=" * 70)
    print(f"DMs READY TO SEND ({len(candidates)} candidates)")
    print("=" * 70)

    for i, c in enumerate(candidates, 1):
        dm = generate_dm(c, template_type)
        draft = {
            "name": c["name"],
            "firms": c.get("firms", []),
            "score": c.get("score", 0),
            "priority": c.get("priority", ""),
            "linkedin_url": c.get("linkedin_url", ""),
            "dm_text": dm,
            "template_type": template_type,
        }
        drafts.append(draft)

        firms_str = ", ".join(c.get("firms", [])) or "Unknown"
        print(f"\n[{i}] {c['name']} ({firms_str}) - Score: {c.get('score', 0)}")
        if c.get("linkedin_url"):
            print(f"    LinkedIn: {c['linkedin_url']}")
        print(f"    DM:")
        print("    " + "-" * 50)
        for line in dm.split("\n"):
            print(f"    {line}")
        print("    " + "-" * 50)
        print(f"    [ ] Copy DM > Open LinkedIn > Paste > Send")

    # Save
    output_file = os.path.join(script_dir, "dm_drafts.json")
    with open(output_file, "w") as f:
        json.dump(drafts, f, indent=2)

    print(f"\n{'=' * 70}")
    print(f"Saved {len(drafts)} DM drafts to {output_file}")
    print("=" * 70)


if __name__ == "__main__":
    main()
