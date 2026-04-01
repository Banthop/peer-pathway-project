#!/usr/bin/env python3
"""
Uthman's Daily Action Dashboard for Speaker Sourcing.

Pulls data from Attio CRM and local files to show what needs doing today.
Presents pipeline status, today's actions, gap analysis, panel readiness,
and the sourcing queue in a clean terminal-friendly format.

Usage:
  python3 06_daily_dashboard.py              # Full dashboard
  python3 06_daily_dashboard.py --quick      # Just pipeline summary + today's actions
  python3 06_daily_dashboard.py --offline    # Skip Attio API, use only local files
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(__file__))
import config

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ATTIO_BASE = "https://api.attio.com/v2"
TARGET_CONFIRMED = 8  # ideal panel size (6-8)
MIN_CONFIRMED = 6     # minimum viable panel
FOLLOWUP_DAYS = 3     # days before a "DM Sent" needs a follow-up
SEPARATOR = "=" * 70
THIN_SEP = "-" * 70

# ---------------------------------------------------------------------------
# Helpers — file loading
# ---------------------------------------------------------------------------


def load_json(filename):
    """Load a JSON file from the script directory, returning None if missing."""
    path = os.path.join(SCRIPT_DIR, filename)
    if not os.path.exists(path):
        return None
    try:
        with open(path) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError) as exc:
        print(f"  [warn] Could not read {filename}: {exc}")
        return None


# ---------------------------------------------------------------------------
# Helpers — Attio API
# ---------------------------------------------------------------------------


def _attio_headers():
    api_key = os.environ.get("ATTIO_API_KEY", "")
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def attio_get(path):
    """GET request to Attio REST API. Returns parsed JSON or None."""
    import requests

    url = f"{ATTIO_BASE}{path}"
    try:
        resp = requests.get(url, headers=_attio_headers(), timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        print(f"  [API error] GET {path}: {exc}")
        return None


def attio_post(path, payload):
    """POST request to Attio REST API. Returns parsed JSON or None."""
    import requests

    url = f"{ATTIO_BASE}{path}"
    try:
        resp = requests.post(url, headers=_attio_headers(), json=payload, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        print(f"  [API error] POST {path}: {exc}")
        return None


def find_speaker_list():
    """Find the 'Speaker Recruitment' list (pipeline) in Attio and return its id."""
    data = attio_get("/lists")
    if not data:
        return None
    lists = data.get("data", [])
    for lst in lists:
        title = (lst.get("name") or lst.get("title") or "").lower()
        api_slug = (lst.get("api_slug") or "").lower()
        if "speaker" in title or "speaker" in api_slug:
            return lst.get("id") or lst.get("id_v2")
    return None


def fetch_pipeline_entries(list_id):
    """Query all entries in the speaker pipeline. Returns list of entry dicts."""
    payload = {
        "sorts": [],
        "limit": 100,
    }
    data = attio_post(f"/lists/{list_id}/entries/query", payload)
    if not data:
        return []
    return data.get("data", [])


def _extract_stage(entry):
    """Best-effort extraction of the stage name from a list entry."""
    # Attio list entries store the stage in entry_values or in a
    # top-level "stage" key depending on the API version.
    stage = entry.get("stage")
    if isinstance(stage, dict):
        return stage.get("title") or stage.get("name") or "Unknown"
    if isinstance(stage, str):
        return stage

    # Try entry_values
    for key in ("stage", "Stage", "status", "Status"):
        val = (entry.get("entry_values") or {}).get(key)
        if val:
            if isinstance(val, list) and val:
                inner = val[0]
                if isinstance(inner, dict):
                    return inner.get("status", {}).get("title", "Unknown") if "status" in inner else inner.get("title", "Unknown")
                return str(inner)
            if isinstance(val, str):
                return val

    # Attio v2 stores stage inside "current_stage"
    cs = entry.get("current_stage")
    if isinstance(cs, dict):
        return cs.get("title") or cs.get("name") or "Unknown"
    if isinstance(cs, str):
        return cs

    return "Unknown"


def _extract_name(entry):
    """Best-effort extraction of the person's name from a list entry."""
    # Top-level
    for key in ("name", "full_name", "display_name"):
        val = entry.get(key)
        if val and isinstance(val, str):
            return val

    # Inside entry_values
    ev = entry.get("entry_values") or {}
    for key in ("name", "full_name", "Name", "Full Name"):
        val = ev.get(key)
        if val:
            if isinstance(val, list) and val:
                inner = val[0]
                if isinstance(inner, dict):
                    first = inner.get("first_name", "")
                    last = inner.get("last_name", "")
                    if first or last:
                        return f"{first} {last}".strip()
                    return inner.get("value", str(inner))
                return str(inner)
            if isinstance(val, str):
                return val

    # record_id fallback
    record = entry.get("record") or entry.get("record_id")
    if isinstance(record, dict):
        return record.get("name") or record.get("title") or str(record.get("record_id", "?"))
    return str(record) if record else "Unknown"


def _extract_created_at(entry):
    """Extract the created_at timestamp from an entry, return datetime or None."""
    raw = entry.get("created_at") or entry.get("entry_created_at")
    if not raw:
        return None
    try:
        # Handle ISO format with or without timezone
        if isinstance(raw, str):
            raw = raw.replace("Z", "+00:00")
            return datetime.fromisoformat(raw)
    except (ValueError, TypeError):
        pass
    return None


# ---------------------------------------------------------------------------
# Dashboard sections
# ---------------------------------------------------------------------------


def section_header(title):
    print(f"\n{SEPARATOR}")
    print(f"  {title}")
    print(SEPARATOR)


def print_pipeline_summary(entries):
    """Print how many speakers are in each pipeline stage."""
    section_header("PIPELINE SUMMARY")

    stage_counts = {s: [] for s in config.ATTIO_STAGES}
    unknown = []

    for entry in entries:
        stage = _extract_stage(entry)
        name = _extract_name(entry)
        matched = False
        for known_stage in config.ATTIO_STAGES:
            if stage.lower() == known_stage.lower():
                stage_counts[known_stage].append(name)
                matched = True
                break
        if not matched:
            unknown.append((name, stage))

    total = sum(len(v) for v in stage_counts.values())
    confirmed_count = len(stage_counts.get("Confirmed", []))
    webinar_done = len(stage_counts.get("Webinar Done", []))
    active_coach = len(stage_counts.get("Active Coach", []))
    panel_ready = confirmed_count + webinar_done + active_coach

    for stage in config.ATTIO_STAGES:
        names = stage_counts[stage]
        count = len(names)
        bar = "#" * count + "." * (10 - min(count, 10))
        names_str = f"  ({', '.join(names)})" if names else ""
        print(f"  {stage:<18} [{bar}] {count}{names_str}")

    if unknown:
        print(f"\n  Unrecognised stages:")
        for name, stage in unknown:
            print(f"    {name} -> \"{stage}\"")

    print(f"\n  Total in pipeline:    {total}")
    print(f"  Confirmed for panel:  {panel_ready} / {TARGET_CONFIRMED} target")
    if panel_ready >= MIN_CONFIRMED:
        print(f"  STATUS: Panel viable ({panel_ready} confirmed)")
    else:
        print(f"  STATUS: Need {MIN_CONFIRMED - panel_ready} more confirmed speakers")

    return stage_counts


def print_pipeline_summary_offline():
    """Offline fallback using config.EXISTING_SPEAKERS."""
    section_header("PIPELINE SUMMARY (offline -- using config.py)")

    confirmed = [s for s in config.EXISTING_SPEAKERS if s.get("confirmed")]
    unconfirmed = [s for s in config.EXISTING_SPEAKERS if not s.get("confirmed")]

    print(f"  Confirmed speakers:   {len(confirmed)}")
    for s in confirmed:
        firms_str = ", ".join(s["firms"])
        print(f"    - {s['name']} ({firms_str})")

    print(f"\n  Unconfirmed / in progress: {len(unconfirmed)}")
    for s in unconfirmed:
        firms_str = ", ".join(s["firms"]) if s["firms"] else "No firms listed"
        print(f"    - {s['name']} ({firms_str})")

    print(f"\n  Total known: {len(config.EXISTING_SPEAKERS)}")
    print(f"  Confirmed:   {len(confirmed)} / {TARGET_CONFIRMED} target")
    if len(confirmed) >= MIN_CONFIRMED:
        print(f"  STATUS: Panel viable ({len(confirmed)} confirmed)")
    else:
        print(f"  STATUS: Need {MIN_CONFIRMED - len(confirmed)} more confirmed speakers")

    return None  # no stage_counts available


def print_todays_actions(stage_counts, dm_drafts, entries):
    """Show DMs to send, follow-ups needed, and replies to process."""
    section_header("TODAY'S ACTIONS")

    # 1. DMs to send — candidates in "Sourced" stage
    sourced = stage_counts.get("Sourced", [])
    print(f"\n  DMs TO SEND ({len(sourced)} candidates in 'Sourced'):")
    if sourced:
        # Try to match sourced names to dm_drafts for copy-paste DMs
        dm_lookup = {}
        if dm_drafts:
            for draft in dm_drafts:
                dm_lookup[draft.get("name", "").lower()] = draft

        for name in sourced:
            print(f"    [ ] {name}")
            draft = dm_lookup.get(name.lower())
            if draft and draft.get("dm_text"):
                # Print first 2 lines of DM as preview
                lines = draft["dm_text"].strip().split("\n")
                preview = lines[0][:80]
                print(f"        DM preview: {preview}...")
                if draft.get("linkedin_url"):
                    print(f"        LinkedIn: {draft['linkedin_url']}")
            else:
                print(f"        (no DM draft -- run 03_dm_generator.py)")
    else:
        print("    None -- all candidates have been contacted")

    # 2. Follow-ups needed — candidates in "DM Sent" for 3+ days
    dm_sent = stage_counts.get("DM Sent", [])
    print(f"\n  FOLLOW-UPS NEEDED ({len(dm_sent)} in 'DM Sent'):")
    if dm_sent and entries:
        now = datetime.now(timezone.utc)
        needs_followup = []
        not_yet = []
        for entry in entries:
            stage = _extract_stage(entry)
            if stage.lower() != "dm sent":
                continue
            name = _extract_name(entry)
            created = _extract_created_at(entry)
            if created:
                days_ago = (now - created).days
                if days_ago >= FOLLOWUP_DAYS:
                    needs_followup.append((name, days_ago))
                else:
                    not_yet.append((name, days_ago))
            else:
                needs_followup.append((name, "?"))

        if needs_followup:
            for name, days in needs_followup:
                days_str = f"{days} days ago" if isinstance(days, int) else "unknown date"
                print(f"    [!] {name} -- DM sent {days_str}, follow up now")
        else:
            print(f"    None overdue yet")
        if not_yet:
            for name, days in not_yet:
                print(f"    [ ] {name} -- DM sent {days} day(s) ago, follow up in {FOLLOWUP_DAYS - days} day(s)")
    elif dm_sent:
        # No entry data for date checking
        for name in dm_sent:
            print(f"    [?] {name} -- check when DM was sent")
    else:
        print("    No candidates in 'DM Sent' stage")

    # 3. Replies to process
    replied = stage_counts.get("Replied", [])
    print(f"\n  REPLIES TO PROCESS ({len(replied)}):")
    if replied:
        for name in replied:
            print(f"    [!] {name} -- has replied, move to Interested or Terms Agreed")
    else:
        print("    No unprocessed replies")


def print_todays_actions_offline(dm_drafts):
    """Offline version using config.py data."""
    section_header("TODAY'S ACTIONS (offline)")

    unconfirmed = [s for s in config.EXISTING_SPEAKERS if not s.get("confirmed")]
    print(f"\n  CANDIDATES TO CHASE ({len(unconfirmed)} unconfirmed):")
    for s in unconfirmed:
        firms_str = ", ".join(s["firms"]) if s["firms"] else "No firms"
        print(f"    [ ] {s['name']} ({firms_str})")

    if dm_drafts:
        unsent = [d for d in dm_drafts if d.get("priority") in ("HIGH", "MEDIUM")]
        print(f"\n  DM DRAFTS READY ({len(unsent)}):")
        for d in unsent[:5]:
            print(f"    [ ] {d['name']} ({', '.join(d.get('firms', []))}) -- {d.get('priority', '?')}")
        if len(unsent) > 5:
            print(f"    ... and {len(unsent) - 5} more")
    else:
        print("\n  No dm_drafts.json found -- run 03_dm_generator.py")


def print_gap_report():
    """Show firms and sectors still not covered, plus gender balance."""
    section_header("GAP REPORT")

    covered_firms = config.get_covered_firms()
    remaining_gaps = [f for f in config.GAP_FIRMS if f.lower() not in covered_firms]
    filled_gaps = [f for f in config.GAP_FIRMS if f.lower() in covered_firms]

    print(f"\n  FIRM GAPS ({len(remaining_gaps)} of {len(config.GAP_FIRMS)} still open):")
    if remaining_gaps:
        for firm in remaining_gaps:
            # Show which sector this firm belongs to
            sectors = config.get_sectors_for_firms([firm])
            sector_str = f" [{', '.join(sectors)}]" if sectors else ""
            print(f"    [ ] {firm}{sector_str}")
    else:
        print("    All gap firms covered!")

    if filled_gaps:
        print(f"\n  GAPS FILLED ({len(filled_gaps)}):")
        for firm in filled_gaps:
            # Find who covers it
            coverers = []
            for s in config.EXISTING_SPEAKERS:
                if firm.lower() in [f.lower() for f in s["firms"]]:
                    coverers.append(s["name"])
            print(f"    [x] {firm} -- {', '.join(coverers)}")

    # Sector coverage
    covered_sectors = config.get_covered_sectors()
    all_sectors = set(config.SECTORS.keys())
    uncovered_sectors = all_sectors - covered_sectors

    print(f"\n  SECTOR COVERAGE:")
    for sector in sorted(all_sectors):
        status = "x" if sector in covered_sectors else " "
        print(f"    [{status}] {sector}")

    if uncovered_sectors:
        print(f"\n  UNCOVERED SECTORS: {', '.join(sorted(uncovered_sectors))}")

    # Gender balance
    males = sum(1 for s in config.EXISTING_SPEAKERS if s.get("gender", "").upper() == "M")
    females = sum(1 for s in config.EXISTING_SPEAKERS if s.get("gender", "").upper() == "F")
    other = len(config.EXISTING_SPEAKERS) - males - females

    print(f"\n  GENDER BALANCE:")
    print(f"    Male:   {males}")
    print(f"    Female: {females}")
    if other:
        print(f"    Other/Unknown: {other}")

    total = males + females + other
    if total > 0:
        pct_female = (females / total) * 100
        if pct_female < 25:
            print(f"    [!] Only {pct_female:.0f}% female -- prioritise women candidates")
        elif pct_female < 40:
            print(f"    [~] {pct_female:.0f}% female -- decent, but more women would help")
        else:
            print(f"    [ok] {pct_female:.0f}% female -- good balance")


def print_panel_readiness(panel_split):
    """Show panel readiness status and split if available."""
    section_header("PANEL READINESS")

    confirmed = [s for s in config.EXISTING_SPEAKERS if s.get("confirmed")]
    count = len(confirmed)

    print(f"\n  Confirmed speakers: {count}")
    for s in confirmed:
        firms_str = ", ".join(s["firms"])
        conv = f" ({s['conversion']})" if s.get("conversion") else ""
        print(f"    - {s['name']}: {firms_str}{conv}")

    if count >= MIN_CONFIRMED:
        print(f"\n  PANEL IS VIABLE with {count} speakers")
        if panel_split:
            print(f"\n  CURRENT SPLIT (from panel_split.json):")
            p1 = panel_split.get("part1", [])
            p2 = panel_split.get("part2", [])
            score = panel_split.get("score", "?")

            print(f"    Split score: {score}")
            print(f"\n    Part 1 ({len(p1)} speakers):")
            for s in p1:
                firms_str = ", ".join(s.get("firms", []))
                gender = f" [{s.get('gender', '?')}]" if s.get("gender") else ""
                print(f"      - {s['name']}: {firms_str}{gender}")

            print(f"\n    Part 2 ({len(p2)} speakers):")
            for s in p2:
                firms_str = ", ".join(s.get("firms", []))
                gender = f" [{s.get('gender', '?')}]" if s.get("gender") else ""
                print(f"      - {s['name']}: {firms_str}{gender}")

            if panel_split.get("reasons"):
                print(f"\n    Reasons:")
                for r in panel_split["reasons"]:
                    print(f"      - {r}")
        else:
            print(f"\n  No panel_split.json found.")
            print(f"  Run: python3 05_panel_optimizer.py")
            if count > MIN_CONFIRMED:
                print(f"  (You have {count} confirmed -- optimizer can find the best 3+3 or 4+4 split)")
    else:
        needed = MIN_CONFIRMED - count
        print(f"\n  NEED {needed} MORE CONFIRMED SPEAKERS")
        print(f"  Priority: get unconfirmed candidates to 'Confirmed' stage")

        unconfirmed = [s for s in config.EXISTING_SPEAKERS if not s.get("confirmed")]
        if unconfirmed:
            print(f"\n  Candidates to chase for confirmation:")
            for s in unconfirmed:
                firms_str = ", ".join(s["firms"]) if s["firms"] else "No firms"
                print(f"    -> {s['name']} ({firms_str})")


def print_sourcing_queue(scored_candidates):
    """Show top uncontacted candidates from scored_candidates.json."""
    section_header("SOURCING QUEUE")

    if not scored_candidates:
        print("\n  No scored_candidates.json found.")
        print("  Run: python3 02_scorer.py")
        return

    # Filter to HIGH priority, uncontacted candidates
    # "Uncontacted" = not in EXISTING_SPEAKERS by name
    existing_names = {s["name"].lower() for s in config.EXISTING_SPEAKERS}

    uncontacted = [
        c for c in scored_candidates
        if c.get("name", "").lower() not in existing_names
    ]

    high_priority = [c for c in uncontacted if c.get("priority") == "HIGH"]
    medium_priority = [c for c in uncontacted if c.get("priority") == "MEDIUM"]

    top_candidates = high_priority[:5]
    if len(top_candidates) < 5:
        top_candidates += medium_priority[:5 - len(top_candidates)]

    if not top_candidates:
        print("\n  No uncontacted candidates in queue.")
        print("  All scored candidates are already in the pipeline or contacted.")
        return

    print(f"\n  TOP {len(top_candidates)} UNCONTACTED CANDIDATES:")
    for i, c in enumerate(top_candidates, 1):
        firms_str = ", ".join(c.get("firms", [])) or "Unknown"
        uni = c.get("university", "Unknown")
        score = c.get("score", 0)
        priority = c.get("priority", "?")
        reasons_short = " | ".join(c.get("reasons", [])[:3])

        print(f"\n  {i}. [{priority}] {c['name']} (Score: {score})")
        print(f"     Firms: {firms_str}")
        print(f"     University: {uni}")
        print(f"     Why: {reasons_short}")
        if c.get("linkedin_url"):
            print(f"     LinkedIn: {c['linkedin_url']}")

    remaining = len(uncontacted) - len(top_candidates)
    if remaining > 0:
        print(f"\n  ... and {remaining} more in scored_candidates.json")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(
        description="Uthman's Daily Speaker Sourcing Dashboard"
    )
    parser.add_argument(
        "--quick",
        action="store_true",
        help="Just pipeline summary + today's actions",
    )
    parser.add_argument(
        "--offline",
        action="store_true",
        help="Skip Attio API, use only local files",
    )
    args = parser.parse_args()

    # Determine if we can use the API
    api_key = os.environ.get("ATTIO_API_KEY", "").strip()
    use_api = bool(api_key) and not args.offline

    if not api_key and not args.offline:
        print("  [info] ATTIO_API_KEY not set -- running in offline mode")
        print("         Set the env var or use --offline to suppress this message")
        use_api = False

    # Load optional local files
    dm_drafts = load_json("dm_drafts.json")
    scored_candidates = load_json("scored_candidates.json")
    panel_split = load_json("panel_split.json")

    # Header
    now = datetime.now()
    print(f"\n{SEPARATOR}")
    print(f"  EARLYEDGE SPEAKER SOURCING DASHBOARD")
    print(f"  {now.strftime('%A %d %B %Y, %H:%M')}")
    mode_label = "LIVE (Attio API)" if use_api else "OFFLINE (local files only)"
    print(f"  Mode: {mode_label}")
    print(SEPARATOR)

    # --- Pipeline Summary ---
    stage_counts = None
    entries = []

    if use_api:
        list_id = find_speaker_list()
        if list_id:
            entries = fetch_pipeline_entries(list_id)
            if entries:
                stage_counts = print_pipeline_summary(entries)
            else:
                print("\n  [warn] No entries returned from pipeline. Falling back to offline.")
                print_pipeline_summary_offline()
        else:
            print("\n  [warn] Could not find 'Speaker Recruitment' list in Attio. Falling back to offline.")
            print_pipeline_summary_offline()
    else:
        print_pipeline_summary_offline()

    # --- Today's Actions ---
    if stage_counts is not None:
        print_todays_actions(stage_counts, dm_drafts, entries)
    else:
        print_todays_actions_offline(dm_drafts)

    # Quick mode stops here
    if args.quick:
        print(f"\n{THIN_SEP}")
        print("  (quick mode -- run without --quick for full dashboard)")
        print(THIN_SEP)
        return

    # --- Gap Report ---
    print_gap_report()

    # --- Panel Readiness ---
    print_panel_readiness(panel_split)

    # --- Sourcing Queue ---
    print_sourcing_queue(scored_candidates)

    # Footer
    print(f"\n{SEPARATOR}")
    print("  END OF DASHBOARD")
    print(f"  Next steps:")
    confirmed = [s for s in config.EXISTING_SPEAKERS if s.get("confirmed")]
    if len(confirmed) < MIN_CONFIRMED:
        print(f"    1. Chase unconfirmed speakers for confirmation")
        print(f"    2. DM candidates in 'Sourced' stage")
        print(f"    3. Follow up on 'DM Sent' candidates after {FOLLOWUP_DAYS} days")
    else:
        print(f"    1. Run 05_panel_optimizer.py to finalize Part 1/Part 2 split")
        print(f"    2. Collect speaker write-ups for The Spring Week Playbook")
        print(f"    3. Continue sourcing to fill remaining firm gaps")
    print(SEPARATOR)


if __name__ == "__main__":
    main()
