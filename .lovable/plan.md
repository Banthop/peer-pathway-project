
# Authentication Pages Implementation Plan

## Overview
Create four clean, minimal authentication pages that match the EarlyEdge design system. These are frontend-only with static forms that will be connected to Supabase later.

## Design Approach
- Centered card layout on white background
- Clean, minimal styling matching existing EarlyEdge aesthetic
- Inter font family with light weights (matching current style)
- Mobile responsive
- No Header/Footer on auth pages (cleaner auth experience)
- EarlyEdge logo links back to home

---

## Files to Create

### 1. `/login` - Login Page
**File:** `src/pages/Login.tsx`

**Layout:**
- Centered card (max-width ~400px)
- EarlyEdge logo at top (links to home)
- Headline: "Welcome back"
- Email input
- Password input
- "Log in" button (full width, dark bg)
- "Forgot password?" link
- "Don't have an account? Sign up" link

---

### 2. `/signup` - Student Signup Page
**File:** `src/pages/Signup.tsx`

**Layout:**
- Centered card
- EarlyEdge logo at top
- Headline: "Create your account"
- Name input
- Email input
- Password input
- "Create account" button
- "Already have an account? Log in" link
- Small footer: "Want to coach instead?" link to /become-a-coach

---

### 3. `/forgot-password` - Password Reset Page
**File:** `src/pages/ForgotPassword.tsx`

**Layout:**
- Centered card
- EarlyEdge logo at top
- Headline: "Reset your password"
- Subtext: "Enter your email and we'll send you a reset link."
- Email input
- "Send reset link" button
- "Back to login" link

---

### 4. `/coach/signup` - Coach Application Page
**File:** `src/pages/CoachSignup.tsx`

**Layout:**
- Centered card
- EarlyEdge logo at top
- Headline: "Apply to coach"
- Subtext: "This takes about 3 minutes"
- "Continue with LinkedIn" button (primary, prominent, with LinkedIn icon)
- Divider with "or"
- Name input
- Email input
- Password input
- "Continue" button
- "Already have an account? Log in" link

---

### 5. Shared Auth Layout Component
**File:** `src/components/auth/AuthLayout.tsx`

Reusable wrapper for all auth pages:
- Full viewport height
- Centered content
- EarlyEdge logo at top
- Consistent padding and spacing

---

### 6. Update Routes
**File:** `src/App.tsx`

Add routes:
- `/login` -> Login
- `/signup` -> Signup
- `/forgot-password` -> ForgotPassword
- `/coach/signup` -> CoachSignup

---

## Technical Details

### Styling Patterns (matching existing codebase)
```text
Typography:
- Headlines: font-sans font-light text-foreground
- Subtext: font-sans font-light text-muted-foreground
- Links: text-sm font-sans hover:underline

Inputs:
- Use existing Input component from @/components/ui/input
- Full width, consistent spacing

Buttons:
- Primary: bg-foreground text-background hover:bg-foreground/90
- LinkedIn: bg-[#0A66C2] text-white (LinkedIn brand color)

Card Container:
- w-full max-w-md mx-auto p-8
- No visible card border (clean look)
```

### Component Structure
```text
AuthLayout
+-- Logo (links to /)
+-- Children (form content)

LoginPage
+-- AuthLayout
    +-- h1 "Welcome back"
    +-- form
        +-- Email Input
        +-- Password Input
        +-- Submit Button
    +-- Links (forgot password, signup)
```

### Form Handling
- Forms are non-functional (frontend only)
- Use React state for controlled inputs
- Buttons have onClick handlers that do nothing yet
- Ready for Supabase integration later

---

## Implementation Order
1. Create AuthLayout component
2. Create Login page
3. Create Signup page
4. Create ForgotPassword page
5. Create CoachSignup page
6. Add all routes to App.tsx
7. Update Header "Log In" button to link to /login

---

## Mobile Responsiveness
- Card takes full width on mobile with horizontal padding
- All elements stack vertically
- Touch-friendly input sizes
- Buttons full width on all screen sizes
