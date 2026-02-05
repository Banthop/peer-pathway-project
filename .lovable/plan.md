

# Make Coach Login More Discoverable

## The Problem
The current "Want to coach on EarlyEdge? Apply here" link is at the very bottom in small muted text - easy to miss. Coaches have to read the fine print to find it.

## Proposed Solution
Add a simple toggle/tabs at the top of the login form that lets users choose their role upfront: **Student** or **Coach**. This makes the distinction immediately clear without creating separate pages.

---

## Visual Layout

```text
+----------------------------------+
|         EarlyEdge Logo           |
|                                  |
|         Welcome back             |
|                                  |
|   [  Student  ]  [  Coach  ]     |  <-- Simple toggle tabs
|                                  |
|   +---------------------------+  |
|   | Email                     |  |
|   +---------------------------+  |
|   +---------------------------+  |
|   | Password                  |  |
|   +---------------------------+  |
|                                  |
|   [        Log in           ]    |
|                                  |
|      Forgot password?            |
|   Don't have an account?         |
|   Sign up  /  Apply to coach     |  <-- Changes based on tab
+----------------------------------+
```

---

## How It Works

1. Default tab is **Student** (most common user)
2. When **Coach** is selected:
   - Form stays the same (email/password)
   - "Sign up" link changes to "Apply to coach" → `/coach/signup`
3. Both user types log in through the same form
4. Backend determines their role after authentication

---

## Technical Implementation

### Update Login Page (`src/pages/Login.tsx`)

1. Add state for selected role: `const [role, setRole] = useState<'student' | 'coach'>('student')`
2. Add tab buttons above the form using existing Tabs component or simple styled buttons
3. Conditionally render the signup link based on role:
   - Student: "Don't have an account? Sign up" → `/signup`
   - Coach: "Don't have an account? Apply to coach" → `/coach/signup`
4. Remove the bottom "fine print" section entirely

### Styling
- Use subtle pill-style buttons for the toggle
- Active tab: `bg-foreground text-background`
- Inactive tab: `bg-transparent text-muted-foreground border border-border`
- Keep everything else the same

---

## Why This Works

- **Immediately visible**: The choice is right at the top, not hidden
- **Single page**: No separate coach login route needed
- **Not promotional**: Equal weight to both options, students still default
- **Clean**: Removes the awkward fine print section
- **Familiar pattern**: Many apps use this "I am a..." selector approach

