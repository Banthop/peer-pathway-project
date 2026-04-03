#!/usr/bin/env python3
"""
Sync speaker candidates to the Attio CRM pipeline.
Creates Person records, adds them to the Speaker Recruitment pipeline,
and moves them through stages.

Usage:
  python3 04_attio_sync.py --sync-existing       # Fix pipeline stages for 13 existing speakers
  python3 04_attio_sync.py --add-new              # Add new candidates from scored_candidates.json
  python3 04_attio_sync.py --advance NAME STAGE   # Move a specific speaker to a stage
  python3 04_attio_sync.py --status               # Print current pipeline status from Attio

Requires ATTIO_API_KEY environment variable.
"""

import argparse
import json
import os
import sys
import time

try:
    import requests
except ImportError:
    print("ERROR: requests library required. Install with: pip3 install requests")
    sys.exit(1)

sys.path.insert(0, os.path.dirname(__file__))
import config

# === API Setup ===

BASE_URL = "https://api.attio.com/v2"
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds


def get_headers():
    """Get auth headers. Fails fast if no API key."""
    api_key = os.environ.get("ATTIO_API_KEY")
    if not api_key:
        print("ERROR: ATTIO_API_KEY environment variable not set.")
        print("Get your key from Attio > Settings > API Keys")
        sys.exit(1)
    return {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


def api_request(method, path, json_data=None):
    """Make an Attio API request with retry on rate limits."""
    url = f"{BASE_URL}{path}"
    headers = get_headers()

    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.request(method, url, headers=headers, json=json_data, timeout=30)

            if resp.status_code == 429:
                wait = RETRY_DELAY * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue

            if resp.status_code >= 400:
                print(f"  API error {resp.status_code}: {resp.text[:300]}")
                return None

            return resp.json()

        except requests.exceptions.RequestException as e:
            print(f"  Request failed: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
                continue
            return None

    return None


# === Pipeline Functions ===

def get_pipeline():
    """Find the Speaker Recruitment pipeline (list) and return its ID + stage mapping."""
    data = api_request("GET", "/lists")
    if not data:
        print("ERROR: Could not fetch lists from Attio")
        return None, {}

    lists = data.get("data", [])
    pipeline = None
    for lst in lists:
        title = lst.get("name", "") or lst.get("title", "")
        if "speaker" in title.lower() and "recruit" in title.lower():
            pipeline = lst
            break

    if not pipeline:
        # Try matching on the api_slug from config
        for lst in lists:
            if lst.get("api_slug") == config.ATTIO_SPEAKER_LIST:
                pipeline = lst
                break

    if not pipeline:
        print("ERROR: Could not find Speaker Recruitment pipeline in Attio")
        print(f"  Available lists: {[l.get('name') or l.get('title') for l in lists]}")
        return None, {}

    list_id = pipeline["id"]["list_id"]
    print(f"  Found pipeline: {pipeline.get('name', pipeline.get('title', '?'))} ({list_id})")

    # Get stage attribute and its options
    stages = {}
    attrs_data = api_request("GET", f"/lists/{list_id}/attributes")
    if attrs_data:
        for attr in attrs_data.get("data", []):
            if attr.get("type") == "status" or attr.get("attribute_type") == "status":
                for option in attr.get("config", {}).get("statuses", []):
                    stages[option["title"]] = {
                        "status_id": option["id"]["status_id"],
                        "attribute_id": attr["id"]["attribute_id"],
                    }
                break
            # Also check for "stage" by api_slug
            if attr.get("api_slug") == "stage":
                for option in attr.get("config", {}).get("statuses", []):
                    stages[option["title"]] = {
                        "status_id": option["id"]["status_id"],
                        "attribute_id": attr["id"]["attribute_id"],
                    }
                break

    if stages:
        print(f"  Stages found: {list(stages.keys())}")
    else:
        print("  WARNING: Could not parse pipeline stages")

    return list_id, stages


def get_pipeline_entries(list_id):
    """Get all entries in the pipeline."""
    data = api_request("POST", f"/lists/{list_id}/entries/query", json_data={})
    if not data:
        return []
    return data.get("data", [])


def find_entry_by_record_id(entries, record_id):
    """Find a pipeline entry matching a person record_id."""
    for entry in entries:
        record_ref = entry.get("record_id") or entry.get("parent_record_id")
        if record_ref == record_id:
            return entry
        # Check nested structure
        parent = entry.get("parent_record", {})
        if parent.get("id", {}).get("record_id") == record_id:
            return entry
        # Check in the record_id field within id
        if entry.get("id", {}).get("record_id") == record_id:
            return entry
    return None


def add_to_pipeline(list_id, record_id, stages, stage_name="Sourced"):
    """Add a person record to the Speaker Recruitment pipeline at a given stage."""
    stage_info = stages.get(stage_name)
    if not stage_info:
        print(f"  ERROR: Stage '{stage_name}' not found in pipeline")
        return None

    payload = {
        "data": {
            "parent_record_id": record_id,
            "parent_object": "people",
            "attribute_values": [
                {
                    "attribute": stage_info["attribute_id"],
                    "status": stage_info["status_id"],
                }
            ],
        }
    }

    result = api_request("POST", f"/lists/{list_id}/entries", json_data=payload)
    if result:
        entry_id = result.get("data", {}).get("id", {}).get("entry_id")
        print(f"  Added to pipeline at stage '{stage_name}' (entry: {entry_id})")
        return entry_id
    return None


def move_to_stage(list_id, entry_id, stages, stage_name):
    """Move a pipeline entry to a specific stage."""
    stage_info = stages.get(stage_name)
    if not stage_info:
        print(f"  ERROR: Stage '{stage_name}' not found. Valid stages: {list(stages.keys())}")
        return False

    payload = {
        "data": {
            "attribute_values": [
                {
                    "attribute": stage_info["attribute_id"],
                    "status": stage_info["status_id"],
                }
            ],
        }
    }

    result = api_request("PUT", f"/lists/{list_id}/entries/{entry_id}", json_data=payload)
    if result:
        print(f"  Moved to stage: {stage_name}")
        return True
    return False


# === Person Record Functions ===

def create_speaker_record(candidate, sourced_by="Don"):
    """Create a new Person record in Attio from a scored candidate."""
    name = candidate.get("name", "")
    name_parts = name.split(maxsplit=1)
    first = name_parts[0] if name_parts else name
    last = name_parts[1] if len(name_parts) > 1 else ""

    values = {
        "name": [{"first_name": first, "last_name": last, "full_name": name}],
    }

    # Add LinkedIn if available
    linkedin = candidate.get("linkedin_url", "")
    if linkedin:
        values["email_addresses"] = []  # Empty but present to satisfy schema

    payload = {"data": {"values": values}}
    result = api_request("POST", "/objects/people/records", json_data=payload)

    if result:
        record_id = result.get("data", {}).get("id", {}).get("record_id")
        print(f"  Created person record: {name} ({record_id})")

        # Add a note tagging who sourced this candidate
        add_sourced_note(record_id, name, candidate, sourced_by)

        return record_id
    return None


def add_sourced_note(record_id, name, candidate, sourced_by):
    """Add a note to the person record indicating who sourced them."""
    firms = ", ".join(candidate.get("firms", []))
    uni = candidate.get("university", "")
    score = candidate.get("score", "")
    headline = candidate.get("headline", "")
    linkedin = candidate.get("linkedin_url", "")

    note_lines = [f"Sourced by {sourced_by}"]
    if headline:
        note_lines.append(f"Headline: {headline}")
    if firms:
        note_lines.append(f"Firms: {firms}")
    if uni:
        note_lines.append(f"University: {uni}")
    if score:
        note_lines.append(f"AI Score: {score}")
    if linkedin:
        note_lines.append(f"LinkedIn: {linkedin}")

    note_body = "\n".join(note_lines)

    payload = {
        "data": {
            "parent_object": "people",
            "parent_record_id": record_id,
            "title": f"Sourced by {sourced_by}",
            "format": "plaintext",
            "content": note_body,
        }
    }

    result = api_request("POST", "/notes", json_data=payload)
    if result:
        print(f"    ✓ Note added: Sourced by {sourced_by}")
    else:
        print(f"    ⚠ Could not add note (record still created)")


def update_speaker_attributes(record_id, attrs):
    """Update custom attributes on a Person record (Speaker=True, Speaker Firms, etc.)."""
    values = {}

    if attrs.get("speaker"):
        values["speaker"] = attrs["speaker"]
    if attrs.get("speaker_firms"):
        values["speaker_firms"] = attrs["speaker_firms"]
    if attrs.get("university"):
        values["university"] = attrs["university"]

    if not values:
        return True

    payload = {"data": {"values": values}}
    result = api_request("PATCH", f"/objects/people/records/{record_id}", json_data=payload)

    if result:
        print(f"  Updated attributes for {record_id}")
        return True
    return False


# === Sync Commands ===

def sync_existing():
    """Move the 13 existing speakers to correct pipeline stages.
    confirmed=True  -> 'Confirmed' stage
    confirmed=False -> 'Sourced' stage
    """
    print("\n=== SYNCING EXISTING SPEAKERS ===")
    list_id, stages = get_pipeline()
    if not list_id:
        return

    # Get current entries
    entries = get_pipeline_entries(list_id)
    print(f"  {len(entries)} entries currently in pipeline")

    success = 0
    skipped = 0
    added = 0

    for speaker in config.EXISTING_SPEAKERS:
        target_stage = "Confirmed" if speaker["confirmed"] else "Sourced"
        record_id = speaker["record_id"]
        name = speaker["name"]

        print(f"\n  {name} -> {target_stage}")

        # Find existing entry
        entry = find_entry_by_record_id(entries, record_id)

        if entry:
            entry_id = entry.get("id", {}).get("entry_id")
            if entry_id:
                if move_to_stage(list_id, entry_id, stages, target_stage):
                    success += 1
                else:
                    skipped += 1
            else:
                print(f"    Could not extract entry_id for {name}")
                skipped += 1
        else:
            # Not in pipeline yet, add them
            print(f"    Not in pipeline, adding...")
            entry_id = add_to_pipeline(list_id, record_id, stages, target_stage)
            if entry_id:
                added += 1
                success += 1
            else:
                skipped += 1

    print(f"\n=== DONE: {success} updated, {added} added, {skipped} skipped ===")


def sync_new_candidates(candidates_file, sourced_by="Don"):
    """Read scored_candidates.json, create records for new candidates, add to pipeline."""
    print(f"\n=== ADDING NEW CANDIDATES (sourced by {sourced_by}) ===")

    if not os.path.exists(candidates_file):
        print(f"ERROR: {candidates_file} not found")
        print("Run 02_scorer.py first to generate scored candidates.")
        return

    with open(candidates_file) as f:
        candidates = json.load(f)

    print(f"  Loaded {len(candidates)} candidates from {os.path.basename(candidates_file)}")

    # Filter out existing speakers by name to avoid duplicates
    existing_names = {s["name"].lower() for s in config.EXISTING_SPEAKERS}
    new_candidates = [c for c in candidates if c.get("name", "").lower() not in existing_names]
    print(f"  {len(new_candidates)} new candidates (after excluding existing speakers)")

    if not new_candidates:
        print("  No new candidates to add.")
        return

    list_id, stages = get_pipeline()
    if not list_id:
        return

    created = 0
    failed = 0

    for candidate in new_candidates:
        name = candidate.get("name", "Unknown")
        firms = ", ".join(candidate.get("firms", []))
        score = candidate.get("score", 0)
        priority = candidate.get("priority", "?")

        print(f"\n  [{priority}] {name} (score: {score}, firms: {firms})")

        # Create person record with sourced-by note
        record_id = create_speaker_record(candidate, sourced_by=sourced_by)
        if not record_id:
            print(f"    FAILED to create record")
            failed += 1
            continue

        # Update custom attributes
        attrs = {
            "speaker": True,
            "speaker_firms": ", ".join(candidate.get("firms", [])),
        }
        if candidate.get("university"):
            attrs["university"] = candidate["university"]
        update_speaker_attributes(record_id, attrs)

        # Add to pipeline as "Sourced"
        entry_id = add_to_pipeline(list_id, record_id, stages, "Sourced")
        if entry_id:
            created += 1
        else:
            failed += 1

        # Small delay to be polite to the API
        time.sleep(0.3)

    print(f"\n=== DONE: {created} created, {failed} failed (sourced by {sourced_by}) ===")


def advance_speaker(name, stage_name):
    """Move a specific speaker to a named stage."""
    print(f"\n=== ADVANCING: {name} -> {stage_name} ===")

    # Validate stage
    if stage_name not in config.ATTIO_STAGES:
        print(f"ERROR: '{stage_name}' is not a valid stage.")
        print(f"Valid stages: {', '.join(config.ATTIO_STAGES)}")
        return

    list_id, stages = get_pipeline()
    if not list_id:
        return

    # Try to find speaker by name in existing speakers first
    record_id = None
    for speaker in config.EXISTING_SPEAKERS:
        if name.lower() in speaker["name"].lower():
            record_id = speaker["record_id"]
            print(f"  Found in config: {speaker['name']} ({record_id})")
            break

    entries = get_pipeline_entries(list_id)

    if record_id:
        entry = find_entry_by_record_id(entries, record_id)
    else:
        # Search through entries by matching on name in record values
        print(f"  Not in config, searching pipeline entries...")
        entry = None
        for e in entries:
            record = e.get("parent_record", {})
            record_values = record.get("values", {})
            record_name = record_values.get("name", [{}])
            if isinstance(record_name, list) and record_name:
                full_name = record_name[0].get("full_name", "") or record_name[0].get("first_name", "")
                if name.lower() in full_name.lower():
                    entry = e
                    print(f"  Found in pipeline: {full_name}")
                    break

    if not entry:
        print(f"  ERROR: Could not find '{name}' in pipeline")
        return

    entry_id = entry.get("id", {}).get("entry_id")
    if not entry_id:
        print("  ERROR: Could not extract entry_id")
        return

    move_to_stage(list_id, entry_id, stages, stage_name)


def print_status():
    """Print current pipeline status from Attio."""
    print("\n=== SPEAKER RECRUITMENT PIPELINE STATUS ===")

    list_id, stages = get_pipeline()
    if not list_id:
        return

    entries = get_pipeline_entries(list_id)
    print(f"\n  Total entries: {len(entries)}")

    # Group entries by stage
    by_stage = {stage: [] for stage in config.ATTIO_STAGES}
    unmatched = []

    for entry in entries:
        # Extract the current stage
        entry_stage = None
        attr_values = entry.get("attribute_values", {})

        # Look through attribute values for the status attribute
        for attr_id, val_list in attr_values.items():
            if isinstance(val_list, list):
                for val in val_list:
                    status = val.get("status", {})
                    if status:
                        entry_stage = status.get("title")
                        break
            if entry_stage:
                break

        # Extract person name
        record = entry.get("parent_record", {})
        record_values = record.get("values", {})
        name_vals = record_values.get("name", [])
        if isinstance(name_vals, list) and name_vals:
            name = name_vals[0].get("full_name") or name_vals[0].get("first_name", "Unknown")
        else:
            name = "Unknown"

        if entry_stage and entry_stage in by_stage:
            by_stage[entry_stage].append(name)
        else:
            unmatched.append((name, entry_stage or "no stage"))

    # Print by stage
    print()
    for stage in config.ATTIO_STAGES:
        names = by_stage[stage]
        count = len(names)
        indicator = "*" * min(count, 20)
        print(f"  {stage:20s} [{count:2d}] {indicator}")
        for n in names:
            print(f"  {'':20s}      - {n}")

    if unmatched:
        print(f"\n  {'Unmatched':20s} [{len(unmatched):2d}]")
        for n, s in unmatched:
            print(f"  {'':20s}      - {n} (stage: {s})")

    # Cross-reference with config
    print("\n  --- Config Cross-Reference ---")
    confirmed = [s["name"] for s in config.EXISTING_SPEAKERS if s["confirmed"]]
    unconfirmed = [s["name"] for s in config.EXISTING_SPEAKERS if not s["confirmed"]]
    print(f"  Confirmed in config ({len(confirmed)}): {', '.join(confirmed)}")
    print(f"  Unconfirmed in config ({len(unconfirmed)}): {', '.join(unconfirmed)}")
    print()


# === CLI ===

def main():
    parser = argparse.ArgumentParser(
        description="Sync speaker candidates to Attio CRM pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 04_attio_sync.py --sync-existing
  python3 04_attio_sync.py --add-new
  python3 04_attio_sync.py --advance "Jason" "DM Sent"
  python3 04_attio_sync.py --status
        """,
    )
    parser.add_argument("--sync-existing", action="store_true",
                        help="Fix pipeline stages for existing speakers from config")
    parser.add_argument("--add-new", action="store_true",
                        help="Add new candidates from scored_candidates.json")
    parser.add_argument("--advance", nargs=2, metavar=("NAME", "STAGE"),
                        help="Move a speaker to a pipeline stage")
    parser.add_argument("--status", action="store_true",
                        help="Print current pipeline status")
    parser.add_argument("--sourced-by", default="Don",
                        help="Tag who sourced these candidates (default: Don)")

    args = parser.parse_args()

    if not any([args.sync_existing, args.add_new, args.advance, args.status]):
        parser.print_help()
        sys.exit(0)

    if args.status:
        print_status()

    if args.sync_existing:
        sync_existing()

    if args.add_new:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        candidates_file = os.path.join(script_dir, "scored_candidates.json")
        sync_new_candidates(candidates_file, sourced_by=args.sourced_by)

    if args.advance:
        name, stage = args.advance
        advance_speaker(name, stage)


if __name__ == "__main__":
    main()
