# Coaching Booking Flow SOP

**Owner:** Uthman (delivery) + Automated (booking + emails)
**Last updated:** April 2026

---

## The Flow

```
Student clicks "Book Uthman" on portal
        │
        ▼
Selects session type + date/time
        │
        ▼
Clicks "Pay & Book"
        │
        ▼
Stripe Checkout opens, student pays
        │
        ▼
Redirect back to portal with ?success=true
        │
        ├── Supabase: save to portal_bookings
        ├── Loops event "booking_confirmed": send student confirmation email
        ├── Loops event "new_booking_notification": send Uthman notification email
        └── Attio: create/update deal in Student Sales pipeline
        │
        ▼
Student sees "You're booked" confirmation + calendar download
```

---

## Session Types & Pricing

| Session | Duration | Price | Stripe Product |
|---------|----------|-------|----------------|
| Strategy Call | 30 min | £35 | create-booking-checkout |
| Deep Dive | 60 min | £59 | create-booking-checkout |
| Group Workshop | 90 min | £20/person | create-booking-checkout |
| 3x Deep Dive Bundle | 3 x 60 min | £140 | create-booking-checkout |

---

## Uthman's Checklist

### Before Session (24h)
- [ ] Check portal_bookings for tomorrow's sessions
- [ ] Send Zoom link to student (reply to their confirmation email)
- [ ] Review student's notes (if they filled in the "anything Uthman should know" field)
- [ ] Prepare any relevant templates/resources for their situation

### During Session
- [ ] Start Zoom recording
- [ ] Go through their specific situation
- [ ] Build custom email templates with them
- [ ] Give actionable next steps (write in chat so they can copy)
- [ ] Answer questions

### After Session (within 24h)
- [ ] Send follow-up email with:
  - [ ] Summary of action items
  - [ ] Any custom templates created during the call
  - [ ] Relevant resources (guide sections, examples)
  - [ ] Next session recommendation (if applicable)

### After Session (Day 7)
- [ ] Loops flow sends automated testimonial request:
  - "Hey [name], it's been a week since our session. How are you getting on with the cold emails? Quick favour - would you mind sharing a 2-3 sentence review of the session? Would really help other students considering coaching."
- [ ] If they respond with testimonial, add to BookUthman page reviews

---

## Rescheduling Policy

- Student must email uthman6696@gmail.com at least **24 hours before**
- Uthman finds a new time and confirms via email
- Update the booking in Supabase (or just create a new one)
- No automated rescheduling - manual for now

---

## Refund Policy

- Within 24 hours of session: full refund or follow-up session, no questions asked
- Process refund via Stripe dashboard
- Update Attio deal stage to "Refunded"
- Send brief "sorry it didn't work out" email, ask for feedback

---

## When Cal.com is Active

When `CAL_USERNAME` is set in BookUthman.tsx:
- Students book directly through Cal.com embed
- Cal.com handles availability + time zone conversion
- Cal.com sends its own confirmation email (can customize in Cal.com settings)
- Payment still goes through Stripe checkout
- Supabase booking record still created on success redirect

**To activate Cal.com:**
1. Uthman sets up Cal.com account with event types matching session IDs
2. Set `CAL_USERNAME = "uthman-xyz"` in BookUthman.tsx
3. Deploy to Vercel
4. Manual date picker is automatically replaced with Cal.com embed

---

## Metrics (Track in Attio)

| Metric | Target | How to Track |
|--------|--------|-------------|
| Bookings per week | 3+ | Attio pipeline deal count (stage: "Coaching Booked") |
| Revenue per week | £150+ | Attio deal value |
| Show-up rate | 95%+ | Manual - Uthman marks no-shows |
| Testimonial response rate | 50%+ | Loops flow completion rate |
| Repeat bookings | 20%+ | Attio "number of deals" per contact |
