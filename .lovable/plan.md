

## Goal
Fix the awkward bottom layout where two "Become a Coach" buttons appear back-to-back, making the page feel repetitive and the flow feel off.

## Current Issue
The page currently has 3 "Become a Coach" buttons:
1. Hero section (top)
2. "Did you..." section
3. Final dark CTA section

The last two are essentially stacked on top of each other with minimal content between them, which feels odd and repetitive.

## Recommended Fix
Remove the button from the "Did you..." section, keeping it as a qualifier/lead-in that flows naturally into the final dark CTA.

**New flow:**
- "Did you..." → achievements list → "Then you're ready." (no button, acts as lead-in)
- Final dark CTA → "Your experience is valuable. Literally." → Button

This way "Then you're ready." becomes the perfect transition into the final CTA.

## File to Update
`src/pages/BecomeACoach.tsx`

## Changes

### Remove button from "Did you..." section (lines 184-191)
Delete this entire `ScrollReveal` block containing the button:
```tsx
<ScrollReveal delay={0.3}>
  <Button
    size="lg"
    className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-8 py-6 text-base"
  >
    Become a Coach
  </Button>
</ScrollReveal>
```

### Adjust "Did you..." section bottom padding
Since we're removing the button, reduce the bottom padding slightly so it flows better into the dark CTA:
- From: `pb-16 md:pb-24`
- To: `pb-12 md:pb-16`

## Result
- Page has 2 buttons total: Hero (top) and Final CTA (bottom)
- The "Did you..." section now reads as a natural build-up: "Did you [achievements]? Then you're ready." → flows directly into the dark CTA with the button
- Bottom of page feels cohesive instead of repetitive

