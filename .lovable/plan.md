
# Fix Spacing on Become a Coach Page

## The Problem

Looking at the current page structure, I can see several spacing inconsistencies:

1. **Inconsistent section padding**: The "Did You" section uses `py-12 md:py-16` while all other sections use `py-16 md:py-24` (the site-wide standard)

2. **Too many sections running together**: With all sections having `bg-background` (white), there's no visual separation between:
   - How It Works (white)
   - Why Coach (white)  
   - Did You (white)
   - Final CTA (dark)

3. **Benefit cards bottom margin is too large**: `mb-12 md:mb-16` before the callout box creates too much gap

4. **The callout box feels disconnected**: It sits at the bottom of the Why Coach section but doesn't flow naturally into Did You

---

## The Solution

### 1. Standardize Section Padding

Change "Did You" section from `py-12 md:py-16` to the site-wide standard `py-16 md:py-24`:

```tsx
// Before
<section className="py-12 md:py-16 bg-background">

// After  
<section className="py-16 md:py-24 bg-background">
```

### 2. Reduce Benefit Cards Bottom Margin

Tighten the gap between cards and the callout box:

```tsx
// Before
<div className="grid ... mb-12 md:mb-16">

// After
<div className="grid ... mb-10 md:mb-12">
```

### 3. Add Visual Separation Between Sections

Add a subtle separator or use a light background tint on one section to break up the white-on-white flow. Options:

**Option A**: Add a subtle border-top to the "Did You" section
```tsx
<section className="py-16 md:py-24 bg-background border-t border-border/30">
```

**Option B**: Give "Why Coach" a very light background tint
```tsx
<section className="py-16 md:py-24 bg-secondary/20">
```

I recommend **Option A** (subtle border) as it's cleaner and matches the minimalist aesthetic.

---

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Did You section padding | `py-12 md:py-16` | `py-16 md:py-24` |
| Benefit cards bottom margin | `mb-12 md:mb-16` | `mb-10 md:mb-12` |
| Did You section | No separator | `border-t border-border/30` |

These three small adjustments will create consistent rhythm and better visual separation across the page.
