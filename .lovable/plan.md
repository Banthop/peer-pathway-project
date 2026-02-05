

# Clarify Coach vs Student Auth Flow

## The Issue
The login page doesn't make it clear whether you're logging in as a coach or student, and there's no way for a coach to find the coach signup from the login page.

## Proposed Solution
Add helpful context links to the login page that mirror how the student signup page handles this - with a subtle "Want to coach instead?" link.

---

## Changes

### Update Login Page (`src/pages/Login.tsx`)

Add a subtle coach-specific link at the bottom, similar to how the student signup has "Want to coach instead?":

**Current footer:**
```
Forgot password?
Don't have an account? Sign up
```

**Updated footer:**
```
Forgot password?
Don't have an account? Sign up

---
Want to coach on EarlyEdge? Apply here
```

The "Apply here" link goes to `/coach/signup`.

---

## Visual Layout

```
┌─────────────────────────────────┐
│         EarlyEdge Logo          │
│                                 │
│        Welcome back             │
│                                 │
│   ┌─────────────────────────┐   │
│   │ Email                   │   │
│   └─────────────────────────┘   │
│   ┌─────────────────────────┐   │
│   │ Password                │   │
│   └─────────────────────────┘   │
│                                 │
│   [        Log in         ]     │
│                                 │
│      Forgot password?           │
│   Don't have an account?        │
│          Sign up                │
│                                 │
│   ─────────────────────────     │
│   Want to coach on EarlyEdge?   │
│         Apply here              │
└─────────────────────────────────┘
```

---

## Technical Implementation

1. Add a visual separator (border-t) 
2. Add text: "Want to coach on EarlyEdge?"
3. Add link "Apply here" → `/coach/signup`
4. Style to match existing subtle footer links

---

## Why This Approach

- **Simple**: One shared login works for both user types (the backend will know their role)
- **Discoverable**: Coaches can find the application from login if they arrived there by mistake
- **Consistent**: Mirrors the pattern already used on the student signup page
- **Minimal**: Doesn't clutter the primary flow for students (the majority of users)

