"""
Speaker Handbook Question Generator + Response Compiler

This system:
1. Generates personalised question sets for each speaker (based on their firms)
2. Outputs copy-paste messages you send to speakers
3. Takes their responses and compiles them into handbook chapters
4. Claude polishes but keeps their voice

Usage:
    python speaker_questions.py generate          # Generate question messages for all speakers
    python speaker_questions.py generate "Jason"   # Generate for one speaker
    python speaker_questions.py compile            # Compile all responses into handbook
    python speaker_questions.py status             # See who's responded
"""

import json
import os
import sys
from pathlib import Path

# Add parent dir for config import
sys.path.insert(0, str(Path(__file__).parent.parent / "speaker-sourcing"))
from config import EXISTING_SPEAKERS, SECTORS

RESPONSES_DIR = Path(__file__).parent / "responses"
OUTPUT_DIR = Path(__file__).parent / "output"


# === QUESTION BANK ===
# Core questions every speaker answers (about their PRIMARY assigned firm)
CORE_QUESTIONS = [
    {
        "id": "what_happened",
        "question": "Walk us through your {firm} spring week/vac scheme day by day. What actually happened? What did you do each day?",
        "why": "Students want to know what to expect. Real detail beats generic descriptions.",
    },
    {
        "id": "stand_out",
        "question": "What did you do during the week that you think helped you stand out? Be honest, even if it felt small at the time.",
        "why": "Actionable insider tips.",
    },
    {
        "id": "wish_known",
        "question": "What do you wish you'd known before your first day at {firm}? What would you tell your past self?",
        "why": "Gold. This is what students pay for.",
    },
    {
        "id": "mistake",
        "question": "Did you make any mistakes during the week, or see someone else make one? What happened?",
        "why": "Learning from others' mistakes is invaluable.",
    },
    {
        "id": "conversion",
        "question": "Did you get a return offer (summer internship or full-time)? If yes, when did they tell you and what do you think sealed it? If no, what do you think you'd do differently?",
        "why": "The conversion question. THE reason people buy this handbook.",
    },
    {
        "id": "culture",
        "question": "How would you describe the culture at {firm}? What surprised you about the people there?",
        "why": "Culture insight you can't get from a website.",
    },
    {
        "id": "one_tip",
        "question": "If you could give ONE tip to someone starting their {firm} spring week next Monday, what would it be?",
        "why": "The headline quote for their chapter.",
    },
]

# Bonus questions for speakers with multiple firms
COMPARISON_QUESTIONS = [
    {
        "id": "compare",
        "question": "You did spring weeks at {firms_list}. How did they compare? Which was the best experience and why?",
        "why": "Cross-firm comparison is extremely valuable.",
    },
    {
        "id": "different_vibes",
        "question": "Did the firms have different vibes/cultures? Like, was one more intense than another? More friendly?",
        "why": "Students choosing between firms need this.",
    },
]

# Questions for people who converted
CONVERSION_QUESTIONS = [
    {
        "id": "follow_up",
        "question": "After the spring week ended, what did you do to follow up? Did you send thank you emails, LinkedIn messages, anything?",
        "why": "The follow-up playbook.",
    },
    {
        "id": "timeline",
        "question": "What was the timeline from spring week to getting the offer? When did you hear back?",
        "why": "Reduces anxiety. Students want to know when to expect news.",
    },
]

# Questions for law vac scheme speakers
LAW_QUESTIONS = [
    {
        "id": "seat_rotations",
        "question": "Which seats/departments did you rotate through during your vac scheme at {firm}? Which was your favourite and why?",
        "why": "Law students need to know about seat options.",
    },
    {
        "id": "assessed_exercise",
        "question": "Was there an assessed exercise or presentation? What was it and how did you prepare?",
        "why": "Vac scheme assessment is THE stress point for law students.",
    },
    {
        "id": "tc_offer",
        "question": "Did you get a training contract offer? When did they tell you, and was it during the scheme or after?",
        "why": "The TC offer is the law equivalent of a return offer.",
    },
]

# Quick-fire round (fun, builds personality in the chapter)
QUICKFIRE = [
    {"id": "qf_dress", "question": "What did you wear on day 1?"},
    {"id": "qf_lunch", "question": "Best thing about the free lunches/socials?"},
    {"id": "qf_awkward", "question": "Most awkward moment of the week?"},
    {"id": "qf_surprised", "question": "What surprised you most?"},
    {"id": "qf_worth_it", "question": "Was it worth it? Scale of 1-10."},
]


def get_speaker_sector(firms):
    """Determine if a speaker is law, consulting, trading, or finance."""
    law_firms = set(f.lower() for f in SECTORS.get("Law", []))
    consulting_firms = set(f.lower() for f in SECTORS.get("Consulting MBB", []) + SECTORS.get("Big 4", []))
    trading_firms = set(f.lower() for f in SECTORS.get("Quant/Trading", []))

    speaker_firms_lower = [f.lower() for f in firms]

    if any(f in law_firms for f in speaker_firms_lower):
        return "law"
    if any(f in consulting_firms for f in speaker_firms_lower):
        return "consulting"
    if any(f in trading_firms for f in speaker_firms_lower):
        return "trading"
    return "finance"


def generate_questions_for_speaker(speaker):
    """Generate a personalised question set for a speaker."""
    name = speaker["name"]
    firms = speaker["firms"]
    primary_firm = firms[0] if firms else "your firm"
    has_conversion = speaker.get("conversion") is not None
    sector = get_speaker_sector(firms)

    questions = []

    # Core questions (personalised with their firm name)
    for q in CORE_QUESTIONS:
        questions.append({
            "id": q["id"],
            "question": q["question"].format(firm=primary_firm),
        })

    # Multi-firm comparison questions
    if len(firms) > 1:
        firms_list = ", ".join(firms)
        for q in COMPARISON_QUESTIONS:
            questions.append({
                "id": q["id"],
                "question": q["question"].format(firms_list=firms_list),
            })

    # Conversion questions
    if has_conversion:
        for q in CONVERSION_QUESTIONS:
            questions.append({
                "id": q["id"],
                "question": q["question"],
            })

    # Law-specific questions
    if sector == "law":
        for q in LAW_QUESTIONS:
            questions.append({
                "id": q["id"],
                "question": q["question"].format(firm=primary_firm),
            })

    # Quick-fire round
    for q in QUICKFIRE:
        questions.append({
            "id": q["id"],
            "question": q["question"],
        })

    return questions


def format_message_for_speaker(speaker):
    """Generate a copy-paste message to send to a speaker."""
    name = speaker["name"].split()[0]  # First name only
    firms = speaker["firms"]
    primary = firms[0] if firms else "your firm"
    questions = generate_questions_for_speaker(speaker)

    # Split into main questions and quickfire
    main_qs = [q for q in questions if not q["id"].startswith("qf_")]
    quickfire_qs = [q for q in questions if q["id"].startswith("qf_")]

    msg = f"""Hey {name}! Thanks for being part of the panel.

We're putting together The Spring Week Conversion Handbook, a guide packed with real insider tips from people who've actually done spring weeks. Your chapter would cover {primary}{' (plus comparisons with ' + ', '.join(firms[1:]) + ')' if len(firms) > 1 else ''}.

Could you answer these questions for us? Just voice note or type, whatever's easier. Doesn't need to be polished, we'll clean it up. Your name and uni get credited.

"""

    for i, q in enumerate(main_qs, 1):
        msg += f"{i}. {q['question']}\n\n"

    msg += """QUICK-FIRE ROUND (one-liners are fine):

"""

    for q in quickfire_qs:
        msg += f"- {q['question']}\n"

    msg += """
No pressure on length. A few sentences per question is great, a few paragraphs is even better. Whatever feels natural.

Aim to get this back to us by [DATE]. Cheers!"""

    return msg


def save_response(speaker_name, responses):
    """Save a speaker's responses to a JSON file."""
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    filename = speaker_name.lower().replace(" ", "_") + ".json"
    filepath = RESPONSES_DIR / filename

    data = {
        "speaker_name": speaker_name,
        "responses": responses,
        "status": "received",
    }

    with open(filepath, "w") as f:
        json.dump(data, f, indent=2)

    print(f"Saved response for {speaker_name} to {filepath}")


def compile_chapter(speaker, responses):
    """
    Compile a speaker's responses into a handbook chapter.
    Returns markdown content preserving their voice.
    """
    name = speaker["name"]
    firms = speaker["firms"]
    primary = firms[0] if firms else "Unknown"
    uni = speaker.get("university", "")
    gender = speaker.get("gender", "")
    conversion = speaker.get("conversion", "")

    # Header
    chapter = f"## {name} | {primary}"
    if len(firms) > 1:
        chapter += f" (+ {', '.join(firms[1:])})"
    chapter += "\n\n"

    if uni:
        chapter += f"**University:** {uni}\n"
    if conversion:
        chapter += f"**Outcome:** {conversion}\n"
    chapter += "\n"

    # Pull the "one tip" as a highlighted quote
    one_tip = responses.get("one_tip", "")
    if one_tip:
        chapter += f"> \"{one_tip}\"\n\n"

    # Day by day section
    what_happened = responses.get("what_happened", "")
    if what_happened:
        chapter += f"### What Actually Happens at {primary}\n\n"
        chapter += f"{what_happened}\n\n"

    # How to stand out
    stand_out = responses.get("stand_out", "")
    if stand_out:
        chapter += f"### How to Stand Out\n\n"
        chapter += f"{stand_out}\n\n"

    # What they wish they knew
    wish_known = responses.get("wish_known", "")
    if wish_known:
        chapter += f"### What I Wish I Knew\n\n"
        chapter += f"{wish_known}\n\n"

    # Mistakes
    mistake = responses.get("mistake", "")
    if mistake:
        chapter += f"### Mistakes to Avoid\n\n"
        chapter += f"{mistake}\n\n"

    # Culture
    culture = responses.get("culture", "")
    if culture:
        chapter += f"### The Culture at {primary}\n\n"
        chapter += f"{culture}\n\n"

    # Conversion
    conv_response = responses.get("conversion", "")
    if conv_response:
        chapter += f"### The Return Offer\n\n"
        chapter += f"{conv_response}\n\n"

    # Follow up
    follow_up = responses.get("follow_up", "")
    if follow_up:
        chapter += f"### Follow-Up Strategy\n\n"
        chapter += f"{follow_up}\n\n"

    # Timeline
    timeline = responses.get("timeline", "")
    if timeline:
        chapter += f"### Timeline\n\n"
        chapter += f"{timeline}\n\n"

    # Comparison (multi-firm speakers)
    compare = responses.get("compare", "")
    if compare:
        chapter += f"### Comparing Firms\n\n"
        chapter += f"{compare}\n\n"

    different_vibes = responses.get("different_vibes", "")
    if different_vibes:
        chapter += f"### Different Vibes\n\n"
        chapter += f"{different_vibes}\n\n"

    # Law-specific
    seat_rotations = responses.get("seat_rotations", "")
    if seat_rotations:
        chapter += f"### Seat Rotations\n\n"
        chapter += f"{seat_rotations}\n\n"

    assessed = responses.get("assessed_exercise", "")
    if assessed:
        chapter += f"### The Assessed Exercise\n\n"
        chapter += f"{assessed}\n\n"

    tc_offer = responses.get("tc_offer", "")
    if tc_offer:
        chapter += f"### Training Contract Offer\n\n"
        chapter += f"{tc_offer}\n\n"

    # Quick-fire
    qf_items = []
    qf_map = {
        "qf_dress": "Day 1 outfit",
        "qf_lunch": "Best perk",
        "qf_awkward": "Most awkward moment",
        "qf_surprised": "Biggest surprise",
        "qf_worth_it": "Worth it?",
    }
    for qf_id, label in qf_map.items():
        val = responses.get(qf_id, "")
        if val:
            qf_items.append(f"**{label}:** {val}")

    if qf_items:
        chapter += f"### Quick-Fire\n\n"
        chapter += "\n".join(qf_items) + "\n\n"

    chapter += "---\n\n"

    return chapter


def compile_full_handbook():
    """Compile all speaker responses into the full handbook."""
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    handbook = "# The Spring Week Conversion Handbook 2026\n\n"
    handbook += "*Real insights from real people who did it. Their words, their tips, their mistakes.*\n\n"
    handbook += "**Published by EarlyEdge** | yourearlyedge.co.uk\n\n"
    handbook += "---\n\n"

    # Group speakers by sector for the table of contents
    chapters_by_sector = {
        "Investment Banking": [],
        "Quant/Trading": [],
        "Law": [],
        "Consulting": [],
        "Asset Management": [],
        "Other": [],
    }

    response_files = list(RESPONSES_DIR.glob("*.json"))

    if not response_files:
        print("No responses found yet. Send questions to speakers first.")
        print(f"Response files should go in: {RESPONSES_DIR}")
        return

    compiled_count = 0

    for resp_file in sorted(response_files):
        with open(resp_file) as f:
            data = json.load(f)

        speaker_name = data["speaker_name"]
        responses = data["responses"]

        # Find speaker in config
        speaker = None
        for s in EXISTING_SPEAKERS:
            if s["name"].lower() == speaker_name.lower():
                speaker = s
                break

        if not speaker:
            print(f"Warning: {speaker_name} not found in config. Skipping.")
            continue

        sector = get_speaker_sector(speaker["firms"])
        chapter_content = compile_chapter(speaker, responses)

        sector_key = {
            "finance": "Investment Banking",
            "trading": "Quant/Trading",
            "law": "Law",
            "consulting": "Consulting",
        }.get(sector, "Other")

        chapters_by_sector[sector_key].append({
            "name": speaker_name,
            "content": chapter_content,
        })
        compiled_count += 1

    # Build table of contents
    handbook += "## Contents\n\n"
    chapter_num = 1
    for sector, chapters in chapters_by_sector.items():
        if not chapters:
            continue
        handbook += f"### {sector}\n"
        for ch in chapters:
            handbook += f"{chapter_num}. {ch['name']}\n"
            chapter_num += 1
        handbook += "\n"

    handbook += "---\n\n"

    # Add all chapters
    for sector, chapters in chapters_by_sector.items():
        if not chapters:
            continue
        handbook += f"# Part: {sector}\n\n"
        for ch in chapters:
            handbook += ch["content"]

    # Write output
    output_path = OUTPUT_DIR / "spring_week_handbook_2026.md"
    with open(output_path, "w") as f:
        f.write(handbook)

    print(f"\nHandbook compiled: {output_path}")
    print(f"Chapters: {compiled_count}")
    print(f"Sectors covered: {sum(1 for s, c in chapters_by_sector.items() if c)}")


def show_status():
    """Show which speakers have responded."""
    RESPONSES_DIR.mkdir(parents=True, exist_ok=True)

    all_speakers = [s for s in EXISTING_SPEAKERS if s.get("confirmed") or s.get("available")]
    response_files = {f.stem for f in RESPONSES_DIR.glob("*.json")}

    print("\n=== Handbook Response Status ===\n")

    responded = []
    pending = []

    for s in all_speakers:
        name_key = s["name"].lower().replace(" ", "_")
        if name_key in response_files:
            responded.append(s["name"])
        else:
            pending.append(s["name"])

    print(f"Responded ({len(responded)}/{len(all_speakers)}):")
    for name in responded:
        print(f"  [x] {name}")

    print(f"\nPending ({len(pending)}):")
    for name in pending:
        print(f"  [ ] {name}")


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python speaker_questions.py generate          # Generate all question messages")
        print("  python speaker_questions.py generate \"Jason\"   # Generate for one speaker")
        print("  python speaker_questions.py compile            # Compile handbook from responses")
        print("  python speaker_questions.py status             # Check response status")
        return

    command = sys.argv[1]

    if command == "generate":
        target_name = sys.argv[2] if len(sys.argv) > 2 else None
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        speakers = [s for s in EXISTING_SPEAKERS if s.get("confirmed") or s.get("available")]

        if target_name:
            speakers = [s for s in speakers if s["name"].lower() == target_name.lower()]
            if not speakers:
                print(f"Speaker '{target_name}' not found or not confirmed/available.")
                return

        all_messages = []

        for speaker in speakers:
            msg = format_message_for_speaker(speaker)
            all_messages.append(f"{'='*60}\nTO: {speaker['name']} ({', '.join(speaker['firms'])})\n{'='*60}\n\n{msg}")
            print(f"Generated questions for {speaker['name']} ({len(speaker['firms'])} firms)")

        # Save all messages to a file for easy copy-paste
        output_path = OUTPUT_DIR / "speaker_question_messages.txt"
        with open(output_path, "w") as f:
            f.write("\n\n".join(all_messages))

        print(f"\nAll messages saved to: {output_path}")
        print("Copy-paste each message to the relevant speaker.")

    elif command == "compile":
        compile_full_handbook()

    elif command == "status":
        show_status()

    else:
        print(f"Unknown command: {command}")


if __name__ == "__main__":
    main()
