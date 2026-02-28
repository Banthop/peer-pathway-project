# EarlyEdge — Complete Technical & Business Context

> This document is the single source of truth for building EarlyEdge. Feed this to your AI agent before any task. It contains business logic, technical requirements, design system, database schema, API contracts, payment flows, and all decisions made to date.

---

## 1. What Is EarlyEdge

EarlyEdge is a two-sided peer coaching marketplace. Students book 1-on-1 sessions with coaches who are students or recent graduates that recently achieved something competitive — Spring Weeks at investment banks, Oxbridge offers, UCAT scores, training contracts at magic circle law firms, tech internships at FAANG companies.

**Core value proposition:** Learn from someone who just did it. Not career coaches who did it 10 years ago and charge £150+/hour. Peers who did it in the last 1-3 years, remember everything, and charge £25-60/hour.

**Target market:** UK students. Demand side = sixth formers applying to uni, university students applying for internships/graduate roles. Supply side = students and recent grads who achieved competitive outcomes.

**Revenue model:** Platform takes commission on paid sessions, group events, and paid resources. Free intro calls (15 min) have no charge.

### Revenue Streams

**1-on-1 Sessions & Packages (Core)**
- Coaches set their own per-session prices (typically £25-60/hour)
- Packages (3-5 sessions) are the default, not an upsell — 3.75x higher AOV

**Group Sessions / Workshops:**
- Coaches create ticketed group events (workshops, bootcamps, AMAs, panels)
- Pricing: typically £15-25 per attendee for workshops, £50-100 for multi-session bootcamps
- Platform takes the same commission as 1-on-1 sessions
- Example: "Spring Week Conversion Workshop" — 1 coach, 15 students, £20 each = £300 total

**Paid Resources / Digital Products:**
- Coaches upload and sell guides, templates, checklists, toolkits
- Pricing: £5-15 per resource (impulse purchase territory for students)
- Free resources exist as lead magnets — require account creation to access
- Platform takes 20% of paid resource sales
- Example: "My exact Goldman Sachs application — annotated" — £10, sells repeatedly with zero marginal cost

**Events (Larger Scale):**
- Ticketed webinars, panels, live Q&As
- Pricing: £10-20 per ticket, 20-50+ attendees
- Example: "AMA with a Goldman Sachs Analyst — £10, 50 spots"

> The revenue stack is designed so a single student can spend money in multiple ways: free intro → paid session/package → group workshop → paid resource → more sessions. Average revenue per student should increase over time as more products become available.

### Commission Structure
- **New coaches (first 5 sessions):** 30% platform commission
- **After 5 completed sessions:** 20% platform commission
- **Founding coaches (first 3 months from launch):** 0% commission
- Alternative framing for coaches: "20% standard rate, with a 10% new coach fee that disappears after 5 sessions"

### Pricing
- Coaches set their own prices
- Typical range: £25-60/hour
- Average session: ~£40
- Average package: ~£150
- UCAT packages: ~£175 (parents pay, higher price tolerance)
- Premium pricing for high-stakes moments (final round prep): £80-100/session

### Key Business Decisions
1. Coaches can be students OR recent grads (within 2-3 years of achievement)
2. Coach churn is expected — students become coaches, knowledge stays fresh
3. Packages are the default, not an upsell — push packages over single sessions (3.75x higher AOV)
4. Parents pay for UCAT/Oxbridge — different price sensitivity
5. Launch Feb 15 even if imperfect — speed over perfection
6. 10% discount for student referrals
7. Sponsored/featured coach profiles (clearly labelled) as future revenue stream
8. Cold emailing is its own coaching category
9. Internship conversion is a significant market (even without converting, the process knowledge is valuable)
10. Spring Weeks > Summers for coaching (you can only do one summer)

### Categories (22 total)

**Original 12:**
Investment Banking, Consulting, Law (Vac Schemes), Law (Training Contracts), UCAT, STEP, Oxbridge Applications, University Applications, Software Engineering, Quant Finance, Cold Emailing, Internship Conversion

**New 10:**
Assessment Centre Prep, IELTS / TOEFL, SQE Prep, Scholarship Applications, Graduate Schemes, Dissertation Coaching, CV & Application Review, LinkedIn & Professional Branding, Medical School (MMI), First-Class Degree Coaching

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React (via Lovable / Antigravity) | Single page app with client-side routing |
| Backend / Database | Supabase (PostgreSQL + Auth + Realtime) | Hosted PostgreSQL, built-in auth, row-level security, realtime subscriptions |
| Payments | Stripe Connect | Marketplace payments — platform collects, splits to coaches |
| Scheduling | Cal.com or custom build | Automated emails: 24hrs before, 1hr before, 24hrs after (review prompt) |
| Video Calls | Zoom or Google Meet links | External links, not built in-app |
| Email | Resend or SendGrid | Transactional emails (booking confirmations, reminders, review prompts) |
| Email Marketing | Mailchimp | Newsletter, drip campaigns, coach newsletters (post-funding) |
| Hosting/Deploy | Vercel | Auto-deploy from GitHub on push |
| Repo | GitHub | Shared between founders |

### Supabase Specifics
- Use Supabase Auth for all authentication (email/password + Google OAuth)
- Use Supabase Realtime for messaging between students and coaches
- Use Supabase Storage for profile photos and file uploads (CVs, documents)
- Use Row Level Security (RLS) on all tables
- Use Supabase Edge Functions for server-side logic (Stripe webhooks, commission calculations)

---

## 3. Design System

### Typography
- **Primary font:** Inter (weights: 300 Light, 400 Regular, 500 Medium, 600 Semi Bold, 700 Bold, 800 Extra Bold)
- **No serif font.** No Instrument Serif anywhere. Not for headings, not for the logo, not for display text.
- **Google Fonts import:** `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap`

### Font Sizes (Reference Scale)
| Element | Size | Weight | Font |
|---------|------|--------|------|
| Hero headline | 48-64px | 700-800 | Inter |
| Page title | 24-28px | 700 | Inter |
| Section heading | 16-18px | 600 | Inter |
| Sub-heading / label | 13px | 600 | Inter |
| Body text | 13-14px | 400 | Inter |
| Light body / secondary | 13-14px | 300 | Inter |
| Small text / metadata | 11-12px | 400-500 | Inter |
| Tiny labels (uppercase) | 10-11px | 600, uppercase, tracking wide | Inter |
| Button text | 13px | 600 | Inter |

### Colours
**EarlyEdge is strictly black and white. No accent colours.**

| Token | Value | Usage |
|-------|-------|-------|
| `--black` | `#111111` | Primary text, primary buttons, dark cards |
| `--white` | `#FFFFFF` | Backgrounds, button text on dark |
| `--bg` | `#FAFAFA` | Page background |
| `--card-bg` | `#FFFFFF` | Card backgrounds |
| `--border` | `#E8E8E8` | Card borders, dividers |
| `--border-light` | `#F0F0F0` | Internal dividers within cards |
| `--text-primary` | `#111111` | Headings, important text |
| `--text-secondary` | `#555555` | Body text, bios |
| `--text-tertiary` | `#888888` | Credentials, secondary info |
| `--text-muted` | `#999999` | Timestamps, metadata, placeholders |
| `--text-faint` | `#CCCCCC` | Disabled states, separators |
| `--hover-bg` | `#F5F5F5` | Hover states on list items |
| `--tag-bg` | `#F5F5F5` | Category tag backgrounds |
| `--dark-card-bg` | `#111111` | Hero cards (next session) |
| `--dark-card-secondary` | `#222222` | Elements within dark cards |
| `--dark-card-border` | `#444444` | Borders within dark cards |
| `--dark-card-text` | `#888888` | Secondary text on dark cards |
| `--online-green` | `#22C55E` | Online indicator dot only (messaging) |

### Spacing
- Section gaps: 32-40px
- Card padding: 20-28px
- Internal card spacing: 10-14px between elements
- Border radius (cards): 10-12px
- Border radius (buttons): 6-8px
- Border radius (pills/tags): 20px

### Component Patterns

**Primary Button (dark):**
```css
background: #111; color: #fff; border: none; border-radius: 8px;
padding: 11px 24px; font-size: 13px; font-weight: 600;
```

**Secondary Button (outline):**
```css
background: #fff; color: #111; border: 1px solid #e8e8e8; border-radius: 8px;
padding: 10px 20px; font-size: 13px; font-weight: 500;
```

**Card:**
```css
background: #fff; border: 1px solid #e8e8e8; border-radius: 12px;
padding: 22px 24px; transition: all 0.25s ease;
/* Hover: border-color #bbb, translateY(-2px), box-shadow 0 4px 20px rgba(0,0,0,0.06) */
```

**Dark Hero Card:**
```css
background: #111; border-radius: 14px; padding: 28px 32px; color: #fff;
```

**Category Tag:**
```css
font-size: 10.5-12px; padding: 3-6px 10-14px; background: #f5f5f5;
border-radius: 20px; color: #666;
```

**Dashed Nudge/Alert:**
```css
background: #fff; border: 1px dashed #d0d0d0; border-radius: 10px; padding: 14px 24px;
```

**Star Rating:** Black filled stars (#111) for rated, #ccc stroke for unrated. SVG-based.

### Logo
`Early` in Inter Light (weight 300) + `Edge` in Inter Bold (weight 700). No icon. Text only. Font size ~22px in sidebar.

### Sidebar Navigation
- Width: 220px, fixed position
- Active state: font-weight 600, color #111, 2px solid #111 left border
- Inactive state: font-weight 400, color #888, transparent left border
- Notification dots: 6px black circles aligned right

---

## 4. Database Schema

### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('student', 'coach', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Auth handled by Supabase Auth; this table extends the auth.users table
-- Link via: id = auth.users.id
```

### `coaches`
```sql
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  bio TEXT,
  full_bio TEXT,
  headline TEXT NOT NULL, -- e.g., "Goldman Sachs Spring Week '24"
  credential_year INTEGER,
  university TEXT, -- e.g., "Oxford '24"
  categories TEXT[] NOT NULL, -- e.g., {'Investment Banking', 'Spring Week'}
  hourly_rate INTEGER NOT NULL, -- in pence (e.g., 5000 = £50)
  photo_url TEXT,
  linkedin_url TEXT,
  verified BOOLEAN DEFAULT false,
  stripe_account_id TEXT,
  stripe_onboarded BOOLEAN DEFAULT false,
  total_sessions INTEGER DEFAULT 0,
  commission_rate INTEGER DEFAULT 30, -- percentage, drops to 20 after 5 sessions
  is_founding_coach BOOLEAN DEFAULT false, -- 0% commission for first 3 months
  founding_coach_expires_at TIMESTAMPTZ,
  social_platform TEXT, -- 'tiktok', 'youtube', 'linkedin', 'instagram', null
  social_url TEXT,
  social_followers INTEGER,
  is_featured BOOLEAN DEFAULT false, -- sponsored/featured profile
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for browsing
CREATE INDEX idx_coaches_categories ON coaches USING GIN (categories);
CREATE INDEX idx_coaches_active ON coaches (is_active) WHERE is_active = true;
CREATE INDEX idx_coaches_rate ON coaches (hourly_rate);
```

### `coach_packages`
```sql
CREATE TABLE coach_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "Spring Week Sprint"
  description TEXT,
  session_count INTEGER NOT NULL,
  price INTEGER NOT NULL, -- in pence (total package price)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `coach_services`
```sql
CREATE TABLE coach_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., "CV Review", "Mock Interview", "Application Strategy"
  description TEXT,
  duration INTEGER NOT NULL DEFAULT 60, -- minutes
  price INTEGER, -- in pence, null = use coach hourly rate
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `availability`
```sql
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_availability_coach ON availability (coach_id, day_of_week);
```

### `bookings`
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  service_id UUID REFERENCES coach_services(id),
  package_id UUID REFERENCES coach_packages(id),
  type TEXT NOT NULL CHECK (type IN ('intro', 'session', 'package_session')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  price INTEGER NOT NULL DEFAULT 0, -- in pence (0 for intro calls)
  commission_amount INTEGER DEFAULT 0, -- in pence, calculated at booking time
  commission_rate INTEGER, -- snapshot of rate at booking time
  meeting_link TEXT,
  notes TEXT, -- student can add prep notes
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id),
  cancellation_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_bookings_coach ON bookings (coach_id, scheduled_at);
CREATE INDEX idx_bookings_student ON bookings (student_id, scheduled_at);
CREATE INDEX idx_bookings_status ON bookings (status);
```

### `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE UNIQUE NOT NULL,
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text TEXT,
  outcome_badge TEXT, -- e.g., "Landed Goldman SW", "Oxford PPE Offer"
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_coach ON reviews (coach_id, created_at DESC);
```

### `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL, -- derived from booking or coach-student pair
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages (conversation_id, created_at);
CREATE INDEX idx_messages_unread ON messages (recipient_id, is_read) WHERE is_read = false;
```

### `conversations`
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(coach_id, student_id)
);
```

### `referrals`
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) NOT NULL,
  referred_id UUID REFERENCES users(id),
  referral_code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER DEFAULT 10,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `season_banners`
```sql
CREATE TABLE season_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, -- "Spring Week season is open"
  subtitle TEXT, -- "applications close in 6 weeks"
  link_text TEXT, -- "View Spring Week coaches →"
  link_category TEXT, -- category to filter to
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `trending_topics`
```sql
CREATE TABLE trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `events`
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('workshop', 'bootcamp', 'ama', 'panel')),
  category TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  max_attendees INTEGER NOT NULL DEFAULT 20,
  current_attendees INTEGER DEFAULT 0,
  price INTEGER NOT NULL DEFAULT 0, -- pence
  meeting_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `event_registrations`
```sql
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, student_id)
);
```

### `resources`
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('guide', 'template', 'checklist', 'toolkit', 'article')),
  price INTEGER NOT NULL DEFAULT 0, -- pence (0 = free)
  file_url TEXT,
  preview_text TEXT,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `resource_purchases`
```sql
CREATE TABLE resource_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(resource_id, student_id)
);
```

---

## 5. Row Level Security (RLS) Policies

```sql
-- Users can read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Coaches: public read for active coaches, coach can edit own
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active coaches" ON coaches FOR SELECT USING (is_active = true);
CREATE POLICY "Coach can update own profile" ON coaches FOR UPDATE USING (auth.uid() = user_id);

-- Bookings: student and coach can see their own
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = student_id OR auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id));
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Reviews: public read, student can create for their completed bookings
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public reviews" ON reviews FOR SELECT USING (is_public = true);
CREATE POLICY "Student can create review" ON reviews FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Messages: only sender and recipient can see
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Availability: public read, coach can edit own
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view availability" ON availability FOR SELECT USING (true);
CREATE POLICY "Coach can manage availability" ON availability FOR ALL USING (auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id));

-- Packages/Services: public read, coach can manage own
ALTER TABLE coach_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view packages" ON coach_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Coach can manage packages" ON coach_packages FOR ALL USING (auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id));

ALTER TABLE coach_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON coach_services FOR SELECT USING (is_active = true);
CREATE POLICY "Coach can manage services" ON coach_services FOR ALL USING (auth.uid() IN (SELECT user_id FROM coaches WHERE id = coach_id));

-- Trending topics: anyone can read active
ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active topics" ON trending_topics FOR SELECT USING (is_active = true);

-- Events: public read for active, coaches manage own
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active events" ON events FOR SELECT USING (is_active = true);
CREATE POLICY "Coaches manage their events" ON events FOR ALL USING (
  coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
);

-- Event registrations: students see own, coaches see their event's
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own registrations" ON event_registrations FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Coaches see their event registrations" ON event_registrations FOR SELECT USING (
  event_id IN (SELECT id FROM events WHERE coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()))
);
CREATE POLICY "Students can register" ON event_registrations FOR INSERT WITH CHECK (student_id = auth.uid());

-- Resources: public read for active, coaches manage own
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active resources" ON resources FOR SELECT USING (is_active = true);
CREATE POLICY "Coaches manage their resources" ON resources FOR ALL USING (
  coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid())
);

-- Resource purchases: students see own
ALTER TABLE resource_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students see own purchases" ON resource_purchases FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can purchase" ON resource_purchases FOR INSERT WITH CHECK (student_id = auth.uid());
```

---

## 6. API Endpoints

All API calls go through Supabase client library. For complex operations, use Supabase Edge Functions.

### Auth (Supabase Auth Built-in)
```
POST   supabase.auth.signUp({ email, password, options: { data: { name, type } } })
POST   supabase.auth.signInWithPassword({ email, password })
POST   supabase.auth.signInWithOAuth({ provider: 'google' })
POST   supabase.auth.resetPasswordForEmail(email)
POST   supabase.auth.updateUser({ password })
POST   supabase.auth.signOut()
```

### Coaches — Browse & Discovery
```
GET    /coaches                         -- List active coaches, with filters
       ?category=Investment Banking
       ?min_rate=2500&max_rate=6000     -- in pence
       ?sort=recommended|rating|price_asc|price_desc
       ?search=goldman
       ?limit=20&offset=0

GET    /coaches/:id                     -- Full coach profile
GET    /coaches/:id/reviews             -- Paginated reviews
GET    /coaches/:id/packages            -- Active packages
GET    /coaches/:id/services            -- Active services
GET    /coaches/:id/availability        -- Weekly availability slots
```

### Coach Self-Management
```
PUT    /coaches/:id                     -- Update own profile (bio, rate, categories, photo)
PUT    /coaches/:id/availability        -- Set weekly availability
POST   /coaches/:id/packages            -- Create package
PUT    /coaches/:id/packages/:pid       -- Update package
DELETE /coaches/:id/packages/:pid       -- Deactivate package
POST   /coaches/:id/services            -- Create service
PUT    /coaches/:id/services/:sid       -- Update service
```

### Bookings
```
POST   /bookings                        -- Create booking
       { coach_id, service_id?, package_id?, type, scheduled_at, duration }
GET    /bookings/:id                    -- Get booking details
PUT    /bookings/:id                    -- Update (reschedule)
PUT    /bookings/:id/cancel             -- Cancel booking
PUT    /bookings/:id/complete           -- Mark completed (auto or manual)
POST   /bookings/:id/review            -- Leave review
       { rating, text, outcome_badge? }
```

### Student Dashboard
```
GET    /student/dashboard               -- Aggregate: next session, upcoming, past, nudges
GET    /student/bookings?status=upcoming|past|all
GET    /student/coaches                 -- Coaches the student has booked with before
```

### Coach Dashboard
```
GET    /coach/dashboard                 -- Aggregate: upcoming sessions, earnings summary, recent reviews
GET    /coach/bookings?status=upcoming|past|all
GET    /coach/earnings                  -- Total earned, pending, history by month
GET    /coach/earnings/breakdown        -- Per-session breakdown with commission details
```

### Messages
```
GET    /conversations                   -- List conversations for current user
GET    /conversations/:id/messages      -- Messages in conversation, paginated
POST   /conversations/:id/messages      -- Send message { content }
PUT    /messages/:id/read               -- Mark as read
GET    /conversations/unread-count      -- Total unread across all conversations

-- Realtime: subscribe to messages table filtered by conversation_id
```

### Admin
```
GET    /admin/dashboard                 -- Total revenue, bookings, coaches, students, growth
GET    /admin/coaches                   -- All coaches with status
PUT    /admin/coaches/:id/verify        -- Verify coach credentials
PUT    /admin/coaches/:id/deactivate    -- Remove underperformer
GET    /admin/bookings                  -- All bookings with filters
GET    /admin/revenue                   -- Revenue breakdown by period
POST   /admin/season-banners            -- Create/update seasonal banners
```

### Events
```
GET  /events              -- list active events with filters (category, date range, coach)
GET  /events/:id          -- single event with attendee count
POST /events              -- create event (coach only)
PUT  /events/:id          -- update event (owning coach only)
POST /events/:id/register -- register for event (creates event_registration, triggers Stripe if paid)
```

### Resources
```
GET  /resources            -- list active resources with filters (category, type, free/paid)
GET  /resources/:id        -- single resource (preview for paid, full for purchased/free)
POST /resources            -- create resource (coach only, file upload to Supabase Storage)
PUT  /resources/:id        -- update resource (owning coach only)
POST /resources/:id/purchase -- purchase resource (creates resource_purchase, triggers Stripe)
GET  /resources/:id/download -- download file (only if purchased or free)
```

### Trending Topics
```
GET /trending-topics -- list active trending topics sorted by sort_order
```

---

## 7. Stripe Connect Payment Flow

### Setup
1. Platform creates Stripe Connect account (Standard or Express)
2. Each coach goes through Stripe Connect onboarding to create their connected account
3. Platform stores `stripe_account_id` on coach record

### Booking Payment Flow
```
1. Student selects session/package and proceeds to checkout
2. Frontend calls Edge Function: create-payment-intent
3. Edge Function:
   a. Calculates total price
   b. Determines commission rate (30% first 5 sessions, 20% after, 0% founding coaches)
   c. Creates Stripe PaymentIntent with:
      - amount: total in pence
      - application_fee_amount: commission in pence
      - transfer_data: { destination: coach_stripe_account_id }
   d. Returns client_secret to frontend
4. Frontend uses Stripe.js to confirm payment
5. Stripe webhook (payment_intent.succeeded):
   a. Update booking status to 'confirmed'
   b. Store stripe_payment_intent_id on booking
   c. Send confirmation email to student and coach
6. Free intro calls skip Stripe entirely — just create booking with price=0

-- Commission calculation function
CREATE OR REPLACE FUNCTION calculate_commission(p_coach_id UUID, p_amount INTEGER)
RETURNS TABLE(commission_rate INTEGER, commission_amount INTEGER, coach_amount INTEGER) AS $$
DECLARE
  v_coach coaches%ROWTYPE;
  v_rate INTEGER;
BEGIN
  SELECT * INTO v_coach FROM coaches WHERE id = p_coach_id;

  -- Founding coach with active exemption
  IF v_coach.is_founding_coach AND v_coach.founding_coach_expires_at > now() THEN
    v_rate := 0;
  -- Under 5 sessions: 30%
  ELSIF v_coach.total_sessions < 5 THEN
    v_rate := 30;
  -- 5+ sessions: 20%
  ELSE
    v_rate := 20;
  END IF;

  RETURN QUERY SELECT
    v_rate,
    (p_amount * v_rate / 100)::INTEGER,
    (p_amount - (p_amount * v_rate / 100))::INTEGER;
END;
$$ LANGUAGE plpgsql;
```

### After Session
```
1. Session marked completed (manually by coach, or auto 30min after scheduled end)
2. Stripe automatically transfers funds to coach (minus application_fee)
3. 24 hours after: send review prompt email to student
4. If refund requested within 24 hours of first session: full refund via Stripe
```

### Event Payment Flow
1. Student clicks "Register" on an event
2. If event price > 0: Edge Function creates PaymentIntent with `application_fee_amount` (commission)
3. Frontend confirms payment via Stripe Elements
4. On success: create `event_registration`, increment `current_attendees`
5. If event price = 0: create `event_registration` directly, no Stripe

### Resource Payment Flow
1. Student clicks "Get access" on a paid resource
2. Edge Function creates PaymentIntent with `application_fee_amount` (commission)
3. Frontend confirms payment via Stripe Elements
4. On success: create `resource_purchase`, reveal download link
5. Free resources skip Stripe — require account creation only

### Payment Splitting for Packages
For packages over £100, offer "Pay per session" option:
- Default display: "Pay per session: £30 × 5"
- Alternative: "Pay upfront and save 5%: £142"
- Stripe charges per session before each scheduled session

---

## 8. Auth Flow

### Student Sign Up
```
1. Student enters: name, email, password
2. OR clicks "Sign in with Google"
3. Supabase creates auth.users record
4. Trigger function creates users record with type='student'
5. Redirect to student dashboard (empty state)
```

### Coach Sign Up
```
1. Coach enters: name, email, password, LinkedIn URL
2. Supabase creates auth.users record
3. Trigger function creates users record with type='coach'
4. Trigger function creates coaches record with defaults
5. Redirect to coach profile setup page
6. Coach fills in: bio, headline, credential year, categories, hourly rate, services, packages, availability, photo
7. Coach profile stays hidden until admin manually verifies (verified=false)
8. Admin reviews LinkedIn, requests screenshot of offer letter/email
9. Admin sets verified=true → coach appears in browse
```

### Supabase Trigger
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'type', 'student')
  );

  IF NEW.raw_user_meta_data->>'type' = 'coach' THEN
    INSERT INTO coaches (user_id, headline, categories, hourly_rate)
    VALUES (NEW.id, '', '{}', 4000); -- defaults, coach fills in later
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 9. Coach Verification

All coaches are manually verified before going live.

**Process:**
1. Coach signs up and completes profile
2. Admin dashboard shows unverified coaches
3. Admin checks:
   - LinkedIn profile matches claimed credential
   - Screenshots of offer letter/email if needed
   - Bio is genuine and not AI-generated
4. Admin sets `verified = true` on coaches table
5. Coach appears in Browse Coaches

**Note:** LinkedIn API access requires application and approval, so credential verification is manual for now. Coach enters their LinkedIn URL on signup, admin checks it manually.

---

## 10. Booking Flow (User Journey)

### Free Intro Call
```
1. Student on coach profile → clicks "Book free intro"
2. Sees coach availability for next 2 weeks (15-min slots only)
3. Selects time slot
4. Confirms booking (no payment)
5. System creates booking with type='intro', price=0
6. Both receive confirmation email with Google Meet/Zoom link
7. After call: student decides whether to book paid sessions
```

### Single Paid Session
```
1. Student on coach profile → clicks "Book a session"
2. Selects service type (CV Review, Mock Interview, etc.)
3. Sees availability for selected duration
4. Selects time slot
5. Checkout page: order summary, price, Stripe payment form
6. Payment processed → booking confirmed
7. Both receive confirmation email with meeting link
8. Student can send prep materials via Messages
9. After session: auto-marked completed, review prompt sent 24hrs later
```

### Package Purchase
```
1. Student on coach profile → clicks "Book package"
2. Sees package details (name, session count, price, per-session price, savings)
3. Pays full package price upfront via Stripe
4. System creates booking records for each session (initially unscheduled)
5. Student schedules sessions one at a time from their dashboard
6. Each session follows the standard session flow
```

---

## 11. Email Automation

Using Cal.com integration or custom via Resend/SendGrid:

| Trigger | Recipient | Timing | Content |
|---------|-----------|--------|---------|
| Booking confirmed | Both | Immediate | Confirmation + meeting link |
| Session reminder | Both | 24 hours before | Reminder + prep notes |
| Session reminder | Both | 1 hour before | Quick reminder + meeting link |
| Session completed | Student | 24 hours after | Review prompt with link |
| Review received | Coach | Immediate | Notification of new review |
| New message | Recipient | 5 min delay (if unread) | "You have a new message from..." |
| Coach verified | Coach | Immediate | "Your profile is now live!" |
| Welcome | New user | Immediate | Welcome + getting started guide |

---

## 12. Verticals / Categories

| Category | Description | Seasonality |
|----------|-------------|-------------|
| Investment Banking | Spring Weeks, internships, graduate roles | Sep-Nov applications |
| Consulting | McKinsey, BCG, Bain, etc. Case interview prep | Rolling |
| Law (Vacation Schemes) | Vac scheme applications | Feb-Apr deadlines |
| Law (Training Contracts) | TC applications | Rolling |
| UCAT | Medical school admissions test | Apr-Aug (tests Jul-Sep) |
| STEP | Cambridge maths admissions test | Jan-Jun (exam in June) |
| Oxbridge Applications | Personal statements, interviews, admissions tests | Apr-Oct |
| University Applications | Personal statements, UCAS | Jun-Jan |
| Software Engineering | Tech internships, coding interviews | Rolling, some Aug-Nov |
| Quant Finance | Quant roles, technical prep | Similar to banking |
| Cold Emailing | Networking and outreach strategy for internships across all industries | Rolling |
| Internship Conversion | Converting Spring Week/internship to full-time offer | Mar-Apr |

---

## 13. Frontend Pages — Complete List

### Public Pages (No Auth)
| Page | Status | Notes |
|------|--------|-------|
| Landing page | Needs fixes | Hero copy, hide reviews until real, add FAQ, add "Become a Coach" CTA |
| Browse coaches | Needs build | Filters, search, sort, coach cards, mobile responsive |
| Coach profile (public) | Needs build | Full bio, reviews, packages, services, booking CTAs |
| How it works | Done | — |
| FAQ | Not started | 6-8 questions |
| Become a Coach | Needs build | Benefits, earnings potential, sign up CTA |

### Auth Pages
| Page | Status | Notes |
|------|--------|-------|
| Student sign up | Done | Email, password, name + Google OAuth |
| Student log in | Done | Email/password + Google |
| Coach sign up | Not started | Email, password, name, LinkedIn URL |
| Coach log in | Not started | Same as student login, routes to coach dashboard |
| Forgot password | Done | Email input → reset link |

### Student Pages (Auth Required)
| Page | Status | Notes |
|------|--------|-------|
| Student dashboard | Design done | Overview with sessions, nudges, recommendations |
| Browse coaches (logged in) | Design done | Same as public but with "Book again" for past coaches |
| Coach profile (logged in) | Design done | Same as public but with booking flow |
| My Bookings | Design done | Upcoming/Past tabs, reschedule, cancel, review |
| Messages | Design done | Conversation list + chat thread |
| Checkout | Not started | Order summary, Stripe Elements payment form |
| Booking confirmation | Not started | Success page with details + calendar add |
| Leave review | Not started | Star rating, text, optional outcome badge |
| Settings | Not started | Name, email, password change |
| `/dashboard/resources` | Not started | `DashboardResources`: Browse free and paid resources from coaches |

**Updated navigation:**
- Student sidebar: Overview, Browse Coaches, Events, Resources, My Bookings, Messages
- Coach sidebar: Overview, Sessions, Events, Resources, Messages, Earnings, Reviews, Edit Profile, Analytics

### Coach Pages (Auth Required)
| Page | Status | Notes |
|------|--------|-------|
| Coach dashboard | Not started | Upcoming sessions, earnings summary, recent reviews, quick stats |
| Coach profile setup/edit | Not started | Photo, bio, headline, credential, categories, services, packages, rate |
| Availability settings | Not started | Weekly calendar, set time slots |
| Coach earnings | Not started | Total earned, pending, history by month, per-session breakdown |
| Coach bookings | Not started | Upcoming/past, student details, session notes |
| Coach messages | Not started | Same messaging system as student side |

### Admin Pages
| Page | Status | Notes |
|------|--------|-------|
| Admin dashboard | Not started | Total revenue, bookings count, coach count, student count |
| Coach management | Not started | List all coaches, verify/deactivate, view profiles |
| Booking management | Not started | All bookings, filter by status |
| Revenue reporting | Not started | Revenue by period, by coach, by category |
| Season banner management | Not started | Create/edit/deactivate seasonal banners |

---

## 14. Current Status (As of Feb 10, 2026)

### Done
- Landing page design: ~80% (needs FAQ, footer fixes, Become a Coach CTA)
- How it works page: Complete
- Student auth: Complete (sign up, log in, forgot password)
- Student dashboard design: Complete (all states including empty state)
- Coach card design: Complete (with packages, bio, stats, review snippet)
- Browse coaches design: Complete (filters, search, sort, grid)
- My Bookings design: Complete (upcoming/past tabs)
- Messages design: Complete (conversation list + chat)
- Coach profile page design: Complete (full bio, reviews, booking sidebar with packages)
- Google Form for coach applications: Planning stage
- Outreach templates: Planning stage

### Not Started
- All backend (Supabase setup, schema, RLS, auth, APIs)
- Coach auth pages (sign up, log in)
- All coach-side pages
- Admin dashboard
- Stripe Connect integration
- Email automation
- Cal.com or scheduling integration
- Real data replacing dummy data
- Mobile responsiveness across all pages

---

## 15. Launch Targets

**Launch date:** February 15, 2026

**Before launch must-haves:**
- 20 coaches recruited and profiles live
- Student auth flow (sign up, log in)
- Browse coaches with filters
- Coach profile page with booking
- Free intro call booking (no payment)
- Paid session booking with Stripe
- Student dashboard (basic)
- Coach dashboard (basic)
- Messaging between student and coach

**Revenue targets:**
- End of Feb: £376
- End of Mar: £1,606 cumulative
- End of Jun: £6,676 cumulative
- End of Dec: £31,000 cumulative

**Funding threshold (June 2026):**
- 50+ paid sessions completed
- £5k+ cumulative revenue
- 30+ coaches
- 15+ reviews with outcomes
- Target investor: Houghton Street Ventures (LSE-focused fund)

---

## 16. Important Implementation Notes

1. **All monetary values stored in pence** (integer, not float). £50 = 5000. Display as `£${(amount / 100).toFixed(2)}` or `£${amount / 100}` for whole numbers.

2. **Coach ratings:** Hide rating until coach has 5+ reviews. Show "New coach" badge instead. Never show empty stars or 0.0 ratings.

3. **Session counts:** Hide session count until coach has completed 3+ sessions. Show "New coach" badge instead.

4. **Credential year on everything.** Always display the year alongside credentials: "Goldman Sachs Spring Week '24" not "Goldman Sachs Spring Week". Freshness is a core selling point.

5. **Packages are the priority.** Every coach profile should prominently display packages above single session pricing. The "Coaches you might like" cards on the dashboard show the package inline.

6. **Free intro is the top of funnel.** For coaches the student hasn't booked with, the primary CTA is always "Book free intro" not "Book session."

7. **Reviews only from completed paid sessions.** Never from intro calls. Include optional outcome badge: "Landed Goldman SW", "Oxford PPE Offer", etc.

8. **Refund policy:** "Not satisfied with your first session? Email us within 24 hours for a full refund." Handle manually for now.

9. **Commission updates automatically.** After a coach's 5th completed session, their commission_rate column should update from 30 to 20. Use a database trigger:

```sql
CREATE OR REPLACE FUNCTION update_commission_after_session()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE coaches SET
      total_sessions = total_sessions + 1,
      commission_rate = CASE
        WHEN total_sessions + 1 >= 5 THEN 20
        ELSE commission_rate
      END
    WHERE id = NEW.coach_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_completed
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_commission_after_session();
```

10. **Timezone:** All times stored in UTC. Display in Europe/London timezone on frontend. Use `Intl.DateTimeFormat` with `timeZone: 'Europe/London'`.

11. **Meeting links:** Auto-generate Google Meet links using Google Calendar API, or let coaches paste their own Zoom/Meet links. Start with manual (coach pastes link), automate later.

12. **File uploads:** Students should be able to attach CVs/documents in messages. Use Supabase Storage with a 10MB file size limit. Allowed types: PDF, DOCX, PNG, JPG.

---

## 17. Pricing Display Rules

### Per-Session Framing
- Always show per-session price as the primary/largest number
- Total package price is secondary, smaller text
- Crossed-out "individual session price × sessions" shows savings
- Example: "**£30/session** · 5 sessions · £150 total · ~~£200 individually~~"

### Three-Tier Display
Every coach profile shows three options side by side:
1. **Single session** (highest per-session price — serves as anchor/decoy)
2. **Main package** (highlighted as "Most popular" — the option you want them to buy)
3. **Shorter package** (mid-tier option for price-sensitive students)

The primary CTA below all tiers is always "Book free intro — 15 min, no charge." The tiers are informational — purchase happens after the free intro.

### Anchoring
Show a subtle comparison on coach profiles:
- Default: "Typical career coach: £150+/hr → EarlyEdge coaches: from £X/session"
- UCAT: "UCAT prep courses: £500-2,000 → 1-on-1 coaching: from £35/session"
- SQE: "SQE prep courses: £3,000+ → 1-on-1 coaching: from £30/session"

### Package Naming
All packages must be outcome-focused. Never "5 Session Bundle."
Examples: "Spring Week Conversion Programme", "Vac Scheme Secured", "UCAT Score Boost: 2800→3100+", "Cold Email Masterclass"

### No Empty Social Proof
- Do NOT show star ratings until a coach has 3+ reviews
- Do NOT show session counts until a coach has 3+ sessions
- Do NOT show "New coach" badges at launch (when everyone is new, it's meaningless)
- Simply omit these elements. Show them only when real data exists.
- Credentials (firm/university logos + headline) serve as the trust signal until reviews accumulate.

### Founding Coach Pricing
For founding coaches: show "Founding price: £25/session ~~(normally £35)~~" with "Founding prices end [date]"

---

## 18. Landing Page Structure

1. **Seasonal banner** — thin, dismissible, pulls from `season_banners` table. Shows current urgent deadlines.
2. **Header** — EarlyEdge | Browse | Become a Coach | How it works | Log in | Get Started
3. **Hero** — headline "Your edge, unlocked." in Inter Bold. Subheadline. Guided category selector (NOT a free-text search bar). Floating uni/firm logos. NO floating coach cards. Anchor text: "Book a free intro call · Sessions from £25 · Packages from £99"
4. **How it works** — 3 steps. "Browse coaches" button (not "Get Started"). 15-minute free intro (not 10).
5. **Featured coaches** — redesigned cards showing: avatar, name, credential, tagline (outcome-focused), service tags, signature package name + session count, per-session price. NO ratings/review counts at launch.
6. **Resource bank** — white background (no dark container). Trending topics row. Category filters. Coach booking links on each resource. Sign-up gate for access.
7. **FAQ** — For Students / For Coaches toggle. No changes.
8. **Final CTA** — "Your future self will thank you." + "Book a Free Intro" button.
9. **Footer** — no changes.

**Removed sections:**
- "Coaches From 50+ Universities and Firms" + headshot strip — DELETED (redundant with hero logos and featured coaches)
- "Why students choose EarlyEdge" — DELETED (redundant with hero subheadline)

---

## 19. Coach Card Spec

### Featured Coach Card (Landing Page)
```text
[Avatar] Name · University '24
         Credential headline

"Outcome-focused tagline — what students get from working with this coach"

Service Tag · Service Tag · Service Tag

[Package Name] · X sessions

from £X/session

[View profile →]  [Book free intro]
```

### Browse Coach Card (Dashboard)
Same as above but may include:
- Rating (only if 3+ reviews exist)
- "X spots available this week" (if availability data supports it)

### What NOT to show:
- No ratings until 3+ reviews
- No session counts until 3+ sessions
- No "New coach" badge
- No hourly rate as primary price (always per-session within package context)

