

# Student Dashboard Implementation Plan

## Overview

Create a comprehensive Student Dashboard at `/dashboard` with a sidebar navigation layout, following the reference design patterns while maintaining EarlyEdge's black and white minimalist aesthetic.

---

## Route Structure

```text
/dashboard                 -> Overview (default)
/dashboard/bookings        -> My Bookings (with Upcoming/Past tabs)
/dashboard/saved           -> Saved Coaches
/dashboard/settings        -> Settings (future)
```

---

## File Structure

```text
src/
├── components/
│   └── dashboard/
│       ├── DashboardSidebar.tsx       # Left sidebar navigation
│       ├── DashboardLayout.tsx        # Layout wrapper with sidebar
│       ├── UpcomingSessionCard.tsx    # Reusable session card
│       ├── PastSessionCard.tsx        # Past session with review
│       ├── SavedCoachCard.tsx         # Coach card with unsave
│       ├── RecommendedCoachCard.tsx   # Recommended coach card
│       ├── SessionAlertBanner.tsx     # Upcoming session alert
│       └── EmptyState.tsx             # Reusable empty state
├── pages/
│   └── dashboard/
│       ├── DashboardOverview.tsx      # Main overview page
│       ├── DashboardBookings.tsx      # Bookings with tabs
│       └── DashboardSaved.tsx         # Saved coaches grid
├── types/
│   └── dashboard.ts                   # Dashboard-specific types
└── data/
    └── sampleBookings.ts              # Mock data for sessions
```

---

## Component Details

### 1. DashboardLayout.tsx

The main layout wrapper using the existing Shadcn Sidebar components.

**Structure:**
- `SidebarProvider` wrapping everything
- `DashboardSidebar` component on the left
- `SidebarInset` containing the main content area
- Mobile: Sidebar collapses to a Sheet (built into Shadcn)

**Key Features:**
- Uses `collapsible="icon"` for icon-only mode on smaller screens
- White background (`bg-background`)
- Proper spacing from sidebar

### 2. DashboardSidebar.tsx

Left navigation using Shadcn's `Sidebar`, `SidebarContent`, `SidebarMenu`, etc.

**Top Section (Logo + Trigger):**
- EarlyEdge logo at top
- `SidebarTrigger` for collapse/expand

**Navigation Items:**
- Overview (Home icon)
- Browse Coaches (Search icon)
- My Bookings (Calendar icon)
- Saved Coaches (Heart icon)

**Bottom Section (SidebarFooter):**
- Settings (Settings icon)
- Log out (LogOut icon)

**Active State Styling:**
- Uses `NavLink` component with `activeClassName`
- Active: `bg-muted text-foreground font-medium`
- Inactive: `text-muted-foreground hover:bg-muted/50`

### 3. DashboardOverview.tsx

The main dashboard landing page.

**Header:**
```text
Welcome back, Alex          <- Dynamic name (hardcoded for now)
Here's what's coming up     <- Subtext
```

**Alert Banner (conditional):**
- Only shows if session within 24 hours
- "You have a session with Sarah K. tomorrow at 2:00 PM"
- "Join call" button (black, primary style)

**Upcoming Sessions Section:**
- Headline: "Upcoming sessions"
- Grid/list of `UpcomingSessionCard` components
- Empty state: "No sessions booked yet" + "Browse coaches" button

**Past Sessions Section:**
- Headline: "Past sessions"
- Shows max 3 with "View all" link
- `PastSessionCard` with review status

**Recommended Coaches Section:**
- Headline: "Coaches you might like"
- Horizontal scroll on mobile, 3-4 card grid on desktop
- "Browse all coaches" link at bottom

### 4. UpcomingSessionCard.tsx

Card for upcoming bookings.

**Content:**
- Coach photo (circular, 48px)
- Coach name + credential (e.g., "Goldman Spring Week '24")
- Date and time
- Session type badge
- "Join call" button (shows if within 15 mins)
- "Reschedule" link

**Styling:**
- `rounded-xl border border-border/40`
- White background
- Subtle hover effect

### 5. PastSessionCard.tsx

Card for past sessions.

**Content:**
- Coach photo + name + credential
- Date
- Session type
- Review status:
  - If not reviewed: "Leave review" button
  - If reviewed: Star rating display

### 6. SavedCoachCard.tsx

For the Saved Coaches page.

**Content:**
- Coach photo
- Name
- Credential
- Hourly rate
- "View profile" button
- Heart icon (filled) to unsave

### 7. RecommendedCoachCard.tsx

Simplified coach card for recommendations.

**Content:**
- Photo
- Name
- Credential + year
- Category tags (2-3)
- Hourly rate
- "View profile" button

### 8. SessionAlertBanner.tsx

Alert component for imminent sessions.

**Styling:**
- `bg-muted rounded-xl p-4`
- Info icon on left
- Text + "Join call" button on right

### 9. EmptyState.tsx

Reusable empty state component.

**Props:**
- `icon`: Lucide icon
- `title`: string
- `description`: string
- `actionLabel`: string
- `actionHref`: string

---

## Data Types

### types/dashboard.ts

```typescript
export interface Session {
  id: string;
  coachId: string;
  coachName: string;
  coachPhoto: string;
  coachCredential: string;
  date: Date;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reviewed?: boolean;
  rating?: number;
}

export interface SavedCoach {
  id: string;
  name: string;
  photo: string;
  credential: string;
  hourlyRate: number;
  tags: string[];
}
```

---

## Mock Data

### data/sampleBookings.ts

Sample sessions for UI development:

**Upcoming Sessions:**
1. Sarah K. - CV Review - Tomorrow 2:00 PM
2. David W. - Mock Interview - Feb 10, 10:00 AM

**Past Sessions:**
1. Sarah K. - Application Strategy - Jan 28 (reviewed, 5 stars)
2. James L. - Coding Interview Prep - Jan 20 (not reviewed)
3. Emily R. - LNAT Prep - Jan 15 (reviewed, 4 stars)

**Saved Coaches:**
- Reuse existing coach data from `sampleCoach.ts`

---

## Routing Updates

### App.tsx Changes

Add nested routes for dashboard:

```typescript
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardBookings from "./pages/dashboard/DashboardBookings";
import DashboardSaved from "./pages/dashboard/DashboardSaved";

// Inside Routes:
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardOverview />} />
  <Route path="bookings" element={<DashboardBookings />} />
  <Route path="saved" element={<DashboardSaved />} />
</Route>
```

---

## Styling Guidelines

Following EarlyEdge's established patterns:

**Colors (Black and White Only):**
- Background: `bg-background` (white)
- Text: `text-foreground` (black)
- Muted: `text-muted-foreground` (gray)
- Borders: `border-border/40`
- Surfaces: `bg-muted` or `bg-secondary`

**Typography:**
- Font: `font-sans` (Inter)
- Weights: `font-light` (body), `font-medium` (emphasis)
- Headings: Light weight, large sizes

**Buttons:**
- Primary: `bg-foreground text-background` (black with white text)
- Secondary/Ghost: `bg-transparent text-foreground`

**Cards:**
- `rounded-xl border border-border/40`
- Subtle hover: `hover:border-border`
- Clean, minimal padding

**Spacing:**
- Generous whitespace
- Section padding: `py-8`
- Card gaps: `gap-4` or `gap-6`

---

## Mobile Responsiveness

**Sidebar Behavior:**
- Desktop (md+): Fixed sidebar, always visible
- Mobile: Sheet overlay triggered by hamburger
- Uses built-in Shadcn sidebar mobile behavior

**Content Layout:**
- Cards stack vertically on mobile
- Horizontal scroll for recommended coaches on small screens
- Responsive padding adjustments

---

## Implementation Order

1. **Types and Mock Data** - Create data structures first
2. **DashboardLayout + DashboardSidebar** - Core layout shell
3. **DashboardOverview** - Main page with all sections
4. **Session Cards** - Upcoming and Past components
5. **DashboardBookings** - Bookings page with tabs
6. **DashboardSaved** - Saved coaches grid
7. **Route Updates** - Wire everything in App.tsx

---

## Technical Considerations

- Uses existing `NavLink` component for active route highlighting
- Leverages existing coach data from `sampleCoach.ts`
- Reuses existing UI components (Card, Button, Badge, Tabs, Avatar)
- Session times use existing date-fns dependency for formatting
- Empty states consistent across all pages

