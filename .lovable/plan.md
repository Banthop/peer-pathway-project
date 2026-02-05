

## Goal
Make the "Then you're ready." line feel less awkward and flow better into the final CTA section.

## Current Issue
After removing the button, "Then you're ready." sits alone as a short punchy line that feels disconnected - it ends the section abruptly without a clear payoff.

## Recommended Fix
**Merge "Then you're ready." into the final dark CTA section** as the opening hook, rather than leaving it floating in the "Did you..." section.

**New flow:**
- "Did you..." section ends with the achievements list (no punchline)
- Final dark CTA opens with "Then you're ready." as a bold lead-in, followed by the existing content

This creates a stronger narrative arc where the dark section provides the payoff.

## File to Update
`src/pages/BecomeACoach.tsx`

## Changes

### 1. Remove "Then you're ready." from the "Did you..." section
Delete lines 179-183 (the ScrollReveal block containing "Then you're ready.").

Also reduce the bottom margin on the achievements text from `mb-6` to `mb-0` since it's now the last element.

### 2. Add "Then you're ready." to the Final CTA section
Insert it as the first element inside the dark CTA, above "Your experience is valuable. Literally."

```tsx
<ScrollReveal>
  <p className="text-xl md:text-2xl font-sans font-medium text-background mb-2">
    Then you're ready.
  </p>
</ScrollReveal>
```

### 3. Adjust the headline styling
Make "Your experience is valuable. Literally." slightly smaller since "Then you're ready." is now the lead-in:
- From: `text-3xl md:text-4xl`
- To: `text-2xl md:text-3xl`

## Result
The page now reads:
1. "Did you... [achievements]?" - ends with a question
2. Dark CTA: "Then you're ready. Your experience is valuable. Literally." - provides the answer and payoff

The punchline lands in the dark section where the button lives, creating a cohesive call-to-action block.

