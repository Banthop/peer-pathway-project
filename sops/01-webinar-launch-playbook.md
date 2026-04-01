# Webinar Launch Playbook

**Owner:** Don (strategy) + Uthman (speaker sourcing + delivery)
**Timeline:** 4 weeks before event
**Last updated:** April 2026

---

## Week 4: Planning & Speaker Sourcing

### Don
- [ ] Define topic, angle, target audience
- [ ] Set ticket pricing (recording-only, bundle, premium tiers)
- [ ] Create speaker outreach tracker (Google Sheet - use Spring Week template)
- [ ] Review Uthman's shortlist - approve/reject candidates

### Uthman
- [ ] Source 15-20 speaker candidates on LinkedIn
- [ ] Log each one in the tracker with: name, LinkedIn, firm, conversion status
- [ ] Begin DM outreach using templates (Sheet 2 of tracker)
- [ ] Follow up on no-replies after 3-5 days

### Milestone: 3+ speakers confirmed, lock in the date

---

## Week 3: Setup & Build

### Don
- [ ] Clone webinar landing page (duplicate `Webinar.tsx`, update copy)
- [ ] Create Stripe products for each tier
- [ ] Create checkout edge function (or reuse `create-booking-checkout`)
- [ ] Set up Loops:
  - [ ] Create a contact list/segment for this webinar's registrants
  - [ ] Build registration confirmation flow
  - [ ] Build reminder sequence (3-day, day-of, 1-hour-before)
- [ ] Create event in Cal.com for speaker run-of-show

### Uthman
- [ ] Confirm speaker lineup (3-5 speakers)
- [ ] Create run-of-show doc in Notion:
  - Opening (2 min) - Don intro
  - Speaker 1 (10-15 min) - [topic]
  - Speaker 2 (10-15 min) - [topic]
  - ... etc
  - Live Q&A (20-30 min)
  - CTA / close (5 min)
- [ ] Do a tech rehearsal with all speakers (Zoom test)

### Both
- [ ] Test full flow: landing page, form, Stripe, confirmation email, Attio contact created

---

## Week 2: Promotion

### Content Calendar (daily)

| Day | Don | Uthman |
|-----|-----|--------|
| Mon | LinkedIn post: announce webinar | Instagram story: behind-the-scenes |
| Tue | Email blast #1 to CRM (all non-buyers) | LinkedIn post: speaker reveal |
| Wed | Engage with comments | DM warm leads |
| Thu | LinkedIn post: social proof / testimonial | Email blast #2 (buyers - different angle) |
| Fri | Email blast #3 (form leads who didn't buy) | Instagram reel: "what you'll learn" |
| Sat | LinkedIn post: countdown | - |
| Sun | Email blast #4 (final push, urgency) | - |

### Speaker Amplification
- [ ] Send speakers a pre-written LinkedIn post to share
- [ ] Send speakers a pre-written IG story graphic
- [ ] Get speakers to tag @EarlyEdge

---

## Week 1: Final Push

- [ ] Send urgency email: "Last X spots"
- [ ] Send discount email to hot leads (Attio segment: clicked but didn't buy)
- [ ] Final speaker confirmation + share run-of-show
- [ ] Tech rehearsal #2 (day before)
- [ ] Prepare post-webinar sequence:
  - [ ] Recording delivery email (immediate after processing)
  - [ ] Guide/resource upsell (Day 1)
  - [ ] Coaching upsell (Day 3)
  - [ ] Testimonial request (Day 7)

---

## Webinar Day

### 2 hours before
- [ ] Test Zoom/StreamYard link
- [ ] Post "going live in 2 hours" on LinkedIn + IG stories
- [ ] Loops: send 1-hour reminder email

### During
- [ ] Don moderates, Uthman presents
- [ ] Record everything
- [ ] Monitor chat for questions
- [ ] Drop CTA links in chat at relevant moments

### After (within 2 hours)
- [ ] Upload recording to portal
- [ ] Send "recording is live" email via Loops flow
- [ ] Post highlight clips on social
- [ ] Update Attio: tag all attendees as `webinar_attended`

---

## Post-Webinar (Week 0)

### Day 1
- [ ] Email: recording delivery + "here's what you missed"
- [ ] Guide upsell to recording-only buyers
- [ ] Share key moments on social

### Day 3
- [ ] Coaching upsell email with social proof
- [ ] Replay offer to non-buyers (48h limited)

### Day 7
- [ ] Testimonial request to all attendees
- [ ] Debrief meeting (Notion): what worked, what didn't, revenue recap

### Day 14
- [ ] Close replay offer
- [ ] Archive webinar content
- [ ] Start planning next one

---

## Metrics to Track (Attio Dashboard)

| Metric | Target |
|--------|--------|
| Registrations | 100+ |
| Show-up rate | 40%+ |
| Recording purchases | 50+ |
| Revenue | £1,500+ |
| Coaching upsells | 5+ |
| Email open rate | 45%+ |
| NPS / satisfaction | 8+/10 |
