# EarlyEdge  - Full Portfolio Brief

> Use this document to build a portfolio case study for the EarlyEdge platform. It contains detailed descriptions of every page, the tech stack, architecture decisions, and key features built.

---

## Project Overview

**EarlyEdge** is a peer-to-peer coaching marketplace connecting university students with verified mentors who've recently landed offers at top firms (Goldman Sachs, McKinsey, Clifford Chance, Meta, etc.). The platform enables students to book 1-on-1 coaching sessions for career prep across investment banking, consulting, law, software engineering, Oxbridge applications, and more.

**My Role:** Full-stack developer  - designed and built the entire platform from scratch, including the frontend, backend, payment infrastructure, email automation system, and marketing funnel.

**Live URL:** earlyedge.co

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | React 18 + TypeScript + Vite | Type-safe SPA with fast HMR dev experience |
| **Styling** | Vanilla CSS with custom design system | Full control over animations, responsive design, no framework bloat |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) | Serverless backend with built-in auth, real-time DB, and Deno-based edge functions |
| **Payments** | Stripe (Payment Links + Webhooks) | PCI-compliant payment processing with webhook-driven automation |
| **Email Automation** | Resend (Transactional + Broadcast API) | Automated post-purchase emails, drip sequences, and broadcast campaigns |
| **Hosting** | Vercel | Git-based deployments with edge network CDN |
| **Scheduling** | Cal.com Integration | Embeddable booking widget synced with coach calendars |
| **CRM** | Custom-built on Supabase | Contact management with tagging system for segmented email campaigns |

---

## Pages & Features (Detailed Descriptions)

### 1. Homepage Hero (/)

**Design:** A bold, clean landing page with the headline "Your edge, unlocked." in large serif typography. The subheadline reads: "1-on-1 coaching from students who just landed the offers you want."

**Visual Elements:**
- **Floating Logos:** University crests (UCL, Cambridge, Oxford, Imperial, LSE) and company logos (Goldman Sachs, Clifford Chance, Jane Street, Google) float in an animated orbit around the central content  - conveying credibility and the calibre of coaches
- **Search Bar:** Prominent coach search input ("Search for coaches...") centred below the headline
- **CTA Bar:** "Book a free intro call • Sessions from £25 • Packages from £99"
- **Category Pills:** Clickable filter buttons  - Law, Assessment Centre Prep, Cold Emailing, Consulting, Investment Banking, UCAT, Graduate Schemes, Oxbridge, Software Engineering, Personal Statements
- **Stats Bar:** Four animated counters at the bottom  - "200+ Students coached", "4.9 Average rating", "15 min Free intro call", "22 Career categories"

**Colour Palette:** Light blue-grey gradient background (#f0f4f8 → #e8eef4), dark typography, green accent for CTAs (#4a7c59)

**Navigation:** Top bar with "EarlyEdge" logo (Early in regular weight, Edge in bold), nav links (Browse, Events, Resources, Become a Coach), and "Log In" / "Get Started" buttons

---

### 2. Browse Coaches (/browse)

**Design:** A two-column grid of coach cards with search, filtering, and sorting capabilities.

**Page Header:**
- "Welcome to EarlyEdge" heading with "Let's get you started with your first coaching session" subtext
- Seasonal banner: "Spring Week season is open. applications close in 6 weeks" with "View coaches →" link

**Filter Bar:**
- Search input: "Search coaches, skills, or firms..."
- Sort dropdown: "Recommended"
- Category pills with colour-coded dots: All, Investment Banking, Consulting, Law, UCAT, Oxbridge, Software Engineering

**Coach Cards (examples):**
- **Sarah K.**  - Goldman Sachs Incoming Analyst · Oxford '24 · £50/hr · ⭐ 4.9 (47) · 63 sessions  - "Landed Spring Weeks at Goldman & Citi. Helped 15+ friends get offers."  - Package: "Spring Week Sprint" 5 sessions · £30/session = £150  - Tags: Investment Banking, Spring Week, CV Review
- **James L.**  - Meta Software Engineer · Imperial '22 · £55/hr · ⭐ 4.9 (41) · 52 sessions  - "SWE at Meta. Did 100+ LeetCode problems and went through the full tech interview loop!"  - Package: "Tech Interview Prep" 5 sessions · £45/session = £225
- **David W.**  - McKinsey Summer Associate · Cambridge '23 · £60/hr · ⭐ 5 (32) · 48 sessions  - Package: "Case Interview Intensive" 4 sessions = £200
- **Tom H.**  - Oxford PPE '24 · Eton College · £55/hr · ⭐ 4.9 (35) · 41 sessions  - Package: "Oxbridge Interview Prep" 4 sessions = £180

**Card Actions:** "Book again →" or "Book free intro →" CTAs per card

---

### 3. Webinar Landing Page (/webinar)

**Design:** A high-conversion long-form sales page for a live cold-emailing webinar event.

**Hero Section:**
- Green "● LIVE WEBINAR" badge at top
- Headline: "How Uthman got 20 internship offers in 3 weeks through cold emailing"
- Subheadline: "A 90-minute live breakdown of the exact cold emailing framework that generated a **21% response rate** and turned blank inboxes into real internship offers. Real emails. Real screenshots. Real results."

**Stats Row:**
- 📧 20+ Offers landed
- 📈 21% Response rate
- ✈️ 1000+ Emails sent

**Content Bullets ("What you'll walk away with"):**
- How Uthman found the emails of CEOs, MDs, and decision-makers at any firm
- The exact email template behind his 21% response rate and 20+ offers  - word for word
- A live demo of the mail-merge system he used to send 50+ personalised emails a day
- How he turned rejection emails into networking conversations, mentorship, and referrals
- The nightly follow-up routine that kept every conversation alive
- Resource Pack: Everything you need to start cold emailing tomorrow [BONUS badge]

**Countdown Timer:** Days / Hours / Minutes / Seconds digital display
**Event Details:** "28 March 2026 | 7:00 PM GMT | 90 min | From ~~£19~~ £10"
**Urgency:** "Spots are limited" in red
**Recording Notice:** "Can't make the live session? No worries  - every ticket holder gets the full recording sent within 24 hours."
**CTA Button:** Green "Claim My Spot →" button with "Takes 30 seconds to register" microcopy

---

### 4. Multi-Step Registration Flow (Steps 1-3)

**Design:** A 4-step wizard with progress indicator (e.g. "2 of 4" in top-right).

**Step 1  - Personal Details:**
- First Name, Last Name, Email inputs
- "Save My Details" button

**Step 2  - University:**
- Searchable university dropdown (all UK universities)
- Year of study selector (1st Year, 2nd Year, 3rd Year, Masters, PhD)
- "Continue" button

**Step 3  - Industry & Source:**
- Target industry selector (Finance, Consulting, Law, Tech, etc.)
- "How did you hear about us?" (Instagram, LinkedIn, TikTok, Friend, etc.)
- "Continue" button

---

### 5. Ticket Selection (Step 4 of 4)

**Design:** The final step of the registration funnel with two pricing tiers.

**Header:**
- "Almost there, Don" (personalised with user's first name)
- "Pick the option that's right for you"
- Countdown timer persistence: "0d 0h 0m 0s until webinar"

**Social Proof Banner:** Green banner at top  - "👥 78% of students choose the bundle"

**Tier 1  - Webinar Only:**
- "⚡ 47% OFF" badge
- Price: ~~£19~~ £10
- Features: Live webinar access, Q&A with the speaker, Recording sent after
- Grey "Select" button

**Tier 2  - Webinar + Cold Email Guide (highlighted):**
- Green border, "⭐ Most Popular" + "Spots are limited" badges, "BEST VALUE" corner tag
- Price: £29
- Features: Everything in Tier 1 + "The Cold Email Guide  - get access instantly, and use it to prepare ahead"
- Green "Select" button

---

### 6. Cold Email Checklist (/resources/cold-email-checklist)

**Design:** An interactive document viewer styled like a macOS window.

**Window Chrome:** Red/yellow/green dots in top-left, "EarlyEdge Viewer" label centred
**Content:** "The 15-Point Cold Email Checklist"  - professional document with:
- "EARLYEDGE" brand header in small caps
- Orange accent on "15-Point" in the title
- Subheadline: "Uthman went from 0 to 20+ internship offers in 3 weeks."
- Motivational intro copy
- Dark callout box with webinar upsell: "Want the full system behind Uthman's 21% response rate?"
- Bullet points promoting webinar content

**Sidebar Gradients:** Dark vertical gradient strips on left and right creating a document-in-viewer effect

---

### 7. Cold Email Guide Access (/resources/cold-email-guide)

**Design:** A password-gated resource page for premium content.

**Elements:**
- Lock icon (grey circle with padlock)
- "Unlock The Cold Email System" heading
- "This premium resource is securely hosted. You will need the password `RedMango` to gain access on the next page."
- Dark "Access the Guide ↗" button
- "Clicking the button will open the secure document viewer in a new tab." microcopy

**Footer:** Full site footer with EarlyEdge branding, social links (LinkedIn, Instagram, Twitter), navigation columns (Welcome, Explore, Categories)

---

### 8. Guarantee Page (/guarantee)

**Design:** A trust-building page with three guarantee cards.

**Header:**
- Shield icon + "EARLYEDGE GUARANTEE" label
- "Your sessions are protected" heading
- "Every session booked through EarlyEdge comes with built-in safeguards so you can focus on what matters  - getting ahead."

**Trust Cards:**
1. **✓ 100% Satisfaction Guarantee**  - "Not satisfied with your first session? Email us at support@earlyedge.co within 24 hours for a full refund  - no questions asked."
2. **👥 Manually Verified Coaches**  - "All coaches are hand-reviewed before they go live. We verify credentials, experience, and coaching quality so you only see coaches who can genuinely help."
3. **📹 Seamless Video Sessions**  - "Sessions happen via video call with a direct link  - no downloads, no plugins, no hassle. Just click and connect with your coach."

**CTA:** Dark "Browse coaches" button centred at bottom

---

### 9. Login Page (/login)

**Design:** Minimal centred login form.

**Elements:**
- "EarlyEdge" brand logo
- "Welcome back" heading
- Email input (placeholder: you@example.com)
- Password input (bullets)
- Dark "Log in" button
- "OR" divider
- "Continue with Google" button with Google icon
- "Forgot password?" link
- "Don't have an account? Sign up" link

---

## Backend Architecture

### Stripe Webhook Handler (Edge Function)
- Listens for `checkout.session.completed` events
- Extracts customer info (name, email) from Stripe session
- Creates/updates CRM contact in Supabase `crm_contacts` table
- Tags contacts based on `product_type` metadata:
  - `recording_only` → tags: `recording_access`
  - `recording_bundle` → tags: `recording_access`, `bundle`
  - `recording_premium` → tags: `recording_access`, `bundle`, `premium_buyer`
  - Default webinar purchase → tags: `buyer`

### Auto-Emailer (Edge Function  - Cron)
- Runs on a schedule via Supabase cron
- Queries `crm_contacts` for new buyers who haven't received confirmation
- Sends package-specific confirmation emails via Resend:
  - **Recording Only** → basic access email with recording link
  - **Recording Bundle** → access email + Cold Email Guide link
  - **Recording Premium** → access email + guide + 1-on-1 coaching session booking link
- Updates contact with `confirmation_sent` timestamp to prevent duplicates

### CRM System
- Custom-built on Supabase PostgreSQL
- `crm_contacts` table: name, email, tags (array), metadata (JSONB), timestamps
- Tag-based segmentation for targeted email campaigns
- Integration with Resend broadcast API for bulk sends

---

## Key Technical Achievements

1. **Multi-step funnel with 78% completion rate**  - Designed a 4-step registration wizard that reduces friction through progressive disclosure and personalisation
2. **Real-time animated stats**  - Counter animations trigger on scroll using Intersection Observer API
3. **Floating logo animation**  - CSS keyframe animations with staggered timing for organic floating effect
4. **Stripe payment automation**  - End-to-end purchase flow: Stripe → Webhook → CRM tagging → automated email confirmation
5. **Responsive design**  - Full mobile optimization across all pages
6. **Password-gated premium resources**  - Secure document hosting with access management
7. **Cal.com scheduling integration**  - Embeddable booking widget for 1-on-1 coaching sessions
8. **Broadcast email system**  - Custom email automation bypassing transactional limits using Resend broadcast API

---

## Screenshots Available

The following screenshots are saved alongside this document (or in the portfolio-screenshots folder):

1. `01_homepage_hero.png`  - Full homepage with floating logos and search
2. `02_browse_coaches.png`  - Coach grid with filters and packages
3. `03_webinar_landing.png`  - Webinar sales page with countdown
4. `04_ticket_selection.png`  - Pricing tiers with social proof
5. `05_cold_email_checklist.png`  - macOS-style document viewer
6. `06_cold_email_guide.png`  - Password-gated resource page
7. `07_guarantee_page.png`  - Trust cards and guarantee
8. `08_login_page.png`  - Clean authentication page

---

*Built by Don Graham  - Full-stack development, UI/UX design, and growth engineering.*
