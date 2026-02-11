# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 1. What This Is

**EarlyEdge** is a two-sided peer coaching marketplace for UK students. Students book 1-on-1 sessions with coaches (students or recent graduates) who recently achieved competitive outcomes — Spring Weeks at investment banks, Oxbridge offers, high UCAT scores, training contracts at magic circle law firms, tech internships at FAANG companies.

**Core value prop:** Learn from someone who just did it, not career coaches who did it 10 years ago. Peers who achieved it in the last 1-3 years, remember everything, and charge £25-60/hour instead of £150+.

**Current state:** Frontend-only React SPA. All data is hardcoded mock data in `src/data/`. No backend (Supabase planned), no real auth (pages exist but don't authenticate), no payments (Stripe Connect planned). Full business context, database schema, API contracts, and payment flows are in `early.md`.

---

## 2. Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server on http://localhost:8080
npm run build        # Production build to dist/
npm run lint         # ESLint
npm run test         # Vitest single run
npm run test:watch   # Vitest watch mode
npm run preview      # Preview production build locally
```

**Windows note:** On this machine, `npm` may not be in the bash PATH. Use `cmd /c npm ...` if direct `npm` fails.

---

## 3. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Build | Vite 5 | Dev server on port 8080, HMR overlay disabled |
| Framework | React 18 | SPA with client-side routing |
| Language | TypeScript 5.8 | Strict mode via `tsconfig.app.json` |
| UI Components | shadcn/ui | ~49 Radix-based components in `src/components/ui/` |
| Styling | Tailwind CSS 3.4 | CSS variables (HSL) in `src/index.css`, extended in `tailwind.config.ts` |
| Charts | Recharts | Bar charts with custom tooltips in dashboard widgets |
| Routing | react-router-dom v6 | Nested routes for dashboard layout |
| State | TanStack React Query | Wired in App.tsx, not yet used with real APIs |
| Testing | Vitest + React Testing Library | Config in `vitest.config.ts` |
| Linting | ESLint 9 + TypeScript ESLint | Flat config in `eslint.config.js` |
| Planned backend | Supabase | PostgreSQL + Auth + Realtime + Storage |
| Planned payments | Stripe Connect | Marketplace payments with commission splits |

**Path alias:** `@` maps to `./src` (configured in `vite.config.ts`, `tsconfig.json`, and `vitest.config.ts`).

---

## 4. Project Structure

```
src/
├── App.tsx                          # Root component — all routes defined here
├── main.tsx                         # Entry point
├── index.css                        # Global styles, CSS variables, Tailwind, custom animations
├── components/
│   ├── ui/                          # ~49 shadcn/ui primitives (accordion → tooltip)
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx      # Sidebar + mobile header + <Outlet />
│   │   ├── DashboardSidebar.tsx     # Fixed sidebar nav with user dropdown
│   │   ├── DashboardMobileHeader.tsx
│   │   ├── CoachCard.tsx            # Reusable coach card with hover props
│   │   ├── QuickStats.tsx           # 2x2 stat grid with animated counters
│   │   ├── SessionChart.tsx         # Recharts bar chart for monthly sessions
│   │   ├── DeadlineTimeline.tsx     # Application deadlines with urgency dots
│   │   ├── ReferralCard.tsx         # Dark gradient referral card with copy code
│   │   ├── TrendingCategories.tsx   # Horizontal pill row with trend %
│   │   └── ProgressRing.tsx         # SVG circle progress ring
│   ├── coach/
│   │   ├── CoachHero.tsx            # Coach profile header
│   │   ├── CoachAbout.tsx           # Bio section
│   │   ├── CoachReviews.tsx         # Reviews section
│   │   ├── CoachServices.tsx        # Services list
│   │   ├── BookingSidebar.tsx       # Booking sidebar on profile page
│   │   ├── MobileBookingBar.tsx     # Mobile booking CTA bar
│   │   └── booking/                 # BookingDialog, DateTimePicker, ServiceSelector, etc.
│   ├── auth/
│   │   └── AuthLayout.tsx           # Shared auth page wrapper
│   ├── NavLink.tsx                  # Wraps react-router NavLink with activeClassName
│   ├── Header.tsx / Footer.tsx      # Site-wide header and footer
│   ├── Hero.tsx                     # Landing page hero
│   ├── FeaturedCoaches.tsx          # Landing page coach showcase
│   ├── HowItWorks.tsx              # Landing page how-it-works section
│   └── ...                          # Other landing page sections
├── pages/
│   ├── Index.tsx                    # Landing page
│   ├── CoachProfile.tsx             # Individual coach profile
│   ├── BecomeACoach.tsx             # Coach recruitment page
│   ├── Login.tsx / Signup.tsx       # Student auth
│   ├── CoachSignup.tsx              # Coach auth
│   ├── ForgotPassword.tsx           # Password reset
│   ├── NotFound.tsx                 # 404 page
│   └── dashboard/
│       ├── DashboardOverview.tsx    # Main dashboard (New User / Active User toggle)
│       ├── DashboardBookings.tsx    # Upcoming / Past tabs with segmented control
│       ├── DashboardBrowse.tsx      # Coach discovery with search, filter, sort
│       └── DashboardMessages.tsx    # Conversation list + chat thread
├── data/
│   ├── dashboardData.ts             # All mock data + TypeScript types for dashboard
│   ├── sampleCoach.ts               # Mock coach profile data
│   └── sampleBookings.ts            # Mock booking data
├── hooks/
│   ├── useCountUp.ts                # Animated number counter (requestAnimationFrame)
│   ├── use-mobile.tsx               # Mobile breakpoint detection
│   ├── use-toast.ts                 # Toast notification hook
│   └── useScrollAnimation.tsx       # Scroll-triggered animations
├── lib/
│   └── utils.ts                     # cn() utility (clsx + tailwind-merge)
└── types/
    ├── booking.ts                   # Booking-related TypeScript types
    ├── coach.ts                     # Coach-related TypeScript types
    └── dashboard.ts                 # Dashboard-related TypeScript types
```

---

## 5. Routing

All routes defined in `src/App.tsx`. Two route groups:

**Public pages:**
| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Index` | Landing page |
| `/coach/:coachId` | `CoachProfile` | Individual coach profile with booking sidebar |
| `/become-a-coach` | `BecomeACoach` | Coach recruitment page |
| `/login` | `Login` | Student login |
| `/signup` | `Signup` | Student signup |
| `/forgot-password` | `ForgotPassword` | Password reset |
| `/coach/signup` | `CoachSignup` | Coach signup |

**Dashboard (nested under `DashboardLayout`):**
| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard` | `DashboardOverview` | Main dashboard with New User / Active User toggle |
| `/dashboard/bookings` | `DashboardBookings` | Upcoming/Past tabs with segmented control |
| `/dashboard/browse` | `DashboardBrowse` | Coach discovery with search, filter, sort |
| `/dashboard/messages` | `DashboardMessages` | Conversation list + chat thread |

---

## 6. Dashboard Architecture

### Layout

`DashboardLayout` renders a fixed sidebar (`DashboardSidebar`, hidden below `md:`) + a mobile header (`DashboardMobileHeader`) + `<Outlet />` for page content. The sidebar has nav items (Overview, Browse Coaches, My Bookings, Messages) with notification dots for unread messages and pending reviews.

### DashboardOverview — Two Views

The overview page has a **New User** / **Active User** toggle (segmented control) that switches between two view components:

- **NewUserView**: Get-started steps (1-2-3), recommended coaches grid, sidebar with deadlines + referral card
- **ActiveUserView**: "Up next" dark hero card, upcoming sessions, review nudge, "Your coaches" section (booked coaches with Message/Book again), past sessions table, "Coaches you might like", sidebar with deadlines + referral + activity stats

Both views use a two-column grid layout: `grid-cols-[1fr_320px]` collapsing to single column below `lg:` (1024px). Sidebar widgets (`SidebarDeadlines`, `SidebarReferral`, `SidebarActivity`) are defined as local components within `DashboardOverview.tsx`, not imported from separate files.

### Other Dashboard Pages

- **DashboardBookings**: Segmented control tabs (Upcoming/Past). Cards have 3px category-coloured left borders. Upcoming cards show date/time, price, "Confirmed" status, action buttons (Join call, Message coach, Reschedule). Past cards show star ratings or "Leave review" button with hover-reveal "Book again" link.
- **DashboardBrowse**: Welcome header, seasonal banner, "Browse Coaches" section with search input (`max-w-md`), sort dropdown, category filter pills with colour dots, coach grid (`lg:grid-cols-2`). Search filters across name, credential, tags, and bio.
- **DashboardMessages**: Two-pane layout — conversation list (w-80) + chat area. Student bubbles are blue (`#3B82F6`), coach bubbles are white with border. Chat header shows session context (sessions together count, next session date/time) and action buttons (Schedule session, View profile).

---

## 7. Mock Data

All dashboard data lives in `src/data/dashboardData.ts` — types and data co-located.

### Key Types

```typescript
Coach { id, slug, name, credential, uni, rating, reviews, tags, rate, avatar,
        category, bio, sessions, packageName, packageSessions, packagePrice,
        hasBooked, fullBio }

Conversation { id, coach, avatar, credential, lastMessage, lastTime, unread,
               online, messages: ChatMessage[] }

ChatMessage { id, sender: "student" | "coach", text, time }
```

### Key Exports

- `allCoaches` — Array of 6 coaches with full profile data
- `upcomingSessions` / `pastBookings` — Session/booking arrays
- `conversations` — Mock message threads
- `categories` — Category name strings including "All"
- `deadlines` — Application deadlines with urgency levels and colours
- `referralInfo` — Referral code and reward details
- `trendingCategories` — Categories with trend percentages
- `categoryColorMap` — Maps category names to hex colours
- `quickStats`, `monthlySessionData`, `spendingSummary`, `streakInfo`

Each Coach has a `slug` field (e.g. `"sarah-k"`) used for URL routing alongside numeric `id`. The `hasBooked` boolean determines whether a coach appears in "Your coaches" or "Coaches you might like".

Additional mock data: `src/data/sampleCoach.ts` (coach profile page), `src/data/sampleBookings.ts` (booking flow).

---

## 8. Colour System

### Base Palette

EarlyEdge is **strictly black-and-white**. The base palette uses CSS variables (HSL) in `src/index.css`:

| Token | Hex Approx | Usage |
|-------|-----------|-------|
| `--black` / `--foreground` | `#111111` | Primary text, primary buttons, dark cards |
| `--white` / `--background` | `#FFFFFF` | Backgrounds, button text on dark |
| `--bg` | `#FAFAFA` | Page background |
| `--border` | `#E8E8E8` | Card borders, dividers |
| `--muted-foreground` | `#888-999` | Secondary text, metadata |

### Functional Accent Colours

Accents are used **strictly for data and status** — never for decoration:

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-blue` | `#3B82F6` | Investment Banking category, student chat bubbles |
| `accent-emerald` | `#10B981` | UCAT category, "Confirmed" status |
| `accent-amber` | `#F59E0B` | Oxbridge category, review nudge |
| `accent-rose` | `#F43F5E` | Trend indicators, alerts |
| `accent-violet` | `#8B5CF6` | Consulting category |
| `accent-indigo` | `#6366F1` | Law category |
| `accent-cyan` | `#06B6D4` | Software Engineering category |

These are defined in `tailwind.config.ts` under `theme.extend.colors.accent`.

### Category Colour Map

`categoryColorMap` in `dashboardData.ts` maps category names to hex colours. These appear as:
- 3px left-border accents on session/booking cards
- Colour dots on category filter pills (Browse page)
- Colour dots on deadline timeline entries

### Custom CSS Classes

Defined in `src/index.css`:
- `gradient-hero` — Linear gradient from `#111` to `#1a1a2e` (dark hero cards)
- `review-nudge-glow` — Amber-tinted background for review prompts
- `animate-pulse-dot` — Pulsing dot for urgent deadlines
- `animate-count-reveal` — Number counter reveal animation
- `animate-ring-fill` — SVG progress ring fill animation

---

## 9. Component Patterns

- **CoachCard** (`src/components/dashboard/CoachCard.tsx`) — Reusable card with hover state passed as props (`hovered: boolean`, `onHover: (id | null) => void`, `large?: boolean`). Shows avatar, name, credential, rating, tags, rate, package info. `large` variant used on Browse page.
- **Sidebar widgets** — `SidebarDeadlines`, `SidebarReferral`, `SidebarActivity` are defined locally inside `DashboardOverview.tsx`, shared between NewUserView and ActiveUserView.
- **StarRating** — Inline component used in DashboardOverview and DashboardBookings. Black filled stars for rated, border-colour for unrated.
- **Segmented controls** — Used for view toggles (New/Active User) and tab switching (Upcoming/Past bookings). Pattern: `inline-flex bg-muted rounded-lg p-1` with active state `bg-background shadow-sm`.
- **cn()** utility in `src/lib/utils.ts` — clsx + tailwind-merge for conditional class merging.
- **NavLink** (`src/components/NavLink.tsx`) — Wraps react-router `NavLink` with `activeClassName` support for sidebar navigation.

---

## 10. Design Spec (from early.md)

### Typography

- **Intended fonts:** DM Sans (body, 400-700) + Instrument Serif (display headings, 400)
- **Current implementation:** Uses Inter + Lora (may need updating to match spec)
- **Logo:** `Early` in Instrument Serif regular + `Edge` in Instrument Serif bold. Text only, no icon. ~22px in sidebar.

### Font Scale

| Element | Size | Weight | Font |
|---------|------|--------|------|
| Page title | 24-28px | 400 | Instrument Serif |
| Section heading | 16px | 600 | DM Sans |
| Sub-heading / label | 13px | 600 | DM Sans |
| Body text | 13-14px | 400-500 | DM Sans |
| Small text / metadata | 11-12px | 400-500 | DM Sans |
| Tiny labels (uppercase) | 10-11px | 600, uppercase, letter-spacing: 0.08-0.1em | DM Sans |
| Button text | 13px | 600 | DM Sans |

### Component Specs

- **Primary button:** `bg-foreground text-background rounded-md/lg px-5 py-2 text-xs font-semibold`
- **Secondary button:** `bg-background text-foreground border border-border rounded-md`
- **Card:** `bg-background border border-border rounded-xl px-6 py-5` with hover: `translateY(-2px) shadow-sm`
- **Dark hero card:** `gradient-hero rounded-[14px] p-6 text-white`
- **Category tag:** `px-4 py-1.5 text-xs border rounded-full` with active: `bg-foreground text-background`
- **Spacing:** Section gaps 32-40px, card padding 20-28px, border-radius cards 10-12px, buttons 6-8px, pills 20px

---

## 11. Business Context Summary

Full details in `early.md`. Key points for development:

### Revenue Model
- **Commission:** 30% for first 5 sessions → 20% after → 0% for founding coaches (first 3 months)
- **Pricing:** Coaches set own prices, typically £25-60/hr. Average session ~£40, average package ~£150.
- **All monetary values in pence** in the database (£50 = 5000). Mock data uses pounds directly.

### Categories (12 total)
Investment Banking, Consulting, Law (Vac Schemes), Law (Training Contracts), UCAT, STEP, Oxbridge Applications, University Applications, Software Engineering, Quant Finance, Cold Emailing, Internship Conversion. Each has its own seasonality.

### Key Business Rules
1. **Coach ratings hidden until 5+ reviews** — show "New coach" badge instead
2. **Session counts hidden until 3+ sessions** — show "New coach" badge instead
3. **Packages prioritised over single sessions** — 3.75x higher AOV
4. **Free intro is top-of-funnel** — primary CTA for unbooked coaches is "Book free intro"
5. **Credential year always displayed** (e.g. "Goldman Sachs Spring Week '24") — freshness is core value prop
6. **Reviews only from completed paid sessions** — never from intro calls
7. **10% referral discount** for student referrals
8. **Coach churn is expected** — students become coaches, knowledge stays fresh

### Planned Database (Supabase)
Tables: `users`, `coaches`, `coach_packages`, `coach_services`, `availability`, `bookings`, `reviews`, `messages`, `conversations`, `referrals`, `season_banners`. All with RLS policies. See `early.md` for full schema with SQL.

### Planned Payment Flow (Stripe Connect)
Student pays → Stripe PaymentIntent with `application_fee_amount` (commission) → auto-transfer to coach's connected account. Free intro calls skip Stripe entirely.

---

## 12. Key Files Reference

| File | Purpose |
|------|---------|
| `early.md` | Complete business context, DB schema, API contracts, payment flows |
| `cursor-migration.md` | Migration guide from Lovable, tech stack overview |
| `src/data/dashboardData.ts` | All mock data + TypeScript types for dashboard |
| `src/pages/dashboard/DashboardOverview.tsx` | Main dashboard page with two-view toggle |
| `src/components/dashboard/CoachCard.tsx` | Reusable coach card component |
| `src/components/dashboard/DashboardLayout.tsx` | Dashboard shell (sidebar + outlet) |
| `src/components/dashboard/DashboardSidebar.tsx` | Sidebar nav with notification dots |
| `src/index.css` | Global styles, CSS variables, custom animations |
| `tailwind.config.ts` | Theme extensions, accent colours, font config |
| `components.json` | shadcn/ui configuration |
| `src/lib/utils.ts` | cn() utility (clsx + tailwind-merge) |
| `src/hooks/useCountUp.ts` | Animated number counter hook |

---

## 13. What's Built vs Not Built

### Built (frontend design/UI)
- Landing page (~80%)
- How It Works page
- Student auth flow (signup, login, forgot password)
- Coach signup page
- Student dashboard (overview with two user states, bookings, browse, messages)
- Coach profile page with booking dialog
- Become a Coach page
- 404 page

### Not Built Yet
- All backend (Supabase setup, schema, RLS, auth, APIs)
- Real authentication (currently mock)
- Coach dashboard / settings / earnings pages
- Admin dashboard
- Stripe Connect integration
- Checkout / payment pages
- Email automation (booking confirmations, reminders, review prompts)
- Scheduling integration (Cal.com or custom)
- Mobile responsiveness across all pages
- FAQ page

### Launch Target
February 15, 2026 — must-haves include 20 coaches, working auth, coach browsing with filters, booking flow (free intro + paid sessions with Stripe), basic dashboards, and messaging.
