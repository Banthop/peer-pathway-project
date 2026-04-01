# 🚨 Troubleshooting Runbook

**For when things break. Don't panic, follow the steps.**  
**Last updated:** April 2026

---

## "A customer says they didn't get their email"

**Frequency:** Happens weekly. This is your #1 support request.

### Step 1: Look them up
- **Marketing email** (confirmation, upsell, nurture): Check HubSpot → search by email → Timeline tab
- **Transactional email** (booking confirmation, portal access): Check Resend dashboard → resend.com/emails → search

### Step 2: Diagnose
| What You See | What Happened | Fix |
|-------------|---------------|-----|
| Email shows "Sent" + "Delivered" | Email arrived - they didn't check spam | Tell them to check spam + promotions. Resend from HubSpot. |
| Email shows "Sent" + "Bounced" | Bad email address | Ask for a different email. Update contact. Resend. |
| Email shows "Sent" but no "Delivered" | Stuck in transit or caught by spam filter | Resend. If happens repeatedly, check SPF/DKIM settings. |
| No email in timeline at all | Workflow didn't fire | Manually enroll them in the correct HubSpot workflow. |
| Not in HubSpot at all | They never got captured | Check Supabase crm_contacts. Manually add to HubSpot + send email. |

### Step 3: Reply template
```
Hey [name],

Sorry about that - I've just resent it to you now. 
Should land in the next few minutes. 

If it goes to spam or promotions, just drag it to your primary inbox 
and you won't have that problem again.

Let me know if you need anything else.

Don
```

---

## "Stripe payment went through but no portal access"

### Step 1: Check Stripe
- Go to dashboard.stripe.com → Payments → search by email
- Confirm payment status is "Succeeded"

### Step 2: Check Supabase
- Go to AdminCRM or query Supabase:
  ```sql
  SELECT * FROM crm_contacts WHERE email = 'their@email.com';
  ```
- Check: do they have tag `stripe_customer`?
- Check: is their status `converted`?

### Step 3: Fix
- If tags are missing: manually add `stripe_customer` + `confirmation_sent` tags
- If not in Supabase at all: create the contact manually with correct tags
- Re-trigger the portal access email:
  ```bash
  curl -X POST "https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/send-portal-access" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer [ANON_KEY]" \
    -H "apikey: [ANON_KEY]" \
    -d '{"email":"their@email.com","firstName":"TheirName","productType":"recording_bundle"}'
  ```

---

## "Booking confirmation didn't send"

### Step 1: Check Resend
- Go to resend.com → Emails → search by recipient email
- See if the booking confirmation broadcast was created

### Step 2: If not sent, re-trigger manually
```bash
curl -X POST "https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/send-booking-confirmation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "apikey: [ANON_KEY]" \
  -d '{
    "studentEmail": "their@email.com",
    "studentName": "Their Name",
    "sessionName": "Deep Dive Session",
    "sessionId": "deep-dive",
    "duration": "60 min",
    "dateStr": "Wed 9 Apr",
    "time": "14:00",
    "price": "£59"
  }'
```

### Step 3: Check for cleanup
- If there are orphaned Resend audiences (booking_xxx), clean them up:
  ```bash
  curl "https://api.resend.com/audiences" \
    -H "Authorization: Bearer [RESEND_API_KEY]"
  ```

---

## "The website is down"

### Step 1: Check Vercel
- Go to vercel.com → peer-pathway-project → Deployments
- Is the latest deployment green (success)?
- If red: click on it, read the build error, fix the code

### Step 2: Check if it's a DNS issue
- Try accessing: webinar.yourearlyedge.co.uk
- Try accessing: peer-pathway-project.vercel.app (direct Vercel URL)
- If Vercel URL works but custom domain doesn't → DNS issue

### Step 3: Check Supabase
- Go to supabase.com/dashboard → project → check if services are running
- Common: Supabase free tier can pause after inactivity (rare but possible)

---

## "Edge function isn't working"

### Step 1: Check Supabase Functions dashboard
- Go to supabase.com/dashboard → Functions → check the function logs
- Look for error messages

### Step 2: Test manually
```bash
curl -X POST "https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/[function-name]" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "apikey: [ANON_KEY]" \
  -d '{"test": true}'
```

### Step 3: Common fixes
| Error | Fix |
|-------|-----|
| `RESEND_API_KEY not set` | Set secret: `supabase secrets set RESEND_API_KEY=re_xxx` |
| `Function not found` | Redeploy: `supabase functions deploy [name] --no-verify-jwt` |
| `CORS error` (in browser) | Edge function should use `--no-verify-jwt` flag |
| `Rate limit` (Resend) | Wait for daily reset or upgrade to paid Resend |

---

## "HubSpot workflow isn't firing" (future)

### Step 1: Check workflow
- HubSpot → Automation → Workflows → find the workflow → History tab
- See if contacts are being enrolled
- Check enrollment conditions - maybe the trigger properties don't match

### Step 2: Common issues
| Issue | Fix |
|-------|-----|
| Contact doesn't meet enrollment criteria | Check contact properties match the workflow trigger |
| Workflow is paused/draft | Publish and turn on the workflow |
| Contact was already enrolled | HubSpot doesn't re-enroll by default. Enable re-enrollment if needed. |
| Suppression list blocking | Check Settings → Email → Suppression lists |

---

## Emergency Contacts

| What | Who | How |
|------|-----|-----|
| Code issues | Don | Fix via GitHub + Vercel auto-deploy |
| Supabase issues | Don | Dashboard: supabase.com |
| Stripe issues | Don | Dashboard: dashboard.stripe.com |
| Resend issues | Don | Dashboard: resend.com |
| HubSpot issues | Don | Dashboard: app.hubspot.com |
| Coaching/booking issues | Uthman | Email: uthman6696@gmail.com |
| DNS/domain issues | Don | Domain registrar dashboard |
