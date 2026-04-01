"""
Shared configuration for the speaker sourcing workflow.
Single source of truth for firms, scoring, search queries, and existing speakers.
"""

# === GAP FIRMS (no speaker yet) ===
GAP_FIRMS = [
    "Goldman Sachs", "JPMorgan", "Deutsche Bank", "BNP Paribas",
    "Rothschild", "Lazard", "Evercore", "KPMG", "Jane Street",
    "BlackRock", "Pimco",
]

# === EXISTING SPEAKERS (from Attio pipeline) ===
EXISTING_SPEAKERS = [
    {"name": "Jason", "firms": ["Jefferies", "Nomura", "Citi"], "confirmed": True, "conversion": "Citi return offer", "gender": "M", "record_id": "23e02026-64bc-4763-a1ff-b44b60f6d745"},
    {"name": "Indiana", "firms": ["HSBC", "UBS"], "confirmed": True, "conversion": "BOA return offer", "gender": "F", "record_id": "149f02a3-93cf-47b7-ae74-94a4341b203f"},
    {"name": "Ishaq", "firms": ["RBC AM", "HSBC", "Carlyle", "Deloitte", "OC&C"], "confirmed": True, "conversion": "Summer internship conversions", "gender": "M", "record_id": "ed7166c8-ce68-4298-a975-bcfe6c59a08a"},
    {"name": "Danyaal", "firms": ["McKinsey", "Schroders"], "confirmed": True, "conversion": "Summer internship conversion", "gender": "M", "record_id": "3d4abe64-6572-4cbb-948a-9b348d09093d"},
    {"name": "Dylan", "firms": ["Morgan Stanley", "Maven"], "confirmed": True, "conversion": "Co-founder", "gender": "M", "record_id": "c7f2ffd9-19eb-4ef2-96dc-a8b605c98331"},
    {"name": "Ali", "firms": ["EY"], "confirmed": False, "gender": "M", "record_id": "a9022bfe-be2b-4f39-8e1f-82b761b21a1b"},
    {"name": "Mustafa", "firms": ["Schroders"], "confirmed": False, "gender": "M", "record_id": "0a41b3ee-4ab7-4c0b-8be7-fc66c46c2402"},
    {"name": "Jibril", "firms": ["PwC", "Millennium", "Citadel", "Morgan Stanley"], "confirmed": False, "gender": "M", "record_id": "3148022c-dca3-46b7-923d-c13f454cea01"},
    {"name": "Sami", "firms": ["Forvis Mazars"], "confirmed": False, "gender": "M", "record_id": "ab7b7019-7bfa-4c76-85d4-6520a7152967"},
    {"name": "Rahama", "firms": ["BDO"], "confirmed": False, "gender": "F", "record_id": "361e8db0-f194-4427-bc1c-2f653e64b9a6"},
    {"name": "Yuyao Xie", "firms": ["Barclays", "Optiver", "Bank of America", "Millennium"], "confirmed": False, "gender": "F", "record_id": "df6feb65-61f3-48de-9d7b-be7c5ade0277"},
    {"name": "Alexander", "firms": ["Marsh", "McKinsey", "HP", "IBM"], "confirmed": False, "gender": "M", "record_id": "5229f32d-4b23-43ca-ac04-7622943d2002"},
    {"name": "Daniyaal Anwar", "firms": [], "confirmed": False, "gender": "M", "record_id": "24aebeaf-9599-42b2-96d8-47ff06f09f99"},
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
            "Slaughter and May", "Latham & Watkins"],
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
    # Gap firm searches (highest priority)
    '"spring week" "Goldman Sachs" "return offer"',
    '"spring week" "JPMorgan" "return offer"',
    '"spring week" "Deutsche Bank" "return offer"',
    '"spring week" "Jane Street" internship',
    '"spring week" "BlackRock" "return offer"',
    '"spring week" "KPMG" "return offer"',
    '"spring week" "Rothschild" "return offer"',
    '"spring week" "Lazard" "return offer"',
    '"spring week" "Evercore" internship',
    '"spring week" "BNP Paribas" "return offer"',
    # Gender diversity searches
    '"spring week" "return offer" she her women female',
    '"spring week" converted intern "women in finance"',
    # Dark horse searches (non-traditional unis)
    '"spring week" "return offer" -LSE -"London School of Economics"',
    '"spring week" "summer internship" Exeter OR Bath OR Durham OR "St Andrews"',
    '"spring week" converted Birmingham OR Nottingham OR Bristol OR Manchester',
    # Sector gap searches
    '"spring week" "Freshfields" OR "Clifford Chance" OR "Linklaters" converted',
    '"spring week" "Bloomberg" OR tech internship converted',
    # General high-quality searches
    '"spring week" "converted into" "summer internship"',
    '"spring week" "got the offer" OR "return offer" OR "secured" internship',
]

# === DM TEMPLATES ===
DM_PANEL_SPEAKER = """Hey {first_name}! I came across your profile and saw you did a spring week at {primary_firm}{conversion_note}. Really impressive.

I'm building EarlyEdge, we run live webinars where students who've been through spring weeks share their experience with students who haven't. Our last cold email webinar had 100+ attendees.

We're putting together a 2-part panel on spring week conversions, how to actually turn a spring week into a return offer. Would you be open to being on the panel? It's a ~15 min segment + Q&A, on Zoom, and we'd love to have someone with {their_value}.

Happy to jump on a quick call if easier. No worries either way!"""

DM_PLAYBOOK_CONTRIBUTOR = """Hey {first_name}! Saw you completed a spring week at {primary_firm}, love to hear about that.

We're putting together The Spring Week Playbook, a guide where students who've done spring weeks write up what the programme involved, insider tips, and advice for future applicants. Would you be interested in contributing a short write-up about your {primary_firm} experience?

It's pretty quick, just 500-800 words on what your spring week was like and any tips. Your name + uni would be credited. Let me know if you'd be up for it!"""

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
