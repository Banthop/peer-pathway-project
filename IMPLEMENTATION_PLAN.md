# EarlyEdge Dashboard Complete Overhaul — Implementation Plan for Claude Code

## Project Overview

EarlyEdge is a coaching marketplace for UK students (secondary school, sixth form, university). Students book coaches for spring weeks, summer internships, UCAT prep, degree apprenticeships, language tests — everything career/uni-related that is **NOT** A-Level/IB exam tutoring. Think "Leland.com for UK students."

**Goal**: Transform the existing plain/functional dashboards into a premium, fully-operational platform with beautiful design, real Supabase data, working booking systems, real-time messaging, and psychological conversion tactics.

---

## Critical Context & Constraints

### Tech Stack
- **Frontend**: React 18 + TypeScript, Vite, React Router v6
- **Styling**: Tailwind CSS (via shadcn/ui components) + custom CSS variables
- **State**: TanStack React Query for server state
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **Deployment**: Vercel (auto-deploys from `main` branch)

### Authentication
- Auth via Supabase Auth (email/password)
- `AuthContext.tsx` at `src/contexts/AuthContext.tsx` provides `user`, `userType` ("student" | "coach" | "admin"), `loading`, `signOut`
- Route guards: `StudentRoute`, `CoachRoute`, `AdminRoute`, `GuestRoute` in `App.tsx`

### Test Accounts
| Role | Email | Password |
|------|-------|----------|
| Active Student | activestudent@earlyedge.co.uk | Active123! |
| New Student | newstudent@earlyedge.co.uk | Student123! |
| Coach (Sarah) | sarah@earlyedge.co.uk | Sarah123! |
| Coach (James) | james@earlyedge.co.uk | James123! |
| Coach (David) | david@earlyedge.co.uk | David123! |
| Coach (Tom) | tom@earlyedge.co.uk | Tom123! |
| Coach (Emily) | emily@earlyedge.co.uk | Emily123! |
| Coach (Marcus) | marcus@earlyedge.co.uk | Marcus123! |
| Coach (Priya) | priya@earlyedge.co.uk | Priya123! |
| Coach (Aisha) | aisha@earlyedge.co.uk | Aisha123! |

### Supabase Config
```
URL: https://cidnbhphbmwvbozdxqhe.supabase.co
Anon Key: (in .env.local as VITE_SUPABASE_ANON_KEY)
```
The client is at `src/integrations/supabase/client.ts`. It exports `supabase` (SupabaseClient | null) and `supabaseAvailable` (boolean).

> [!CAUTION]
> **NEVER use `git push --force` on `main`**. The repo history is fragile.

---

## Database Schema (Supabase Tables)

Types are defined in `src/integrations/supabase/types.ts`. Key tables:

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `users` | id, email, name, type, avatar_url | Links to Supabase Auth via `id` |
| `coaches` | id, user_id, bio, full_bio, headline, categories[], hourly_rate (pence), photo_url, linkedin_url, verified, total_sessions, is_active | Foreign key to `users` |
| `coach_services` | id, coach_id, name, description, duration (min), price (pence), is_active | Per-coach service offerings |
| `coach_packages` | id, coach_id, name, description, session_count, price (pence), is_active | Multi-session bundles |
| `availability` | id, coach_id, day_of_week (0=Sun), start_time, end_time, is_active | Weekly recurring slots |
| `bookings` | id, coach_id, student_id, service_id, package_id, type, status, scheduled_at, duration, price (pence), notes, meeting_link | Core booking record |
| `reviews` | id, booking_id, coach_id, student_id, rating, text, outcome_badge, is_public | Post-session reviews |
| `conversations` | id, coach_id, student_id, last_message_at | Chat thread |
| `messages` | id, conversation_id, sender_id, recipient_id, content, is_read | Individual messages |
| `events` | id, coach_id, title, description, event_type, category, scheduled_at, duration, max_attendees, current_attendees, price (pence), meeting_link, is_active | Coach-created events |
| `event_registrations` | id, event_id, student_id, status | Student event signups |
| `resources` | id, coach_id, title, description, category, resource_type, price (pence), file_url, preview_text, download_count, is_active, is_featured | Coach resources/guides |
| `resource_purchases` | id, resource_id, student_id | Student resource purchases |
| `referrals` | id, referrer_id, referred_id, referral_code, discount_percentage, is_used | Referral tracking |

> [!IMPORTANT]
> All prices in the DB are stored in **pence** (1/100 of £). Always divide by 100 for display.

---

## Existing Hooks (in `src/hooks/`)

| Hook | File | What it does |
|------|------|-------------|
| `useStudentBookings(status)` | useBookings.ts | Fetches student's bookings with coach data joined |
| `useCoachBookings(status)` | useBookings.ts | Fetches coach's bookings with student data joined |
| `useCreateBooking()` | useBookings.ts | Mutation to insert a booking |
| `useCoachProfile()` | useCoachProfile.ts | Fetches current coach's profile + user data |
| `useUpdateCoachProfile()` | useCoachProfile.ts | Mutation to update coach profile (splits user/coach table updates) |
| `useConversations()` | useMessages.ts | Fetches conversations for current user |
| `useMessages(conversationId)` | useMessages.ts | Fetches messages + Realtime subscription for live updates |
| `useSendMessage()` | useMessages.ts | Mutation to send a message |
| `useUnreadCount()` | useMessages.ts | Unread message count with 30s polling |
| `useStartConversation()` | useMessages.ts | Creates or finds existing conversation |
| `useCoachReviews()` | useReviews.ts | Fetches reviews for the current coach |
| `useCoaches()` | useCoaches.ts | Fetches all coaches for browse page |

---

## File Structure

```
src/
├── App.tsx                          # All routing
├── contexts/
│   ├── AuthContext.tsx               # Auth provider
│   └── BuyerAuthContext.tsx          # Portal buyer auth
├── components/
│   ├── dashboard/                   # Student dashboard components
│   │   ├── DashboardLayout.tsx      # Outlet wrapper
│   │   ├── DashboardSidebar.tsx     # Student sidebar nav
│   │   ├── DashboardMobileHeader.tsx
│   │   ├── CoachCard.tsx            # Coach recommendation card
│   │   ├── BookingsCalendar.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── QuickStats.tsx
│   │   └── ...
│   ├── coach-dashboard/             # Coach dashboard components
│   │   ├── CoachDashboardLayout.tsx  # Outlet wrapper
│   │   ├── CoachDashboardSidebar.tsx # Coach sidebar nav
│   │   └── SessionDetailPanel.tsx
│   └── ui/                          # shadcn/ui primitives
├── pages/
│   ├── dashboard/                   # Student pages
│   │   ├── DashboardOverview.tsx     # Main student dashboard (702 lines)
│   │   ├── DashboardBookings.tsx
│   │   ├── DashboardBrowse.tsx
│   │   ├── DashboardMessages.tsx
│   │   ├── DashboardEvents.tsx
│   │   └── DashboardResources.tsx
│   ├── coach-dashboard/             # Coach pages
│   │   ├── CoachOverview.tsx        # Main coach dashboard (545 lines)
│   │   ├── CoachSessions.tsx
│   │   ├── CoachEvents.tsx
│   │   ├── CoachResources.tsx
│   │   ├── CoachMessages.tsx
│   │   ├── CoachEarnings.tsx
│   │   ├── CoachReviews.tsx
│   │   ├── CoachEditProfile.tsx
│   │   ├── CoachAnalytics.tsx
│   │   ├── CoachOnboarding.tsx
│   │   └── StripeConnect.tsx
│   └── CoachProfile.tsx             # Public coach profile page
├── hooks/                           # Data hooks (listed above)
├── data/                            # Static/fallback data
│   ├── dashboardData.ts             # Student fallback data
│   ├── coachDashboardData.ts        # Coach fallback data
│   ├── eventsData.ts
│   └── ...
└── integrations/supabase/
    ├── client.ts
    └── types.ts
```

### Routing (from App.tsx)

**Student**: `/dashboard`, `/dashboard/bookings`, `/dashboard/browse`, `/dashboard/messages`, `/dashboard/events`, `/dashboard/resources`

**Coach**: `/coach-dashboard`, `/coach-dashboard/sessions`, `/coach-dashboard/messages`, `/coach-dashboard/earnings`, `/coach-dashboard/reviews`, `/coach-dashboard/edit-profile`, `/coach-dashboard/analytics`, `/coach-dashboard/payouts`, `/coach-dashboard/events`, `/coach-dashboard/resources`

**Public**: `/coach/:coachId` (public coach profile)

---

## Competitor Analysis: Leland.com

Key patterns to adopt from Leland:
1. **Rich coach cards** with credential badges (university, company), star ratings, and session counts
2. **Category-based browsing** with pill filters (Spring Weeks, UCAT, Degree Apprenticeships, etc.)
3. **Social proof everywhere** — review count, outcomes achieved, success rates
4. **Free events as lead magnets** — prominently featured, easy registration
5. **Warm, inviting colour palette** — not corporate grey, uses vibrant gradients and accent colours
6. **"Tell us your goal" onboarding** — personalised recommendations based on student interests
7. **Content library access** — templates, guides, and resources as conversion tools

---

## Phase 1: Design System Overhaul

### Goal
Replace the current monochrome/plain design with a vibrant, premium, psychologically optimised colour system.

### Changes

#### [MODIFY] `src/index.css` (or equivalent global CSS)
Update CSS custom properties (`:root` and `.dark`) to introduce:
- **Primary accent**: A warm, energetic colour (e.g., electric indigo `#6366F1` → `#818CF8`) instead of plain black
- **Success/positive**: Rich emerald for earnings, confirmations, CTAs
- **Warm neutrals**: Replace cold greys with warm stone/slate tones
- **Gradient system**: Define reusable gradients for hero sections, CTAs, sidebars
- **Subtle background patterns**: Very light gradient backgrounds instead of flat `#FAFAFA`
- Premium shadows using coloured box-shadows (e.g., `shadow-indigo-500/10`)

#### Design Principles
- Every stat card should have a subtle coloured icon background (not grey)
- CTAs should use gradients, not flat colours
- Hover states should feel alive (scale, shadow lift, colour shift)
- Use `backdrop-blur` glass effects for floating elements
- Typography: Use Inter or similar modern font with proper weight hierarchy
- Micro-animations on mount (fade-in-up with stagger) for dashboard sections

---

## Phase 2: Student Dashboard — New User View

### Goal
When `newstudent@earlyedge.co.uk` logs in, they should see an inspiring, conversion-optimised onboarding experience.

### Changes

#### [MODIFY] `src/pages/dashboard/DashboardOverview.tsx` — `NewUserView` component

**Current state**: Basic 3-step cards + coach recommendations + events + deadlines sidebar. Uses static data from `dashboardData.ts`.

**New design**:
1. **Welcome Hero** — Large, gradient banner with personalised greeting. "Welcome, [Name] 👋" with animated wave. Subtitle: "Your career journey starts here. Let's find the perfect coach for you." Include a subtle animated illustration or pattern.

2. **"What are you working towards?" Goal Selector** — Interactive pill/chip selector (Leland-inspired). Categories: Spring Weeks, Summer Internships, UCAT Prep, Degree Apprenticeships, Language Tests (IELTS/TOEFL), Personal Statements, Interview Prep, Networking Skills. Selecting a goal filters the recommended coaches below. Store selection in Supabase user metadata or local state.

3. **How It Works** — Redesigned 3-step flow with animated number badges, icons, and connecting lines/arrows. Step cards should have coloured icon backgrounds, not black number squares.

4. **Recommended Coaches** — Fetch real coaches from Supabase via `useCoaches()` hook. Rich cards with: photo/avatar, name, university credential badge, headline, star rating, session count, hourly rate, categories as coloured pills, "Book Free Intro" CTA button (gradient). Cards should have hover lift + glow effect.

5. **Upcoming Free Events** — Fetch from Supabase `events` table where `price = 0`. Show with vibrant category-coloured left strip, host avatar, date/time, attendee count, "Register Free" button.

6. **Social Proof Banner** — Aggregate stats: "X students helped · Y sessions completed · Z 5-star reviews". Animated count-up on scroll into view.

7. **Sidebar**:
   - **Deadline Tracker** — Real application deadlines (Spring Week, Summer Intern deadlines) with urgency indicators. Pull from a deadlines config or Supabase table.
   - **Referral Card** — Keep but redesign with gradient background and better copy. "Give £5, Get £5".
   - **Popular Categories** — Trending topic pills linking to browse page filtered by category.

#### [MODIFY] `src/components/dashboard/CoachCard.tsx`
Completely redesign the coach card component:
- Photo or styled avatar with gradient ring
- University badge (small pill with university name)
- Star rating with review count
- Category pills (max 3, with "+ N more")
- Hourly rate displayed prominently
- "Book Free Intro" gradient CTA
- Hover: subtle scale + shadow + glow

#### [MODIFY] `src/data/dashboardData.ts`
Remove hardcoded mock data. All data should come from Supabase. Keep as fallback for when Supabase is unavailable.

---

## Phase 3: Student Dashboard — Active User View

### Goal
When `activestudent@earlyedge.co.uk` logs in (has bookings), they see a rich, data-driven dashboard.

### Changes

#### [MODIFY] `src/pages/dashboard/DashboardOverview.tsx` — `ActiveUserView` component

**New design**:
1. **"Up Next" Hero Card** — Keep the dark gradient hero but make it more vibrant. Add: coach photo, countdown timer to session ("starts in 2h 15m"), one-click "Join Call" button, "Message Coach" quick action, "Add to Calendar" link (.ics download).

2. **Quick Stats Row** — 4 coloured stat cards (like coach dashboard):
   - Total Sessions (icon: Calendar, colour: indigo)
   - Coaches Worked With (icon: Users, colour: violet)
   - Reviews Left (icon: Star, colour: amber)
   - Hours of Coaching (icon: Clock, colour: emerald)
   Each card should have a subtle gradient background, not plain white.

3. **Upcoming Sessions List** — Interactive cards with coach avatar, session type, date/time, "Reschedule" and "Message" quick actions. "Starting Soon" badge for sessions within 24 hours.

4. **Review Nudge** — If there are unreviewed past sessions, show a prominent nudge card with the coach's name and a "Leave Review" CTA. Use amber/gold tones.

5. **Your Coaches** — Grid of coaches you've booked with. Each card: avatar, name, credential, "Message" and "Book Again" buttons. Show last session date.

6. **Past Sessions** — Compact list with hover reveal of details. Show star rating if reviewed, "Leave Review" prompt if not.

7. **Explore More Coaches** — Carousel or grid of unbooked coaches, personalised to student's category interests.

8. **Sidebar**:
   - **Deadline Tracker** (same as new user)
   - **Activity Summary** — Sessions, unique coaches, reviews given
   - **Referral Card** (redesigned)

---

## Phase 4: Student Booking Flow

### Goal
When a student clicks "Book" on a coach, they get a polished, calendar-based booking experience. Bookings must persist in Supabase and appear on both student and coach dashboards.

### Changes

#### [NEW] `src/components/booking/BookingModal.tsx`
A modal/drawer that opens when clicking "Book" on any coach card or profile:

1. **Service Selection** — If the coach has multiple services (`coach_services`), show them as selectable cards with name, description, duration, price. Include "Free Intro Call" (15 min, £0) as default first option.

2. **Date Selection** — Calendar grid showing next 14 days. Grey out days where the coach has no availability (check `availability` table by `day_of_week`). Show the coach's timezone.

3. **Time Selection** — Show available time slots for the selected day based on `availability` table. Grey out slots where existing `bookings` conflict. Standard time slots generated from coach's `start_time` to `end_time` in `duration`-minute increments for the selected service.

4. **Confirmation** — Summary card: Service name, Coach name, Date, Time, Duration, Price. "Add notes for your coach" textarea. "Confirm Booking" gradient CTA button.

5. **On Confirm**:
   - Call `useCreateBooking()` mutation
   - Insert into `bookings` table with status "pending" (or "confirmed" for intros)
   - Show success animation/confetti
   - Auto-start a conversation if one doesn't exist (`useStartConversation`)
   - Send a welcome message: "Hi! I just booked a [type] with you on [date]."

6. **Post-booking** — Redirect to bookings page or show inline confirmation. The booking should now appear on both student's "Upcoming" and coach's "Upcoming Sessions".

#### [MODIFY] `src/pages/dashboard/DashboardBookings.tsx`
- Redesign with tabs: "Upcoming" / "Past" / "Cancelled"
- Upcoming: Cards with join link, reschedule, cancel actions
- Past: Cards with "Leave Review" prompt if unreviewed
- Calendar view toggle using `BookingsCalendar` component

#### [NEW] `src/hooks/useAvailability.ts`
Hook to fetch a coach's availability and compute open time slots for a given date, excluding already-booked slots.

---

## Phase 5: Coach Dashboard Overhaul

### Goal
Transform the coach dashboard into a powerful, beautiful command centre.

### Changes

#### [MODIFY] `src/pages/coach-dashboard/CoachOverview.tsx`

**New design**:
1. **Welcome Header** — "Good morning, [Name]" with time-of-day greeting. Show profile completeness percentage as a progress ring if profile is incomplete.

2. **Stats Grid** — Keep 4 cards but redesign with coloured icon backgrounds and gradients:
   - Earnings (emerald) — this month + % change vs last month
   - Sessions (indigo) — this month + all-time
   - Rating (amber) — average + review count
   - Profile Views (violet) — this month + trend
   Each stat card should have a mini sparkline or trend indicator.

3. **Revenue Chart** — Keep the bar chart but add: gradient bars, animated entrance, hover tooltips showing exact amounts. Consider a mini area chart as alternative.

4. **"Up Next" Hero** — Same concept as student but from coach perspective. Show student name, session type, notes the student left, "Prepare" and "Join Call" CTAs.

5. **Upcoming Sessions** — Interactive list with student avatars. "Message" and "Reschedule" quick actions. "Starting Soon" urgency badge.

6. **Recent Reviews** — Already exists, redesign with better cards. Show outcome badges prominently.

7. **Past Sessions** — Compact list with earnings shown per session.

8. **Sidebar**:
   - **Today's Schedule** — Timeline view of today's sessions
   - **Next Payout** — Pending earnings with expected date
   - **Quick Actions** — Edit Profile, View Public Profile, Manage Availability, Create Event

#### [MODIFY] `src/components/coach-dashboard/CoachDashboardSidebar.tsx`
Redesign sidebar navigation:
- Add icons next to each nav item (Overview: LayoutDashboard, Sessions: Calendar, Events: Ticket, Resources: BookOpen, etc.)
- Unread message count badge on "Messages" nav item (use `useUnreadCount()`)
- "Coach" badge should be a gradient pill, not plain black
- Better visual hierarchy for active state (gradient left border instead of solid)

---

## Phase 6: Coach Edit Profile — Premium Editor

### Goal
Give coaches a beautiful, comprehensive profile editor. Changes should persist to Supabase instantly.

### Changes

#### [MODIFY] `src/pages/coach-dashboard/CoachEditProfile.tsx`

**Current state**: 22KB file, basic form. Needs complete redesign.

**New design**:
1. **Live Preview** — Split layout: editor on left, live preview of public profile on right (or toggle). Changes reflect in real-time.

2. **Profile Photo** — Upload area with drag-and-drop. Use Supabase Storage to upload photos. Show circular crop preview. If no photo, show styled avatar with initials.

3. **Basic Info Section**:
   - Display Name
   - Headline (one-liner, e.g., "Ex-Goldman Sachs | Spring Week Expert")
   - Bio (rich text with character counter — keep under 500 chars)
   - Full Bio (longer description with formatting support — markdown or rich text)

4. **Credentials Section**:
   - University (searchable dropdown)
   - Credential Year
   - LinkedIn URL (validated)
   - Social Platform + URL + Follower count

5. **Categories** — Multi-select pill chips. Available categories relevant to the platform: Spring Weeks, Summer Internships, UCAT, Degree Apprenticeships, IELTS/TOEFL, Personal Statements, Interview Prep, Assessment Centres, Networking, CV/Resume, Cover Letters, Career Planning.

6. **Pricing Section**:
   - Hourly Rate (in £, convert to pence for storage)
   - Services manager — add/edit/delete services with name, description, duration, price
   - Packages manager — add/edit/delete multi-session packages

7. **Availability Manager**:
   - Visual weekly grid (Mon-Sun, time slots)
   - Toggle days on/off
   - Set start/end times per day
   - Visual confirmation of when students can book

8. **Save Behaviour**: Use `useUpdateCoachProfile()` mutation. Auto-save with debounce (500ms after last keystroke), or explicit "Save Changes" button with loading state. Show toast on success.

---

## Phase 7: Messaging System Polish

### Goal
Make messaging feel like a premium chat app. Should work perfectly for both students and coaches.

### Changes

#### [MODIFY] `src/pages/dashboard/DashboardMessages.tsx` and `src/pages/coach-dashboard/CoachMessages.tsx`

Both should share the same core messaging UI. Consider extracting a shared `MessagingView` component.

**Design**:
1. **Conversation List** (left panel):
   - Avatar + name + last message preview + timestamp
   - Unread badge (blue dot) for conversations with unread messages
   - Online indicator (optional, can be faked for now)
   - Sort by most recent activity
   - Search/filter conversations

2. **Chat Area** (right panel):
   - Message bubbles: own messages in accent colour (right-aligned), theirs in grey (left-aligned)
   - Timestamps grouped by day ("Today", "Yesterday", "Mon 24 Mar")
   - "Typing..." indicator (optional, via Supabase Realtime presence)
   - Auto-scroll to bottom on new messages
   - Message input with send button (Enter to send, Shift+Enter for newline)

3. **Empty State**: If no conversations, show "Start a conversation by messaging a coach from their profile" with a CTA to browse coaches.

4. **Realtime**: Already implemented in `useMessages()` hook with Supabase Realtime subscriptions. Test that messages appear instantly for both parties.

5. **Mark as Read**: When a conversation is opened, mark all messages as `is_read = true` for the recipient. Use a `useEffect` to trigger this.

---

## Phase 8: Events System

### Goal
Coaches can create free (and paid) events. Students can discover and register.

### Changes

#### [MODIFY] `src/pages/coach-dashboard/CoachEvents.tsx`
Redesign the event creation/management page:

1. **Event List** — Grid of coach's events (upcoming + past). Cards show: title, date/time, attendee count/max, category, status (draft/active/past).

2. **Create Event Modal/Form**:
   - Title, Description (rich text)
   - Event Type: Workshop, Bootcamp, AMA, Panel
   - Category (from platform categories)
   - Date/Time picker
   - Duration
   - Max attendees
   - Price (0 for free)
   - Meeting link (Zoom/Google Meet URL)
   - "Publish" vs "Save as Draft" buttons

3. **Event Management** — Edit, cancel, view registrations for each event.

#### [MODIFY] `src/pages/dashboard/DashboardEvents.tsx`
Student event discovery page:

1. **Category Filter Tabs** — All, Spring Weeks, UCAT, Degree Apprenticeships, etc.
2. **Event Cards** — Vibrant cards with: gradient category strip, title, host avatar + name, date/time, attendee count, "Free" badge or price, "Register" CTA.
3. **Registered Events Section** — Show events the student has registered for with "Add to Calendar" and "Join" buttons.
4. **On Register**: Insert into `event_registrations` table. Increment `current_attendees` on `events`.

---

## Phase 9: Resources System — Rich Editor

### Goal
Coaches can create and manage resources with a rich editing experience. Students can browse and access.

### Changes

#### [MODIFY] `src/pages/coach-dashboard/CoachResources.tsx`
1. **Resource List** — Grid of coach's resources with: title, type badge, download count, price, active/inactive toggle.
2. **Create Resource Form**:
   - Title, Description
   - Resource Type: Guide, Template, Checklist, Toolkit, Article
   - Category
   - Price (0 for free)
   - Content — Rich text editor (use a library like TipTap or ReactQuill). Support headings, bold, italic, lists, links, images.
   - File upload — Support PDF, DOCX, etc. via Supabase Storage.
   - Preview text — Shown before purchase/access.
3. **Toggle active/featured** — Quick actions on each resource card.

#### [MODIFY] `src/pages/dashboard/DashboardResources.tsx`
1. **Browse Resources** — Grid with category filters, type filters.
2. **Resource Cards** — Title, description preview, author avatar + name, type badge, price/"Free" badge, download count, "Access" CTA.
3. **Resource Detail View** — Full content display for free or purchased resources.

---

## Phase 10: Public Coach Profile Page

### Goal
The public profile page (`/coach/:coachId`) should be a conversion-optimised landing page for each coach.

### Changes

#### [MODIFY] `src/pages/CoachProfile.tsx`

**Leland-inspired design**:
1. **Hero Section** — Full-width gradient header with coach photo, name, headline, university/company badges, star rating + review count, response time indicator.

2. **About Section** — Full bio with rich formatting.

3. **Services Grid** — Each service as a card with: name, description, duration, price, "Book Now" CTA. Highlight "Free Intro" prominently.

4. **Packages** — Multi-session bundle cards with savings indicator ("Save 15%").

5. **Reviews Carousel** — Scrollable review cards with star rating, student name, outcome badge if applicable.

6. **Availability Preview** — Mini calendar showing available days this week.

7. **Events & Resources** — Show upcoming events and featured resources by this coach.

8. **Sticky CTA Bar** — Fixed bottom bar on mobile: "Book Free Intro · From £X/session". Uses `BookingModal` from Phase 4.

---

## Verification Plan

### Automated Tests
Run locally before pushing:
```bash
npm run dev          # Verify no compilation errors
npm run build        # Verify production build succeeds
```

### Manual Testing Checklist
1. **New Student Flow**: Login as `newstudent@earlyedge.co.uk` → see goal selector → browse coaches → book a free intro → verify booking appears in "Upcoming"
2. **Active Student Flow**: Login as `activestudent@earlyedge.co.uk` → see upcoming sessions → leave a review → browse events → register for event → message a coach
3. **Coach Flow**: Login as `sarah@earlyedge.co.uk` → see dashboard stats → check the booking from step 1 appears → reply to message → create an event → edit profile → verify changes on public profile
4. **Cross-flow Verification**: Booking by student appears on coach dashboard. Message from student shows for coach. Event created by coach shows for student.
5. **Realtime Messaging**: Open two browser tabs (student + coach), start a conversation, verify messages appear instantly in both.

### Browser Testing
Use the browser tool to verify pages render correctly at `http://localhost:5173/dashboard` and `http://localhost:5173/coach-dashboard`.

---

## Execution Order

1. **Phase 1** (Design System) — Do this first, everything else depends on it
2. **Phase 4** (Booking Flow) — Core business logic, must work
3. **Phase 2 + 3** (Student Dashboards) — Main student experience
4. **Phase 5** (Coach Dashboard) — Main coach experience
5. **Phase 6** (Coach Edit Profile) — Coach self-service
6. **Phase 7** (Messaging) — Polish existing system
7. **Phase 8** (Events) — Enhancement
8. **Phase 9** (Resources) — Enhancement
9. **Phase 10** (Public Profile) — Conversion optimisation

> [!IMPORTANT]
> After completing all phases, run `npm run build` to verify no TypeScript/build errors, then `git add . && git commit -m "feat: complete dashboard overhaul" && git push` to deploy.

---

## Key Psychological & Sales Tactics to Apply

1. **Urgency**: "Only 3 spots left this week" on coach cards
2. **Social proof**: Review counts, session counts, outcomes everywhere
3. **Loss aversion**: "Don't miss your Spring Week deadline — 6 weeks left"
4. **Scarcity**: "Limited availability" badges on popular coaches
5. **Reciprocity**: Free intro calls prominently featured
6. **Anchoring**: Show higher hourly rate crossed out next to package price
7. **Progress/Commitment**: Gamified progress bars, streak counters
8. **Authority**: University badges, company logos, verified badges
9. **Personalisation**: "Recommended for you" based on stated goals
10. **Micro-commitments**: Goal selector leads to coach recommendations leads to booking
