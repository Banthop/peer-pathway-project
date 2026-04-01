#!/usr/bin/env python3
"""
AI-powered LinkedIn Sales Navigator sourcer for spring week speaker candidates.
Uses browser-use to automate Sales Nav search and extract candidate profiles.

Uthman runs this, logs into LinkedIn once, then walks away.

Requirements:
  pip install browser-use langchain-anthropic
  export ANTHROPIC_API_KEY='sk-ant-...'

Usage:
  python3 01_linkedin_sourcer.py                    # Run all searches (recommended)
  python3 01_linkedin_sourcer.py --max-searches 3   # Quick test with 3 searches
  python3 01_linkedin_sourcer.py --regular           # Use regular LinkedIn (no Sales Nav)
  python3 01_linkedin_sourcer.py --resume             # Resume from where you left off
"""

import argparse
import asyncio
import json
import os
import random
import sys
import time
from datetime import datetime, timezone
from difflib import SequenceMatcher

sys.path.insert(0, os.path.dirname(__file__))
import config

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CANDIDATES_FILE = os.path.join(SCRIPT_DIR, "candidates.json")
PROGRESS_FILE = os.path.join(SCRIPT_DIR, ".sourcing_progress.json")

DELAY_MIN = 20
DELAY_MAX = 45
NAME_SIM_THRESHOLD = 0.80

# ---------------------------------------------------------------------------
# Sales Navigator searches — much better than regular LinkedIn
# Each search = a Sales Nav filter combo that finds a specific type of candidate
# ---------------------------------------------------------------------------
SALES_NAV_SEARCHES = [
    # --- GAP FIRM SEARCHES (highest priority) ---
    {
        "id": "gs",
        "label": "Goldman Sachs spring week alumni",
        "keywords": "spring week",
        "past_company": "Goldman Sachs",
        "geography": "United Kingdom",
    },
    {
        "id": "jpm",
        "label": "JPMorgan spring week alumni",
        "keywords": "spring week",
        "past_company": "JPMorgan",
        "geography": "United Kingdom",
    },
    {
        "id": "db",
        "label": "Deutsche Bank spring week alumni",
        "keywords": "spring week",
        "past_company": "Deutsche Bank",
        "geography": "United Kingdom",
    },
    {
        "id": "bnp",
        "label": "BNP Paribas spring week alumni",
        "keywords": "spring week",
        "past_company": "BNP Paribas",
        "geography": "United Kingdom",
    },
    {
        "id": "roth",
        "label": "Rothschild spring week alumni",
        "keywords": "spring week OR insight week",
        "past_company": "Rothschild",
        "geography": "United Kingdom",
    },
    {
        "id": "lazard",
        "label": "Lazard spring week alumni",
        "keywords": "spring week OR insight week",
        "past_company": "Lazard",
        "geography": "United Kingdom",
    },
    {
        "id": "evercore",
        "label": "Evercore spring week alumni",
        "keywords": "spring week OR insight week OR internship",
        "past_company": "Evercore",
        "geography": "United Kingdom",
    },
    {
        "id": "kpmg",
        "label": "KPMG spring week alumni",
        "keywords": "spring week OR vacation scheme",
        "past_company": "KPMG",
        "geography": "United Kingdom",
    },
    {
        "id": "js",
        "label": "Jane Street internship alumni",
        "keywords": "internship OR spring week",
        "past_company": "Jane Street",
        "geography": "United Kingdom",
    },
    {
        "id": "br",
        "label": "BlackRock spring week alumni",
        "keywords": "spring week OR internship",
        "past_company": "BlackRock",
        "geography": "United Kingdom",
    },
    {
        "id": "pimco",
        "label": "Pimco internship alumni",
        "keywords": "internship OR spring week",
        "past_company": "PIMCO",
        "geography": "United Kingdom",
    },
    # --- SECTOR GAP SEARCHES ---
    {
        "id": "law",
        "label": "Magic Circle law spring week / vacation scheme",
        "keywords": "spring week OR vacation scheme OR insight scheme",
        "past_company": "Freshfields OR Clifford Chance OR Linklaters OR Allen & Overy OR Slaughter and May",
        "geography": "United Kingdom",
    },
    {
        "id": "tech",
        "label": "Tech spring week / internship (Bloomberg, Google etc)",
        "keywords": "spring week OR internship converted",
        "past_company": "Bloomberg OR Google OR Palantir",
        "geography": "United Kingdom",
    },
    # --- DIVERSITY SEARCHES ---
    {
        "id": "women_ib",
        "label": "Women in IB spring weeks",
        "keywords": "spring week return offer",
        "past_company": "Goldman Sachs OR JPMorgan OR Morgan Stanley OR Barclays OR Citi",
        "geography": "United Kingdom",
        "note": "Filter for female profiles in results",
    },
    {
        "id": "dark_horse",
        "label": "Non-target uni students with top spring weeks",
        "keywords": "spring week return offer OR converted",
        "past_company": "Goldman Sachs OR JPMorgan OR Morgan Stanley OR Barclays OR Citi OR Deutsche Bank OR UBS",
        "school": "Exeter OR Bath OR Durham OR St Andrews OR Birmingham OR Nottingham OR Bristol OR Manchester OR Leeds OR Sheffield OR Newcastle OR Glasgow OR Edinburgh OR Lancaster OR York OR Southampton OR Leicester OR Cardiff OR Aston OR Coventry OR Surrey OR Kent",
        "geography": "United Kingdom",
    },
    # --- HIGH VALUE CONVERSION SEARCHES ---
    {
        "id": "multi_convert",
        "label": "People with 2+ spring weeks (multi-converters)",
        "keywords": "spring week return offer summer internship",
        "geography": "United Kingdom",
    },
    {
        "id": "quant_convert",
        "label": "Quant/trading spring weeks",
        "keywords": "spring week OR internship",
        "past_company": "Citadel OR Millennium OR Optiver OR Two Sigma OR DE Shaw OR IMC OR SIG",
        "geography": "United Kingdom",
    },
]

# Regular LinkedIn search queries (fallback if no Sales Nav)
REGULAR_SEARCHES = config.SEARCH_QUERIES


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def load_candidates():
    if os.path.exists(CANDIDATES_FILE):
        try:
            with open(CANDIDATES_FILE) as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return []
    return []


def save_candidates(candidates):
    tmp = CANDIDATES_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(candidates, f, indent=2)
    os.replace(tmp, CANDIDATES_FILE)


def load_progress():
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE) as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    return {"completed": []}


def save_progress(progress):
    with open(PROGRESS_FILE, "w") as f:
        json.dump(progress, f, indent=2)


def names_match(a, b):
    if not a or not b:
        return False
    a, b = a.strip().lower(), b.strip().lower()
    if a == b:
        return True
    ap, bp = a.split(), b.split()
    if (len(ap) == 1 or len(bp) == 1) and ap[0] == bp[0]:
        return True
    return SequenceMatcher(None, a, b).ratio() >= NAME_SIM_THRESHOLD


def is_existing(name):
    return any(names_match(name, s["name"]) for s in config.EXISTING_SPEAKERS)


def dedup(candidates):
    unique = []
    for c in candidates:
        cn = c.get("name", "")
        dup_idx = None
        for i, u in enumerate(unique):
            if names_match(cn, u.get("name", "")):
                dup_idx = i
                break
        if dup_idx is not None:
            new_f = sum(1 for v in c.values() if v)
            old_f = sum(1 for v in unique[dup_idx].values() if v)
            if new_f > old_f:
                unique[dup_idx] = c
        else:
            unique.append(c)
    return unique


def parse_results(raw):
    if not raw:
        return []
    text = raw.strip()
    try:
        p = json.loads(text)
        return p if isinstance(p, list) else [p] if isinstance(p, dict) else []
    except json.JSONDecodeError:
        pass
    import re
    for m in re.findall(r'\[[\s\S]*?\]', text):
        try:
            p = json.loads(m)
            if isinstance(p, list):
                return p
        except json.JSONDecodeError:
            continue
    results = []
    for m in re.findall(r'\{[\s\S]*?\}', text):
        try:
            p = json.loads(m)
            if isinstance(p, dict) and "name" in p:
                results.append(p)
        except json.JSONDecodeError:
            continue
    return results


def normalize(raw, source=""):
    firms = raw.get("firms", [])
    if isinstance(firms, str):
        firms = [f.strip() for f in firms.split(",") if f.strip()]
    fc = raw.get("follower_count") or raw.get("followers")
    if isinstance(fc, str):
        fc = fc.replace(",", "").replace("+", "")
        try:
            fc = int(fc)
        except ValueError:
            fc = None
    return {
        "name": (raw.get("name") or "").strip(),
        "headline": (raw.get("headline") or "").strip(),
        "firms": firms,
        "university": (raw.get("university") or "").strip() or None,
        "linkedin_url": (raw.get("linkedin_url") or raw.get("url") or "").strip() or None,
        "follower_count": fc,
        "gender": (raw.get("gender") or raw.get("gender_signal") or "").strip() or None,
        "has_conversion": raw.get("has_conversion", False),
        "conversion_detail": (raw.get("conversion_detail") or raw.get("conversion") or "").strip() or None,
        "source_query": source,
        "sourced_at": datetime.now(timezone.utc).isoformat(),
    }


# ---------------------------------------------------------------------------
# Browser-use agent
# ---------------------------------------------------------------------------
async def ensure_logged_in(browser, llm):
    """Navigate to LinkedIn, wait for login if needed."""
    from browser_use import Agent

    print("\nChecking LinkedIn login...")
    agent = Agent(
        task=(
            "Go to https://www.linkedin.com/feed/. "
            "Wait for the page to fully load. "
            "If you see a login/sign-in page, respond with exactly 'LOGIN_REQUIRED'. "
            "If you see the LinkedIn feed (posts, updates), respond with exactly 'LOGGED_IN'."
        ),
        llm=llm,
        browser=browser,
        max_actions_per_step=3,
    )
    try:
        result = await agent.run(max_steps=10)
        text = ""
        if hasattr(result, "final_result"):
            text = result.final_result() if callable(result.final_result) else str(result.final_result)
        elif result:
            text = str(result)

        if "LOGIN" in text.upper() and "REQUIRED" in text.upper():
            print("\n" + "=" * 60)
            print("  LINKEDIN LOGIN REQUIRED")
            print("  Log in to LinkedIn in the browser window.")
            print("  Then press ENTER here to continue...")
            print("=" * 60)
            input()
            print("  Continuing...\n")
        else:
            print("  Already logged in.\n")
    except Exception as e:
        print(f"  Could not check login: {e}")
        print("  If needed, log in manually. Press ENTER to continue...")
        input()


async def run_sales_nav_search(search, browser, llm, existing_names):
    """Run a single Sales Navigator search."""
    from browser_use import Agent

    label = search["label"]
    keywords = search.get("keywords", "")
    past_company = search.get("past_company", "")
    school = search.get("school", "")
    geography = search.get("geography", "United Kingdom")
    note = search.get("note", "")

    filter_instructions = []
    if keywords:
        filter_instructions.append(f'In the Keywords field, type: {keywords}')
    if past_company:
        filter_instructions.append(f'In the "Past company" filter, search for and select: {past_company}')
    if school:
        filter_instructions.append(f'In the "School" filter, search for and select: {school}')
    if geography:
        filter_instructions.append(f'In the "Geography" filter, search for and select: {geography}')

    filters_text = "\n".join(f"  {i+1}. {inst}" for i, inst in enumerate(filter_instructions))

    extra = ""
    if note:
        extra = f"\nAdditional instruction: {note}"

    task = f"""
Go to LinkedIn Sales Navigator search: https://www.linkedin.com/sales/search/people

Apply these search filters:
{filters_text}
{extra}

Wait for results to load. Then look through the first 2 pages of results (click "Next" if available).

For EACH person in the results, extract:
- Full name
- Headline (their current title/role)
- Firms they've worked at (especially spring weeks, internships, insight weeks)
- University (if visible in their headline or profile snippet)
- Their LinkedIn profile URL
- Gender (guess from name/photo — M or F, or unknown)
- Whether they appear to have converted their spring week into a return offer or summer internship (look for clues in headline like "incoming", "returning", "summer analyst", etc.)

Skip anyone whose name matches: {existing_names}
Skip anyone who is clearly not a UK university student or recent graduate.

IMPORTANT: Return your findings as a valid JSON array. Each object must have:
- "name": string
- "headline": string
- "firms": [array of firm names]
- "university": string or null
- "linkedin_url": string
- "gender": "M" or "F" or "unknown"
- "has_conversion": true/false
- "conversion_detail": string describing the conversion, or null

If no results found, return: []
Return ONLY the JSON array.
"""

    print(f"\n  Searching: {label}")
    try:
        agent = Agent(task=task, llm=llm, browser=browser, max_actions_per_step=5)
        result = await agent.run(max_steps=35)

        raw = ""
        if hasattr(result, "final_result"):
            raw = result.final_result() if callable(result.final_result) else str(result.final_result)
        elif result and hasattr(result, "history"):
            for entry in reversed(result.history):
                if hasattr(entry, "result") and entry.result:
                    for r in entry.result:
                        if hasattr(r, "extracted_content") and r.extracted_content:
                            raw = r.extracted_content
                            break
                    if raw:
                        break
        if not raw and result:
            raw = str(result)

        candidates = parse_results(raw)
        print(f"    Found {len(candidates)} candidate(s)")
        return candidates

    except Exception as e:
        print(f"    ERROR: {e}")
        return []


async def run_regular_search(query, idx, total, browser, llm, existing_names):
    """Run a regular LinkedIn search (fallback)."""
    from browser_use import Agent

    task = f"""
Go to LinkedIn and search for: {query}

Click on the search bar, type the query, press Enter.
After results load, click the "Posts" tab. If no "Posts" tab, try "People".

For each relevant result on the first 2 pages:
1. Extract: full name, headline, firms (spring weeks/internships), university, LinkedIn URL
2. Skip non-UK students and existing speakers: {existing_names}
3. Try to determine gender (M/F/unknown) from name/photo
4. Note if they mention converting spring week to return offer or summer internship

Return as JSON array with keys: name, headline, firms, university, linkedin_url, gender, has_conversion, conversion_detail
If no results, return: []
Return ONLY the JSON array.
"""

    print(f"\n  [{idx+1}/{total}] {query[:60]}...")
    try:
        agent = Agent(task=task, llm=llm, browser=browser, max_actions_per_step=5)
        result = await agent.run(max_steps=30)

        raw = ""
        if hasattr(result, "final_result"):
            raw = result.final_result() if callable(result.final_result) else str(result.final_result)
        elif result:
            raw = str(result)

        candidates = parse_results(raw)
        print(f"    Found {len(candidates)} candidate(s)")
        return candidates

    except Exception as e:
        print(f"    ERROR: {e}")
        return []


async def main_async(args):
    from browser_use import Browser
    from browser_use.browser.browser import BrowserConfig
    from langchain_anthropic import ChatAnthropic

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("ERROR: ANTHROPIC_API_KEY not set.")
        print("Run:  export ANTHROPIC_API_KEY='sk-ant-...'")
        sys.exit(1)

    llm = ChatAnthropic(model_name="claude-sonnet-4-20250514", timeout=60, stop=None, temperature=0.0)
    browser = Browser(config=BrowserConfig(headless=False))
    existing_names = [s["name"] for s in config.EXISTING_SPEAKERS]

    all_candidates = load_candidates()
    progress = load_progress()

    use_sales_nav = not args.regular

    if use_sales_nav:
        searches = SALES_NAV_SEARCHES
        search_ids = [s["id"] for s in searches]
    else:
        searches = REGULAR_SEARCHES
        search_ids = [str(i) for i in range(len(searches))]

    # Filter to only uncompleted searches (unless --reset)
    if args.resume:
        completed = set(progress.get("completed", []))
        to_run = [(i, s) for i, s in enumerate(searches) if (search_ids[i] not in completed)]
        if not to_run:
            print("All searches already completed! Run with --reset to start fresh.")
            return
        print(f"Resuming: {len(to_run)} searches remaining ({len(completed)} already done)")
    else:
        to_run = list(enumerate(searches))
        progress = {"completed": []}
        save_progress(progress)

    if args.max_searches:
        to_run = to_run[:args.max_searches]

    # Print plan
    print("=" * 60)
    print("  EARLYEDGE SPEAKER SOURCER")
    print("  " + ("Sales Navigator" if use_sales_nav else "Regular LinkedIn"))
    print("=" * 60)
    print(f"  Searches to run: {len(to_run)}")
    print(f"  Gap firms: {', '.join(config.GAP_FIRMS[:5])}...")
    print(f"  Existing speakers: {len(config.EXISTING_SPEAKERS)}")
    print("=" * 60)

    # Login check
    await ensure_logged_in(browser, llm)

    # Run searches
    for run_idx, (search_idx, search) in enumerate(to_run):
        sid = search_ids[search_idx] if search_idx < len(search_ids) else str(search_idx)

        # Delay between searches
        if run_idx > 0:
            delay = random.randint(DELAY_MIN, DELAY_MAX)
            print(f"\n  Waiting {delay}s (rate limiting)...")
            await asyncio.sleep(delay)

        # Run the search
        if use_sales_nav:
            new = await run_sales_nav_search(search, browser, llm, existing_names)
            source = search.get("label", sid)
        else:
            new = await run_regular_search(search, search_idx, len(searches), browser, llm, existing_names)
            source = search if isinstance(search, str) else str(search)

        # Normalize and filter
        for raw in new:
            c = normalize(raw, source=source)
            if not c["name"] or is_existing(c["name"]):
                continue
            all_candidates.append(c)

        all_candidates = dedup(all_candidates)
        save_candidates(all_candidates)

        progress["completed"].append(sid)
        save_progress(progress)

        print(f"    Total so far: {len(all_candidates)} unique candidates")

    # Close browser
    try:
        await browser.close()
    except Exception:
        pass

    # Final summary
    gap_lower = {g.lower() for g in config.GAP_FIRMS}
    from_gap = [c for c in all_candidates if any(f.lower() in gap_lower for f in c.get("firms", []))]
    women = [c for c in all_candidates if (c.get("gender") or "").upper() in ("F", "FEMALE")]
    converted = [c for c in all_candidates if c.get("has_conversion")]

    print("\n" + "=" * 60)
    print("  SOURCING COMPLETE")
    print("=" * 60)
    print(f"  Total candidates:     {len(all_candidates)}")
    print(f"  From gap firms:       {len(from_gap)}")
    print(f"  Female candidates:    {len(women)}")
    print(f"  With conversions:     {len(converted)}")
    print(f"  Saved to:             candidates.json")
    print()
    print("  NEXT STEPS:")
    print("    python3 02_scorer.py          # Score & rank them")
    print("    python3 03_dm_generator.py    # Generate DMs")
    print("    python3 06_daily_dashboard.py # See full status")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="AI LinkedIn sourcer for spring week speakers")
    parser.add_argument("--max-searches", type=int, help="Max searches to run")
    parser.add_argument("--regular", action="store_true", help="Use regular LinkedIn instead of Sales Navigator")
    parser.add_argument("--resume", action="store_true", help="Resume from where you left off")
    parser.add_argument("--reset", action="store_true", help="Clear progress and start fresh")
    args = parser.parse_args()

    if args.reset and os.path.exists(PROGRESS_FILE):
        os.remove(PROGRESS_FILE)
        print("Progress cleared.\n")

    asyncio.run(main_async(args))


if __name__ == "__main__":
    main()
