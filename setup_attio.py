#!/usr/bin/env python3
"""Set up EarlyEdge Attio workspace via API"""
import json, urllib.request, sys

API_KEY = sys.argv[1] if len(sys.argv) > 1 else None
if not API_KEY:
    print("Usage: python3 setup_attio.py YOUR_API_KEY")
    sys.exit(1)

BASE = "https://api.attio.com/v2"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

def api(method, path, data=None):
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(f"{BASE}{path}", data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read()), resp.status
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        try:
            return json.loads(err_body), e.code
        except:
            return {"error": err_body}, e.code

print("🚀 Setting up EarlyEdge Attio workspace...\n")

# ═══════════════════════════════════════
# 1. Custom attributes on People
# ═══════════════════════════════════════
print("📋 Creating custom attributes on People...")

attrs = [
    {"title": "Product Type", "api_slug": "product_type", "type": "select", "is_multiselect": True},
    {"title": "Source", "api_slug": "source", "type": "select", "is_multiselect": False},
    {"title": "University", "api_slug": "university_name", "type": "text", "is_multiselect": False},
    {"title": "Year of Study", "api_slug": "year_of_study", "type": "select", "is_multiselect": False},
    {"title": "Target Industry", "api_slug": "target_industry", "type": "select", "is_multiselect": False},
    {"title": "Stripe Customer", "api_slug": "stripe_customer", "type": "checkbox", "is_multiselect": False},
    {"title": "Total Spent", "api_slug": "total_spent", "type": "number", "is_multiselect": False},
    {"title": "Coaching Sessions", "api_slug": "coaching_sessions", "type": "number", "is_multiselect": False},
    {"title": "Has Testimonial", "api_slug": "has_testimonial", "type": "checkbox", "is_multiselect": False},
    {"title": "Portal Access", "api_slug": "portal_access", "type": "checkbox", "is_multiselect": False},
    {"title": "Speaker", "api_slug": "is_speaker", "type": "checkbox", "is_multiselect": False},
    {"title": "Speaker Firms", "api_slug": "speaker_firms", "type": "text", "is_multiselect": False},
    {"title": "Speaker Rate", "api_slug": "speaker_rate", "type": "text", "is_multiselect": False},
    {"title": "Lead Score", "api_slug": "lead_score", "type": "number", "is_multiselect": False},
]

for attr in attrs:
    payload = {
        "data": {
            "title": attr["title"],
            "api_slug": attr["api_slug"],
            "type": attr["type"],
            "description": attr["title"],
            "is_required": False,
            "is_unique": False,
            "config": {}
        }
    }
    # Add multiselect if applicable
    if "is_multiselect" in attr:
        payload["data"]["is_multiselect"] = attr["is_multiselect"]
        if attr["type"] == "select":
            payload["data"]["config"]["options"] = []
    
    # Handle specific types like number or text
    if attr["type"] == "number":
        payload["data"]["config"]["format"] = "number"

    resp, code = api("POST", "/objects/people/attributes", payload)
    status = "✅" if code in (200, 201) else f"⚠️ ({code}: {resp.get('message', resp.get('code', 'unknown'))})"
    print(f"  {attr['title']}: {status}")

# ═══════════════════════════════════════
# 2. Create Lists (pipelines)
# ═══════════════════════════════════════
print("\n📊 Creating pipelines...")

# Student Sales
resp, code = api("POST", "/lists", {
    "data": {
        "name": "Student Sales",
        "parent_object": "people",
        "api_slug": "student_sales"
    }
})
sales_id = None
if code in (200, 201):
    sales_id = resp.get("data", {}).get("id", {}).get("list_id")
    print(f"  Student Sales: ✅ (ID: {sales_id})")
else:
    print(f"  Student Sales: ⚠️ ({code}: {resp.get('message', resp.get('code', 'unknown'))})")

# Speaker Recruitment
resp, code = api("POST", "/lists", {
    "data": {
        "name": "Speaker Recruitment",
        "parent_object": "people",
        "api_slug": "speaker_recruitment"
    }
})
speaker_id = None
if code in (200, 201):
    speaker_id = resp.get("data", {}).get("id", {}).get("list_id")
    print(f"  Speaker Recruitment: ✅ (ID: {speaker_id})")
else:
    print(f"  Speaker Recruitment: ⚠️ ({code}: {resp.get('message', resp.get('code', 'unknown'))})")

# ═══════════════════════════════════════
# 3. Add status attributes (stages)
# ═══════════════════════════════════════
print("\n🔄 Creating pipeline stages...")

if sales_id:
    resp, code = api("POST", f"/lists/{sales_id}/attributes", {
        "data": {
            "title": "Stage",
            "api_slug": "stage",
            "type": "status",
            "description": "Pipeline Stage",
            "is_required": False,
            "is_unique": False,
            "config": {
                "default_value": None,
                "statuses": [
                    {"title": "Lead", "target_archive_state": "active"},
                    {"title": "Form Submitted", "target_archive_state": "active"},
                    {"title": "Contacted", "target_archive_state": "active"},
                    {"title": "Interested", "target_archive_state": "active"},
                    {"title": "Checkout Started", "target_archive_state": "active"},
                    {"title": "Paid", "target_archive_state": "active"},
                    {"title": "Coaching Upsell Sent", "target_archive_state": "active"},
                    {"title": "Coaching Booked", "target_archive_state": "active"},
                    {"title": "Coaching Completed", "target_archive_state": "active"},
                    {"title": "Testimonial Received", "target_archive_state": "archived"},
                ]
            }
        }
    })
    status = "✅" if code in (200, 201) else f"⚠️ ({code}: {json.dumps(resp)[:200]})"
    print(f"  Student Sales stages: {status}")

if speaker_id:
    resp, code = api("POST", f"/lists/{speaker_id}/attributes", {
        "data": {
            "title": "Stage",
            "api_slug": "stage",
            "type": "status",
            "description": "Pipeline Stage",
            "is_required": False,
            "is_unique": False,
            "config": {
                "default_value": None,
                "statuses": [
                    {"title": "Sourced", "target_archive_state": "active"},
                    {"title": "DM Sent", "target_archive_state": "active"},
                    {"title": "Replied", "target_archive_state": "active"},
                    {"title": "Interested", "target_archive_state": "active"},
                    {"title": "Terms Agreed", "target_archive_state": "active"},
                    {"title": "Confirmed", "target_archive_state": "active"},
                    {"title": "Webinar Done", "target_archive_state": "active"},
                    {"title": "Active Coach", "target_archive_state": "archived"},
                ]
            }
        }
    })
    status = "✅" if code in (200, 201) else f"⚠️ ({code}: {json.dumps(resp)[:200]})"
    print(f"  Speaker Recruitment stages: {status}")

# ═══════════════════════════════════════
# 4. Create university company records
# ═══════════════════════════════════════
print("\n🏫 Creating university records...")

unis = [
    "Imperial College London", "UCL", "King's College London", "LSE",
    "University of Manchester", "University of Warwick", "University of Birmingham",
    "University of Bristol", "University of Nottingham", "University of Oxford",
    "University of Cambridge",
]

for uni in unis:
    resp, code = api("POST", "/objects/companies/records", {
        "data": {"values": {"name": [{"value": uni}]}}
    })
    status = "✅" if code in (200, 201) else f"⚠️ ({code})"
    print(f"  {uni}: {status}")

print("\n" + "═" * 50)
print("✅ Attio setup complete!")
print(f"\nCreated:")
print(f"  • {len(attrs)} custom attributes on People")
print(f"  • Student Sales pipeline (10 stages)")
print(f"  • Speaker Recruitment pipeline (8 stages)")
print(f"  • {len(unis)} university records")
print(f"\nNext: Import contacts CSV in Attio UI")
print(f"  → People → Import → Upload hubspot_import.csv")
print("═" * 50)
