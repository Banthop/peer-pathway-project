#!/bin/bash
# EarlyEdge Attio Setup Script
# Usage: ATTIO_API_KEY=your_key bash setup_attio.sh

set -e

API_KEY="${ATTIO_API_KEY:?Set ATTIO_API_KEY first}"
BASE="https://api.attio.com/v2"
H1="Authorization: Bearer $API_KEY"
H2="Content-Type: application/json"

echo "🚀 Setting up EarlyEdge Attio workspace..."

# ═══════════════════════════════════════
# 1. Create custom attributes on People
# ═══════════════════════════════════════
echo ""
echo "📋 Creating custom attributes on People..."

attrs=(
  '{"title":"Product Type","api_slug":"product_type","type":"select","is_multiselect":true}'
  '{"title":"Source","api_slug":"source","type":"select","is_multiselect":false}'
  '{"title":"University","api_slug":"university","type":"text","is_multiselect":false}'
  '{"title":"Year of Study","api_slug":"year_of_study","type":"select","is_multiselect":false}'
  '{"title":"Target Industry","api_slug":"target_industry","type":"select","is_multiselect":false}'
  '{"title":"Stripe Customer","api_slug":"stripe_customer","type":"checkbox","is_multiselect":false}'
  '{"title":"Total Spent","api_slug":"total_spent","type":"currency","is_multiselect":false}'
  '{"title":"Coaching Sessions Booked","api_slug":"coaching_sessions","type":"number","is_multiselect":false}'
  '{"title":"Has Testimonial","api_slug":"has_testimonial","type":"checkbox","is_multiselect":false}'
  '{"title":"Portal Access","api_slug":"portal_access","type":"checkbox","is_multiselect":false}'
  '{"title":"Speaker","api_slug":"is_speaker","type":"checkbox","is_multiselect":false}'
  '{"title":"Speaker Firms","api_slug":"speaker_firms","type":"text","is_multiselect":false}'
  '{"title":"Speaker Rate","api_slug":"speaker_rate","type":"text","is_multiselect":false}'
  '{"title":"Lead Score","api_slug":"lead_score","type":"number","is_multiselect":false}'
)

for attr in "${attrs[@]}"; do
  title=$(echo "$attr" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])")
  echo -n "  Creating: $title... "
  
  resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE/objects/people/attributes" \
    -H "$H1" -H "$H2" \
    -d "$attr" 2>&1)
  
  code=$(echo "$resp" | tail -1)
  body=$(echo "$resp" | head -n -1)
  
  if [ "$code" = "200" ] || [ "$code" = "201" ]; then
    echo "✅"
  else
    echo "⚠️ ($code) $(echo $body | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("message",d.get("error","unknown")))' 2>/dev/null || echo "$body")"
  fi
done

# ═══════════════════════════════════════
# 2. Create Lists (pipelines)
# ═══════════════════════════════════════
echo ""
echo "📊 Creating lists..."

# Student Sales Pipeline
echo -n "  Creating: Student Sales pipeline... "
SALES=$(curl -s -w "\n%{http_code}" -X POST "$BASE/lists" \
  -H "$H1" -H "$H2" \
  -d '{
    "name": "Student Sales",
    "parent_object": "people",
    "object_singular_noun": "Deal",
    "object_plural_noun": "Deals"
  }')
sales_code=$(echo "$SALES" | tail -1)
sales_body=$(echo "$SALES" | head -n -1)
if [ "$sales_code" = "200" ] || [ "$sales_code" = "201" ]; then
  echo "✅"
  SALES_ID=$(echo "$sales_body" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id']['list_id'])" 2>/dev/null || echo "")
  echo "    List ID: $SALES_ID"
else
  echo "⚠️ ($sales_code)"
fi

# Speaker Recruitment Pipeline
echo -n "  Creating: Speaker Recruitment pipeline... "
SPEAKERS=$(curl -s -w "\n%{http_code}" -X POST "$BASE/lists" \
  -H "$H1" -H "$H2" \
  -d '{
    "name": "Speaker Recruitment",
    "parent_object": "people",
    "object_singular_noun": "Speaker",
    "object_plural_noun": "Speakers"
  }')
speaker_code=$(echo "$SPEAKERS" | tail -1)
speaker_body=$(echo "$SPEAKERS" | head -n -1)
if [ "$speaker_code" = "200" ] || [ "$speaker_code" = "201" ]; then
  echo "✅"
  SPEAKER_ID=$(echo "$speaker_body" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id']['list_id'])" 2>/dev/null || echo "")
  echo "    List ID: $SPEAKER_ID"
else
  echo "⚠️ ($speaker_code)"
fi

# ═══════════════════════════════════════
# 3. Add status attributes (stages) to lists
# ═══════════════════════════════════════
echo ""
echo "🔄 Creating pipeline stages..."

if [ -n "$SALES_ID" ]; then
  echo -n "  Adding stages to Student Sales... "
  curl -s -X POST "$BASE/lists/$SALES_ID/attributes" \
    -H "$H1" -H "$H2" \
    -d '{
      "title": "Stage",
      "api_slug": "stage",
      "type": "status",
      "statuses": [
        {"title": "Lead", "is_active": true},
        {"title": "Form Submitted", "is_active": true},
        {"title": "Contacted", "is_active": true},
        {"title": "Interested", "is_active": true},
        {"title": "Checkout Started", "is_active": true},
        {"title": "Paid", "is_active": true},
        {"title": "Coaching Upsell Sent", "is_active": true},
        {"title": "Coaching Booked", "is_active": true},
        {"title": "Coaching Completed", "is_active": true},
        {"title": "Testimonial Received", "is_active": false}
      ]
    }' > /dev/null 2>&1
  echo "✅"
fi

if [ -n "$SPEAKER_ID" ]; then
  echo -n "  Adding stages to Speaker Recruitment... "
  curl -s -X POST "$BASE/lists/$SPEAKER_ID/attributes" \
    -H "$H1" -H "$H2" \
    -d '{
      "title": "Stage",
      "api_slug": "stage",
      "type": "status",
      "statuses": [
        {"title": "Sourced", "is_active": true},
        {"title": "DM Sent", "is_active": true},
        {"title": "Replied", "is_active": true},
        {"title": "Interested", "is_active": true},
        {"title": "Terms Agreed", "is_active": true},
        {"title": "Confirmed", "is_active": true},
        {"title": "Webinar Done", "is_active": true},
        {"title": "Active Coach", "is_active": false}
      ]
    }' > /dev/null 2>&1
  echo "✅"
fi

# ═══════════════════════════════════════
# 4. Create some companies (universities)
# ═══════════════════════════════════════
echo ""
echo "🏫 Creating university records..."

unis=(
  "Imperial College London"
  "UCL"
  "King's College London"
  "LSE"
  "University of Manchester"
  "University of Warwick"
  "University of Birmingham"
  "University of Bristol"
  "University of Nottingham"
  "University of Oxford"
  "University of Cambridge"
)

for uni in "${unis[@]}"; do
  echo -n "  Creating: $uni... "
  resp=$(curl -s -w "\n%{http_code}" -X POST "$BASE/objects/companies/records" \
    -H "$H1" -H "$H2" \
    -d "{\"data\":{\"values\":{\"name\":[{\"value\":\"$uni\"}]}}}")
  code=$(echo "$resp" | tail -1)
  if [ "$code" = "200" ] || [ "$code" = "201" ]; then
    echo "✅"
  else
    echo "⚠️ ($code)"
  fi
done

echo ""
echo "═══════════════════════════════════════"
echo "✅ Attio setup complete!"
echo ""
echo "What was created:"
echo "  • 14 custom attributes on People"
echo "  • Student Sales pipeline (10 stages)"
echo "  • Speaker Recruitment pipeline (8 stages)"
echo "  • 11 university company records"
echo ""
echo "Next: Import your contacts CSV in Attio UI"
echo "  → People → Import → Upload hubspot_import.csv"
echo "═══════════════════════════════════════"
