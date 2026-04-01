# 📨 Lead Processing SOP

**Owner:** Automated (HubSpot + Edge Functions) - Don monitors  
**Last updated:** April 2026

---

## Lead Sources & Entry Points

| Source | How They Enter | Where They Go |
|--------|---------------|---------------|
| Webinar landing page form | Form submit → HubSpot | HubSpot contact + Supabase crm_contacts |
| Stripe purchase | Stripe webhook | HubSpot deal + contact update |
| LinkedIn scrape | Manual import | HubSpot contact (source: social_media) |
| Coaching booking | BookUthman page | Supabase portal_bookings + HubSpot deal |
| Manual add | HubSpot or AdminCRM | HubSpot contact |

---

## Automated Sequences (HubSpot Workflows)

### When: New Form Lead (tag: `form_lead`, NOT `stripe_customer`)

```
Trigger: Contact property "Lead Status" = "Open"
         AND "Stripe Customer" != "Yes"

→ Immediately: Send "Free Value" email
→ Wait 24 hours
→ Send "Social Proof" email (3 students who landed offers)
→ Wait 48 hours  
→ Send "50% Off" discount email (code: WEBINAR50)
→ Wait 72 hours
→ Send "Final Urgency" email (closing tonight)
→ Wait 24 hours
→ If still not purchased: Move to "Nurture" list (monthly emails only)
```

### When: New Buyer (Stripe webhook → HubSpot deal created)

```
Trigger: Deal stage = "Closed Won"

→ Immediately: 
  - Update lifecycle stage to "Customer"
  - Add to "Buyers" list
  - Check product type:
    - Recording Only → Send "Recording Access" email
    - Bundle → Send "Bundle Welcome" email  
    - Premium → Send "Premium Welcome" email + "Book Uthman" CTA
→ Wait 1 day
→ Send "How to get the most from this" email
→ Wait 2 days
→ Send "Coaching Upsell" email (social proof from past students)
```

### When: Email Bounced

```
Trigger: Email event = hard bounce

→ Immediately:
  - Tag contact: "bounced"
  - Remove from all active sequences
  - Add to "Bad Emails" list
  - Alert Don via HubSpot notification
```

### When: Unsubscribed

```
Trigger: Contact unsubscribes

→ Immediately:
  - Tag: "unsubscribed"
  - Remove from ALL sequences and lists
  - Do NOT send any more emails (HubSpot handles this automatically)
```

---

## Manual Processing Checklist

### Daily (5 min - Don)
- [ ] Check HubSpot dashboard: any new leads overnight?
- [ ] Check HubSpot notifications: any bounces or issues?
- [ ] Check Stripe dashboard: any failed payments?

### Weekly (15 min - Don)
- [ ] Review "Hot Leads" segment in HubSpot (clicked but didn't buy)
- [ ] Manually follow up with high-value leads (university, engagement level)
- [ ] Check email deliverability stats (open rate, click rate, bounce rate)
- [ ] Review and clean "Bad Emails" list

---

## Troubleshooting: "I Didn't Get My Email"

**This will happen. Here's the exact process:**

1. **Look up the contact in HubSpot** (search by email)
2. **Check the timeline tab** - see every email sent, delivered, opened, clicked
3. **If email shows as "Sent" + "Delivered":**
   - Ask them to check spam/promotions folder
   - Resend the specific email from HubSpot (1-click resend)
4. **If email shows as "Bounced":**
   - Ask for an alternative email
   - Update contact, resend manually
5. **If NO email shows in timeline:**
   - Check if workflow was triggered (HubSpot → Workflows → History)
   - If not triggered: manually enroll them in the correct workflow
   - If triggered but failed: check workflow error logs
6. **If it's a transactional email (booking confirmation, portal access):**
   - Check Resend dashboard (resend.com/emails)
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

**Hot lead threshold:** 50+ points → auto-notify Don for manual follow-up
