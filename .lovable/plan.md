

# Become a Coach Page

## Overview

Create a comprehensive landing page at `/become-a-coach` to recruit students and recent graduates as coaches. The page will have multiple sections designed to inspire, inform, and convert visitors into coach applicants.

---

## Page Structure

```text
+------------------------------------------------------------------+
|                           HEADER                                  |
+------------------------------------------------------------------+
|                                                                   |
|  HERO SECTION                                                     |
|  "You did it. Now get paid to teach it."                         |
|  [Apply to Coach] - Takes 3 minutes                               |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  HOW IT WORKS (4 Steps)                                           |
|  Apply -> Get Verified -> Set Terms -> Start Earning              |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  WHY COACH ON EARLYEDGE (3 Benefit Cards)                         |
|  Qualified | Build Brand | Earn on Terms                          |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  WHO WE'RE LOOKING FOR (Category Pills)                           |
|  IB | Consulting | Law | Oxbridge | UCAT | SWE                   |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  EARNINGS SECTION (Stats Row)                                     |
|  £30-50/hr | 80% yours | £200+/month                              |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  COACH TESTIMONIALS (3 Quote Cards)                               |
|  Placeholder testimonials from current coaches                    |
|                                                                   |
+------------------------------------------------------------------+
|                                                                   |
|  FINAL CTA (Dark Background)                                      |
|  "Got into Oxford? Landed Goldman?..."                            |
|  [Apply to Coach]                                                 |
|                                                                   |
+------------------------------------------------------------------+
|                           FOOTER                                  |
+------------------------------------------------------------------+
```

---

## Section Details

### 1. Hero Section

**Content:**
- Headline: "You did it. Now get paid to teach it."
- Subheadline: "Got a Spring Week, training contract, or top uni offer? Students will pay to learn exactly how you did it."
- Primary CTA: "Apply to Coach" button (dark, prominent)
- Secondary text: "Takes 3 minutes"

**Design:**
- Centered layout, clean and minimal
- Large headline using Source Serif 4 (matches main hero)
- White background
- No floating elements (simpler than main hero)

### 2. How It Works (4 Steps)

**Steps:**
| Step | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | ClipboardCheck | Apply | Fill out a quick form with your credentials and what you'd coach on |
| 2 | BadgeCheck | Get verified | We check your LinkedIn to make sure you're legit |
| 3 | Settings | Set your terms | Choose your prices, availability, and services |
| 4 | Wallet | Start earning | Students book you, we handle payments, you coach and get paid |

**Design:**
- Horizontal layout on desktop (4 columns)
- Vertical stack on mobile
- Numbered steps with icons in dark circles
- Similar to existing HowItWorks but adapted for 4 steps

### 3. Why Coach on EarlyEdge (3 Benefit Cards)

**Cards:**
| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | Trophy | You're more qualified than you think | You don't need 10 years of experience. You just did it - that's exactly what students need. |
| 2 | UserCircle | Build your personal brand | Your profile, reviews, and sessions help you stand out. Some coaches add "EarlyEdge Coach" to their LinkedIn. |
| 3 | PoundSterling | Earn on your terms | Set your own prices (most charge £30-50/hr). Keep 80% after your first 5 sessions. Coach 2 hours a week or 20. |

**Design:**
- Match existing WhyEarlyEdge card styling
- 3-column grid on desktop, stacked on mobile
- Dark circle icons, subtle border cards
- Hover lift effect

### 4. Who We're Looking For

**Categories (Pills):**
- Investment Banking (Spring Weeks, Internships)
- Consulting (MBB, Big 4)
- Law (Vacation Schemes, Training Contracts)
- Oxbridge Applications
- UCAT / Medicine
- Software Engineering

**Design:**
- Section heading + subtext
- Category pills in a flex wrap layout
- Pills styled like hero category badges (outline, hover fill)
- Text below: "Recently achieved something competitive? You're exactly who students want to learn from."

### 5. Earnings Section (Stats Row)

**Stats:**
| Stat | Value | Label |
|------|-------|-------|
| 1 | £30-50 | per hour, typical |
| 2 | 80% | yours after 5 sessions |
| 3 | £200+ | average monthly (5 hrs/week) |

**Design:**
- 3-column stats row
- Large numbers, smaller labels
- Clean horizontal dividers or card style
- Subtle background differentiation

### 6. Coach Testimonials

**Placeholder Testimonials:**
1. "I wished I had someone like me when I was applying. Now I get to be that person - and get paid for it." - James T., Goldman Spring Week '24
2. "Coaching fits perfectly around my degree. I do 3-4 sessions a week and it covers my rent." - Priya M., Oxford Law '25
3. "Students message me saying they got the offer. That feeling is incredible - and the money doesn't hurt either." - Alex R., McKinsey Intern '24

**Design:**
- 3-column grid of quote cards
- Avatar placeholder (circle with initials)
- Quote text, name, credential
- Subtle card styling

### 7. Final CTA Section (Dark Background)

**Content:**
- Headline: "Got into Oxford? Landed Goldman? Secured a TC at a magic circle firm?"
- Subheadline: "Students are looking for someone exactly like you."
- Button: "Apply to Coach"
- Small text: "Takes 3 minutes. No commitment. Leave anytime."

**Design:**
- Dark background (`bg-foreground` or `bg-dark`)
- White/light text
- Centered layout
- High contrast CTA button

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/pages/BecomeACoach.tsx` | Main page component |

### Route Setup

Add to `src/App.tsx`:
```tsx
import BecomeACoach from "./pages/BecomeACoach";

// In Routes:
<Route path="/become-a-coach" element={<BecomeACoach />} />
```

### Update Header

Update the "Become a Coach" link in Header.tsx to point to `/become-a-coach` instead of `#become-coach`.

---

## Component Structure

```tsx
const BecomeACoach = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          {/* Centered headline, subheadline, CTA */}
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-secondary/30">
          {/* 4-step process */}
        </section>

        {/* Why Coach */}
        <section className="py-16 md:py-24">
          {/* 3 benefit cards */}
        </section>

        {/* Who We're Looking For */}
        <section className="py-16 md:py-24 bg-secondary/30">
          {/* Category pills */}
        </section>

        {/* Earnings Stats */}
        <section className="py-16 md:py-24">
          {/* Stats row */}
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-secondary/30">
          {/* Quote cards */}
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-foreground text-background">
          {/* Dark CTA box */}
        </section>
      </main>
      <Footer />
    </div>
  );
};
```

---

## Styling Guidelines

### Typography
- **Hero headline**: `font-serif font-semibold` (Source Serif 4, like main hero)
- **Section headings**: `text-3xl md:text-4xl font-sans font-extralight`
- **Body text**: `font-sans font-light text-muted-foreground`
- **Card titles**: `font-sans font-medium text-xl`
- **Stats numbers**: `text-4xl md:text-5xl font-sans font-light`

### Colors
- White background for main sections (`bg-background`)
- Light gray for alternating sections (`bg-secondary/30`)
- Dark section for final CTA (`bg-foreground text-background`)
- Accent color for interactive elements

### Spacing
- Consistent section padding: `py-16 md:py-24`
- Container max-width with padding: `container mx-auto px-4`

### Cards
- Match existing card styling: `bg-card border border-border/50 rounded-xl`
- Hover effects: `hover:shadow-md hover:border-border transition-all`

---

## Implementation Steps

1. **Create page file and basic structure**
   - Create `src/pages/BecomeACoach.tsx`
   - Set up page shell with Header and Footer
   - Add route in App.tsx

2. **Build Hero section**
   - Centered headline with Source Serif 4
   - Subheadline in Inter Light
   - Primary CTA button
   - Secondary text

3. **Build How It Works section**
   - Define steps data array
   - Create 4-column grid layout
   - Add step numbers, icons, and descriptions
   - Mobile responsive stacking

4. **Build Why Coach section**
   - Define benefits data array
   - Create 3-column card grid
   - Match WhyEarlyEdge styling
   - Add icons and hover effects

5. **Build Who We're Looking For section**
   - Define categories array
   - Create flex wrap pills layout
   - Style pills like hero badges
   - Add supporting text

6. **Build Earnings Stats section**
   - Create 3-column stats layout
   - Large numbers with labels
   - Responsive grid

7. **Build Testimonials section**
   - Define testimonials data with placeholders
   - Create quote card components
   - 3-column grid layout
   - Avatar placeholders with initials

8. **Build Final CTA section**
   - Dark background section
   - Centered content
   - CTA button with inverted colors
   - Trust text

9. **Update Header link**
   - Change "Become a Coach" href to `/become-a-coach`
   - Use Link component from react-router-dom

10. **Add scroll animations**
    - Wrap sections in ScrollReveal for entrance animations

---

## Mobile Responsiveness

- Hero: Stack content vertically, reduce font sizes
- How It Works: Vertical timeline on mobile
- Benefit Cards: Stack to single column
- Category Pills: Wrap naturally
- Stats: Stack to single column
- Testimonials: Stack to single column
- Final CTA: Full width, adjusted padding

---

## Summary

This page creates a compelling recruitment experience for potential coaches with:

1. **Aspirational Hero**: Bold headline that speaks to achievement
2. **Clear Process**: 4-step visual showing simplicity of joining
3. **Value Proposition**: 3 key benefits that resonate with target audience
4. **Target Clarity**: Category pills showing who fits
5. **Earnings Transparency**: Clear stats on potential income
6. **Social Proof**: Testimonials from current coaches
7. **Strong Close**: Dark CTA section with urgency

The design maintains consistency with the existing EarlyEdge style while creating a dedicated, conversion-focused experience for coach recruitment.

