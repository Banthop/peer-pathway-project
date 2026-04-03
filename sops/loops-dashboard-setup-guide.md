# Loops Dashboard Setup: Complete Checklist

## Section 1: Pre-Requisites

**Loops API Key:** (stored in Loops dashboard under Settings > API)

**DNS Status:** VERIFIED (emails already sending/delivering/clicking based on Don's contact data)

**Supabase Secrets Still Needed:**
- `LOOPS_API_KEY`: (copy from Loops dashboard > Settings > API)
- `ATTIO_API_KEY`: (copy from Attio dashboard > Settings > Developers)
- `LOOPS_PORTAL_TRANSACTIONAL_ID`: Create the template first, then copy its ID

Add all three at: https://supabase.com/dashboard/project/cidnbhphbmwvbozdxqhe/settings/functions

---

## Section 2: Custom Contact Properties

These already exist in Loops (created via API):

| Property | Type | Notes |
|----------|------|-------|
| university | string | e.g. "Imperial College London" |
| productType | string | e.g. "bundle", "spring_week_premium" |
| isBundle | boolean | true/false |
| totalSpent | number | Cumulative GBP spend |
| awarenessLevel | string | e.g. "Problem Aware", "Most Aware" |
| status | string | e.g. "lead", "converted" |
| tags | string | Comma-separated string |
| webinarType | string | "cold_email" or "spring_week" |
| yearOfStudy | string | e.g. "2nd Year" |
| targetIndustry | string | e.g. "Investment Banking" |
| coachingSessions | number | Count of sessions booked |
| hasTestimonial | boolean | true/false |
| portalAccess | boolean | true/false |
| stripeCustomerId | string | Stripe customer ID |
| referralCode | string | For future referral tracking |
| springWeekProductType | string | "part1", "part2", "bundle", "premium" |
| hasPlaybook | boolean | true/false |
| hasCoaching | boolean | true/false |
| sessionAttended | string | "part1", "part2", or "both" |
| coachName | string | Panellist coach name |
| coachFirm | string | e.g. "Citi", "Barclays" |
| lifetimeValue | number | Total lifetime spend |
| source | string | e.g. "webinar", "linkedin" |

---

## Section 3: Event Names (What Edge Functions Fire)

| Event name | Fired by | When |
|---|---|---|
| `purchase_completed` | stripe-webhook | On every Stripe checkout.session.completed |
| `portal_access_granted` | send-portal-access | When batch portal access is manually triggered |
| `booking_confirmed` | send-booking-confirmation | When a student books coaching |
| `new_booking_notification` | send-booking-confirmation | Same trigger, fires to Uthman's email |
| `contact_synced` | loops-sync | First time a buyer contact is synced |
| `spring_week_webinar_complete` | Manual trigger | After the webinar session ends |
| `spring_week_coaching_booked` | Future update | When student books with a panellist |

---

## Section 4: Build All 8 Flows

### Flow 1: Purchase Completed (Buyer Welcome)

**Trigger:** Event `purchase_completed`

1. **Email 1 (Immediate)** - Subject: `you're in`
   - Preview: "Here's everything you just unlocked."
   - Body: from sops/loops-email-sequences.md lines 56-80
   - CTA: "Access Your Portal" > {{portalLink}}
   - Use Liquid conditionals for bundle content: `{% if isBundle == true %}...{% endif %}`

2. **Email 2 (Day 1)** - Subject: `watch it like this (not like a Netflix show)`
   - Preview: "4 things to do while you watch the recording."
   - Body: from lines 99-124
   - CTA: "Watch the Recording" > {{portalLink}}

3. **Email 3 (Day 3)** - Subject: `the recording gives you the playbook. this gives you a coach.`
   - Preview: "What happened when 3 students booked a session after the webinar."
   - Body: from lines 143-173
   - CTA: "Book a Coaching Session" > {{bookUthmanLink}}
   - Filter: skip if productType == "recording_premium"

4. **Email 4 (Day 7)** - Subject: `quick favour (30 seconds)`
   - Preview: "Would genuinely mean a lot."
   - Body: from lines 193-211
   - No CTA, reply-based ask

**Also create:** Portal Access transactional template
- Go to Transactional > New Template
- Name: "Portal Access Email"
- Use content from lines 239-268
- Save, copy the template ID
- Add ID as Supabase secret: LOOPS_PORTAL_TRANSACTIONAL_ID

---

### Flow 2: Portal Access Granted

**Trigger:** Event `portal_access_granted`

1. **Email 1 (Immediate)** - Subject: `your portal is live - here's how to get in`
   - Preview: "Login link + what to do first."
   - Body: from lines 239-268
   - CTA: "Open Your Portal" > {{portalLink}}
   - Conditional: bundle guide references wrapped in `{% if isBundle == true %}...{% endif %}`

---

### Flow 3: Booking Confirmed (to Student)

**Trigger:** Event `booking_confirmed`

1. **Email 1 (Immediate)** - Subject: `you're booked - {{sessionName}} on {{dateStr}}`
   - Body: from lines 297-327
   - No CTA

2. **Email 2 (Day 1)** - Subject: `tomorrow: your session with Uthman`
   - Body: from lines 347-369
   - Prep checklist

3. **Email 3 (Day 7)** - Subject: `how's it going since our session?`
   - Body: from lines 429-457
   - Signoff: Uthman

**Also create:** Session Recap transactional template (Uthman fills in manually after each session)

---

### Flow 4: New Booking Notification (to Uthman)

**Trigger:** Event `new_booking_notification`

1. **Email 1 (Immediate)** - Subject: `New booking: {{studentName}} - {{sessionName}} on {{dateStr}}`
   - Body: from lines 485-502
   - Sends to Uthman's email (uthman6696@gmail.com, set in the edge function)

---

### Flow 5: Spring Week Promo (Broadcast Campaigns)

**Not event-triggered.** These are scheduled campaigns sent to your full contact list.

1. **Campaign 1 (Day 0)** - Subject: `getting a spring week is the easy part`
   - Body: from lines 529-550. No CTA.

2. **Campaign 2 (Day 2)** - Subject: `3 things that separate students who convert spring weeks`
   - Body: from lines 569-590. No CTA.

3. **Campaign 3 (Day 4)** - Subject: `we're putting 8 students who converted their spring weeks on a panel`
   - Body: from lines 610-654. Update placeholder firm names and dates before sending.
   - CTA: "Register Now" > landing page URL

4. **Campaign 4 (Day 6)** - Subject: `100+ students attended our last webinar. here's what happened after.`
   - Body: from lines 668-697.
   - CTA: "Save Your Spot" > landing page URL

5. **Campaign 5 (Day 8)** - Subject: `registration closes in 48 hours`
   - Body: from lines 717-753. Update prices and dates.
   - CTA: "Register Before It Closes" > landing page URL

---

### Flow 6: Spring Week Purchase Completed

**Trigger:** Event `purchase_completed` with filter: `webinarType == "spring_week"`

1. **Email 1 (Immediate)** - Subject: `you're in - here's what's coming`
   - Body: from lines 791-843. Four conditional blocks by productType.
   - CTA: "Open Your Portal" > {{portalLink}}

2. **Email 2 (Day 2)** - Subject: `how to prepare before the webinar`
   - Body: from lines 858-895.
   - CTA: "Open Your Portal" > {{portalLink}}

3. **Email 3 (Day 5)** - Subject: `confirmed: who's speaking at part {{webinarPart}}`
   - Body: from lines 913-945. Update with actual speaker names before buyers reach this.

4. **Email 4 (Day 7)** - Subject: `your webinar is [X] days away`
   - Body: from lines 959-998.
   - CTA: "Open Your Portal" > {{portalLink}}

---

### Flow 7: Spring Week Post-Webinar

**Trigger:** Event `spring_week_webinar_complete` (fire manually after each session)

1. **Email 1 (Immediate)** - Subject: `thanks for being there`
   - Body: from lines 1024-1055.

2. **Email 2 (Day 1)** - Subject: `your recording is ready`
   - Body: from lines 1069-1103.
   - CTA: "Watch the Recording" > {{portalLink}}

3. **Email 3 (Day 5)** - Subject: `what's your next move?`
   - Body: from lines 1118-1153.
   - CTA: "Book a Coaching Session" > {{bookUthmanLink}} (for non-coaching buyers)

---

### Flow 8: Spring Week Coaching Booked

**Trigger:** Event `spring_week_coaching_booked`

1. **Email 1 (Immediate)** - Subject: `booked - your session with {{coachName}} ({{coachFirm}})`
   - Body: from lines 1184-1212.
   - Signoff: Don & Uthman

2. **Email 2 (Day 1)** - Subject: `tomorrow: your session with {{coachName}}`
   - Body: from lines 1233-1254.

3. **Email 3 (Day 2)** - Subject: `how was your session with {{coachName}}?`
   - Body: from lines 1272-1293.
   - CTA: "Book a Follow-Up Session" > {{bookUthmanLink}}
   - Signoff: Uthman

---

## Section 5: Email Design Spec

Match this exactly in the Loops template editor:

- Max width: 480px, centered
- Font: system fonts (Apple, Segoe UI, Arial)
- Text: #222222, 15px, line-height 27px
- CTA buttons: #111111 background, white text, 8px radius, 14px font
- Background: white, no images
- Logo footer: "Early" (light) + "Edge" (bold) in 13px #999999
- Subject lines: always lowercase
- Signoffs: "Don & Dylan" for brand, "Uthman" for coaching, "Don & Uthman" for coaching confirmations

---

## Section 6: Pre-Launch Checklist

- [ ] LOOPS_API_KEY added as Supabase secret
- [ ] ATTIO_API_KEY added as Supabase secret
- [ ] LOOPS_PORTAL_TRANSACTIONAL_ID added after creating template
- [ ] All 8 Loops automations created and set to Active
- [ ] 2 transactional templates created (Portal Access, Session Recap)
- [ ] Test purchase_completed event fired to a test email
- [ ] Test booking_confirmed event fired
- [ ] Test new_booking_notification arrives at Uthman's email
- [ ] All 5 promo campaign emails reviewed by Don before scheduling
- [ ] Unsubscribe link works in every template
- [ ] Full end-to-end purchase flow tested on staging
- [ ] After Loops is live: cancel Resend subscription
