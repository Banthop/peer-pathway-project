

# Compact Vertical Timeline "How It Works" Redesign

## Overview

Replace the current 3-step card-based timeline with a compact, minimal 6-step vertical timeline featuring small icons, short text, and subtle branch connectors. The design will be visually elegant while keeping spacing tight.

---

## Design Concept

```text
                    How it works
                         
         ○───── Browse coaches
         │      Filter by goal, uni, firm...
         │
         ○───── Check their profile
         │      See their experience, LinkedIn...
         │
         ○───── Book a free intro
         │      A 15-minute call to see if...
         │
         ○───── Book a session
         │      Pick a time that works...
         │
         ○───── Meet 1-on-1
         │      A private call to go through...
         │
         ○───── Leave a review
                Help other students find...
```

### Visual Elements
- **Vertical timeline line**: Subtle border color running down the left side
- **Step nodes**: Small circles (icons inside) positioned on the timeline
- **Branch connectors**: Horizontal line from node to content
- **Content**: Headline + short body, aligned to the right of the timeline
- **Tight spacing**: Compact gaps between steps (~24-32px)

---

## Step Content

| Step | Icon | Headline | Body |
|------|------|----------|------|
| 1 | Search | Browse coaches | Filter by goal, uni, firm, or background. Find someone who's done exactly what you're aiming for. |
| 2 | User | Check their profile | See their experience, LinkedIn, and reviews from other students. |
| 3 | MessageCircle | Book a free intro | A 15-minute call to see if they're the right fit. No payment, no commitment. |
| 4 | Calendar | Book a session | Pick a time that works. Pay securely - you're only charged after the session is confirmed. |
| 5 | Video | Meet 1-on-1 | A private call to go through your questions. CVs, prep, what to expect - whatever you need. |
| 6 | Star | Leave a review | Help other students find great coaches. Book again anytime - same coach or someone new. |

---

## Technical Implementation

### File to Modify
`src/components/HowItWorks.tsx`

### Key Changes

1. **Replace data structure**: Update the `steps` array with 6 new steps including Lucide icons

2. **New layout structure**:
```tsx
<div className="relative">
  {/* Vertical line */}
  <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
  
  {/* Steps */}
  {steps.map((step) => (
    <div className="relative flex gap-6 pb-8">
      {/* Icon node on timeline */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
        <step.icon className="w-4 h-4 text-foreground" />
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-1">
        <h3 className="font-sans font-medium text-foreground mb-1">
          {step.headline}
        </h3>
        <p className="font-sans font-light text-muted-foreground text-sm">
          {step.body}
        </p>
      </div>
    </div>
  ))}
</div>
```

3. **Styling details**:
   - Icon circles: `w-10 h-10` (40px) with subtle border
   - Timeline line: `w-px bg-border` positioned behind icons
   - Step spacing: `pb-8` (32px) between steps
   - Text: Small body text (`text-sm`), medium headline weight
   - Max width: `max-w-2xl` centered for readability

4. **Remove**: 
   - Image assets (no longer needed)
   - Badge/pill components
   - Alternating card layout
   - Large step numbers

5. **Keep**:
   - Section heading style (`font-sans font-extralight`)
   - "Get Started" CTA button at bottom
   - Responsive padding

---

## Visual Comparison

| Aspect | Current | New |
|--------|---------|-----|
| Steps | 3 | 6 |
| Icons | Image illustrations | Lucide icons (small) |
| Layout | Alternating cards | Single column timeline |
| Spacing | Large gaps with cards | Compact, tight |
| Content | Long descriptions + badges | Short headline + 1-2 sentences |
| Visual weight | Heavy (cards, images) | Light, minimal |

---

## Responsive Behavior

- **Desktop**: Timeline left-aligned with content, centered in container
- **Mobile**: Same layout, just narrower - timeline works well at any width
- No layout changes needed between breakpoints (unlike current alternating design)

---

## Summary

This redesign transforms the "How It Works" section from a heavy 3-step card layout to an elegant 6-step vertical timeline that:
- Communicates the full user journey clearly
- Uses compact, scannable formatting
- Matches the site's minimal aesthetic
- Feels modern and refined

