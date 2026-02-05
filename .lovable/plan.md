
## Goal (what will look “formatted right”)
You want the /become-a-coach page to have the same “wide, premium” vertical rhythm as the bottom of the page, while fixing:
- the top hero feeling squished
- the bottom CTA feeling squished (especially “padding under” the button)
- the “Did you…” block feeling cramped (headline → “Then you’re ready.” → button)

Right now the page uses tighter section padding (`py-12 md:py-16`) in most places, and the hero + final CTA don’t get the same generous breathing room that other parts of the site use.

## What I inspected (current state)
File: `src/pages/BecomeACoach.tsx`

Current section paddings:
- Hero: `pt-24 pb-12 md:pt-32 md:pb-16` (bottom is notably tighter than “wide spacing”)
- How it works: `py-12 md:py-16`
- Why coach: `py-12 md:py-16`
- Did you: `py-12 md:py-16`
- Final CTA (dark): `py-12 md:py-16` (this is why the bottom button area can feel like it has not enough room under it)

Also, the “Did you…” section uses individual `mb-*` values that are currently on the small side for the tone you want.

## Implementation approach
1) Bring this page back in line with the site-wide “wide section spacing” standard (`py-16 md:py-24`) for major sections.
2) Increase the hero’s bottom padding and internal spacing so it doesn’t feel cramped compared to the rest of the page.
3) Increase the final dark CTA’s vertical padding and slightly increase spacing inside the CTA stack so there’s visibly more room under the button/caption.
4) Increase spacing inside the “Did you…” block so “Then you’re ready.” and the button don’t feel squashed.

To avoid reintroducing an awkwardly huge gap between the callout and “Did you…”, I’ll keep the page “wide” overall while using a slightly asymmetric handoff at that boundary:
- reduce the bottom padding of “Why coach” a bit
- reduce the top padding of “Did you” a bit
This keeps the overall airy feel without “double-padding” stacking up at that junction.

## Exact edits (single file)
### File: `src/pages/BecomeACoach.tsx`

### A) Hero section: make the top feel more premium / less squished
Change the Hero `<section>` padding:
- From: `pt-24 pb-12 md:pt-32 md:pb-16`
- To: something wider like: `pt-28 pb-16 md:pt-40 md:pb-24`

Also slightly increase the spacing under the hero paragraph:
- From: `mb-8`
- To: `mb-10` (or `mb-12` if you want it very airy)

### B) “How it works” section: restore wide spacing
Change:
- From: `py-12 md:py-16`
- To: `py-16 md:py-24`

### C) “Why coach” section: restore wide spacing but prevent an oversized gap at the very bottom
Change:
- From: `py-12 md:py-16`
- To: `pt-16 md:pt-24 pb-12 md:pb-16`

And increase the space between the benefit cards and the callout (so the callout isn’t “jammed” under the cards):
- From: `mb-8 md:mb-10`
- To: `mb-12 md:mb-16`

### D) “Did you…” section: wide spacing overall + fix the squashed “Then you’re ready.” → button
Change the section padding to be wide, but with a slightly reduced top to avoid double-spacing after the callout:
- From: `py-12 md:py-16`
- To: `pt-12 md:pt-16 pb-16 md:pb-24`

Then increase internal spacing:
- The long qualifier paragraph:
  - From: `mb-4`
  - To: `mb-6` (more breathing room)
- “Then you’re ready.” line:
  - Keep it prominent, but give it more room before the button:
  - From: `mb-8`
  - To: `mb-10` (or `mb-12` if you want it very airy)

### E) Final dark CTA: add more padding under the button (main request)
Change:
- From: `py-12 md:py-16`
- To: `py-16 md:py-24`

And make the CTA stack a touch roomier:
- In the final CTA’s `<div className="flex flex-col items-center gap-3">`
  - From: `gap-3`
  - To: `gap-4` (small change, big “less squished” feel)

Optionally increase the paragraph spacing above the button:
- The dark CTA paragraph currently has `mb-8`
- If you still feel it’s tight after the section padding increase, change to `mb-10`

## Visual checks (what you should see after)
- The hero headline/paragraph/button should feel like it “sits” in a larger, premium block (not jammed toward the top or immediately into the next section).
- The “Did you…” section should read like: headline → supporting line → “Then you’re ready.” → button, with clear breathing room between each.
- The final dark CTA should have obvious space below the button/caption before the section ends (this is the “padding under it” fix).

## Testing checklist (quick)
- Desktop: scroll from hero → how it works → why coach → callout → did you → final CTA, and confirm the rhythm feels consistently wide.
- Mobile: confirm the hero top padding doesn’t feel cramped under the fixed header, and that the final CTA button has comfortable space below it.
- Confirm the callout box remains centered (it should; current code uses `max-w-xl mx-auto` + `w-full`).

## Next possible follow-ups (optional)
- Make all page sections use a shared `Section` wrapper component so spacing can’t drift again.
- Make the “Become a Coach” buttons scroll to an application form section (so the CTA feels purposeful, not decorative).
