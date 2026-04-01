# Troubleshooting Runbook

**For when things break. Don't panic, follow the steps.**
**Last updated:** April 2026

---

## "A customer says they didn't get their email"

**Frequency:** Happens weekly. This is your #1 support request.

### Step 1: Look them up
- **Marketing email** (confirmation, upsell, nurture): Check Loops (app.loops.so), search by email, review email history
- **Transactional email** (booking confirmation, portal access): These are fired by Supabase edge functions via Loops events. Check Loops for the contact's sent email history.

### Step 2: Diagnose
| What You See | What Happened | Fix |
|-------------|---------------|-----|
| Email shows "Sent" + "Delivered" | Email arrived - they didn't check spam | Tell them to check spam + promotions. Resend from Loops. |
| Email shows "Sent" + "Bounced" | Bad email address | Ask for a different email. Update contact in Attio and Loops. Resend. |
| Email shows "Sent" but no "Delivered" | Stuck in transit or caught by spam filter | Resend. If happens repeatedly, check SPF/DKIM settings in Loops. |
| No email in Loops history at all | Flow didn't fire | Manually add them to the correct Loops flow. |
| Not in Attio at all | They were never captured | Check Supabase crm_contacts. Manually add to Attio and enrol in the correct Loops flow. |

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
- Go to dashboard.stripe.com, Payments, search by email
- Confirm payment status is "Succeeded"

### Step 2: Check Supabase
- Query Supabase directly or check Attio CRM:
  ```sql
  SELECT * FROM crm_contacts WHERE email = 'their@email.com';
  ```
- Check: do they have tag `stripe_customer`?
- Check: is their status `converted`?

### Step 3: Fix
- If tags are missing: manually add `stripe_customer` + `confirmation_sent` tags
- If not in Supabase at all: create the contact manually with correct tags
- Re-trigger the portal access edge function (which fires the `portal_access_granted` Loops event):
  ```bash
  curl -X POST "https://cidnbhphbmwvbozdxqhe.supabase.co/functions/v1/send-portal-access" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer [ANON_KEY]" \
    -H "apikey: [ANON_KEY]" \
    -d '{"email":"their@email.com","firstName":"TheirName","productType":"recording_bundle"}'
  ```

---

## "Booking confirmation didn't send"

### Step 1: Check Loops
- Go to app.loops.so, find the contact by email
- Check their email history for the booking confirmation

### Step 2: If not sent, re-trigger manually
The `send-booking-confirmation` edge function fires two Loops events: `booking_confirmed` (to the student) and `new_booking_notification` (to Uthman).

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

### Step 3: Verify in Loops
- Go to app.loops.so and confirm the event was received and the email was sent to the contact

---

## "The website is down"

### Step 1: Check Vercel
- Go to vercel.com, peer-pathway-project, Deployments
- Is the latest deployment green (success)?
- If red: click on it, read the build error, fix the code

### Step 2: Check if it's a DNS issue
- Try accessing: webinar.yourearlyedge.co.uk
- Try accessing: peer-pathway-project.vercel.app (direct Vercel URL)
- If Vercel URL works but custom domain doesn't, it is a DNS issue

### Step 3: Check Supabase
- Go to supabase.com/dashboard, project, check if services are running
- Common: Supabase free tier can pause after inactivity (rare but possible)

---

## "Edge function isn't working"

### Step 1: Check Supabase Functions dashboard
- Go to supabase.com/dashboard, Functions, check the function logs
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
| `LOOPS_API_KEY not set` | Set secret: `supabase secrets set LOOPS_API_KEY=loops_xxx` |
| `ATTIO_API_KEY not set` | Set secret: `supabase secrets set ATTIO_API_KEY=attio_xxx` |
| `Function not found` | Redeploy: `supabase functions deploy [name] --no-verify-jwt` |
| `CORS error` (in browser) | Edge function should use `--no-verify-jwt` flag |
| `Rate limit` (Loops) | Check Loops plan limits or wait for reset |

---

## "Loops flow isn't firing"

### Step 1: Check the flow in Loops
- Go to app.loops.so, Loops (flows), find the relevant flow
- Check the flow history to see if contacts are being enrolled
- Check enrollment trigger conditions - the event name may not match

### Step 2: Common issues
| Issue | Fix |
|-------|-----|
| Contact doesn't meet enrollment criteria | Check contact properties match the flow trigger |
| Flow is paused or in draft | Publish and enable the flow |
| Contact was already enrolled | Check if re-enrollment is enabled in flow settings |
| Event name mismatch | Confirm the edge function is firing the exact event name used in the flow trigger |
| Contact not in Loops | Confirm the edge function is creating the Loops contact before firing the event |

---

## Emergency Contacts

| What | Who | How |
|------|-----|-----|
| Code issues | Don | Fix via GitHub + Vercel auto-deploy |
| Supabase issues | Don | Dashboard: supabase.com |
| Stripe issues | Don | Dashboard: dashboard.stripe.com |
| Loops issues | Don | Dashboard: app.loops.so |
| Attio issues | Don | Dashboard: app.attio.com |
| Coaching/booking issues | Uthman | Email: uthman6696@gmail.com |
| DNS/domain issues | Don | Domain registrar dashboard |
