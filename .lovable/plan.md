
## Goal
Redesign the final dark CTA section to feel more spacious and impactful rather than crammed and forced.

## Current Problem
The dark section currently has 5 text elements stacked tightly together:
1. "Get into Oxford? Land a Spring Week?..." (qualifier questions)
2. "Then you're ready." (punchline)
3. "Your experience is valuable. Literally." (headline)
4. "Students want help from someone..." (supporting text)
5. Button + subtext

This creates a wall of text that feels overwhelming and squashed - too many ideas competing for attention in one block.

## Recommended Solution
Simplify the dark CTA to focus on ONE clear message with more breathing room. Move the qualifier questions back to a light section that builds anticipation, then let the dark section deliver a clean, punchy payoff.

## File to Update
`src/pages/BecomeACoach.tsx`

## Changes

### 1. Create a new "Are you ready?" transition section (light background)
Add a new section between "Why Coach" and the final CTA:
- Light background (`bg-background`)
- Display the achievement questions as individual styled items (not a paragraph)
- End with "Then you're ready." as the section closer
- More vertical padding for breathing room

### 2. Simplify the dark CTA section
Strip it down to just:
- One bold headline: "Your experience is valuable. Literally."
- One supporting line
- Button + subtext
- More generous vertical padding (`py-20 md:py-32`)

### 3. Style the achievements as a visual list
Instead of cramming achievements into a paragraph, display them as:
- A centered grid or flex-wrap layout
- Each achievement as a subtle chip/badge style
- Creates visual interest and breaks up the text

## Technical Summary

**New "Are you ready?" section structure:**
```tsx
<section className="py-16 md:py-24 bg-background">
  <div className="container mx-auto px-4 text-center">
    {/* Achievement chips in a flex-wrap layout */}
    <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-3xl mx-auto">
      {achievements.map(...)}
    </div>
    
    <p className="text-2xl md:text-3xl font-sans font-medium text-foreground">
      Then you're ready.
    </p>
  </div>
</section>
```

**Simplified dark CTA structure:**
```tsx
<section className="py-20 md:py-32 bg-foreground">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extralight text-background mb-6">
      Your experience is valuable. Literally.
    </h2>
    <p className="text-lg font-sans font-light text-background/80 mb-10">
      Students want help from someone who just did what they're trying to do.
    </p>
    <Button ...>Become a Coach</Button>
    <span>No commitment. Leave whenever.</span>
  </div>
</section>
```

## Visual Result
- **Light section**: Achievement badges create visual rhythm, ending with "Then you're ready."
- **Dark section**: Clean, spacious, focused - just the value prop and CTA
- More breathing room throughout
- Stronger visual hierarchy

## Why This Works
1. Separates the "build-up" (achievements) from the "payoff" (CTA)
2. Gives each section a single job rather than cramming everything together
3. Achievement chips add visual interest and scannability
4. Generous padding prevents the "squashed" feeling
5. Matches the cleaner FinalCTA pattern used on the homepage
