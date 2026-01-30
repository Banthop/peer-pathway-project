

# Landing Page Restructure + "How It Works" Redesign

## Overview

This plan covers two major changes:
1. **Restructure the landing page order** for better flow and reduced redundancy
2. **Redesign the "How It Works" section** with a vertical branching timeline that's more detailed and visually engaging

---

## Part 1: Page Structure Changes

### Current Order
```text
1. Hero
2. SocialProof
3. WhyEarlyEdge
4. PopularCategories
5. FeaturedCoaches
6. HowItWorks
7. Reviews
8. LogosBar
9. FinalCTA
```

### Proposed Order
```text
1. Hero
2. SocialProof
3. HowItWorks (moved up - explain service before showing product)
4. FeaturedCoaches
5. WhyEarlyEdge (moved down - reinforcement after seeing coaches)
6. Reviews
7. FinalCTA (strengthened)

REMOVED:
- PopularCategories (redundant with Hero pills)
- LogosBar (redundant with SocialProof + Hero logos)
```

### Rationale
- **How It Works** should come earlier so visitors understand the service before seeing coaches
- **Why EarlyEdge** works better as reinforcement after seeing the product
- Removing redundant sections creates a tighter, more focused journey to conversion

---

## Part 2: "How It Works" Vertical Timeline Redesign

### Current Design Issues
- Horizontal layout feels disconnected
- Too minimal - doesn't communicate the full value
- No sense of progression or journey

### New Design: Vertical Branching Timeline

```text
┌─────────────────────────────────────────────────────────────────┐
│                        HOW IT WORKS                             │
│                                                                 │
│    ┌──────────────────────────────────────────────────────┐     │
│    │  STEP 1: FIND YOUR COACH                             │     │
│    │  ────────────────────────────────────                │     │
│    │                                                      │     │
│    │  [Illustration]    Browse coaches who've been        │     │
│    │                    where you want to go.             │     │
│    │                                                      │     │
│    │    ┌─────────────┐  ┌─────────────┐  ┌──────────┐   │     │
│    │    │ Search by   │  │ Filter by   │  │ Book a   │   │     │
│    │    │ goal/field  │  │ university/ │  │ free     │   │     │
│    │    │             │  │ company     │  │ intro    │   │     │
│    │    └─────────────┘  └─────────────┘  └──────────┘   │     │
│    └──────────────────────────────────────────────────────┘     │
│                             │                                   │
│                             │ (connecting line)                 │
│                             ▼                                   │
│    ┌──────────────────────────────────────────────────────┐     │
│    │  STEP 2: GET COACHED                                 │     │
│    │  ────────────────────────────────                    │     │
│    │                                                      │     │
│    │  Work 1-on-1 on applications,       [Illustration]   │     │
│    │  interviews, and strategy.                           │     │
│    │                                                      │     │
│    │    ┌─────────────┐  ┌─────────────┐  ┌──────────┐   │     │
│    │    │ Application │  │ Interview   │  │ Strategy │   │     │
│    │    │ review      │  │ practice    │  │ sessions │   │     │
│    │    └─────────────┘  └─────────────┘  └──────────┘   │     │
│    └──────────────────────────────────────────────────────┘     │
│                             │                                   │
│                             │ (connecting line)                 │
│                             ▼                                   │
│    ┌──────────────────────────────────────────────────────┐     │
│    │  STEP 3: LAND YOUR OFFER                             │     │
│    │  ────────────────────────────────                    │     │
│    │                                                      │     │
│    │  [Illustration]    Join thousands who've secured     │     │
│    │                    spots at top universities         │     │
│    │                    and firms.                        │     │
│    │                                                      │     │
│    │    ┌─────────────┐  ┌─────────────┐  ┌──────────┐   │     │
│    │    │ University  │  │ Internship  │  │ Graduate │   │     │
│    │    │ offers      │  │ offers      │  │ roles    │   │     │
│    │    └─────────────┘  └─────────────┘  └──────────┘   │     │
│    └──────────────────────────────────────────────────────┘     │
│                                                                 │
│                    [ Get Started Button ]                       │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Step Content

**Step 1: Find Your Coach**
- Main description: "Browse coaches who've been where you want to go. Book a free intro call to find your fit."
- Sub-features (pills/badges):
  - "Search by goal" - Find coaches for your specific target
  - "Filter by background" - University, company, field
  - "Free intro call" - No commitment to start

**Step 2: Get Coached**
- Main description: "Work 1-on-1 on applications, interviews, and strategy—tailored to your goals."
- Sub-features (pills/badges):
  - "Application review" - CVs, personal statements, cover letters
  - "Interview practice" - Mock interviews with feedback
  - "Strategy sessions" - Planning and timeline guidance

**Step 3: Land Your Offer**
- Main description: "Join thousands who've secured spots at top universities and firms."
- Sub-features (pills/badges):
  - "University offers" - Oxbridge, Russell Group, US schools
  - "Internships" - Spring weeks, summer programs
  - "Graduate roles" - Full-time positions at top firms

### Visual Design Elements
- Each step in a card with subtle border
- Alternating layout: illustration left/right on desktop
- Vertical connecting line between steps with step numbers as circles
- Pills/badges for sub-features to add depth
- Maintains existing illustration assets
- Mobile: stacks vertically with timeline on left

---

## Part 3: Strengthen Final CTA

### Current (weak)
```text
Ready to get started?
[Get Started]
```

### Proposed (stronger)
```text
Your future self will thank you.
[Find Your Coach]

Free intro call · No commitment · Cancel anytime
```

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Reorder sections, remove PopularCategories and LogosBar |
| `src/components/HowItWorks.tsx` | Complete redesign with vertical branching timeline |
| `src/components/FinalCTA.tsx` | Stronger headline and trust indicators |

### Implementation Steps

1. **Update `src/pages/Index.tsx`**
   - Remove `PopularCategories` and `LogosBar` imports
   - Reorder components: Hero → SocialProof → HowItWorks → FeaturedCoaches → WhyEarlyEdge → Reviews → FinalCTA

2. **Redesign `src/components/HowItWorks.tsx`**
   - Create new vertical timeline layout with cards
   - Add step number circles with connecting line
   - Add sub-feature pills for each step
   - Alternate illustration position on desktop
   - Keep existing image assets
   - Responsive design: vertical stack on mobile

3. **Enhance `src/components/FinalCTA.tsx`**
   - Update headline to be more emotional
   - Change button text
   - Add trust indicators below button

---

## Summary of Changes

| Change | Impact |
|--------|--------|
| Remove PopularCategories | Eliminates redundancy with Hero |
| Remove LogosBar | Eliminates redundancy with SocialProof |
| Move HowItWorks earlier | Better logical flow - explain before showing |
| Move WhyEarlyEdge later | Acts as reinforcement after seeing product |
| Redesign HowItWorks | More engaging, detailed, vertical timeline |
| Strengthen FinalCTA | Better conversion at end of page |

