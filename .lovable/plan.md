

# Fix Coloring on Become a Coach Page

## The Problem

Comparing the Become a Coach page to the main landing page, I can see several color inconsistencies that make the page feel "off":

### Current Issues

1. **How It Works section uses `bg-secondary/30`** - This creates a grayish tinted background, but the main site's How It Works section has no background (just `bg-background`). This breaks the clean white consistency.

2. **The "Did you..." achievement text uses `text-foreground`** - This makes it the same weight as the headline visually. On the main site, body text consistently uses `text-muted-foreground` for hierarchy.

3. **Step number badges use `bg-primary`** - The primary color in your theme is a dark gray (`266 4% 20.8%`), which is almost identical to `foreground`. This makes the numbered badges blend into the dark icon circles rather than providing contrast.

4. **Final CTA section uses `bg-foreground`** - This is fine (dark section), but the main site's FinalCTA uses `bg-background` (white). The inconsistency between pages may feel jarring.

### Color Comparison

| Element | Become a Coach | Main Site |
|---------|----------------|-----------|
| How It Works bg | `bg-secondary/30` (gray tint) | `bg-background` (white) |
| Achievement text | `text-foreground` (dark) | `text-muted-foreground` |
| Final CTA bg | `bg-foreground` (dark) | `bg-background` (white) |

---

## The Solution

Align the Become a Coach page with the main site's color approach for consistency:

### 1. Remove the Gray Background from How It Works

Change from `bg-secondary/30` to `bg-background` to match the clean white approach used across the main site.

### 2. Fix Achievement Text Color

The flowing "Get into Oxford? Land a Spring Week?..." text should use `text-muted-foreground` instead of `text-foreground` to create proper visual hierarchy under the "Did you..." headline.

### 3. Keep the Dark Final CTA (Optional Discussion)

The dark final CTA actually works well as a page closer - it creates a strong call to action. However, if you want consistency with the main site, we can switch it to white. I'd recommend keeping it dark since it serves a different purpose (recruitment vs. student conversion).

---

## Changes to Make

### File: `src/pages/BecomeACoach.tsx`

**Change 1: How It Works background**
```tsx
// Before (line 92)
<section className="py-16 md:py-24 bg-secondary/30">

// After
<section className="py-16 md:py-24 bg-background">
```

**Change 2: Achievement questions text color**
```tsx
// Before (line 134)
<p className="text-lg md:text-xl font-sans font-light text-foreground mb-8 md:mb-10 ...">

// After
<p className="text-lg md:text-xl font-sans font-light text-muted-foreground mb-8 md:mb-10 ...">
```

---

## Visual Result

After these changes:

```text
+------------------------------------------------------------------+
|  HERO (white bg)                                                  |
|  Dark headline, muted subtext, dark button                        |
+------------------------------------------------------------------+
|  HOW IT WORKS (white bg - now matches main site)                  |
|  Dark icon circles, step descriptions in muted gray               |
+------------------------------------------------------------------+
|  DID YOU... (white bg)                                            |
|  "Did you..." in dark                                             |
|  Achievement questions in muted gray (now hierarchy is clear)     |
|  Benefit cards with dark icons                                    |
|  Time commitment in muted gray                                    |
+------------------------------------------------------------------+
|  FINAL CTA (dark bg - strong closer)                              |
|  White text, white button                                         |
+------------------------------------------------------------------+
```

---

## Summary

Two simple color fixes:
1. Remove the gray tint from How It Works (`bg-secondary/30` to `bg-background`)
2. Make achievement questions use muted text (`text-foreground` to `text-muted-foreground`)

This aligns the page with the main site's clean, high-contrast aesthetic while keeping the dark Final CTA as an intentional design choice for the recruitment page.

