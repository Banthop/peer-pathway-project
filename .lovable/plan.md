

# Booking Flow Implementation Plan

## Overview

Create a complete booking experience for both "Schedule a free intro" and "Book a session" actions. The flow will use modal dialogs with a multi-step process, maintaining the minimal Inter Light aesthetic.

---

## User Flow Diagrams

### Flow 1: Schedule a Free Intro (15-minute discovery call)

```text
+------------------+     +------------------+     +------------------+
|   Click Button   | --> |  Select Date &   | --> |  Confirmation    |
|  "Schedule free  |     |  Time Slot       |     |  + Details Form  |
|   intro"         |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
                                                           |
                                                           v
                                                  +------------------+
                                                  |  Success Screen  |
                                                  |  (Add to Cal)    |
                                                  +------------------+
```

### Flow 2: Book a Session (Paid coaching)

```text
+------------------+     +------------------+     +------------------+
|   Click Button   | --> |  Select Service  | --> |  Select Date &   |
|  "Book session"  |     |  Type            |     |  Time Slot       |
+------------------+     +------------------+     +------------------+
                                                           |
                                                           v
                         +------------------+     +------------------+
                         |  Success Screen  | <-- |  Details + Topic |
                         |  (Add to Cal)    |     |  Description     |
                         +------------------+     +------------------+
```

---

## Modal Designs

### Free Intro Modal - Step 1: Select Date & Time

```text
+----------------------------------------------------------+
|  x                                                        |
|                                                           |
|  Schedule a free intro with Sarah                         |
|  A 15-minute call to see if we're a good fit             |
|                                                           |
|  +------------------------+  +------------------------+   |
|  |                        |  |  Available times       |   |
|  |      CALENDAR          |  |                        |   |
|  |      January 2026      |  |  ○ 10:00 AM            |   |
|  |   < Mon Tue Wed ... >  |  |  ○ 11:00 AM            |   |
|  |      1   2   3         |  |  ○ 2:00 PM             |   |
|  |      [4]  5   6        |  |  ● 6:00 PM  ← selected |   |
|  |                        |  |  ○ 7:00 PM             |   |
|  +------------------------+  +------------------------+   |
|                                                           |
|                              [Continue →]                 |
+----------------------------------------------------------+
```

### Free Intro Modal - Step 2: Your Details

```text
+----------------------------------------------------------+
|  ← Back                                                 x |
|                                                           |
|  Almost there!                                            |
|  Confirm your details for Friday, Feb 7 at 6:00 PM       |
|                                                           |
|  Full Name *                                              |
|  +------------------------------------------------------+ |
|  | John Smith                                           | |
|  +------------------------------------------------------+ |
|                                                           |
|  Email *                                                  |
|  +------------------------------------------------------+ |
|  | john@example.com                                     | |
|  +------------------------------------------------------+ |
|                                                           |
|  Anything you'd like Sarah to know? (optional)           |
|  +------------------------------------------------------+ |
|  | I'm applying for spring week programmes...           | |
|  +------------------------------------------------------+ |
|                                                           |
|                    [Confirm Booking]                      |
+----------------------------------------------------------+
```

### Free Intro Modal - Step 3: Success

```text
+----------------------------------------------------------+
|                                                         x |
|                                                           |
|                         ✓                                 |
|                                                           |
|  You're all set!                                          |
|                                                           |
|  Your free intro with Sarah is booked for:               |
|  Friday, February 7, 2026 at 6:00 PM GMT                 |
|                                                           |
|  A confirmation email has been sent to                    |
|  john@example.com                                         |
|                                                           |
|  +--------------------+  +--------------------+           |
|  | Add to Google Cal  |  | Add to Apple Cal   |           |
|  +--------------------+  +--------------------+           |
|                                                           |
|                      [Done]                               |
+----------------------------------------------------------+
```

---

### Book Session Modal - Step 1: Select Service

```text
+----------------------------------------------------------+
|  x                                                        |
|                                                           |
|  Book a session with Sarah                                |
|  Choose the type of coaching you need                     |
|                                                           |
|  +------------------------------------------------------+ |
|  | ○  CV & Cover Letter Review                          | |
|  |    45 min · £40                                       | |
|  |    Detailed feedback on your application materials    | |
|  +------------------------------------------------------+ |
|                                                           |
|  +------------------------------------------------------+ |
|  | ●  Mock Interview                         ← selected | |
|  |    60 min · £60                                       | |
|  |    Realistic practice with feedback                   | |
|  +------------------------------------------------------+ |
|                                                           |
|  +------------------------------------------------------+ |
|  | ○  Application Strategy                              | |
|  |    45 min · £45                                       | |
|  |    Personalised guidance on approach                  | |
|  +------------------------------------------------------+ |
|                                                           |
|  +------------------------------------------------------+ |
|  | ○  Custom Hourly · £50/hr                            | |
|  |    Flexible time for specific questions               | |
|  +------------------------------------------------------+ |
|                                                           |
|                              [Continue →]                 |
+----------------------------------------------------------+
```

### Book Session Modal - Step 2: Select Date & Time
(Same as Free Intro Step 1, but with selected service shown at top)

### Book Session Modal - Step 3: Details + Topic

```text
+----------------------------------------------------------+
|  ← Back                                                 x |
|                                                           |
|  Booking: Mock Interview (60 min)                         |
|  Friday, Feb 7, 2026 at 6:00 PM · £60                    |
|                                                           |
|  Full Name *                                              |
|  +------------------------------------------------------+ |
|  | John Smith                                           | |
|  +------------------------------------------------------+ |
|                                                           |
|  Email *                                                  |
|  +------------------------------------------------------+ |
|  | john@example.com                                     | |
|  +------------------------------------------------------+ |
|                                                           |
|  What would you like to focus on? *                       |
|  +------------------------------------------------------+ |
|  | I have a Goldman Sachs superday coming up and want   | |
|  | to practice market sizing questions and...           | |
|  +------------------------------------------------------+ |
|                                                           |
|  +--------------------------+                             |
|  | Total: £60               |    [Confirm & Pay →]       |
|  +--------------------------+                             |
+----------------------------------------------------------+
```

### Book Session Modal - Step 4: Success
(Similar to Free Intro success, but includes payment confirmation)

---

## Technical Implementation

### New Files to Create

| File | Purpose |
|------|---------|
| `src/components/coach/booking/BookingDialog.tsx` | Main dialog wrapper with state management |
| `src/components/coach/booking/FreeIntroFlow.tsx` | Multi-step flow for free intro |
| `src/components/coach/booking/BookSessionFlow.tsx` | Multi-step flow for paid sessions |
| `src/components/coach/booking/DateTimePicker.tsx` | Calendar + time slot selection |
| `src/components/coach/booking/ServiceSelector.tsx` | Service type selection with radio cards |
| `src/components/coach/booking/BookingDetailsForm.tsx` | Name, email, notes form |
| `src/components/coach/booking/BookingSuccess.tsx` | Confirmation screen with calendar links |
| `src/types/booking.ts` | Type definitions for booking data |

### Type Definitions

```typescript
// src/types/booking.ts

export type BookingType = 'free-intro' | 'session';

export interface TimeSlot {
  time: string;      // "10:00 AM"
  available: boolean;
}

export interface BookingFormData {
  fullName: string;
  email: string;
  notes?: string;
  focusTopic?: string;  // Required for paid sessions
}

export interface BookingState {
  type: BookingType;
  selectedService?: CoachService | { name: 'Custom Hourly'; price: number };
  selectedDate?: Date;
  selectedTime?: string;
  formData?: BookingFormData;
}
```

### Component Architecture

```text
BookingDialog (manages open/close state)
├── FreeIntroFlow (type="free-intro")
│   ├── Step 1: DateTimePicker
│   ├── Step 2: BookingDetailsForm
│   └── Step 3: BookingSuccess
│
└── BookSessionFlow (type="session")
    ├── Step 1: ServiceSelector
    ├── Step 2: DateTimePicker
    ├── Step 3: BookingDetailsForm
    └── Step 4: BookingSuccess
```

### State Management

Use React `useState` within `BookingDialog` to track:
- Current step (number)
- Booking type ('free-intro' | 'session')
- Selected service (for paid bookings)
- Selected date
- Selected time
- Form data (name, email, notes)

### Mock Time Slots

For now, generate mock availability data. The slots will be based on the coach's `availability.nextSlot` as a starting point:

```typescript
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots = [
    { time: "9:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "2:00 PM", available: true },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: false },
    { time: "5:00 PM", available: true },
    { time: "6:00 PM", available: true },
  ];
  return slots;
};
```

---

## Implementation Steps

### Step 1: Create Types and Utilities
- Create `src/types/booking.ts` with type definitions
- Add utility functions for date formatting and mock slot generation

### Step 2: Build DateTimePicker Component
- Calendar on left (using existing Calendar component)
- Time slots on right as selectable pills/buttons
- Handle date selection updating available times
- Add `pointer-events-auto` to calendar for dialog interaction

### Step 3: Build ServiceSelector Component
- Radio group with styled cards for each service
- Show service name, duration, price, description
- Include "Custom Hourly" option

### Step 4: Build BookingDetailsForm Component
- Form with react-hook-form + zod validation
- Fields: fullName (required), email (required), notes/focusTopic
- Different validation for free intro vs paid session

### Step 5: Build BookingSuccess Component
- Checkmark icon animation
- Booking summary details
- "Add to Calendar" buttons (Google, Apple)
- "Done" button to close

### Step 6: Build FreeIntroFlow Component
- 2-step flow: DateTimePicker -> BookingDetailsForm -> Success
- Back button navigation
- Progress indicator (optional)

### Step 7: Build BookSessionFlow Component
- 3-step flow: ServiceSelector -> DateTimePicker -> BookingDetailsForm -> Success
- Back button navigation
- Show selected service throughout

### Step 8: Build BookingDialog Component
- Wrap flows in Dialog component
- Manage which flow to show based on booking type
- Reset state when dialog closes

### Step 9: Connect to BookingSidebar and MobileBookingBar
- Add onClick handlers to buttons
- Pass coach data to booking dialog
- Handle dialog open/close state

---

## Styling Guidelines

- Use `font-sans font-light` for body text
- Use `font-sans font-medium` for headings
- White backgrounds with subtle borders
- Primary button for main CTA, outline for secondary
- Time slots: outline style, filled when selected
- Form inputs: standard shadcn styling
- Success checkmark: green with subtle animation

---

## Form Validation (using Zod)

```typescript
const bookingFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  notes: z.string().optional(),
  focusTopic: z.string().optional(),
});

// For paid sessions, focusTopic becomes required
const paidBookingSchema = bookingFormSchema.extend({
  focusTopic: z.string().min(10, "Please describe what you'd like to focus on"),
});
```

---

## Calendar Integration (Add to Calendar)

Generate calendar links using URL parameters:

```typescript
const generateGoogleCalendarUrl = (booking: BookingState, coach: Coach) => {
  const startDate = // format booking date + time
  const endDate = // add duration
  const title = encodeURIComponent(`Coaching with ${coach.name}`);
  const details = encodeURIComponent(`${booking.selectedService?.name}`);
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}`;
};
```

---

## Mobile Considerations

- Dialog should be full-screen on mobile (drawer style)
- Calendar and time slots stack vertically on mobile
- Form fields full width
- Larger touch targets for time slot selection

---

## Summary

This implementation creates a polished, multi-step booking experience with:

1. **Free Intro Flow**: Quick 2-step process (select time -> confirm details)
2. **Book Session Flow**: 3-step process (select service -> select time -> confirm details)
3. **Shared Components**: Reusable DateTimePicker, form, and success screen
4. **Consistent Styling**: Matches the minimal Inter Light aesthetic
5. **Form Validation**: Proper error handling with Zod
6. **Calendar Integration**: Easy addition to Google/Apple calendars

The flow is designed to be straightforward and conversion-focused, removing friction while collecting the necessary information for a successful coaching session.

