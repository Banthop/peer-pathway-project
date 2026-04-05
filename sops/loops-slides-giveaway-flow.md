# Loops Flow: Slides Giveaway Sequence

**Trigger:** Contact created/updated with tag `linkedin_slides_lead`
**Fired by:** `scripts/linkedin-email-automation.mjs` via Loops API (event: `slides_requested`)
**Audience:** People who commented their email on a LinkedIn post asking for Uthman's cold email slides
**From:** dylan@yourearlyedge.co.uk
**Signed by:** Dylan, EarlyEdge

---

## Context

Uthman cold emailed 1,062 firms with no connections, no fancy CV, just a method. 223 replied. 21% response rate. 20 offers in 3 weeks. He ran a 90-minute live webinar breaking down exactly how he did it. These slides are from that webinar.

This sequence delivers the slides immediately, then softly upsells the recording, guide, and 1-on-1 coaching over 5 days.

---

## Email Template Spec

All emails use: 480px max-width, system fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Arial), white background (#ffffff), black CTA buttons (#111111), 15px/27px body text, #222222 body colour.

---

## Email 1 - Immediate: "the slides, as promised"

**Subject:** the slides, as promised
**Preview text:** Here's the exact deck Uthman used.

---

**HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">Here's the exact deck Uthman used.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Hey,</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Good call commenting. Here are the slides from Uthman's 90-minute webinar on cold emailing your way to internship offers.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 24px 0;">They cover the exact system he used to email 1,062 firms, get 223 replies, and land 20 offers in 3 weeks.</td></tr>

          <tr>
            <td style="padding:0 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#111111;border-radius:8px;">
                    <a href="{{slidesLink}}" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">Download the slides</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Save them somewhere you'll actually find them. You'll want to refer back.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**CTA button text:** Download the slides
**CTA link:** `{{slidesLink}}`

---

## Email 2 - Day 1: "one thing the slides can't show you"

**Subject:** one thing the slides can't show you
**Preview text:** The slides show what worked. The recording shows why.

---

**HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">The slides show what worked. The recording shows why.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Hey,</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">The slides show you <em>what</em> Uthman did. But they can't show you <em>why</em> it works, how he handled the replies, or what he actually said to turn a "tell me more" into an offer.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">That's in the recording. 90 minutes, live walkthrough, nothing held back.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 24px 0;">It's 10 pounds if you want it.</td></tr>

          <tr>
            <td style="padding:0 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#111111;border-radius:8px;">
                    <a href="https://buy.stripe.com/4gM7sK8iUcK55qGbl22400d" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">Get the recording (10)</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**CTA button text:** Get the recording (10)
**CTA link:** https://buy.stripe.com/4gM7sK8iUcK55qGbl22400d

---

## Email 3 - Day 3: "what students said after working with Uthman"

**Subject:** what students said after working with Uthman
**Preview text:** Priya fixed her subject lines. Jake had an offer within a week.

---

**HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">Priya fixed her subject lines. Jake had an offer within a week.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Hey,</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">A couple of things students said after working directly with Uthman:</td></tr>

          <tr>
            <td style="border-left:3px solid #111111;padding:4px 0 4px 16px;margin:0 0 16px 0;display:block;">
              <span style="font-size:15px;line-height:27px;color:#222222;font-style:italic;">"Fixed my subject lines and got 3 replies in the first week."</span>
              <span style="font-size:13px;color:#888888;display:block;margin-top:4px;">Priya, LSE</span>
            </td>
          </tr>

          <tr><td style="padding:0 0 16px 0;"></td></tr>

          <tr>
            <td style="border-left:3px solid #111111;padding:4px 0 4px 16px;margin:0 0 20px 0;display:block;">
              <span style="font-size:15px;line-height:27px;color:#222222;font-style:italic;">"Had my call on Monday, fixed my templates the same day."</span>
              <span style="font-size:13px;color:#888888;display:block;margin-top:4px;">Jake, Warwick</span>
            </td>
          </tr>

          <tr><td style="padding:0 0 20px 0;"></td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">You can book a 1-on-1 session with Uthman directly: 30 minutes for 35, or 60 minutes for 59. He'll look at your actual emails, your target list, your reply handling, and tell you exactly what to change.</td></tr>

          <tr>
            <td style="padding:0 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#111111;border-radius:8px;">
                    <a href="https://cal.com/uthm4n" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">Book a session with Uthman</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**CTA button text:** Book a session with Uthman
**CTA link:** https://cal.com/uthm4n

---

## Email 4 - Day 5: "last one from me"

**Subject:** last one from me
**Preview text:** Internship season doesn't wait. Just wanted to make sure you had this.

---

**HTML:**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">Internship season doesn't wait. Just wanted to make sure you had this.</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" border="0" style="max-width:480px;width:100%;">

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Hey,</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Last one, I promise.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">Internship season is moving fast. The students who get offers aren't necessarily the best on paper, they're the ones who started earlier and followed up more.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 20px 0;">If you want the full recording and guide together, it's 29 for both. If you want Uthman to look at your specific emails and fix them with you, that's at the link below.</td></tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 24px 0;">Either way, the slides are yours. Hope they're useful.</td></tr>

          <tr>
            <td style="padding:0 0 12px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#111111;border-radius:8px;">
                    <a href="https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e" style="display:inline-block;background-color:#111111;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;">Get recording + guide (29)</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 0 24px 0;">
              <a href="https://cal.com/uthm4n" style="font-size:14px;color:#555555;text-decoration:underline;">Or book 1-on-1 coaching with Uthman</a>
            </td>
          </tr>

          <tr><td style="font-size:15px;line-height:27px;color:#222222;padding:0 0 6px 0;">Dylan</td></tr>
          <tr><td style="font-size:13px;color:#999999;padding:0;letter-spacing:-0.3px;"><span style="font-weight:300;">Early</span><span style="font-weight:700;">Edge</span></td></tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

**CTA button text:** Get recording + guide (29)
**CTA link:** https://buy.stripe.com/5kQcN49mYh0ldXcexe2400e
**Secondary link text:** Or book 1-on-1 coaching with Uthman
**Secondary link:** https://cal.com/uthm4n

---

## Loops Setup Notes

1. Create a new Flow in Loops
2. Trigger: Event name `slides_requested`
3. Add 4 emails with delays: immediate, +1 day, +3 days, +5 days
4. Use the HTML above for each email (paste into the HTML editor, not the visual builder)
5. Replace `{{slidesLink}}` in Email 1 with the actual PDF link once uploaded
6. White background, black buttons - do NOT use the default pink template
7. Unsubscribe footer is handled automatically by Loops
