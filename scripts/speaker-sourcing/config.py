"""
Shared configuration for the speaker sourcing workflow.
Single source of truth for firms, scoring, search queries, and existing speakers.
"""

# === GAP FIRMS (no speaker yet, prioritised by spring week timing) ===
# Priority 1: Upcoming spring weeks with NO speaker coverage
GAP_FIRMS_CRITICAL = [
    "Rothschild",       # April 23 - NOBODY covers this
    "BlackRock",        # April, London - NOBODY covers this
]
# Priority 2: Upcoming spring weeks, partially covered but more depth needed
GAP_FIRMS_HIGH = [
    "JPMorgan",         # w/c April 13/20 - Matthias + Nadiya cover
    "Lazard",           # April - Kishan + Hassan cover
    "Evercore",         # April - Ayo + Kishan cover
    "Jane Street",      # April 13-18 - Joel covers
]
# Priority 3: Done spring weeks or later dates (still useful for "how I got in")
GAP_FIRMS_LOW = [
    "Goldman Sachs",    # DONE (March) - Kishan + Hassan cover
    "Deutsche Bank",    # DONE (March) - Ayo + Mya cover
    "BNP Paribas",      # DONE (April 7-10) - deprioritised
    "KPMG",             # June - Matthias covers
    "Pimco",            # No UK programme - dropped
]
# Priority 4: Law firms - SEPARATE EVENT (Vac Scheme Conversion Webinar)
# Not part of the 3-night spring week webinar. Sourcing separately.
# KEY CORRECTIONS:
#   - Clifford Chance: REMOVED - no spring vac scheme (SPARK is May, work exp is summer)
#   - Slaughter and May: REMOVED - "Spring Forward" is a 1st-year diversity programme, NOT a vac scheme
#   - Freshfields: NO spring scheme (summer only Jun-Aug) - but Matthias covers it
# TARGET: 2025 (or earlier) vac scheme graduates who CONVERTED to training contract offers.
# NOT 2026 cohort - they just finished and don't know if they converted yet.
GAP_FIRMS_LAW = [
    "Linklaters",               # Magic Circle
    "A&O Shearman",             # Magic Circle (Allen & Overy)
    "Latham & Watkins",         # US Elite
    "White & Case",             # US Elite
    "Herbert Smith Freehills",  # Silver Circle
    "Baker McKenzie",           # Large International
    "Kirkland & Ellis",         # US Elite
    "Macfarlanes",              # Silver Circle
    "Clifford Chance",          # Magic Circle (no spring scheme but has summer)
    "Skadden",                  # US Elite
    "Weil Gotshal",             # US Elite
    "Paul Weiss",               # US Elite
    "Jones Day",                # US Elite
]
# Combined - law EXCLUDED from main webinar gap list
GAP_FIRMS = GAP_FIRMS_CRITICAL + GAP_FIRMS_HIGH

# === EXISTING SPEAKERS (from Attio pipeline) ===
EXISTING_SPEAKERS = [
    # === WEBINAR 1 SPEAKERS (need to re-ask for 3-night weekend intensive) ===
    {"name": "Jason", "firms": ["Jefferies", "Nomura", "Citi"], "confirmed": False, "conversion": "Citi return offer", "gender": "M", "record_id": "23e02026-64bc-4763-a1ff-b44b60f6d745", "status": "re-ask"},
    {"name": "Indiana", "firms": ["HSBC", "UBS"], "confirmed": False, "conversion": "BOA return offer", "gender": "F", "record_id": "149f02a3-93cf-47b7-ae74-94a4341b203f", "status": "re-ask"},
    {"name": "Ishaq", "firms": ["RBC AM", "HSBC", "Carlyle", "Deloitte", "OC&C"], "confirmed": False, "conversion": "Summer internship offers (HSBC, Carlyle, Deloitte, OC&C). No offer from RBC.", "gender": "M", "record_id": "ed7166c8-ce68-4298-a975-bcfe6c59a08a", "status": "re-ask"},
    {"name": "Danyaal", "firms": ["McKinsey", "Schroders"], "confirmed": False, "conversion": None, "gender": "M", "record_id": "3d4abe64-6572-4cbb-948a-9b348d09093d", "status": "re-ask"},
    {"name": "Dylan", "firms": ["Morgan Stanley", "Maven"], "confirmed": False, "conversion": "Co-founder", "gender": "M", "record_id": "c7f2ffd9-19eb-4ef2-96dc-a8b605c98331", "status": "re-ask"},
    {"name": "Ali", "firms": ["EY"], "confirmed": False, "gender": "M", "record_id": "a9022bfe-be2b-4f39-8e1f-82b761b21a1b"},
    {"name": "Mustafa", "firms": ["Schroders"], "confirmed": False, "gender": "M", "record_id": "0a41b3ee-4ab7-4c0b-8be7-fc66c46c2402"},
    {"name": "Jibril", "firms": ["PwC", "Millennium", "Citadel", "Morgan Stanley"], "confirmed": False, "gender": "M", "record_id": "3148022c-dca3-46b7-923d-c13f454cea01"},
    {"name": "Sami", "firms": ["Forvis Mazars"], "confirmed": False, "gender": "M", "record_id": "ab7b7019-7bfa-4c76-85d4-6520a7152967"},
    {"name": "Rahama", "firms": ["BDO"], "confirmed": False, "gender": "F", "record_id": "361e8db0-f194-4427-bc1c-2f653e64b9a6"},
    {"name": "Yuyao Xie", "firms": ["Barclays", "Optiver", "Bank of America", "Millennium"], "confirmed": False, "gender": "F", "record_id": "df6feb65-61f3-48de-9d7b-be7c5ade0277"},
    {"name": "Alexander", "firms": ["Marsh", "McKinsey", "HP", "IBM"], "confirmed": False, "gender": "M", "record_id": "5229f32d-4b23-43ca-ac04-7622943d2002"},
    {"name": "Daniyaal Anwar", "firms": [], "confirmed": False, "gender": "M", "record_id": "24aebeaf-9599-42b2-96d8-47ff06f09f99"},
    # === FRIENDS / ALREADY AVAILABLE (Don's network) ===
    {"name": "Ayo Odeyingbo", "firms": ["Morgan Stanley", "Evercore", "HSBC", "Perella Weinberg", "Deutsche Bank", "Insight Investment"], "confirmed": False, "conversion": None, "gender": "M", "university": "LSE", "available": True},
    {"name": "Joel Fadahunsi", "firms": ["Jane Street", "Bank of America", "EY", "Bain Capital"], "confirmed": False, "conversion": None, "gender": "M", "university": "LSE", "available": True},
    {"name": "Serena Popovici", "firms": ["Nomura", "Royal Bank of Canada", "Dare", "Susquehanna", "Barings", "Houlihan Lokey", "ARC Associates"], "confirmed": False, "conversion": None, "gender": "F", "university": "LSE", "available": True},
    {"name": "Aashay Deole", "firms": ["Barclays", "Houlihan Lokey", "J O Hambro", "Earth Capital"], "confirmed": False, "conversion": None, "gender": "M", "university": "LSE", "available": True},
    {"name": "Matthias Schunemann", "firms": ["Citi", "Susquehanna", "AlphaSights", "Bloomberg", "KPMG", "JPMorgan", "Freshfields"], "confirmed": False, "conversion": None, "gender": "M", "university": "LSE", "available": True},
]

# === SECTORS ===
SECTORS = {
    "Investment Banking": ["Goldman Sachs", "JPMorgan", "Morgan Stanley", "Barclays", "Citi",
                           "HSBC", "Deutsche Bank", "BNP Paribas", "Rothschild", "Lazard",
                           "Evercore", "Jefferies", "Nomura", "UBS", "Bank of America",
                           "Houlihan Lokey", "Moelis"],
    "Quant/Trading": ["Jane Street", "Citadel", "Optiver", "Millennium", "SIG",
                      "Two Sigma", "DE Shaw", "IMC", "Maven Securities"],
    "Sales & Trading": ["Goldman Sachs", "JPMorgan", "Morgan Stanley", "Barclays", "Citi"],
    "Consulting MBB": ["McKinsey", "BCG", "Bain"],
    "Big 4": ["PwC", "Deloitte", "EY", "KPMG"],
    "Asset Management": ["BlackRock", "Schroders", "Pimco", "Fidelity", "Vanguard",
                         "M&G", "RBC AM", "Carlyle", "Insight Investment"],
    "Tech": ["Bloomberg", "Google", "Amazon", "Microsoft", "Meta", "Palantir"],
    "Law": ["Freshfields", "Clifford Chance", "Allen & Overy", "Linklaters",
            "Slaughter and May", "Latham & Watkins", "White & Case",
            "Herbert Smith Freehills", "Baker McKenzie", "Macfarlanes",
            "Davis Polk", "Skadden", "Weil Gotshal", "Dentons", "Bird & Bird",
            "Mayer Brown", "Sidley Austin", "Kirkland & Ellis", "Cleary Gottlieb"],
    "PE": ["Blackstone", "Carlyle", "KKR", "Apollo", "Warburg Pincus"],
    "Economic Consulting": ["Compass Lexecon", "NERA", "Oxera", "FTI Consulting"],
}

# === TARGET UNIVERSITIES ===
LSE_NAMES = ["LSE", "London School of Economics"]
HIGH_VALUE_UNIS = ["Imperial", "UCL", "Warwick", "Oxford", "Cambridge"]
DARK_HORSE_UNIS = ["Exeter", "Bath", "St Andrews", "Leeds", "Sheffield", "Cardiff",
                   "Queen Mary", "Aston", "Coventry", "DMU", "Kent", "Surrey",
                   "Southampton", "Leicester", "Newcastle", "Glasgow", "Edinburgh",
                   "Durham", "Lancaster", "York"]

# === SCORING WEIGHTS ===
WEIGHTS = {
    "fills_gap_firm": 30,
    "confirmed_conversion": 25,
    "gender_diversity": 15,
    "university_diversity": 10,
    "dark_horse_bonus": 10,
    "sector_gap": 5,
    "follower_1k": 3,
    "follower_5k": 5,
    "lse_penalty": -5,
}

# === LINKEDIN SEARCH QUERIES ===
SEARCH_QUERIES = [
    # Multi-spring-week converters (highest priority, fewer speakers, more firms)
    "incoming summer analyst spring week 2025",
    "spring week return offer incoming summer intern",
    "multiple spring weeks investment banking",
    # Gap firm searches
    "Goldman Sachs spring week",
    "JPMorgan spring week",
    "Deutsche Bank spring week",
    "Jane Street internship UK",
    "BlackRock spring week",
    "KPMG spring week",
    "Rothschild spring insight",
    "Lazard spring week",
    "Evercore spring week",
    "BNP Paribas spring week",
    # Conversion-focused
    "spring week summer internship return offer",
    "spring week converted investment banking",
    # Non-target uni dark horses
    "spring week investment banking Exeter OR Bath OR Durham",
    "spring week investment banking Birmingham OR Nottingham OR Bristol",
    # Sector gaps - IB
    "vacation scheme Freshfields OR Clifford Chance OR Linklaters",
    # === LAW - Target 2025 vac scheme grads who CONVERTED to training contracts ===
    "training contract offer 2025 vacation scheme",
    "vacation scheme converted training contract offer 2025",
    "training contract offer Linklaters OR Clifford Chance OR Allen Overy 2025",
    "training contract offer Latham Watkins OR White Case OR Herbert Smith 2025",
    "training contract offer Kirkland Ellis OR Skadden OR Baker McKenzie 2025",
    "vacation scheme magic circle training contract 2025",
    "future trainee 2027 vacation scheme 2025",
    "vacation scheme Macfarlanes OR Weil OR Paul Weiss training contract",
    # === CONSULTING - Insight programme speakers ===
    "BCG insight programme London 2025 2026",
    "McKinsey discover UK spring insight",
    "Bain spring insight programme UK",
    "Oliver Wyman insight day London",
    "Deloitte spring into programme",
    # === ASSET MANAGEMENT / PE ===
    "BlackRock spring insight London",
    "Blackstone spring insight EMEA",
    "Fidelity spring insight programme London",
    # === CROSS-INDUSTRY converters ===
    "spring week converted return offer 2025",
    "insight programme summer internship offer UK",
    # === Diversity & dark horse - LAW ===
    "vacation scheme training contract Exeter OR Bath OR Durham OR Nottingham",
    "vacation scheme female training contract 2025 2026",
]

# === DM TEMPLATES ===
DM_PANEL_SPEAKER = """Hey {first_name}! I came across your profile and saw you did a spring week at {primary_firm}{conversion_note}. Really impressive.

I'm building EarlyEdge, we run live webinars where students who've been through spring weeks share their experience with students who haven't. Our last cold email webinar had 100+ attendees.

We're putting together a 2-part panel on spring week conversions, how to actually turn a spring week into a return offer. Would you be open to being on the panel? It's a ~15 min segment + Q&A, on Zoom, and we'd love to have someone with {their_value}.

Happy to jump on a quick call if easier. No worries either way!"""

DM_PLAYBOOK_CONTRIBUTOR = """Hey {first_name}! Saw you completed a spring week at {primary_firm}, love to hear about that.

We're putting together The Spring Week Playbook, a guide where students who've done spring weeks write up what the programme involved, insider tips, and advice for future applicants. Would you be interested in contributing a short write-up about your {primary_firm} experience?

It's pretty quick, just 500-800 words on what your spring week was like and any tips. Your name + uni would be credited. Let me know if you'd be up for it!"""

DM_LAW_SPEAKER = """Hey {first_name}! I saw you did a vacation scheme at {primary_firm}{conversion_note}. That's amazing.

I'm building EarlyEdge, we run live webinars where students who've been through spring weeks and vac schemes share their experience. Our last event had 100+ attendees.

We're running a Vac Scheme Conversion Webinar dedicated to law. Would you be up for a ~12 min panel slot sharing your {primary_firm} vac scheme experience + Q&A?

It's on Zoom, totally relaxed. Happy to jump on a quick call if easier!"""

DM_CONSULTING_SPEAKER = """Hey {first_name}! Saw you did an insight programme at {primary_firm}. Love to see it.

I'm building EarlyEdge, we help students break into competitive careers through live panels and coaching. We're running a 3-night Spring Week Conversion Webinar and Night 2 covers Consulting, Big 4 & Asset Management.

Would you be open to joining as a speaker? It's a ~12 min segment + Q&A on Zoom. Would love someone with your {primary_firm} experience on the panel!"""

DM_FOLLOWUP = """Hey {first_name}! Just following up on my message, would love to chat about the spring week panel if you're interested. No pressure either way!"""

# === ATTIO CONFIG ===
ATTIO_SPEAKER_LIST = "speaker_recruitment"
ATTIO_STAGES = ["Sourced", "DM Sent", "Replied", "Interested", "Terms Agreed", "Confirmed", "Webinar Done", "Active Coach"]


def get_covered_firms():
    """Get all firms already covered by existing speakers."""
    covered = set()
    for s in EXISTING_SPEAKERS:
        for f in s["firms"]:
            covered.add(f.lower())
    return covered


def get_covered_sectors():
    """Get all sectors covered by existing speakers."""
    covered = set()
    all_firms = set()
    for s in EXISTING_SPEAKERS:
        for f in s["firms"]:
            all_firms.add(f.lower())
    for sector, firms in SECTORS.items():
        if any(f.lower() in all_firms for f in firms):
            covered.add(sector)
    return covered


def get_sectors_for_firms(firms):
    """Get which sectors a list of firms covers."""
    sectors = set()
    for sector, sector_firms in SECTORS.items():
        if any(f.lower() in [sf.lower() for sf in sector_firms] for f in firms):
            sectors.add(sector)
    return sectors
