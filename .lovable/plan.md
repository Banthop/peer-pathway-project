
# Dashboard Design Improvements

## Overview

Polish the dashboard to create a more refined, premium experience that better matches the high-quality design of the landing page while maintaining the black-and-white aesthetic.

---

## Improvement Areas

### 1. Sidebar Enhancements

**Current:** Plain logo, basic navigation  
**Improved:**
- Update logo to match header style: "Early" in light weight, "Edge" in bold
- Add user avatar and name at the bottom (above Settings)
- Increase padding and spacing for a more spacious feel
- Add subtle background hover states with smoother transitions

```text
+------------------+
| EarlyEdge        |  <- Styled logo
|                  |
| o Overview       |
| o Browse Coaches |
| o My Bookings    |
| o Saved Coaches  |
|                  |
|                  |
| +-------------+  |
| | (avatar) Alex|  |  <- User section
| +-------------+  |
| o Settings       |
| o Log out        |
+------------------+
```

### 2. Session Card Redesign

**Current:** Basic layout, cramped information  
**Improved:**
- Larger avatar (56px instead of 48px)
- Add university/company logo badges (like FeaturedCoaches)
- Clear visual separation between sections
- More prominent session type badge
- Add subtle shadow on hover
- Better date/time formatting with icons

```text
+----------------------------------------+
|  [Avatar]   Sarah K.        [CV Review]|
|  (56px)     Goldman Sachs Spring Week  |
|                                        |
|  [calendar icon] Thu, Feb 5            |
|  [clock icon] 2:00 PM - 2:45 PM        |
|                                        |
|  [Reschedule]          [Join call -->] |
+----------------------------------------+
```

### 3. Alert Banner Enhancement

**Current:** Flat muted background  
**Improved:**
- Add left accent border for visual importance
- Larger, bolder text
- More prominent call-to-action button
- Add coach avatar to the banner

```text
+------------------------------------------------+
| |  [Avatar] You have a session with Sarah K.   |
| |  tomorrow at 2:00 PM                         |
| |                                [Join call]   |
+------------------------------------------------+
```

### 4. Recommended Coaches Cards

**Current:** Basic cards without logos  
**Improved:**
- Add university and company logo badges (matching FeaturedCoaches)
- Add star rating display
- Better tag styling with more visual weight
- Add "Book intro" button alongside "View profile"
- Increase card height for breathing room

### 5. Past Session Cards

**Current:** Inconsistent layout, awkward text wrapping  
**Improved:**
- Horizontal layout instead of vertical
- Fixed credential text truncation
- Cleaner review/rating display
- Add session notes preview if available

### 6. Tab Styling (Bookings Page)

**Current:** Basic Radix tabs  
**Improved:**
- Pill-style tabs with sliding indicator (matching login page toggle)
- Add session count badges next to tab labels
- Smooth animation between tabs

```text
[ Upcoming (2) ]  [ Past (3) ]
      ^^^^^^
   active indicator
```

### 7. Saved Coaches Cards

**Current:** Minimal information  
**Improved:**
- Add category tags
- Add star rating
- Add "Book intro" button
- Show availability indicator
- Match styling with RecommendedCoachCard

### 8. Global Dashboard Polish

- Add subtle page transition animations
- Consistent heading hierarchy (all section headers same weight)
- Better empty state illustrations
- Add skeleton loading states for future data fetching

---

## Technical Implementation

### Files to Update

| File | Changes |
|------|---------|
| `DashboardSidebar.tsx` | Add user section, update logo styling |
| `UpcomingSessionCard.tsx` | Redesign with larger avatar, icons, better layout |
| `PastSessionCard.tsx` | Horizontal layout, truncation fixes |
| `SessionAlertBanner.tsx` | Add accent border, avatar, enhanced styling |
| `RecommendedCoachCard.tsx` | Add logos, rating, book button |
| `SavedCoachCard.tsx` | Add tags, rating, better CTA |
| `DashboardBookings.tsx` | Pill-style tabs with counts |
| `DashboardOverview.tsx` | Minor spacing adjustments |

### New Components

- `UserSection.tsx` - Reusable user avatar/name block for sidebar

### Data Updates

- Add `rating` and `sessions` count to `RecommendedCoach` type
- Add `universityLogo` and `companyLogo` to coach types

---

## Design Tokens

All improvements will use existing design tokens:

- **Borders:** `border-border/40` (default), `border-border` (hover)
- **Shadows:** `shadow-sm` (cards), `shadow-md` (hover)
- **Spacing:** Increase padding from `p-4` to `p-5` on cards
- **Typography:** `font-medium` for names, `font-light` for descriptions
- **Transitions:** `transition-all duration-200`

---

## Priority Order

1. **Session cards** - Most visible, biggest impact
2. **Alert banner** - Important for user engagement
3. **Sidebar user section** - Adds personalization
4. **Recommended coaches** - Consistency with landing page
5. **Tab styling** - Polish
6. **Saved coaches** - Complete the experience

---

## Expected Result

A dashboard that feels as polished as the landing page, with:
- Clear visual hierarchy
- Premium, spacious feel
- Smooth micro-interactions
- Consistent design language
- Better information density without feeling cramped
