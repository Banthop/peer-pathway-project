

## Goal
Integrate the "Less effort than a part-time job" callout more tightly within the "Why coach on EarlyEdge" section so it feels like a cohesive part of that section rather than floating separately.

## Current Issue
The callout has `pt-12 md:pt-16` padding on its wrapper and `mb-12 md:mb-16` on the benefit cards grid, creating a ~64-80px gap that visually disconnects the callout from the section above.

## File to Update
`src/pages/BecomeACoach.tsx`

## Changes

### 1. Reduce the gap between benefit cards and callout
Change the benefit cards grid margin from `mb-12 md:mb-16` to `mb-8 md:mb-10` (line 134).

### 2. Remove extra top padding on the callout wrapper
Change the ScrollReveal wrapper from `pt-12 md:pt-16` to no padding (line 153).

### 3. Adjust section bottom padding
Since the callout is now part of the section flow, update the section padding from `pb-12 md:pb-16` to `pb-16 md:pb-24` to give proper breathing room at the bottom (line 125).

## Technical Summary

| Element | Current | New |
|---------|---------|-----|
| Benefit cards grid margin | `mb-12 md:mb-16` | `mb-8 md:mb-10` |
| Callout wrapper padding | `pt-12 md:pt-16` | (removed) |
| Section bottom padding | `pb-12 md:pb-16` | `pb-16 md:pb-24` |

## Result
The callout will sit closer to the benefit cards (about 32-40px gap instead of 64-80px), making it feel like a natural part of the "Why coach on EarlyEdge" section rather than a separate floating element.

