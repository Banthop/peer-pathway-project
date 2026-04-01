# EarlyEdge — Full Context & Task Handoff

## What is EarlyEdge?
A peer-to-peer education marketplace where students who've achieved outcomes (internships, spring weeks, uni offers, exam scores) coach students who haven't. Think Uber for student coaching — we take a cut from every booking. Webinars are the traction engine. Each webinar tests a vertical, spawns a mini portal, and by August all portals merge into the full platform.

## Team
- **Don** (CEO): Vision, intuition, strategy, creative direction. Gels with Dylan on marketing.
- **Dylan** (COO/CTO): Detail-oriented executor. Marketing creative, technical build, copywriting, landing pages, automations. Can execute anything Don points him at.
- **Uthman** (VP Ops, 20% equity): Pure work ethic. LinkedIn outreach, speaker sourcing, customer support, research, attending meetings. Developing business instincts.

## Tech Stack
| Tool | Role |
|------|------|
| Attio | CRM — contacts, deals, pipelines |
| Loops | ALL email — marketing sequences + transactional (replaces Resend) |
| ClickUp | Project management |
| Notion | SOPs, documentation, strategy docs |
| Stripe | Payments |
| Cal.com | Uthman's coaching bookings |
| Supabase | App database, auth, edge functions |
| Vercel | Hosting (production=main, staging=staging branch) |

## MCP Connections Available
You have MCP connections to: Notion, Attio, ClickUp, Stripe, Supabase. Use them directly.

---

## WHAT HAS ALREADY BEEN DONE (do not redo these)

### Attio CRM — COMPLETE
- 14 custom attributes on People: Product Type, Source, University, Year of Study, Target Industry, Stripe Customer, Total Spent, Coaching Sessions, Has Testimonial, Portal Access, Speaker, Speaker Firms, Speaker Rate, Lead Score
- Student Sales pipeline with 10 stages: Lead → Form Submitted → Contacted → Interested → Checkout Started → Paid → Coaching Upsell Sent → Coaching Booked → Coaching Completed → Testimonial Received
- Speaker Recruitment pipeline with 8 stages: Sourced → DM Sent → Replied → Interested → Terms Agreed → Confirmed → Webinar Done → Active Coach
- 11 UK university company records (Imperial, UCL, KCL, LSE, Manchester, Warwick, Birmingham, Bristol, Nottingham, Oxford, Cambridge)
- 692 contacts imported from hubspot_import.csv (188 buyers, 504 leads)

### Supabase Edge Functions — REWRITTEN (not yet deployed)
- `stripe-webhook/index.ts` — now syncs purchases to Attio CRM AND triggers Loops event `purchase_completed`
- `send-portal-access/index.ts` — now triggers Loops event `portal_access_granted` instead of Resend
- `send-booking-confirmation/index.ts` — now triggers Loops events `booking_confirmed` (to student) and `new_booking_notification` (to Uthman) instead of Resend
- These need to be deployed to Supabase and need ATTIO_API_KEY + LOOPS_API_KEY set as Supabase Edge Function secrets

### Staging Environment — COMPLETE
- `staging` branch exists on GitHub
- Vercel generates preview URLs for every push to staging

### SOPs Written — IN /sops/ DIRECTORY
6 markdown files ready to import into Notion:
- 01-webinar-launch.md
- 02-lead-processing.md
- 03-coaching-flow.md
- 04-content-social-pipeline.md
- 05-troubleshooting-runbook.md
- 06-deployment-workflow.md

### Contact Export — COMPLETE
- hubspot_import.csv in project root (693 contacts, already imported to Attio)

---

## WHAT STILL NEEDS TO BE DONE (your tasks)

### 1. NOTION — Build the knowledge base
Using the Notion MCP:
- Create a master page called **"EarlyEdge OS"**
- Import all 6 SOP files from `sops/` as sub-pages with formatting preserved
- Create a page **"Spring Week Conversion Webinar — Strategy"** containing:
  - 2-part panel webinar about converting spring weeks into return offers/summer internships
  - NOT about getting spring weeks — about what to do once you're in
  - Part 1 and Part 2 on separate days. Firms split across parts so people buy the bundle
  - Each part: 3-4 speakers from different firms on a panel
  - After the webinar: spring week coaching portal goes live, attendees book panellists for 1-on-1s
  - Revenue tiers: Part 1 ticket, Part 2 ticket, Bundle (both + The Spring Week Playbook guide), Premium (bundle + 1-on-1)
  - The Spring Week Playbook = master guide where speakers write up their spring week experience (what the programme involved, insider tips, interview process, how to convert, mistakes to avoid)
  - Guide contributors don't need conversions — anyone who did a spring week has useful insider info
  - Panel speakers MUST have actual conversions (return offers or summer internship offers)
  - Target firms: Goldman, JPMorgan, Morgan Stanley, Barclays, Citi, HSBC, Deutsche Bank, UBS, BNP Paribas, Jefferies, Nomura, Rothschild, Lazard, Evercore, PwC, Deloitte, EY, KPMG, Citadel, Millennium, Optiver, Jane Street, BlackRock, Pimco, Schroders
  - Confirmed speakers so far with experience at: Jefferies, Forbes, Nomura, Citi (+return offer), Barclays, Optiver, Bank of America, Millennium, PwC, Citadel, Morgan Stanley
- Create a page **"Uthman — Speaker Sourcing Playbook"** written as direct instructions from the CEO:
  - Job: find people who completed and ideally converted spring weeks
  - Sourcing for webinar panels AND Spring Week Playbook contributors
  - Daily workflow: search LinkedIn for "spring week" + bank names, filter UK students/grads, check The Student Room and Reddit, log every candidate in tracking spreadsheet (Name, LinkedIn URL, University, Firms, Conversions, Follower count, Notes)
  - Use only the outreach DM wording Don provides, never write your own
  - Follow up after 3 days, flag candidates with 1000+ followers
  - Priority order: converted at 2+ firms → firms we have gaps for → large followings → target unis (Imperial, UCL, LSE, Warwick, Oxbridge)
  - Research: which spring week programmes are opening now, conversion rates, student worries, public success stories, competitor content
  - Rules: no payment promises without Don's approval, no writing marketing copy, do attend meetings, update spreadsheet daily
- Create a page **"Spring Week Marketing — Draft Posts"** with 3 LinkedIn post drafts for Don to review:
  - Post 1: Tease the webinar. Hook about how most students get spring weeks but don't convert. CTA to DM for early access.
  - Post 2: Social proof from cold email webinar (100+ attendees, students landing offers). "You learned to get in the door. Now learn to stay in the room."
  - Post 3: Educational value post about spring week conversion mistakes. Soft CTA.
  - Voice: natural student founder, not corporate marketing

### 2. CLICKUP — Build project management
Using the ClickUp MCP:
- Create Space: **"EarlyEdge"**
- List **"Spring Week Webinar"**: Map firms covered vs gaps, Plan Part 1 vs Part 2 speaker split, Collect speaker write-ups for Playbook, Build landing page, Set up Stripe payment links, Create registration form, Schedule Zoom Part 1, Schedule Zoom Part 2, Design slides template, Build post-webinar coaching portal
- List **"Systems Migration"**: Finish GoDaddy DNS for Loops (blocked on Dylan), Deploy edge functions to Supabase, Add API keys as Supabase secrets, Build Loops email sequences, Test full purchase flow, Cancel Resend subscription, Remove AdminCRM.tsx
- List **"Content Pipeline"**: Update testimonials wording, Review spring week LinkedIn posts, Plan lunch-and-learn monthly series, Draft UCAT webinar outline, Draft Oxbridge webinar outline, Create spring week promo email sequence

### 3. VERIFY — Confirm existing setup
- Use Attio MCP: confirm both pipelines exist with correct stages, confirm ~692 People records
- Use Supabase MCP: confirm edge functions exist and reference Loops API not Resend

### 4. BLOCKED (cannot do yet)
- GoDaddy DNS records for Loops email domain — needs Dylan's phone for 2FA
- Deploying edge functions — needs ATTIO_API_KEY and LOOPS_API_KEY added as Supabase secrets via dashboard
- Building Loops email sequences — needs DNS verified first

---

## KEY BUSINESS CONTEXT

### Revenue So Far
- ~£3,000 from first cold email webinar cycle
- Products: Recording Only (£10-15), Bundle with guide (£29), Premium with coaching (£49)
- Coaching: 30min Strategy Call (£35), 60min Deep Dive (£59)

### Current Priority
Spring Week Conversion Webinar is the IMMEDIATE focus. Spring week applications are opening within days.

### What Gets Deprecated
- Resend (Loops replaces everything)
- AdminCRM.tsx component (Attio replaces it)
- auto-emailer edge function (Loops handles sequences)

### Loops Event Names (used by edge functions)
- `purchase_completed` — fired on Stripe checkout, triggers welcome sequence
- `portal_access_granted` — fired when granting portal access
- `booking_confirmed` — fired when student books coaching
- `new_booking_notification` — fired to notify Uthman of new booking
