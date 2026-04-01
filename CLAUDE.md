# EarlyEdge - Full Context & Task Handoff

## What is EarlyEdge?
A peer-to-peer education marketplace where students who've achieved outcomes (internships, spring weeks, uni offers, exam scores) coach students who haven't. Think Uber for student coaching - we take a cut from every booking. Webinars are the traction engine. Each webinar tests a vertical, spawns a mini portal, and by August all portals merge into the full platform.

## Team
- **Don** (CEO): Vision, intuition, strategy, creative direction. Gels with Dylan on marketing.
- **Dylan** (COO/CTO): Detail-oriented executor. Marketing creative, technical build, copywriting, landing pages, automations. Can execute anything Don points him at.
- **Uthman** (VP Ops, 20% equity): Pure work ethic. LinkedIn outreach, speaker sourcing, customer support, research, attending meetings. Developing business instincts.

## Tech Stack
| Tool | Role |
|------|------|
| Attio | CRM - contacts, deals, pipelines |
| Loops | ALL email - marketing sequences + transactional (replaces Resend) |
| ClickUp | Project management |
| Notion | SOPs, documentation, strategy docs |
| Stripe | Payments |
| Cal.com | Uthman's coaching bookings |
| Supabase | App database, auth, edge functions |
| Vercel | Hosting (production=main, staging=staging branch) |

## MCP Connections Available
You have MCP connections to: Notion, Attio, ClickUp, Stripe, Supabase. Use them directly.

## Style Rules
- **NEVER use em dashes** anywhere in code, copy, comments, or documentation. Use regular dashes, commas, colons, or rewrite the sentence.
- **Eugene Schwartz's Breakthrough Advertising** is the core framework. Structure everything around the 5 awareness levels (Unaware, Problem Aware, Solution Aware, Product Aware, Most Aware).
- Use Sonnet model for background agents to conserve usage.

---

## WHAT HAS BEEN DONE (do NOT redo these)

### Attio CRM - COMPLETE
- 14 custom attributes on People object
- Student Sales pipeline (10 stages): Lead > Form Submitted > Contacted > Interested > Checkout Started > Paid > Coaching Upsell Sent > Coaching Booked > Coaching Completed > Testimonial Received
- Speaker Recruitment pipeline (8 stages): Sourced > DM Sent > Replied > Interested > Terms Agreed > Confirmed > Webinar Done > Active Coach
- 11 UK university company records
- 692 contacts imported from hubspot_import.csv (188 buyers, 504 leads)
- Awareness levels set on ALL 919 records (731 non-buyers = Problem Aware, 188 buyers = Most Aware)

### Supabase Edge Functions - DEPLOYED
- `stripe-webhook` - syncs purchases to Attio CRM + triggers Loops events, handles spring week products with 3-layer product detection
- `send-portal-access` - triggers Loops event `portal_access_granted`
- `send-booking-confirmation` - triggers Loops events `booking_confirmed` + `new_booking_notification`
- `loops-sync` - syncs crm_contacts to Loops with dry_run mode, graceful migration fallback
- All 4 deployed to production. Attio/Loops calls silently no-op until secrets are added
- **Still needs**: ATTIO_API_KEY + LOOPS_API_KEY added as Supabase Edge Function secrets

### Supabase Database
- Migrations 001-010 tracked in supabase/migrations/
- Key columns: webinar_type, awareness_level, first_touchpoint, lifetime_value, loops_synced_at
- Views: spring_week_funnel, spring_week_revenue, funnel_metrics
- All migrations (008-010) applied to prod

### Spring Week Webinar Funnel - COMPLETE
- Full multi-step registration funnel at `/spring-week` route
- Files: SpringWeekWebinar.tsx, SpringWeekWelcome.tsx, SpringWeekIndustry.tsx, SpringWeekTickets.tsx, springWeekData.ts
- 4 pricing tiers with live Stripe payment links: Part 1 (15), Part 2 (15), Bundle (29), Premium (49)
- Stripe product IDs: prod_UFrcUWCwGdzNqo (Part 1), prod_UFrcmX59L7wHRW (Part 2), prod_UFrcsQHhGy0WES (Bundle), prod_UFrcW9BHxahd9E (Premium)
- CRM tracking at each form step with spring_week tags
- Form abandon tracking (tag-based: form_started vs checkout_started)
- Success screen with sessionStorage fallback + URL param ticket reading + bundle upsell
- SEO meta tags, FAQ section, Meet Your Speakers grid, social proof card
- Vite code splitting: vendor/supabase/ui/index chunks (461KB main, down from 818KB)

### Spring Week Portal - COMPLETE
- Route: `/spring-week-portal` with tier-gated content
- SpringWeekPortalLayout.tsx with useSpringWeekAccess() hook (reads CRM tags)
- SpringWeekPortal.tsx dashboard: Sessions, Playbook, Recordings, Coaching, Speakers
- Tier badges (blue/indigo/emerald/amber) for part1/part2/bundle/premium
- Upgrade CTAs for lower tiers, 11 confirmed speakers listed

### Spring Week Playbook Page - COMPLETE
- Route: `/spring-week-playbook`
- Dual-mode: preview for non-buyers (with locked sections), full content for bundle/premium
- 11 chapters (one per speaker firm), each with 4 sections
- Purchase CTA block for non-buyers with Bundle/Premium Stripe links
- Uses same useSpringWeekAccess() hook for access control

### Spring Week Coaching Page - COMPLETE
- Route: `/spring-week-coaching`
- SpringWeekCoaching.tsx (484 lines)
- 11 firm-specific speaker cards with "what they can help with" details
- 2 coaching tiers: Strategy Call (30min, 35) and Deep Dive (60min, 59)
- How it works (4-step flow), testimonial placeholders, bottom CTA

### Image Optimization - COMPLETE
- All logos compressed: total ~1.4MB down to ~350KB
- Imperial logo: 670KB down to 12KB (98% reduction)

### Email Copy - COMPLETE (in sops/loops-email-sequences.md)
- 15 production-ready emails across 5 Loops flows
- HTML template spec matching existing auto-emailer style (480px, system fonts, black buttons)
- Ready to paste into Loops once DNS is verified

### Notion Knowledge Base - COMPLETE
- EarlyEdge OS master page with 15+ sub-pages
- Dashboard, Revenue Model, Strategy docs, SOPs, Playbooks, Marketing Drafts
- Breakthrough Advertising awareness framework integrated throughout

### ClickUp Project Management - COMPLETE
- EarlyEdge space with 4 lists, 56+ tasks
- Spring Week Webinar, Systems Migration, Content Pipeline lists

### Frontend Cleanup - COMPLETE
- Deleted AdminCRM.tsx (1,259 lines - replaced by Attio)
- Zero em dashes in entire src/ directory
- Build compiles clean (TypeScript + Vite)
- ErrorBoundary.tsx added for crash resilience

### SOPs - COMPLETE (in sops/ directory)
- 7 SOP files including loops-email-sequences.md

### DNS - PROPAGATED
- GoDaddy DNS records for Loops added and propagated
- User needs to click Verify in Loops dashboard

---

## WHAT STILL NEEDS HUMAN ACTION

### Dylan's Tasks
1. Click "Verify" in Loops dashboard for DNS
2. Add ATTIO_API_KEY as Supabase Edge Function secret: `e6a3e04767138907ef9da55eaaa4cb99078c871b5dbc75880f46c33f8ff276bd`
3. Add LOOPS_API_KEY as Supabase Edge Function secret: `737c3b4a0a9bee2e03260a1a2a4c9c85`
4. Test full purchase flow end-to-end on staging
5. Cancel Resend subscription after Loops is verified

### Don's Tasks
1. Review and approve Loops email copy in sops/loops-email-sequences.md
2. Review Notion pages (EarlyEdge OS)
3. Confirm speaker lineup with Uthman
4. Decide Part 1 vs Part 2 speaker split

### Uthman's Tasks
1. Continue speaker sourcing using playbook in Notion
2. Priority gaps: Goldman, JPMorgan, HSBC, Deutsche Bank, UBS, BNP Paribas, Rothschild, Lazard, Evercore, Deloitte, EY, KPMG, Jane Street, BlackRock, Pimco, Schroders
3. Update ClickUp tasks daily

---

## NEW TASKS - IMPROVEMENTS & EXPANSIONS

### 6. ATTIO CRM IMPROVEMENTS
Using the Attio MCP, enhance the existing CRM setup:

#### 6a. Automated Deal Creation
- Create a workflow or webhook integration so that every Stripe purchase AUTOMATICALLY creates a deal in the Student Sales pipeline
- Each deal should include: student email, product purchased, amount paid, purchase date
- Deals should auto-advance to "Paid" stage on creation

#### 6b. Lead Scoring System
- Implement the lead scoring system defined in sops/02-lead-processing.md
- Create a computed field or use Attio automations to calculate scores based on: form fills (+10), email opens (+5), email clicks (+15), pricing page visits (+20), checkout starts (+30), purchases (+100), coaching bookings (+50)
- Tag contacts as "hot_lead" when score exceeds 50

#### 6c. Speaker CRM Records
- Create People records for ALL confirmed speakers (the 11 from springWeekData.ts)
- Add them to the Speaker Recruitment pipeline at the "Confirmed" stage
- Fill in Speaker Firms, Speaker Rate fields
- Add tag "spring_week_speaker"

#### 6d. Revenue Tracking
- Create a custom "Revenue" list/view in Attio that aggregates:
  - Total revenue by product type (recording, bundle, premium, coaching)
  - Revenue by webinar (cold email vs spring week)
  - Average order value
  - Top 10 highest-spending customers

#### 6e. University Analytics
- For each of the 11 university records, add a linked view showing:
  - How many students from that university
  - How many converted to buyers
  - Conversion rate per university
  - This helps prioritize marketing spend by university

#### 6f. Webinar Segment Lists
- Create saved lists/segments in Attio:
  - "Spring Week Leads" - tagged spring_week_form_started but NOT stripe_customer
  - "Spring Week Buyers" - tagged spring_week with stripe_customer
  - "Cold Email Buyers" - previous webinar buyers
  - "Hot Leads" - lead score > 50
  - "Coaching Prospects" - bought recording/bundle but NOT coaching
  - "Testimonial Needed" - coaching completed but no testimonial
  - "Repeat Buyers" - purchased from 2+ webinars

### 7. ATTIO-LOOPS SYNC AUTOMATION
- Build a Make.com or n8n automation that syncs Attio contacts to Loops in real-time
- When a contact's tags change in Attio, update their Loops properties
- When a deal moves to "Paid" in Attio, fire the purchase_completed event in Loops
- This creates a bidirectional sync: Stripe > Supabase > Attio > Loops

### 8. STRIPE IMPROVEMENTS
Using the Stripe MCP:

#### 8a. Coaching Products
- Create proper Stripe products for spring week coaching (currently using the old cold email coaching products):
  - "Spring Week Strategy Call" (30min, 35)
  - "Spring Week Deep Dive" (60min, 59)
  - "3x Spring Week Bundle" (3 sessions, 140)
- Update SpringWeekCoaching.tsx to use Stripe checkout instead of email booking

#### 8b. Coupon Codes
- Create Stripe coupons for promotional campaigns:
  - EARLYBIRD - 20% off (for first 50 registrations)
  - BUNDLE10 - 10 off Bundle tier
  - UNIGROUP - 15% off (for university society partnerships)
  - SPEAKER - 100% off Part 1 (free ticket for confirmed speakers)
- These can be applied at checkout via `?coupon=EARLYBIRD` URL param

#### 8c. Revenue Dashboard Webhook
- Enhance stripe-webhook to track cumulative revenue per product in Supabase
- Create a new Supabase view `revenue_dashboard` that shows:
  - Total revenue all time
  - Revenue this month
  - Revenue by product
  - Number of refunds
  - Average order value

### 9. SPRING WEEK PORTAL IMPROVEMENTS

#### 9a. Live Session Countdown
- Add a countdown timer component to SpringWeekPortal.tsx showing time until Part 1 and Part 2 go live
- When the webinar date is set, the portal shows a live countdown
- After the date passes, the section switches to "Watch the Recording"

#### 9b. Speaker Q&A Before the Event
- Add a pre-event Q&A feature where ticket holders can submit questions for speakers before the live session
- Store questions in a `portal_questions` Supabase table
- Show top-voted questions to speakers before the event
- This increases engagement and makes the live Q&A better

#### 9c. Networking Directory
- After the webinar, enable a directory where attendees can opt-in to share their LinkedIn profiles
- Helps students connect with each other and creates community
- Store in Supabase `portal_directory` table with opt-in boolean

#### 9d. Recording Chapters
- When recordings are uploaded, add chapter markers so students can jump to specific speakers
- Store chapter data in springWeekData.ts: `{ time: "00:00", speaker: "Citi", topic: "How to convert" }`

### 10. CONTENT AUTOMATION

#### 10a. Auto-Generated Social Proof
- Build a component that pulls LIVE data from Supabase to show:
  - "X students registered" (from crm_contacts with spring_week tags)
  - "Students from X universities" (distinct university count)
  - "X coaching sessions booked" (from portal_bookings)
- Show these on the landing page and portal - they update in real-time as people sign up

#### 10b. Testimonial Collection System
- Create a public route `/review` that shows a simple form
- Fields: name, university, what product they bought, their experience (text), rating (1-5 stars), permission to use publicly
- Stores in Supabase `testimonials` table
- Approved testimonials auto-appear on landing pages and portal
- The Day 7 testimonial request email links directly to `/review`

#### 10c. Referral System
- Add a referral code system: each buyer gets a unique code (e.g. EARLY-JAKE23)
- When someone uses the code at checkout, the referrer gets credit
- Track referrals in Attio with a "Referred By" field
- After 3 successful referrals, the referrer gets a free coaching session
- This is your cheapest acquisition channel

### 11. ANALYTICS & TRACKING

#### 11a. Full Funnel Analytics View
- Build a Supabase view `full_funnel_analytics` that shows:
  - Landing page visits (if possible via Vercel Analytics)
  - Form starts vs form completions (from crm_contacts tags)
  - Checkout starts vs purchases (from crm_contacts tags)
  - Conversion rate at each step
  - Drop-off points

#### 11b. Admin Dashboard Page
- Create a new route `/admin/analytics` (protected, Don only)
- Shows live data from Supabase views:
  - Revenue chart (daily/weekly/monthly)
  - Funnel conversion rates
  - Top universities
  - Active leads count
  - Coaching utilization rate
- This replaces the old AdminCRM with something actually useful

### 12. WEBINAR INFRASTRUCTURE FOR SCALE

#### 12a. Webinar Template System
- Create a reusable webinar generator: given a topic, pricing, and speaker data, auto-generate:
  - Landing page (clone SpringWeekWebinar.tsx with different data)
  - Portal page (clone SpringWeekPortal.tsx)
  - Playbook page (clone SpringWeekPlaybook.tsx)
  - Stripe products
  - CRM tags
- Next webinars planned: UCAT, Oxbridge Applications, Graduate Schemes
- Each webinar should be a data file + shared components, not duplicated code

#### 12b. Webinar Archive
- After a webinar cycle completes, archive it as an evergreen product
- The recording, guide, and coaching remain available for purchase
- Create a `/library` page showing all past webinars as on-demand products
- This creates passive revenue from old content

### 13. EMAIL SEQUENCE IMPROVEMENTS

#### 13a. Cart Abandonment Flow
- Create a new Loops flow triggered when someone starts checkout but doesn't complete
- Tag: `checkout_started` exists but `stripe_customer` does not
- Email 1 (1 hour later): "You were so close" - remind them what they're getting
- Email 2 (24 hours): "Here's what [student name] said about the webinar" - testimonial
- Email 3 (48 hours): "Last chance: 10% off with code COMEBACK" - discount

#### 13b. Win-Back Sequence
- For contacts who haven't engaged in 30+ days
- Re-introduce EarlyEdge with new value (new webinar, new speakers, new content)
- 3 emails over 2 weeks: new value hook, social proof update, final "we miss you" with discount

#### 13c. Post-Coaching Upsell Sequence
- After a coaching session is completed, target them for:
  - Next webinar (if one is coming up)
  - Bundle coaching package (3x Deep Dive for 140)
  - Referral program enrollment

---

## KEY BUSINESS CONTEXT

### Revenue So Far
- ~3,000 from first cold email webinar cycle
- Products: Recording Only (10-15), Bundle with guide (29), Premium with coaching (49)
- Coaching: 30min Strategy Call (35), 60min Deep Dive (59)

### Current Priority
Spring Week Conversion Webinar is the IMMEDIATE focus. Spring week applications are opening within days.

### What Gets Deprecated
- Resend (Loops replaces everything)
- AdminCRM.tsx (ALREADY DELETED - Attio replaces it)
- auto-emailer edge function (loops-sync replaces it)

### Loops Event Names (used by edge functions)
- `purchase_completed` - fired on Stripe checkout, triggers welcome sequence
- `portal_access_granted` - fired when granting portal access
- `booking_confirmed` - fired when student books coaching
- `new_booking_notification` - fired to notify Uthman of new booking
- `contact_synced` - fired by loops-sync for first-time buyer syncs
- `checkout_abandoned` - NEW: fired when form started but no purchase after 1 hour
- `referral_earned` - NEW: fired when a referral code is used
