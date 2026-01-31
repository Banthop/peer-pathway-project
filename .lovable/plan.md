

# Individual Coach Profile Page

## Overview

Create a comprehensive coach profile page inspired by Leland's design but tailored to EarlyEdge's minimal, Inter Light aesthetic. The page will showcase coach credentials, services, experience, and reviews in a clean, conversion-focused layout.

---

## Page Structure (Desktop: Two-Column Layout)

```text
+------------------------------------------------------------------+
|                           HEADER                                  |
+------------------------------------------------------------------+
|  Breadcrumb: Home / Coaches / Sarah K.                           |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------------------------------------+  +---------------+ |
|  |                                           |  |  STICKY       | |
|  |  MAIN CONTENT                             |  |  BOOKING      | |
|  |                                           |  |  SIDEBAR      | |
|  |  - Hero Section (photo, name, stats)      |  |               | |
|  |  - About / Bio                            |  |  - Avail.     | |
|  |  - Services/Offerings                     |  |  - Trial btn  | |
|  |  - Experience                             |  |  - Book btn   | |
|  |  - Education                              |  |  - Message    | |
|  |  - Reviews                                |  |               | |
|  |                                           |  +---------------+ |
|  +-------------------------------------------+                    |
|                                                                   |
+------------------------------------------------------------------+
|                           FOOTER                                  |
+------------------------------------------------------------------+
```

---

## Section-by-Section Breakdown

### 1. Breadcrumb Navigation
- Simple text breadcrumb: `Home / Coaches / Sarah K.`
- Helps with SEO and navigation context

### 2. Hero Section (Profile Header)

```text
+------------------------------------------------------------------+
|  +--------+                                                       |
|  |        |   Sarah K.  ★ 4.9 (127 reviews)                      |
|  | PHOTO  |                                                       |
|  |  96px  |   "Helping you land your dream offer at top firms"   |
|  |        |                                                       |
|  +--------+   127 sessions  ·  24 followers                       |
|                                                                   |
|  [Oxford icon] Studied at Oxford     [GS icon] Works at Goldman   |
|                                                                   |
|  Successful clients at:  [GS] [McK] [JPM] [Bain] +12             |
+------------------------------------------------------------------+
```

**Content:**
- Large profile photo (96px circle)
- Name + star rating + review count
- One-line tagline/headline
- Stats: sessions completed, followers
- Education badge (uni logo + text)
- Work badge (company logo + text)
- Success logos: companies where clients got offers

### 3. About Section

```text
+------------------------------------------------------------------+
|  About Sarah                                                      |
|  ------------------------------------------------------------------
|  3-4 paragraphs about the coach's background, approach, and       |
|  what makes them unique. Expandable with "Read more" if long.     |
|                                                                   |
|  Can help with:                                                   |
|  [Interview Prep] [CV Review] [Banking] [Spring Week Apps]        |
+------------------------------------------------------------------+
```

**Content:**
- Coach bio (expandable if > 200 words)
- Skills/expertise tags

### 4. Coaching Offerings Section

```text
+------------------------------------------------------------------+
|  Coaching Services                                                |
|  ------------------------------------------------------------------
|  +---------------------------+  +---------------------------+     |
|  | CV Review                 |  | Mock Interview            |     |
|  | 45 min session            |  | 60 min session            |     |
|  | Starting at £40           |  | Starting at £60           |     |
|  | [Book Now]                |  | [Book Now]                |     |
|  +---------------------------+  +---------------------------+     |
|                                                                   |
|  Custom Hourly · £50/hr                                           |
|  Get help with specific questions or topics.  [Buy coaching]      |
+------------------------------------------------------------------+
```

**Content:**
- Service cards with name, duration, price, description
- Custom hourly rate option

### 5. Experience Section

```text
+------------------------------------------------------------------+
|  Experience                                                       |
|  ------------------------------------------------------------------
|  [GS Logo]  Incoming Analyst                                      |
|             Goldman Sachs                                         |
|             Starting 2025                                         |
|                                                                   |
|  [Oxford]   PPE Student                                           |
|             University of Oxford                                  |
|             2021 - 2024                                           |
+------------------------------------------------------------------+
```

**Content:**
- Vertical timeline of work/education experience
- Logo + role + company + dates
- Optional skills tags per role

### 6. Education Section

```text
+------------------------------------------------------------------+
|  Education                                                        |
|  ------------------------------------------------------------------
|  [Oxford Logo]  University of Oxford                              |
|                 BA Philosophy, Politics & Economics               |
|                 2021 - 2024                                       |
|                 First Class Honours                               |
+------------------------------------------------------------------+
```

### 7. Reviews Section

```text
+------------------------------------------------------------------+
|  91 Reviews                                                       |
|  ------------------------------------------------------------------
|  Overall: ★★★★★ 4.9                                              |
|                                                                   |
|  Knowledge: 5.0  |  Value: 4.8  |  Responsiveness: 5.0            |
|  ------------------------------------------------------------------
|  Successful clients at: [GS] [McK] [Oxford] [Cambridge]           |
|  ------------------------------------------------------------------
|                                                                   |
|  [Review Card 1]  [Review Card 2]  [Review Card 3]                |
|                                                                   |
|  [Load more reviews]                                              |
+------------------------------------------------------------------+
```

**Content:**
- Aggregate rating summary
- Category ratings (Knowledge, Value, Responsiveness, Supportiveness)
- Success logos (where clients got offers)
- Individual review cards
- Pagination/load more

### 8. Sticky Booking Sidebar (Desktop Only)

```text
+---------------------------+
|  Available Today 6:00 PM  |  <- green dot indicator
+---------------------------+
|  [Schedule a free intro]  |  <- primary button
|  [Book a session]         |  <- secondary button
+---------------------------+
|  Protected by EarlyEdge   |
|  Quality Guarantee        |
+---------------------------+
|  Questions? Message Sarah |
|  before you get started.  |
|  [Send a message]         |  <- link
+---------------------------+
```

---

## Mobile Layout

On mobile, the sidebar content moves to:
1. **Floating bottom bar** with "Book a free intro" button
2. Or inline at the top after the hero section

The main content stacks vertically in the same order.

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/CoachProfile.tsx` | Main page component |
| `src/components/coach/CoachHero.tsx` | Hero section with photo, name, stats |
| `src/components/coach/CoachAbout.tsx` | Bio and skills |
| `src/components/coach/CoachServices.tsx` | Service offerings cards |
| `src/components/coach/CoachExperience.tsx` | Work experience timeline |
| `src/components/coach/CoachEducation.tsx` | Education section |
| `src/components/coach/CoachReviews.tsx` | Reviews with ratings |
| `src/components/coach/BookingSidebar.tsx` | Sticky booking sidebar |

### Route Setup

Add to `src/App.tsx`:
```tsx
<Route path="/coach/:coachId" element={<CoachProfile />} />
```

### Data Structure

```typescript
interface Coach {
  id: string;
  name: string;
  tagline: string;
  photo: string;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  followers: number;
  university: {
    name: string;
    logo: string;
    degree: string;
    years: string;
  };
  company: {
    name: string;
    logo: string;
    role: string;
  };
  successCompanies: { name: string; logo: string }[];
  bio: string;
  skills: string[];
  services: {
    name: string;
    duration: string;
    price: number;
    description: string;
  }[];
  hourlyRate: number;
  experience: {
    logo: string;
    role: string;
    company: string;
    dates: string;
    description?: string;
    skills?: string[];
  }[];
  education: {
    logo: string;
    institution: string;
    degree: string;
    years: string;
    achievement?: string;
  }[];
  reviews: {
    name: string;
    date: string;
    rating: number;
    text: string;
    outcome?: string;
  }[];
  availability: {
    nextSlot: string;
    timezone: string;
  };
}
```

### Styling Approach

- Use existing Inter Light typography (`font-sans font-light`)
- White background (`bg-background`) throughout
- Subtle borders (`border-border`)
- Cards with `bg-card` and `card-shadow`
- Primary buttons for main CTAs
- Sticky sidebar with `sticky top-24`

---

## Implementation Steps

1. **Create route and page shell**
   - Add route in App.tsx
   - Create CoachProfile.tsx with basic layout structure
   - Two-column grid: main content + sidebar

2. **Build CoachHero component**
   - Profile photo, name, rating
   - Stats row (sessions, followers)
   - University/company badges
   - Success logos row

3. **Build CoachAbout component**
   - Bio text with "Read more" expansion
   - Skills tags grid

4. **Build CoachServices component**
   - Service cards in grid
   - Custom hourly rate row

5. **Build CoachExperience component**
   - Vertical timeline with logos
   - Role, company, dates

6. **Build CoachEducation component**
   - Similar timeline format for education

7. **Build CoachReviews component**
   - Rating summary with category breakdowns
   - Review cards grid
   - Load more functionality

8. **Build BookingSidebar component**
   - Availability indicator
   - CTA buttons
   - Quality guarantee
   - Message option

9. **Mobile responsiveness**
   - Hide sidebar on mobile
   - Add floating bottom booking bar
   - Stack all sections vertically

10. **Link from FeaturedCoaches**
    - Update "View profile" links to go to `/coach/:id`

---

## Sample Content (Using Sarah K.)

| Field | Value |
|-------|-------|
| Name | Sarah K. |
| Tagline | Helping you land your dream offer at top investment banks |
| University | Oxford, PPE, 2021-2024 |
| Company | Goldman Sachs, Incoming Analyst |
| Sessions | 127 |
| Rating | 4.9 |
| Skills | Interview Prep, CV Review, Spring Week, Investment Banking, Assessment Centres |
| Hourly Rate | £50/hr |

---

## Design Notes

- Keep the page clean and scannable
- Use logos prominently (builds trust)
- Sticky sidebar keeps booking CTA always visible on desktop
- Mobile bottom bar ensures conversion on mobile too
- Match the minimal, light aesthetic from the rest of the site
- No heavy animations - subtle hovers only

