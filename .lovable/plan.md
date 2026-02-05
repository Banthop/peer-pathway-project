

# Restructure Become a Coach Page for Better Visibility

## The Problem

The current structure hides key selling points:

```text
Current Flow:
"Did you..." headline (weak, vague)
  ↓
Achievement questions (muted gray - blends in)
  ↓
3 Benefit cards
  ↓
"Less effort than a part-time job..." (muted, buried, hidden)
  ↓
Final CTA
```

**Issues:**
1. "Less effort than a part-time job" is a killer selling point but it's styled as an afterthought in muted gray at the bottom
2. The "Did you..." headline is vague - it doesn't tell you what to expect
3. The achievement questions and time commitment are all muted - nothing pops

---

## The Solution

Restructure so the benefits section has a strong headline, and make the time commitment line stand out:

```text
New Flow:
HERO (unchanged)
  ↓
HOW IT WORKS (unchanged)
  ↓
WHY COACH section (renamed, clearer)
  - Strong headline: "Why coach on EarlyEdge"
  - 3 Benefit cards (same as before)
  - Time commitment as a featured callout box (stands out!)
  ↓
DID YOU section (now separate, punchy)
  - "Did you..." + achievements
  - Direct CTA: "Then you're ready."
  ↓
FINAL CTA (unchanged)
```

**Key changes:**
1. Split the merged section back into two distinct parts for clarity
2. Make "Less effort than a part-time job" a standout callout box with a subtle background
3. Give the benefits a proper headline ("Why coach on EarlyEdge")
4. Make "Did you..." section a punchy qualifier that leads directly to action

---

## Page Structure After Changes

```text
+------------------------------------------------------------------+
|  HERO                                                             |
|  "You figured it out. Now earn from it."                          |
|  [Become a Coach]                                                 |
+------------------------------------------------------------------+
|  HOW IT WORKS                                                     |
|  4 steps: Apply - Verify - Set Terms - Earn                       |
+------------------------------------------------------------------+
|  WHY COACH ON EARLYEDGE                                           |
|                                                                   |
|  [Card 1]       [Card 2]       [Card 3]                          |
|  Qualified      Reputation     Schedule                           |
|                                                                   |
|  +------------------------------------------------------------+   |
|  |  Less effort than a part-time job.                         |   |
|  |  A couple hours a week, on your schedule, from laptop.     |   |
|  +------------------------------------------------------------+   |
+------------------------------------------------------------------+
|  DID YOU...                                                       |
|  Oxford? Spring Week? UCAT? TC? Consulting?                       |
|  "Then you're ready."                                             |
|  [Become a Coach]                                                 |
+------------------------------------------------------------------+
|  FINAL CTA (dark)                                                 |
|  "Your experience is valuable. Literally."                        |
+------------------------------------------------------------------+
```

---

## Code Changes

### File: `src/pages/BecomeACoach.tsx`

**1. Rename and restructure the combined section into "Why Coach" section:**

```tsx
{/* Why Coach Section */}
<section className="py-16 md:py-24 bg-background">
  <div className="container mx-auto px-4">
    <ScrollReveal>
      <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-12 md:mb-16 text-center">
        Why coach on EarlyEdge
      </h2>
    </ScrollReveal>

    {/* Benefit cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
      {benefits.map(...)}
    </div>

    {/* Time commitment - FEATURED CALLOUT */}
    <ScrollReveal delay={0.3}>
      <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-2xl bg-secondary/50 border border-border/50 text-center">
        <p className="text-xl md:text-2xl font-sans font-medium text-foreground mb-2">
          Less effort than a part-time job.
        </p>
        <p className="text-base md:text-lg font-sans font-light text-muted-foreground">
          A couple hours a week, on your schedule, from your laptop.
        </p>
      </div>
    </ScrollReveal>
  </div>
</section>
```

**2. Add new "Did You" section as a qualifier:**

```tsx
{/* Did You Section - Qualifier */}
<section className="py-12 md:py-16 bg-background">
  <div className="container mx-auto px-4 text-center">
    <ScrollReveal>
      <h2 className="text-3xl md:text-4xl font-sans font-extralight text-foreground mb-4">
        Did you...
      </h2>
    </ScrollReveal>
    <ScrollReveal delay={0.1}>
      <p className="text-lg md:text-xl font-sans font-light text-muted-foreground mb-6 max-w-3xl mx-auto">
        Get into Oxford? Land a Spring Week? Score 3000+ on UCAT? Secure a TC at a magic circle firm? Break into consulting?
      </p>
    </ScrollReveal>
    <ScrollReveal delay={0.2}>
      <p className="text-xl md:text-2xl font-sans font-medium text-foreground mb-6">
        Then you're ready.
      </p>
    </ScrollReveal>
    <ScrollReveal delay={0.3}>
      <Button
        size="lg"
        className="bg-foreground text-background hover:bg-foreground/90 font-sans font-medium px-8 py-6 text-base"
      >
        Become a Coach
      </Button>
    </ScrollReveal>
  </div>
</section>
```

---

## Summary

1. **Split sections** - "Why Coach" and "Did You" become distinct sections with clear purposes
2. **Featured callout** - "Less effort than a part-time job" gets a standout box with background
3. **Strong headline** - "Why coach on EarlyEdge" is clear and direct
4. **Punchy qualifier** - "Did you..." becomes a short section that ends with "Then you're ready." and a CTA
5. **Better flow** - Benefits explain why, qualifier confirms who, final CTA closes

