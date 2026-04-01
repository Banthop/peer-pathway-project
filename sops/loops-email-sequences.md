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

---

## Flow 6: Spring Week Purchase Completed

**Trigger:** `spring_week_purchase_completed` event
**Fired by:** `stripe-webhook/index.ts` on `checkout.session.completed` (spring week products)
**Event properties available:** `firstName`, `productType` (one of: `part1`, `part2`, `bundle`, `premium`), `spend`, `portalLink`, `bookUthmanLink`, `webinarPart` (derived: `1`, `2`, `both`), `hasBothParts` (`true`/`false`), `hasPlaybook` (`true`/`false`), `hasCoaching` (`true`/`false`)
**Audience:** Student who just bought a spring week webinar product

**Tier logic summary:**
- `part1` - Part 1 live session + recording. No playbook. No coaching.
- `part2` - Part 2 live session + recording. No playbook. No coaching.
- `bundle` - Both parts + recordings + The Spring Week Playbook. No coaching.
- `premium` - Everything in bundle + 1-on-1 coaching session with a panellist.

---

### Email 1 - Welcome + What You've Got (Immediate)

**Awareness move:** Most Aware - reinforce decision, eliminate buyer's remorse
**Job:** Tell them exactly what they bought. Get them excited about what's coming. For single-part buyers, plant the seed for the other part. For bundle buyers, set expectation around the Playbook. For premium buyers, direct them toward scheduling coaching.

**Subject line:** you're in - here's what's coming
**Preview text:** Everything you just unlocked for the Spring Week Conversion Webinar.

---

Hey {{firstName}},

You're registered. Here's what you've got:

{% if productType == "part1" %}
**Your ticket: Part 1 of the Spring Week Conversion Webinar**

You've got access to the live Part 1 panel session, Q&A with the speakers, and the recording afterward. Speakers confirmed so far have experience at Jefferies, Nomura, Bank of America, and Citi (with a return offer).

You'll get the Zoom link by email before the session. Your recording lands in your portal within 24 hours after the event.

One thing worth knowing: Part 2 covers a different set of firms, including Barclays, Optiver, Millennium, Citadel, and Morgan Stanley. If any of those are on your target list, it's worth grabbing Part 2 as well. The bundle (both parts + The Spring Week Playbook) is £29.
{% endif %}

{% if productType == "part2" %}
**Your ticket: Part 2 of the Spring Week Conversion Webinar**

You've got access to the live Part 2 panel session, Q&A with the speakers, and the recording afterward. Speakers confirmed so far have experience at Barclays, Optiver, Millennium, Citadel, and Morgan Stanley.

You'll get the Zoom link by email before the session. Your recording lands in your portal within 24 hours after the event.

One thing worth knowing: Part 1 covers a different set of firms, including Jefferies, Nomura, Bank of America, and Citi (with a return offer). If any of those are on your target list, it's worth grabbing Part 1 as well. The bundle (both parts + The Spring Week Playbook) is £29.
{% endif %}

{% if productType == "bundle" %}
**Your ticket: The Bundle (Part 1 + Part 2 + The Spring Week Playbook)**

You've got access to both live panel sessions, Q&A with all speakers, both recordings, and The Spring Week Playbook - an insider guide written by spring week alumni across 10+ firms.

The Playbook isn't ready yet (we're collecting the final write-ups from panellists now). You'll get it in your portal before the webinar date. When it drops, read the section on your target firm first.

Zoom links for both sessions will be sent closer to the dates.
{% endif %}

{% if productType == "premium" %}
**Your ticket: Premium (Bundle + 1-on-1 Coaching)**

You've got everything in the bundle, plus a personal coaching session with one of our panellists. This is where you take what you learn in the webinar and apply it to your specific situation, your target firm, your spring week timeline.

Scheduling your coaching session: you'll get a separate email with a booking link. The session happens after the webinar so you can bring specific questions from the panel. Don't book it before watching at least Part 1.
{% endif %}

Your portal: {{portalLink}}

If anything looks off or you've got a question before the webinar, just reply here.

Don & Dylan
EarlyEdge

---

**CTA button text:** Open Your Portal
**CTA link:** `{{portalLink}}`
**Personalization notes:** Use `{{productType}}` to show/hide the relevant conditional block. Each tier gets its own message. The single-part buyer blocks include a soft cross-sell to the bundle. The coaching scheduling note is premium-only.

---

### Email 2 - How to Prepare (Day 2)

**Awareness move:** Most Aware - deepen value pre-event
**Job:** Give them something useful to do before the webinar. Students who prepare get more from the Q&A, which means better results, which means testimonials. The prep tasks are tailored to what they bought.

**Subject line:** how to prepare before the webinar
**Preview text:** Do these 3 things and you'll get twice as much out of it.

---

Hey {{firstName}},

The webinar is coming up and there's a bit of prep worth doing beforehand.

This isn't compulsory. But the students who walk out with the most value are always the ones who arrived with some context - not just showing up cold and hoping to absorb things.

Here's what to do:

**1. Research your target firms**

Look at the specific spring week programmes you're targeting. What do they call the conversion process? Is it a direct return offer, or do summer internship applications open separately? Is there an interview at the end of the programme? Knowing this before the webinar means you can ask sharper questions.

**2. Prepare 3 questions for the Q&A**

Write them down now, before the session. Good questions are specific: "What did you say in your end-of-week follow-up email to your line manager at Citi?" not "How do you network during a spring week?"

The panellists will answer generic questions generically. Specific questions get specific answers.

**3. Review your own timeline**

When is your spring week? Have you already started it, or are you preparing to? Your answers to these questions should shape which parts of the webinar you pay most attention to.

{% if productType == "bundle" or productType == "premium" %}
One more thing: The Spring Week Playbook will be in your portal before the webinar. Skim the section on your target firm before Part 1. You don't need to read the whole thing, just get familiar with the format so you know what to look up after.
{% endif %}

{% if productType == "premium" %}
And for your coaching session: start thinking now about the 2-3 things you most want help with. The more specific you are going in, the more useful the session will be.
{% endif %}

Your portal: {{portalLink}}

Don & Dylan

---

**CTA button text:** Open Your Portal
**CTA link:** `{{portalLink}}`
**Personalization notes:** The Playbook reminder is conditional on `productType` being `bundle` or `premium`. The coaching prep note is premium-only. The core prep content applies to all tiers.

---

### Email 3 - Speaker Tease / Firm Reveal (Day 5)

**Awareness move:** Most Aware - build anticipation, cross-sell
**Job:** Create excitement around confirmed speakers. Remind them what's coming. For single-part buyers, flag the other part if it covers their target firms.

**Subject line:** confirmed: who's speaking at part {{webinarPart}}
**Preview text:** We just locked in the speaker from [Firm]. Here's who's on the panel.

---

Hey {{firstName}},

We just confirmed the full speaker lineup and wanted to share it before the webinar.

{% if productType == "part1" or productType == "bundle" or productType == "premium" %}
**Part 1 panel:**

Speakers with experience converting spring weeks at: Jefferies, Nomura, Bank of America, and Citi (confirmed return offer).

One of our Part 1 speakers received a return offer at Citi after their spring week. We've asked them to walk through, step by step, what the final week looked like - the conversations they had, the follow-up they sent, and what they think made the difference.
{% endif %}

{% if productType == "part2" or productType == "bundle" or productType == "premium" %}
**Part 2 panel:**

Speakers with experience converting spring weeks at: Barclays, Optiver, Millennium, Citadel, and Morgan Stanley.

This panel is deliberately spread across investment banking, trading/quant, and asset management - because the conversion dynamic is different in each. You'll hear from someone at a systematic trading firm (Optiver) and someone at a multi-manager hedge fund (Millennium) on the same panel.
{% endif %}

{% if productType == "part1" %}
A reminder: Part 2 covers Barclays, Optiver, Millennium, Citadel, and Morgan Stanley. If any of those firms are on your list, you can still upgrade to the bundle (both parts + The Spring Week Playbook) for £29. Reply to this email and I'll sort it.
{% endif %}

{% if productType == "part2" %}
A reminder: Part 1 covers Jefferies, Nomura, Bank of America, and Citi. If any of those firms are on your list, you can still upgrade to the bundle (both parts + The Spring Week Playbook) for £29. Reply to this email and I'll sort it.
{% endif %}

Questions for the panel? Send them in advance by replying to this email. We'll make sure the best ones get covered even if the live Q&A runs short.

Don & Dylan

---

**CTA button text:** (none - reply CTA and soft bundle CTA via reply)
**Personalization notes:** `{{webinarPart}}` in the subject line: use `1` for part1, `2` for part2, `1 and 2` for bundle/premium. Show Part 1 panel details to part1/bundle/premium buyers. Show Part 2 panel details to part2/bundle/premium buyers. The upgrade nudge is conditional on being a single-part buyer only. Speaker details should be updated with actual names once confirmed.

---

### Email 4 - Countdown (Day 7)

**Awareness move:** Most Aware - final pre-event activation
**Job:** Build anticipation. Reinforce the value. Give them a clear checklist so they show up ready. Premium buyers get a reminder to book their coaching session.

**Subject line:** your webinar is [X] days away
**Preview text:** Here's what to have ready before you join.

---

Hey {{firstName}},

The Spring Week Conversion Webinar is almost here.

{% if productType == "part1" %}
Part 1 is in [X] days.
{% endif %}
{% if productType == "part2" %}
Part 2 is in [X] days.
{% endif %}
{% if productType == "bundle" or productType == "premium" %}
Part 1 is in [X] days. Part 2 follows [Y] days after that.
{% endif %}

Before you join, run through this:

- Got your questions for the panel written down? (3 minimum, the more specific the better)
- Researched the spring week programmes for your target firms?
- Know your own timeline - when your spring week is and what stage you're at?
{% if hasPlaybook == "true" %}
- Skimmed the relevant section of The Spring Week Playbook in your portal?
{% endif %}
- Got a notebook or something to write on during the session?

The Zoom link will be in your inbox an hour before the session starts. If you don't see it, check spam or reply here.

The sessions are live and the Q&A is real - the panellists aren't scripted. If you've got questions you want answered, submit them in advance by replying to this email or ask live during the session.

{% if productType == "premium" %}
One more thing: your 1-on-1 coaching session is included with your ticket. You'll receive the booking link after Part 1. The coaching works best when you've watched at least one session first - bring your questions, your target firm list, and any materials you want reviewed.
{% endif %}

See you there.

Don & Dylan

---

**CTA button text:** Open Your Portal
**CTA link:** `{{portalLink}}`
**Personalization notes:** `[X]` days and `[Y]` days are dynamic placeholders - Loops can calculate these from the webinar date variables once dates are confirmed. The Playbook checklist item is conditional on `hasPlaybook == "true"` (bundle + premium). The coaching reminder is premium-only. Subject line `[X]` should be calculated the same way.

---

## Flow 7: Spring Week Post-Webinar

**Trigger:** `spring_week_webinar_complete` event
**Fired by:** Manual trigger or Supabase edge function after the webinar session
**Event properties available:** `firstName`, `productType`, `portalLink`, `bookUthmanLink`, `hasPlaybook` (`true`/`false`), `hasCoaching` (`true`/`false`), `sessionAttended` (e.g. `part1`, `part2`, `both`)
**Audience:** Students who attended one or both sessions of the Spring Week Conversion Webinar

**Note for Loops setup:** Fire this event once per buyer after each session they attended. If a bundle/premium buyer attended Part 1, fire immediately after Part 1. Then fire again after Part 2 (or fire once with `sessionAttended == "both"` if triggering after both are done). The simplest approach is to fire it once after the final session each buyer attended.

---

### Email 1 - Recording Processing (Immediate)

**Awareness move:** Most Aware - lock in post-event engagement
**Job:** Bridge the gap between "just watched it live" and "ready to use it." Give them a checklist to act on right now so the momentum doesn't die while they wait for the recording.

**Subject line:** thanks for being there
**Preview text:** Recording is processing - here's what to do while you wait.

---

Hey {{firstName}},

That's a wrap.

Thank you for joining. The recording is processing now and will be in your portal within 24 hours.

While you wait, do this:

**Write down your top 3 takeaways right now.** Not tomorrow, now - while it's fresh. Specifically: what are the 3 things you're going to do differently because of what you heard today?

Then write down any follow-up questions you didn't get to ask. You can put these to a panellist directly in a coaching session, or ask in the portal.

Here's your checklist for the next 24 hours:

- [ ] Written down your 3 takeaways
- [ ] Written down unanswered questions
- [ ] Identified which firms from the panel match your target list
- [ ] Decided what action you're taking this week based on what you heard
{% if hasPlaybook == "true" %}
- [ ] Read the full Spring Week Playbook section on your top target firm
{% endif %}

The recording will be here: {{portalLink}}

You'll get an email as soon as it's live.

Don & Dylan

---

**CTA button text:** (none - no link needed yet, recording isn't live)
**Personalization notes:** The Playbook checklist item is conditional on `hasPlaybook == "true"` (bundle + premium). The rest applies to all buyers.

---

### Email 2 - Recording Ready (Day 1)

**Awareness move:** Most Aware - drive consumption and upsell
**Job:** Deliver the recording. Get them to rewatch the parts that apply to them. For bundle/premium buyers, reinforce the Playbook. For premium buyers, push toward booking coaching. For everyone else, introduce coaching as the natural next step.

**Subject line:** your recording is ready
**Preview text:** It's in your portal now. Here's where to start.

---

Hey {{firstName}},

Your recording is ready. Watch it here: {{portalLink}}

A few things to note when you rewatch:

**Slow down at the follow-up sections.** Almost every panellist mentioned follow-up emails as a critical factor. Pause those moments and write down the exact wording they used. That's the stuff that doesn't survive paraphrasing.

**Note the firm-specific differences.** What worked at an investment bank isn't necessarily what works at a trading firm. If you're targeting multiple firm types, make sure you're applying the right conversion strategy for each.

**Watch the Q&A section twice.** That's where the most honest answers tend to come out. The structured questions get structured answers. The live Q&A gets the real ones.

{% if hasPlaybook == "true" %}
Your Spring Week Playbook is also in the portal. Cross-reference it with the recording - you'll find that a lot of what the panellists said live is expanded on in the written write-ups.
{% endif %}

{% if hasCoaching == "true" %}
Your 1-on-1 coaching session booking link is in your portal. Book it after you've watched the recording - the session is much more useful when you can reference specific things you heard from the panel.
{% endif %}

{% if hasCoaching == "false" %}
One option worth considering: a coaching session with one of the panellists. This is where you take the general frameworks from the webinar and apply them to your specific firms, your specific gaps, your specific timeline.

- Strategy Call (30 min, £35) - best for reviewing specific materials or one focused question
- Deep Dive (60 min, £59) - best for a full plan built around your situation

Book here: {{bookUthmanLink}}
{% endif %}

Don & Dylan

---

**CTA button text:** Watch the Recording
**CTA link:** `{{portalLink}}`
**Personalization notes:** Playbook cross-reference is conditional on `hasPlaybook == "true"`. Coaching booking reminder is conditional on `hasCoaching == "true"`. Coaching upsell block is conditional on `hasCoaching == "false"`. Subject line is universal.

---

### Email 3 - What's Your Next Move? (Day 5)

**Awareness move:** Most Aware - push to action and upsell
**Job:** Check in. Push toward the most valuable next step based on what they bought. For non-bundle buyers, upsell the Playbook. For premium buyers, ask for a testimonial. For everyone, coaching is the natural step if they haven't booked.

**Subject line:** what's your next move?
**Preview text:** 5 days on - here's what students who convert actually do next.

---

Hey {{firstName}},

It's been a few days since the webinar. I want to check in and make sure you've actually moved the needle on something.

The students who get results from events like this aren't the ones who watched and thought "that was useful." They're the ones who picked one thing and did it within a week.

So: what's the one thing you're acting on?

If you're not sure, here's a simple decision tree:

**Applying for spring weeks right now?** Focus on preparation: research the programme structure, write your firm-specific follow-up email in advance, know which teams you want to meet.

**Spring week already coming up?** Focus on the conversion framework from the panel. Specifically: your day-by-day plan for building relationships during the programme, and your post-week follow-up strategy.

**Spring week in the future (next cycle)?** Now is the time to find and reach out to someone at your target firm for a coffee chat before applications open. The panellists all mentioned having some form of pre-application connection.

{% if hasPlaybook == "false" %}
One thing that might help: The Spring Week Playbook. It's the written version of what you heard on the panel, plus insider write-ups from alumni at 10+ firms covering what each programme actually involves, what the conversion process looks like, and what they wish they'd known.

You can add it to your purchase for £14 (bundle upgrade from single-part ticket). Reply to this email if you want a link.
{% endif %}

{% if hasCoaching == "false" %}
If you want someone to help you apply the frameworks to your specific situation - your firms, your timeline, your gaps - that's what coaching is for.

- Strategy Call (30 min, £35): {{bookUthmanLink}}
- Deep Dive (60 min, £59): {{bookUthmanLink}}
{% endif %}

{% if hasCoaching == "true" %}
And if you haven't booked your coaching session yet - do that this week. The earlier you go into your spring week with a plan, the better. Book it from your portal: {{portalLink}}

One quick thing: if you've got 2 minutes, would you mind telling me what you got from the webinar? Just reply to this email - I read every one. It helps me make the next one better and helps other students figure out if it's worth it.
{% endif %}

Don & Dylan

---

**CTA button text:** Book a Coaching Session
**CTA link:** `{{bookUthmanLink}}`
**Personalization notes:** Playbook upsell block is conditional on `hasPlaybook == "false"`. Coaching upsell block is conditional on `hasCoaching == "false"`. Premium testimonial/coaching booking nudge is conditional on `hasCoaching == "true"`. The CTA button only appears for non-coaching buyers. If `hasCoaching == "true"`, the CTA is a reply, not a button.

---

## Flow 8: Spring Week Coaching Booked

**Trigger:** `spring_week_coaching_booked` event
**Fired by:** `send-booking-confirmation/index.ts` (spring week panellist coaching variant)
**Event properties available:** `studentName`, `studentEmail`, `sessionName`, `sessionId`, `duration`, `dateStr`, `time`, `price`, `coachName`, `coachFirm`, `bookUthmanLink`
**Audience:** Student who has booked a 1-on-1 coaching session with a spring week panellist

**Note for Loops setup:** This is a parallel flow to Flow 3 (general coaching) but for panellist coaching specifically. The key difference is the context - these buyers have already watched the webinar and are booking a session with someone whose firm-specific conversion story they've heard. The `coachName` and `coachFirm` variables make the emails much more specific and credible.

---

### Email 1 - Booking Confirmed (Immediate)

**Awareness move:** Most Aware - lock in commitment
**Job:** Confirm the booking details. Build anticipation. Set expectations so they show up having done the right prep.

**Subject line:** booked - your session with {{coachName}} ({{coachFirm}})
**Preview text:** Here are the details and how to get the most from it.

---

Hey {{studentName}},

Your coaching session is confirmed. Here are the details:

---

**Coach:** {{coachName}}, {{coachFirm}}
**Session:** {{sessionName}}
**Date:** {{dateStr}}
**Time:** {{time}}
**Duration:** {{duration}}
**Paid:** {{price}}

---

You'll receive the Zoom link from {{coachName}} within 24 hours of your session. If you don't see it, reply to this email.

**How to prepare:**

{{coachName}} knows the {{coachFirm}} spring week programme from the inside. To make the most of your time:

1. Rewatch the part of the webinar where {{coachName}} was speaking. Write down anything you want to go deeper on.
2. Come with your specific situation: which firms are you targeting, what stage are you at (pre-application, mid-programme, post-programme?), what's your biggest uncertainty right now.
3. Write down 3 specific questions. The more concrete, the better. "What did your end-of-week conversation with your manager look like?" beats "How do I impress people during the programme?"
4. If you have any draft materials (follow-up emails, networking outreach, a list of people you want to approach), send them to uthman6696@gmail.com before the session so {{coachName}} can review them in advance.

This session is yours. There's no fixed agenda - it goes wherever is most useful for your situation.

Don & Uthman

---

**CTA button text:** (none - confirmation email, no conversion needed)
**Personalization notes:** `{{coachName}}` and `{{coachFirm}}` are used throughout to make this feel personal and specific. All session details from the event payload. Signoff is "Don & Uthman" because Uthman handles logistics for these sessions.

---

### Email 2 - Reminder + Prep Checklist (24 Hours Before)

**Awareness move:** Most Aware - reduce no-shows, maximise session quality
**Job:** Remind them. Get them to arrive prepared. A prepared student gets more value, which means a better testimonial and more likely to book again.

**Note for Loops setup:** Same scheduling note as Flow 3 Email 2 - this requires scheduling relative to `{{dateStr}}` and `{{time}}`. If Loops doesn't support negative-offset scheduling from a dynamic date, Uthman triggers this manually the day before.

**Subject line:** tomorrow: your session with {{coachName}}
**Preview text:** Quick prep checklist before you join.

---

Hey {{studentName}},

Just a heads up - your session with {{coachName}} ({{coachFirm}}) is tomorrow.

**{{dateStr}} at {{time}}** | {{duration}}

Before you join:

- [ ] Rewatched the {{coachFirm}} part of the webinar?
- [ ] Got 3 specific questions written down?
- [ ] Sent any draft materials to uthman6696@gmail.com for review?
- [ ] Got a quiet spot with decent WiFi?
- [ ] Got something to take notes with?

The session goes fast. Having your questions written down means you don't spend the first five minutes trying to remember what you wanted to ask.

If you need to reschedule, email uthman6696@gmail.com at least 24 hours in advance.

The Zoom link is coming from {{coachName}} shortly. See you there.

Don & Uthman

---

**CTA button text:** (none)
**Personalization notes:** `{{coachName}}` and `{{coachFirm}}` appear throughout. All scheduling variables from the original event payload. Same Loops scheduling caveat as Flow 3.

---

### Email 3 - Post-Session Follow-Up (24 Hours After)

**Awareness move:** Most Aware - drive action, collect social proof
**Job:** Reinforce the session. Give them a clean framework to act on it. Ask for feedback. Open the door to booking another session.

**Subject line:** how was your session with {{coachName}}?
**Preview text:** Feedback request + your next steps.

---

Hey {{studentName}},

Hope the session with {{coachName}} was useful.

A quick favour - would you mind sharing a short review? It doesn't need to be long. Just reply to this email with 2-3 sentences:

- Was it useful?
- What was the most valuable thing you took from it?
- Would you recommend it to a friend doing a spring week?

These reviews are what help other students figure out whether a coaching session is worth it. And since these sessions are with actual panellists who converted at real firms, not generic coaches, the specifics matter.

If there was something you didn't get to cover in the session, or if something came up since that you want to dig into, you can book a follow-up here: {{bookUthmanLink}}

And if you've still got your spring week ahead of you - now is the time to start executing. The session gave you the plan. The plan only works if you use it.

Uthman

P.S. If anything from the session didn't land or you felt like you didn't get what you needed, reply and let me know. I'd rather hear that directly than have you leave without getting value.

---

**CTA button text:** Book a Follow-Up Session
**CTA link:** `{{bookUthmanLink}}`
**Personalization notes:** `{{coachName}}` appears in subject and body. Signoff is "Uthman" because this is a coaching relationship email, not a brand email. The testimonial ask is reply-based - no form, no friction.

---

## Implementation Notes for Dylan

### Setting up in Loops

1. **Flow 1 (Purchase Completed):** Create as an automated Loop triggered by the `purchase_completed` event. Set delays between emails at Day 0, Day 1, Day 3, Day 7. Add a condition on Email 3: skip if `productType` = `recording_premium`.

2. **Flow 2 (Portal Access):** Create as an automated Loop triggered by the `portal_access_granted` event. Single email, no delays. Use Loops conditional blocks for `isBundle` content.

3. **Flow 3 (Booking Confirmed):** Email 1 is automated, triggered by `booking_confirmed` event. Email 2 (24h reminder) depends on Loops' ability to schedule relative to a dynamic date - if not supported, Uthman sends manually. Email 3 is a transactional template that Uthman triggers manually after each session. Email 4 is automated, 7 days after the `booking_confirmed` event.

4. **Flow 4 (Uthman Notification):** Create as an automated Loop triggered by `new_booking_notification` event. Single email to uthman6696@gmail.com only.

5. **Flow 5 (Spring Week Promo):** This is a manual broadcast sequence, NOT event-triggered. Schedule sends for Day 0, Day 2, Day 4, Day 6, Day 8 relative to when you start the campaign. Audience = full Attio contact list synced to Loops.

6. **Flow 6 (Spring Week Purchase Completed):** Create as an automated Loop triggered by the `spring_week_purchase_completed` event. Set delays at Day 0, Day 2, Day 5, Day 7. The `productType` variable (`part1`, `part2`, `bundle`, `premium`) drives all conditional blocks. Derive `hasPlaybook` and `hasCoaching` in the edge function before firing the event so Loops conditional logic stays simple. The Day 5 speaker reveal email will need to be updated manually once speaker names are confirmed - use Loops' draft mode and update before the first buyer hits Day 5 in the sequence.

7. **Flow 7 (Spring Week Post-Webinar):** Triggered by the `spring_week_webinar_complete` event. Fire this event manually (or via a simple edge function trigger) after each session ends. Delays: Email 1 immediate, Email 2 at Day 1, Email 3 at Day 5. Pass `hasPlaybook` and `hasCoaching` as boolean event properties to drive conditional blocks. For bundle/premium buyers who have both sessions, fire the event once after Part 2 concludes - set `sessionAttended = "both"`.

8. **Flow 8 (Spring Week Coaching Booked):** Create as an automated Loop triggered by the `spring_week_coaching_booked` event. Email 1 immediate. Email 2 is the 24h pre-session reminder - same scheduling caveat as Flow 3 Email 2. Email 3 fires 24 hours after the session (requires a separate trigger or a fixed delay from the `dateStr` variable). `coachName` and `coachFirm` must be passed as event properties from the booking system. If panellist bookings are managed via Cal.com (same as Uthman), add a webhook that fires this event on booking completion.

### Loops Contact Properties to Create

Ensure these properties exist in Loops (synced from Attio or set by events):

- `firstName` (string)
- `productType` (string) - for cold email webinar products
- `springWeekProductType` (string) - `part1`, `part2`, `bundle`, or `premium`
- `isBundle` (boolean/string) - cold email webinar
- `hasPlaybook` (boolean/string) - spring week bundle + premium
- `hasCoaching` (boolean/string) - spring week premium
- `sessionAttended` (string) - `part1`, `part2`, or `both` (post-webinar flow)
- `coachName` (string) - spring week coaching sessions
- `coachFirm` (string) - spring week coaching sessions
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
