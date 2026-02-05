
# Fix Spacing Between Callout and Did You Section

## The Problem

Looking at the screenshot, there's a massive gap between the "Less effort than a part-time job" callout and the "Did you..." section. This happens because:

1. The callout box is inside the "Why Coach" section
2. "Why Coach" section has `py-12 md:py-16` padding (adds space below callout)
3. "Did You" section also has `py-12 md:py-16` padding (adds space above headline)
4. Combined = ~64px gap on desktop, which looks awkward

## The Fix

Reduce the top padding of the "Did You" section since the callout box already provides visual separation:

```
File: src/pages/BecomeACoach.tsx

Line 167 - Change:
<section className="py-12 md:py-16 bg-background">

To:
<section className="pt-6 md:pt-8 pb-12 md:pb-16 bg-background">
```

This gives asymmetric padding:
- **Top**: 6px/8px (small gap after callout)  
- **Bottom**: 12px/16px (normal gap before dark CTA)

## Summary

| Element | Before | After |
|---------|--------|-------|
| "Did You" section padding | `py-12 md:py-16` | `pt-6 md:pt-8 pb-12 md:pb-16` |

This single change will close the awkward gap while keeping proper spacing everywhere else.
