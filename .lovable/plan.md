
# How It Works Section Redesign

## Overview

Transforming the current simple 3-step grid into an engaging, visual section with:
- **Illustrated visuals** for each step
- **Connected timeline** linking the steps together
- **CTA button** at the end to drive action

---

## Visual Design

### Layout Structure

```text
+----------------------------------------------------------+
|                     "How it works"                        |
|                    (Inter, semibold)                      |
+----------------------------------------------------------+
|                                                          |
|  +--------+          +--------+          +--------+      |
|  |  [1]   |----------|  [2]   |----------|  [3]   |      |
|  | Visual |          | Visual |          | Visual |      |
|  +--------+          +--------+          +--------+      |
|   Find your           Get                 Get            |
|   coach              coaching            results         |
|                                                          |
|                  [ Get Started ]                         |
|                                                          |
+----------------------------------------------------------+
```

### Step Illustrations

Each step will feature a visual element instead of just an icon:

1. **Step 1 - Find your coach**
   - Visual: Mini coach card preview (reuse Sarah's card image or create a small mockup)
   - Shows the browsing/discovery experience

2. **Step 2 - Get coaching**
   - Visual: Video call or chat bubble illustration
   - Represents the coaching session experience

3. **Step 3 - Get results**
   - Visual: Trophy or success badge with confetti
   - Celebration of achieving goals

### Timeline Connector

A horizontal line or dotted path connecting all 3 steps:
- On desktop: Horizontal line with step numbers as circles on the line
- On mobile: Vertical line on the left side

### Styling Details

| Element | Font | Weight | Color |
|---------|------|--------|-------|
| Section heading | Inter | 200 (extralight) | foreground |
| Step numbers | Inter | 600 (semibold) | white on black circle |
| Step titles | Inter | 500 (medium) | foreground |
| Step descriptions | Inter | 300 (light) | muted-foreground |
| CTA button | Inter | 200 (extralight) | white on black |

---

## Technical Implementation

### Files to Modify

**src/components/HowItWorks.tsx**
- Complete redesign of the component structure
- Add timeline connector element (CSS-based lines or SVG)
- Import illustration images or create styled placeholder components
- Add CTA button at the bottom
- Apply Inter font family throughout
- Add subtle hover animations on step cards

### Visual Options for Illustrations

**Option A: Use Existing Assets**
- Use `coach-sarah-card.png` as a small preview for Step 1
- Use Lucide icons with decorative backgrounds for Steps 2 & 3
- Add decorative elements (circles, lines) with CSS

**Option B: Create Styled Components**
- Build illustrated cards using existing coach photos
- Create styled containers with gradients and shadows
- More custom but stays within current design system

**Recommendation**: Option A is faster and maintains consistency

### Timeline Implementation

Using CSS pseudo-elements:
- Create a horizontal line behind the step circles
- Step number circles positioned on the line
- Responsive: switches to vertical on mobile

### CTA Button

Match the header/hero button styling:
- Black background, white text
- `font-extralight` (200 weight)
- Padding similar to "Get Started" button in header
- Links to `/browse` or scrolls to coaches section

---

## Animation Touches

- **Fade-up on scroll**: Each step fades in as user scrolls
- **Hover on cards**: Subtle scale (1.02) like coach cards
- **Line draw**: Optional - animate the timeline line as user scrolls

---

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 768px) | Vertical stack with timeline on left |
| Tablet (768px+) | Horizontal 3-column with connecting line |
| Desktop (1024px+) | Same as tablet with larger illustrations |

---

## Summary of Changes

1. Update section heading to use Inter font (extralight 200)
2. Replace icon boxes with illustrated visuals
3. Add horizontal timeline connector with numbered circles
4. Update step titles to Inter medium (500)
5. Update descriptions to Inter light (300)
6. Add "Get Started" CTA button at bottom
7. Add subtle hover animations
8. Ensure mobile-responsive vertical layout
