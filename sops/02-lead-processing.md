# Lead Processing SOP

**Owner:** Automated (Attio + Loops + Edge Functions) - Don monitors
**Last updated:** April 2026

---

## Lead Sources & Entry Points

| Source | How They Enter | Where They Go |
|--------|---------------|---------------|
| Webinar landing page form | Form submit | Attio contact + Supabase crm_contacts |
| Stripe purchase | Stripe webhook | Attio contact update + Student Sales pipeline entry |
| LinkedIn scrape | Manual import | Attio contact (source: social_media) |
| Coaching booking | BookUthman page | Supabase portal_bookings + Attio pipeline entry |
| Manual add | Attio CRM | Attio contact |

---

## Automated Sequences (Loops Flows)

### When: New Form Lead (tag: `form_lead`, NOT `stripe_customer`)

```
Trigger: Contact property "Lead Status" = "Open"
         AND "Stripe Customer" != "Yes"

Immediately: Send "Free Value" email
Wait 24 hours
Send "Social Proof" email (3 students who landed offers)
Wait 48 hours
Send "50% Off" discount email (code: WEBINAR50)
Wait 72 hours
Send "Final Urgency" email (closing tonight)
Wait 24 hours
If still not purchased: Move to "Nurture" list (monthly emails only)
```

### When: New Buyer (Stripe webhook fires `purchase_completed` Loops event)

```
Trigger: Loops event "purchase_completed" received

Immediately:
  - Update Attio contact: lifecycle stage "Customer"
  - Add to "Buyers" segment in Loops
  - Check product type:
    - Recording Only: Send "Recording Access" email
    - Bundle: Send "Bundle Welcome" email
    - Premium: Send "Premium Welcome" email + "Book Uthman" CTA
Wait 1 day
Send "How to get the most from this" email
Wait 2 days
Send "Coaching Upsell" email (social proof from past students)
```

### When: Email Bounced

```
Trigger: Email event = hard bounce

Immediately:
  - Tag contact in Attio: "bounced"
  - Remove from all active Loops sequences
  - Add to "Bad Emails" segment
  - Alert Don via Loops or Attio notification
```

### When: Unsubscribed

```
Trigger: Contact unsubscribes in Loops

Immediately:
  - Tag in Attio: "unsubscribed"
  - Remove from ALL sequences and lists
  - Do NOT send any more emails (Loops handles this automatically)
```

---

## Manual Processing Checklist

### Daily (5 min - Don)
- [ ] Check Attio dashboard: any new leads overnight?
- [ ] Check Loops dashboard: any bounces or delivery issues?
- [ ] Check Stripe dashboard: any failed payments?

### Weekly (15 min - Don)
- [ ] Review "Hot Leads" segment in Attio (clicked but didn't buy)
- [ ] Manually follow up with high-value leads (university, engagement level)
- [ ] Check email deliverability stats in Loops (open rate, click rate, bounce rate)
- [ ] Review and clean "Bad Emails" segment

---

## Troubleshooting: "I Didn't Get My Email"

**This will happen. Here's the exact process:**

1. **Look up the contact in Attio** (search by email at app.attio.com)
2. **Check the contact timeline** - see activity history
3. **For marketing/sequence emails, check Loops** (app.loops.so) - find the contact and review their email history
4. **If email shows as "Sent" + "Delivered":**
   - Ask them to check spam/promotions folder
   - Resend the specific email from Loops
5. **If email shows as "Bounced":**
   - Ask for an alternative email
   - Update contact in Attio and Loops, resend manually
6. **If NO email shows in Loops history:**
   - Check if the Loops flow was triggered (Loops flows history)
   - If not triggered: manually add them to the correct Loops flow
   - If triggered but failed: check the flow error logs in Loops
7. **If it's a transactional email (booking confirmation, portal access):**
   - These are fired by Supabase edge functions via Loops events
   - Re-trigger the edge function manually:
   ```bash
   curl -X POST "https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/send-booking-confirmation" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer [ANON_KEY]" \
     -d '{"studentEmail":"their@email.com","studentName":"Their Name",...}'
   ```

---

## Lead Scoring (Future - build when at 1,000+ contacts)

| Action | Points |
|--------|--------|
| Fills form | +10 |
| Opens email | +5 |
| Clicks email | +15 |
| Visits pricing page | +20 |
| Starts checkout | +30 |
| Purchases | +100 |
| Books coaching | +50 |
| Refers someone | +75 |
| Bounced email | -50 |
| Unsubscribes | -100 |

**Hot lead threshold:** 50+ points, auto-notify Don for manual follow-up
