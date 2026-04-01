# Loops Email Sequences - Production-Ready Copy

**Owner:** Don (approval) + Dylan (implementation in Loops)
**Last updated:** April 2026
**Status:** Ready to paste into Loops once DNS is verified

---

## How This Document Works

Each flow below maps to a Loops event fired by a Supabase edge function. Every email has ONE job: move the reader from awareness level N to N+1 using Eugene Schwartz's Breakthrough Advertising framework.

**Awareness levels:**
1. **Unaware** - doesn't know they have a problem
2. **Problem Aware** - knows the problem, not the solution
3. **Solution Aware** - knows solutions exist, doesn't know yours
4. **Product Aware** - knows your product, hasn't decided
5. **Most Aware** - knows and trusts you, needs a reason to act

**Personalization variables available from edge functions:**
- `{{firstName}}` - student's first name (fallback: "there")
- `{{productType}}` - what they bought (e.g. "bundle", "recording_bundle", "recording_premium")
- `{{spend}}` - amount paid in GBP
- `{{isBundle}}` - "true" or "false"
- `{{portalLink}}` - portal URL
- `{{bookUthmanLink}}` - coaching booking URL
- `{{sessionName}}` - coaching session name
- `{{dateStr}}` - session date
- `{{time}}` - session time
- `{{duration}}` - session duration
- `{{price}}` - session price
- `{{studentName}}` - student's name
- `{{studentEmail}}` - student's email

---

## Flow 1: Purchase Completed (Buyer Welcome Sequence)

**Trigger:** `purchase_completed` event
**Fired by:** `stripe-webhook/index.ts` on `checkout.session.completed`
**Event properties available:** `spend`, `productType`, `isBundle`
**Audience:** Student who just bought a webinar product

---

### Email 1 - Welcome + Delivery (Immediate)

**Awareness move:** Most Aware --> reinforce decision
**Job:** Eliminate buyer's remorse. Deliver what they paid for. Make them feel smart.

**Subject line:** you're in
**Preview text:** Here's everything you just unlocked.

---

Hey {{firstName}},

Welcome to EarlyEdge. You just made a decision most students don't - investing in yourself before you need to.

Here's what you've got access to:

**Your purchase: {{productType}}**

Portal access: {{portalLink}}

Log in and you'll find your webinar recording ready to watch. If you grabbed the bundle, your guide is in there too - download it, save it, refer back to it.

A couple of quick things:

- **Watch the recording with a notebook open.** The panellists drop specific names, timelines, and tactics that you won't remember unless you write them down.
- **Check the guide** (bundle/premium buyers). It's not a summary of the webinar - it's a standalone playbook with templates and frameworks you can use immediately.
- **Bookmark your portal.** New content gets added regularly.

If anything looks off or you can't get in, just reply to this email. I check these personally.

Talk soon,
Don & Dylan

P.S. If you grabbed Premium - keep an eye out for a separate email about booking your 1-on-1 coaching session. That's where the real magic happens.

---

**CTA button text:** Access Your Portal
**CTA link:** `{{portalLink}}`
**Personalization notes:** Use `{{productType}}` to conditionally show/hide the guide and coaching references. If `isBundle` is false, omit the guide line. If `productType` is not `recording_premium`, omit the P.S.

---

### Email 2 - How to Get the Most From This (Day 1)

**Awareness move:** Most Aware --> deepen value
**Job:** Increase consumption. Students who watch = students who get results = students who buy more.

**Subject line:** watch it like this (not like a Netflix show)
**Preview text:** 4 things to do while you watch the recording.

---

Hey {{firstName}},

Most people who buy a webinar recording never actually watch it.

Don't be most people.

Here's how to squeeze every drop of value from what you've got:

**1. Watch with intent, not as background noise**
Set aside the full time. Close your tabs. Treat it like a masterclass, not a podcast.

**2. Pause and write down every specific name, firm, or tactic**
When a panellist says "I used this exact subject line" or "I reached out to this person at Goldman" - pause. Write it down. That's the stuff you can't Google.

**3. Build your action list as you go**
By the end, you should have a list of 5-10 concrete things to do this week. Not "network more." Things like "send 3 cold emails using the template from minute 34."

**4. Revisit the bits that apply to your situation**
You don't need to rewatch the whole thing. But the section about your target firm or your specific situation? Watch that twice.

The recording is in your portal: {{portalLink}}

If you've already watched it - nice. Hit reply and tell me your biggest takeaway. I read every one.

Don & Dylan

---

**CTA button text:** Watch the Recording
**CTA link:** `{{portalLink}}`
**Personalization notes:** No conditional logic needed. This email is universal to all buyers.

---

### Email 3 - Coaching Upsell (Day 3)

**Awareness move:** Most Aware --> upsell (lateral awareness expansion)
**Job:** Plant the seed that the recording is the playbook, but coaching is the execution partner. Social proof does the heavy lifting.

**Subject line:** the recording gives you the playbook. this gives you a coach.
**Preview text:** What happened when 3 students booked a session after the webinar.

---

Hey {{firstName}},

Quick question - have you started acting on what you learned from the webinar?

If yes, brilliant. Keep going.

If not (or if you started but got stuck), that's exactly why we built coaching into EarlyEdge.

Here's the difference:

**The recording** tells you what the best students did.
**A coaching session** helps you do it for YOUR situation - your uni, your target firms, your specific gaps.

Three things that tend to happen in a session with Uthman:

- You walk in with a vague plan. You walk out with a week-by-week roadmap.
- You bring a draft cold email. You leave with one that's actually good.
- You think you know your weak spots. Uthman shows you the ones you've missed.

We're not pretending a 30-minute call will guarantee you an offer. But students who've booked sessions after the webinar consistently tell us it was the thing that turned "I know what to do" into "I've actually done it."

Two options:

- **Strategy Call (30 min, £35)** - best if you have a specific question or want your materials reviewed
- **Deep Dive (60 min, £59)** - best if you want a full roadmap built around your situation

Book here: {{bookUthmanLink}}

No pressure. The recording alone is worth what you paid. But if you want someone in your corner - this is it.

Don & Dylan

---

**CTA button text:** Book a Coaching Session
**CTA link:** `{{bookUthmanLink}}`
**Personalization notes:** If `productType` is `recording_premium`, skip this email entirely - they already have a coaching session included.

---

### Email 4 - Testimonial Request (Day 7)

**Awareness move:** Most Aware --> advocate
**Job:** Get a reply. Make it absurdly easy. No forms, no links, no friction.

**Subject line:** quick favour (30 seconds)
**Preview text:** Would genuinely mean a lot.

---

Hey {{firstName}},

It's been about a week since you got access. I hope you've had a chance to dig in.

I've got a quick favour to ask - would you mind sharing a short review of your experience? Literally 2-3 sentences is perfect.

Something like:
- What made you buy it?
- What was the most useful thing you took away?
- Would you recommend it to a friend?

You don't need to fill out a form or click a link. Just **reply to this email** with a few lines and I'll take it from there.

These reviews are genuinely the thing that helps other students decide if this is worth it. And since we're a small team (there are three of us), every one matters.

Thanks in advance,
Don & Dylan

P.S. If you had any issues with the portal, the recording, or anything else - I'd rather hear that too. Reply either way.

---

**CTA button text:** (none - reply-to email is the CTA)
**Personalization notes:** No conditional logic needed.

---

## Flow 2: Portal Access Granted

**Trigger:** `portal_access_granted` event
**Fired by:** `send-portal-access/index.ts` (broadcast to converted contacts)
**Event properties available:** `firstName`, `isBundle`
**Audience:** Buyer who's being granted portal access (may be triggered separately from purchase)

---

### Email 1 - Portal Credentials + Quick Start (Immediate)

**Awareness move:** Most Aware --> activate
**Job:** Get them logged in and exploring within 60 seconds of opening this email.

**Subject line:** your portal is live - here's how to get in
**Preview text:** Login link + what to do first.

---

Hey {{firstName}},

Your EarlyEdge portal is ready. Here's everything you need:

**Your portal:** {{portalLink}}

Log in with the email you used to purchase. If it's your first time, you'll be prompted to set a password.

**What's inside:**

- Your webinar recording (watch anytime, rewatch as many times as you want)
- Resource library (templates, examples, and frameworks from the sessions)
{% if isBundle == "true" %}
- **Your guide** - download it from the Resources section. This is the standalone playbook with everything the panellists shared, plus extra templates they didn't have time to cover live.
{% endif %}
- Book a coaching session with Uthman ({{bookUthmanLink}})

**What to do first:**

1. Log in and make sure everything loads
2. Watch the recording (or rewatch if you caught it live)
3. Download any templates that apply to your situation
{% if isBundle == "true" %}
4. Download your guide and read the section about your target industry first
{% endif %}

If anything doesn't work - wrong email, can't log in, recording won't play - reply to this email and I'll sort it within 24 hours.

Don & Dylan

---

**CTA button text:** Open Your Portal
**CTA link:** `{{portalLink}}`
**Personalization notes:** Use `{{isBundle}}` to conditionally show/hide guide references. Loops supports conditional blocks - wrap guide-related lines in `{% if isBundle == "true" %}` blocks.

---

## Flow 3: Booking Confirmed (to Student)

**Trigger:** `booking_confirmed` event
**Fired by:** `send-booking-confirmation/index.ts`
**Event properties available:** `studentName`, `studentEmail`, `sessionName`, `sessionId`, `duration`, `dateStr`, `time`, `price`
**Audience:** Student who just booked a coaching session with Uthman

---

### Email 1 - Session Confirmed (Immediate)

**Awareness move:** Most Aware --> lock in commitment
**Job:** Confirm the details. Reduce anxiety. Set expectations so they show up prepared.

**Subject line:** you're booked - {{sessionName}} on {{dateStr}}
**Preview text:** Here's what to expect + how to prepare.

---

Hey {{studentName}},

Your coaching session is confirmed. Here are the details:

---

**Session:** {{sessionName}}
**Date:** {{dateStr}}
**Time:** {{time}}
**Duration:** {{duration}}
**Paid:** {{price}}

---

You'll receive a Zoom link from Uthman within 24 hours of your session. If you don't see it, check your spam or reply to this email.

**How to make the most of your time:**

Before the session, have a think about:

1. **Your target firms** - which ones, and why?
2. **Where you're stuck** - applications? Cold emails? Interview prep? Networking?
3. **What you've tried so far** - what's worked, what hasn't?
4. **Specific questions** - write them down. Sessions go fast and you don't want to forget the thing you really wanted to ask.

If you have any draft cold emails, CVs, or cover letters you want reviewed, send them to uthman6696@gmail.com before the session. Uthman can give much better feedback if he's seen them in advance.

This session is about YOU. There's no agenda we force on you - Uthman will work through whatever's most useful for your situation.

See you soon,
Don & Uthman

---

**CTA button text:** (none - this is a confirmation, not a conversion email)
**Personalization notes:** All variables come directly from the `booking_confirmed` event properties.

---

### Email 2 - Reminder + Prep Tips (24 Hours Before)

**Awareness move:** Most Aware --> ensure show-up
**Job:** Remind them, get them excited, reduce no-shows.

**Note for Loops setup:** This requires a scheduled send relative to `{{dateStr}}` and `{{time}}`. In Loops, set the delay to trigger 24 hours before the session time. If Loops doesn't support negative-offset scheduling from a dynamic date, send this as a transactional email triggered manually by Uthman the day before.

**Subject line:** tomorrow: your session with Uthman
**Preview text:** Quick prep checklist so you get the most out of it.

---

Hey {{studentName}},

Just a heads up - your {{sessionName}} with Uthman is tomorrow.

**{{dateStr}} at {{time}}** | {{duration}}

Quick checklist before you jump on:

- [ ] Got your questions written down?
- [ ] Sent any draft emails/CVs to uthman6696@gmail.com for review?
- [ ] Got a quiet spot with decent WiFi?
- [ ] Got something to take notes with?

If you need to reschedule, email uthman6696@gmail.com at least 24 hours before. No stress - life happens.

Otherwise, Uthman will send the Zoom link shortly. See you there.

Don & Uthman

---

**CTA button text:** (none)
**Personalization notes:** Requires `{{dateStr}}`, `{{time}}`, `{{sessionName}}`, `{{duration}}` from the original booking event.

---

### Email 3 - Follow-Up + Action Items (Day 1 After Session)

**Awareness move:** Most Aware --> drive action
**Job:** Reinforce what they learned. Give them a framework to act on it. Open the door to repeat booking.

**Note for Loops setup:** This is a template. Uthman fills in the personalised summary before sending. Set up as a transactional email template in Loops that Uthman triggers manually (or via a simple internal tool) after each session.

**Subject line:** your session recap + action items
**Preview text:** Everything we covered, plus what to do this week.

---

Hey {{studentName}},

Great session yesterday. Here's a recap of what we covered and your action items.

---

**Session summary:**

[Uthman fills this in - 3-5 bullet points covering what was discussed]

**Your action items for this week:**

1. [Action item 1]
2. [Action item 2]
3. [Action item 3]
4. [Action item 4]

**Resources mentioned:**

- [Link or attachment 1]
- [Link or attachment 2]

---

If you get stuck on any of these, reply to this email. Happy to jump on a quick follow-up.

And if you want to go deeper on anything we didn't have time to cover - you can always book another session: {{bookUthmanLink}}

Keep pushing,
Uthman

---

**CTA button text:** Book Another Session
**CTA link:** `{{bookUthmanLink}}`
**Personalization notes:** This is a manually-triggered transactional email. Uthman fills in the bracketed sections before sending. The template should have editable text fields in Loops for the summary, action items, and resources.

---

### Email 4 - Testimonial Request (Day 7 After Session)

**Awareness move:** Most Aware --> advocate
**Job:** Get a coaching testimonial. Same format as Flow 1 Email 4 - reply-based, zero friction.

**Subject line:** how's it going since our session?
**Preview text:** Quick check-in + a small favour.

---

Hey {{studentName}},

It's been about a week since your coaching session. How are you getting on?

I'd love to hear:
- Have you worked through the action items?
- Has anything clicked since we spoke?
- Any results yet (even small ones)?

And if you've got 30 seconds - would you mind sharing a quick review of the session? Just reply to this email with 2-3 sentences about what it was like.

Something like:
- Was it useful?
- What was the best part?
- Would you recommend it?

No forms, no links. Just hit reply.

These reviews help other students figure out if coaching is right for them. And honestly, hearing what worked (or didn't) helps me get better at this too.

Thanks,
Uthman

P.S. If you want to book a follow-up session, the link's here: {{bookUthmanLink}}

---

**CTA button text:** (none - reply is the CTA)
**Personalization notes:** Requires `{{studentName}}` and `{{bookUthmanLink}}`.

---

## Flow 4: New Booking Notification (to Uthman)

**Trigger:** `new_booking_notification` event
**Fired by:** `send-booking-confirmation/index.ts`
**Event properties available:** `studentName`, `studentEmail`, `sessionName`, `sessionId`, `duration`, `dateStr`, `time`, `price`
**Audience:** Uthman only (uthman6696@gmail.com)

---

### Email 1 - Internal Booking Alert (Immediate)

**Awareness move:** N/A (internal notification)
**Job:** Give Uthman all the info he needs at a glance. Nothing more.

**Subject line:** New booking: {{studentName}} - {{sessionName}} on {{dateStr}}
**Preview text:** {{duration}} session at {{time}}

---

**New coaching session booked.**

**Student:** {{studentName}}
**Email:** {{studentEmail}}
**Session:** {{sessionName}}
**Date:** {{dateStr}}
**Time:** {{time}}
**Duration:** {{duration}}
**Paid:** {{price}}

---

**Your checklist:**
1. Send Zoom link to {{studentEmail}} (within 24h)
2. Check if they sent any materials for review
3. Send reminder email day before (or confirm the automated one fired)
4. Prep any relevant templates/resources for their situation

---

**CTA button text:** (none)
**Personalization notes:** All variables from the `new_booking_notification` event. This email should be plain and functional - no marketing tone.

---

## Flow 5: Spring Week Webinar Promo Sequence (Existing Leads)

**Trigger:** Manual send / scheduled broadcast in Loops
**Audience:** ~900 contacts in Attio (mix of previous buyers and leads)
**Context:** Promoting the upcoming Spring Week Conversion Webinar - a 2-part panel where students who actually converted their spring weeks share how they did it
**Timing:** Send over 8 days, starting ~2 weeks before the webinar date

---

### Email 1 - The Tease (Day 0)

**Awareness move:** Unaware --> Problem Aware
**Job:** Make them realise that getting a spring week is only half the battle. The conversion problem exists and most students don't think about it until it's too late.

**Subject line:** getting a spring week is the easy part
**Preview text:** What nobody tells you about the 6 weeks after you accept.

---

Hey {{firstName}},

Most students spend months trying to land a spring week.

Applications. Online tests. Video interviews. Assessment centres. It's brutal, and when you finally get the offer, it feels like the hard part is over.

It's not.

Here's what nobody talks about: the vast majority of spring week participants don't get a return offer. They do the programme, shake some hands, attend some networking drinks, and then... nothing.

Meanwhile, a small group of students walk out of the exact same programme with a summer internship offer locked in. Same firm, same week, same opportunities. Completely different outcome.

The difference isn't luck. It's not grades. It's not connections.

It's what you do during those 1-2 weeks - and most students have no idea what that looks like.

We're working on something to fix that. More soon.

Don & Dylan
EarlyEdge

P.S. If you've already got a spring week offer (or you're waiting to hear back), pay attention to your inbox this week.

---

**CTA button text:** (none - this is a pure awareness email, no ask)
**Personalization notes:** `{{firstName}}` only. This email goes to the full list.

---

### Email 2 - Educational Value (Day 2)

**Awareness move:** Problem Aware --> Solution Aware
**Job:** Teach them something genuinely useful. Build trust. Show that conversion is a learnable skill with specific, actionable components - not just "be yourself and network."

**Subject line:** 3 things that separate students who convert spring weeks
**Preview text:** Based on conversations with 15+ students who got return offers.

---

Hey {{firstName}},

I've spent the last few weeks talking to students who actually converted their spring weeks into summer internships - at Goldman, JPMorgan, Citi, Barclays, Morgan Stanley, and others.

Some patterns kept coming up. Here are three:

**1. They treated the spring week like a 5-day interview - because it is.**

Every person you speak to during the programme is evaluating you. Not formally (usually), but they're forming opinions. The students who converted understood this from day one. They were intentional about every conversation, every question they asked, every social event they attended.

**2. They followed up properly - and most people didn't.**

After the spring week ended, most students sent a generic "thanks for having me" email (or nothing at all). The ones who converted sent specific, personalised follow-ups to the people they'd connected with. Not immediately - but within a week. And the content of those emails was genuinely thoughtful, not a template.

**3. They had a plan before they arrived.**

They knew which teams they wanted to sit with. They'd researched the people they'd be meeting. They had questions prepared that showed they understood the firm's actual work, not just "what does a typical day look like?"

These aren't secrets. But almost nobody does them - which is exactly why they work.

More on this soon.

Don & Dylan

---

**CTA button text:** (none - pure value, no sell)
**Personalization notes:** `{{firstName}}` only.

---

### Email 3 - Webinar Reveal (Day 4)

**Awareness move:** Solution Aware --> Product Aware
**Job:** Reveal the webinar. Make the format feel unique and credible. The CTA is to register - not to buy. Lower the barrier.

**Subject line:** we're putting 8 students who converted their spring weeks on a panel
**Preview text:** 2-part live webinar. Here's who's speaking.

---

Hey {{firstName}},

Remember those patterns I mentioned - the things that separate students who convert spring weeks from those who don't?

We decided to go straight to the source.

**Introducing: The Spring Week Conversion Webinar**

A 2-part live panel featuring students who completed spring weeks at top firms and walked away with return offers or summer internship offers.

**The format:**

- **Part 1:** [Date TBC] - Speakers from [Firm A], [Firm B], [Firm C], [Firm D]
- **Part 2:** [Date TBC] - Speakers from [Firm E], [Firm F], [Firm G], [Firm H]

Each part is a moderated panel discussion. No slides. No fluff. Just real students answering real questions about exactly what they did during their spring weeks - the conversations, the follow-ups, the mistakes, and the specific things that got them the offer.

**Why two parts?**

Different firms run spring weeks differently. We've split the speakers across two sessions so each one goes deep rather than rushing. Both parts stand alone - but together, you get the full picture across banking, consulting, markets, and more.

**What you'll walk away with:**
- Exactly what "good" looks like during a spring week (from people who've done it)
- The follow-up strategies that actually led to offers
- What NOT to do (the mistakes that quietly kill your chances)
- A chance to ask the panellists anything, live

**Tickets:**
- Part 1 only - £[X]
- Part 2 only - £[X]
- Bundle (both parts + The Spring Week Playbook guide) - £[X]
- Premium (bundle + 1-on-1 coaching session) - £[X]

[REGISTER HERE]

Spots are limited because we want the Q&A to actually be useful. If you've got a spring week coming up (or you're applying now), this is the most efficient way to prepare for it.

Don & Dylan
EarlyEdge

---

**CTA button text:** Register Now
**CTA link:** [landing page URL - to be set]
**Personalization notes:** `{{firstName}}`. The firm names and dates in Part 1/Part 2 should be updated with actual confirmed speakers before sending. Use Loops variables or hardcode them once confirmed.

---

### Email 4 - Social Proof (Day 6)

**Awareness move:** Product Aware --> Most Aware
**Job:** Prove this works. Reference the cold email webinar results. Let the numbers and student quotes do the talking.

**Subject line:** 100+ students attended our last webinar. here's what happened after.
**Preview text:** Real results from real students.

---

Hey {{firstName}},

When we ran our first webinar - the Cold Email Masterclass - we didn't know if anyone would show up.

107 students did.

Here's what happened in the weeks after:

- Students started landing responses from firms they'd been ghosted by for months
- Multiple students reported getting interviews directly from cold emails they wrote using the session's frameworks
- Our coaching sessions filled up - students wanted help executing what they'd learned
- We generated over £3,000 in revenue from a single webinar cycle

But the number I care about most isn't revenue. It's this:

**Students who attended the webinar and then took action got results that students who didn't attend simply didn't get.**

Not because the webinar was magic. Because hearing from people who've actually done the thing - and being able to ask them questions in real time - compresses months of guesswork into 90 minutes.

That's exactly what we're doing again with the Spring Week Conversion Webinar. Different topic, same format, same quality of speakers.

If you got value from the cold email session, you'll want to be at this one.

If you missed the cold email session, this is your chance to not miss it again.

[REGISTER HERE]

Don & Dylan

P.S. "You learned to get in the door. Now learn to stay in the room." That's genuinely what this webinar is about.

---

**CTA button text:** Save Your Spot
**CTA link:** [landing page URL]
**Personalization notes:** `{{firstName}}` only. If you have specific student testimonial quotes, drop 1-2 in here with first names and universities.

---

### Email 5 - Urgency / Final Push (Day 8)

**Awareness move:** Product Aware --> Most Aware (final conversion)
**Job:** Create urgency. Stack the value. Give them a reason to act today, not tomorrow. This is the last email - make it count.

**Subject line:** registration closes in 48 hours
**Preview text:** Last chance to join the Spring Week Conversion Webinar.

---

Hey {{firstName}},

Final email about this - registration for the Spring Week Conversion Webinar closes in 48 hours.

Quick recap of what's on the table:

**The webinar (2 parts):**
- Live panel with students who actually converted spring weeks at Goldman, JPMorgan, Citi, Barclays, Morgan Stanley, Optiver, and more
- Real strategies, real stories, real Q&A
- Part 1: [Date] | Part 2: [Date]

**The Spring Week Playbook (bundle add-on):**
- Written by spring week alumni across 15+ firms
- Insider breakdowns of what each programme involves
- Conversion strategies, common mistakes, follow-up templates
- This isn't a summary of the webinar - it's a standalone guide

**1-on-1 coaching (premium add-on):**
- Personal session with a coach who's been through the process
- Build a custom plan for YOUR spring week at YOUR target firm
- Review your follow-up emails, networking approach, and preparation

**Your options:**
- Part 1 only - £[X]
- Part 2 only - £[X]
- Bundle (both parts + Playbook) - £[X] (best value)
- Premium (bundle + 1-on-1) - £[X]

[REGISTER NOW]

Spring week applications are opening now. The programmes themselves start in weeks. The students who convert don't wing it - they prepare.

This is the preparation.

Don & Dylan
EarlyEdge

P.S. After registration closes, the next time we run this webinar will be after spring weeks have already started. If you're doing a spring week this cycle, this is the window.

---

**CTA button text:** Register Before It Closes
**CTA link:** [landing page URL]
**Personalization notes:** `{{firstName}}` only. Update firm names and dates with actuals before sending. If Loops supports countdown timers, add one showing time until registration closes.

---

## Implementation Notes for Dylan

### Setting up in Loops

1. **Flow 1 (Purchase Completed):** Create as an automated Loop triggered by the `purchase_completed` event. Set delays between emails at Day 0, Day 1, Day 3, Day 7. Add a condition on Email 3: skip if `productType` = `recording_premium`.

2. **Flow 2 (Portal Access):** Create as an automated Loop triggered by the `portal_access_granted` event. Single email, no delays. Use Loops conditional blocks for `isBundle` content.

3. **Flow 3 (Booking Confirmed):** Email 1 is automated, triggered by `booking_confirmed` event. Email 2 (24h reminder) depends on Loops' ability to schedule relative to a dynamic date - if not supported, Uthman sends manually. Email 3 is a transactional template that Uthman triggers manually after each session. Email 4 is automated, 7 days after the `booking_confirmed` event.

4. **Flow 4 (Uthman Notification):** Create as an automated Loop triggered by `new_booking_notification` event. Single email to uthman6696@gmail.com only.

5. **Flow 5 (Spring Week Promo):** This is a manual broadcast sequence, NOT event-triggered. Schedule sends for Day 0, Day 2, Day 4, Day 6, Day 8 relative to when you start the campaign. Audience = full Attio contact list synced to Loops.

### Loops Contact Properties to Create

Ensure these properties exist in Loops (synced from Attio or set by events):

- `firstName` (string)
- `productType` (string)
- `isBundle` (boolean/string)
- `totalSpent` (number)
- `source` (string)

### Pre-Send Checklist

- [ ] DNS verified for sending domain (blocked on Dylan + GoDaddy 2FA)
- [ ] LOOPS_API_KEY set as Supabase Edge Function secret
- [ ] ATTIO_API_KEY set as Supabase Edge Function secret
- [ ] Test purchase flow end-to-end on staging
- [ ] Send test emails to Don + Dylan before going live
- [ ] Verify unsubscribe link works in every email
- [ ] Check that Loops suppresses contacts who have unsubscribed from previous sends

### HTML Template Style (match existing emails exactly)

Our emails use a simple, clean design. No fancy templates. Here's the spec:

- **Max width:** 480px, centered
- **Font:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif` (system fonts)
- **Text color:** `#222222`
- **Text size:** 15px, line-height 27px
- **Paragraph spacing:** 20px bottom padding
- **CTA buttons:** Black (`#111111`), white text, 8px border-radius, 13px 28px padding, 14px font-size, font-weight 600
- **Background:** White (`#ffffff`), no background images or patterns
- **Logo footer:** `<span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span>` in 13px, color `#999999`
- **Bullet points:** Use `&#8226;` entities with 20px left padding, not `<ul>` tags
- **Links:** `#0066cc`, no underline in body text
- **No images in the body** - text only, logo wordmark in footer
- **Signoff pattern:** Name on one line (15px, `#222222`), then EarlyEdge wordmark below (13px, `#999999`)

This matches the exact style in `supabase/functions/auto-emailer/index.ts`. When building templates in Loops, replicate this - don't use Loops' fancy template builder. Keep it minimal.

### Tone Guide for Future Emails

- Write like you're texting a mate who asked for advice, not like a brand
- Lowercase subject lines, always
- Short paragraphs. One idea per paragraph.
- Bold the important bits so skimmers still get the point
- Never use "Dear" or "Kind regards"
- Sign off as "Don & Dylan" for brand emails, "Uthman" for coaching emails, "Don & Uthman" for coaching confirmation
- If in doubt, read it out loud. If it sounds like a marketing email, rewrite it.
- Never use words like "exclusive," "limited-time offer," "act now," or "don't miss out" - they trigger spam filters AND they sound like every other student newsletter
- Urgency should come from real deadlines (spring weeks are opening, registration is closing), not manufactured scarcity
- Never use em dashes. Use regular dashes or rewrite the sentence.
