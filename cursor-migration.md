# EarlyEdge  - Cursor Migration Guide

> This document provides a complete overview of the EarlyEdge codebase (migrated from Lovable.dev) and step-by-step instructions for removing all Lovable dependencies and running the project in a local development environment.

---

## 1. Business Context

EarlyEdge is a **two-sided peer coaching marketplace** for UK students. Students book 1-on-1 sessions with coaches who recently achieved competitive outcomes (Spring Weeks, Oxbridge offers, UCAT scores, training contracts, etc.).

- **Revenue model:** Platform commission on paid sessions (30% for first 5 sessions → 20% after, 0% for founding coaches)
- **Pricing:** Coaches set own prices, typically £25–60/hour
- **Target launch:** February 15, 2026
- **Full business context:** See [`early.md`](file:///c:/Users/Dylan/.antigravity/peer-pathway-project/early.md)

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Build tool** | Vite 5 | Dev server on port 8080 |
| **Framework** | React 18 | SPA with client-side routing (`react-router-dom` v6) |
| **Language** | TypeScript 5.8 | Strict mode via `tsconfig.app.json` |
| **UI components** | shadcn/ui | 49 pre-built components in `src/components/ui/` |
| **Styling** | Tailwind CSS 3.4 | Config in `tailwind.config.ts`, CSS variables in `src/index.css` |
| **State/Data** | TanStack React Query | For future server-state management |
| **Testing** | Vitest + React Testing Library | Config in `vitest.config.ts` |
| **Linting** | ESLint 9 + TypeScript ESLint | Config in `eslint.config.js` |
| **Planned backend** | Supabase (PostgreSQL + Auth + Realtime + Storage) | Not yet connected |
| **Planned payments** | Stripe Connect | Not yet integrated |

---

## 3. Project Structure

```
peer-pathway-project/
├── .lovable/                    # ❌ Lovable config  - DELETE
│   └── plan.md                  #    Lovable design plan
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── App.tsx                  # Root component  - routes defined here
│   ├── App.css                  # Minimal app-level styles
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Global styles + CSS variables + Tailwind
│   ├── vite-env.d.ts            # Vite type declarations
│   ├── components/
│   │   ├── ui/                  # 49 shadcn/ui primitives (accordion → tooltip)
│   │   ├── auth/
│   │   │   └── AuthLayout.tsx   # Shared auth page wrapper
│   │   ├── coach/
│   │   │   ├── BookingSidebar.tsx
│   │   │   ├── CoachAbout.tsx
│   │   │   ├── CoachEducation.tsx
│   │   │   ├── CoachExperience.tsx
│   │   │   ├── CoachHero.tsx
│   │   │   ├── CoachReviews.tsx
│   │   │   ├── CoachServices.tsx
│   │   │   ├── MobileBookingBar.tsx
│   │   │   └── booking/         # BookingDialog, DateTimePicker, ServiceSelector, etc.
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── DashboardMobileHeader.tsx
│   │   │   ├── NextSessionCard.tsx
│   │   │   ├── UpcomingSessionCard.tsx
│   │   │   ├── PastSessionCard.tsx
│   │   │   ├── RecommendedCoachCard.tsx
│   │   │   ├── SavedCoachCard.tsx
│   │   │   ├── SessionAlertBanner.tsx
│   │   │   └── ... (14 total)
│   │   ├── FeaturedCoaches.tsx   # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── PopularCategories.tsx
│   │   ├── Reviews.tsx
│   │   ├── WhyEarlyEdge.tsx
│   │   └── ... (15 total)
│   ├── pages/
│   │   ├── Index.tsx            # Landing page
│   │   ├── CoachProfile.tsx     # Individual coach profile
│   │   ├── BecomeACoach.tsx     # Coach recruitment page
│   │   ├── Login.tsx            # Student login
│   │   ├── Signup.tsx           # Student signup
│   │   ├── CoachSignup.tsx      # Coach signup
│   │   ├── ForgotPassword.tsx   # Password reset
│   │   ├── NotFound.tsx         # 404 page
│   │   └── dashboard/
│   │       ├── DashboardOverview.tsx
│   │       ├── DashboardBookings.tsx
│   │       └── DashboardSaved.tsx
│   ├── data/
│   │   ├── sampleBookings.ts    # Mock booking data
│   │   └── sampleCoach.ts       # Mock coach profile data
│   ├── hooks/
│   │   ├── use-mobile.tsx       # Mobile breakpoint detection
│   │   ├── use-toast.ts         # Toast notification hook
│   │   └── useScrollAnimation.tsx
│   ├── lib/
│   │   └── utils.ts             # cn() utility (clsx + tailwind-merge)
│   ├── types/
│   │   ├── booking.ts           # Booking-related TypeScript types
│   │   ├── coach.ts             # Coach-related TypeScript types
│   │   └── dashboard.ts         # Dashboard-related TypeScript types
│   └── test/
│       ├── setup.ts             # Test setup (jsdom + @testing-library/jest-dom)
│       └── example.test.ts      # Example test
├── components.json              # shadcn/ui config
├── eslint.config.js
├── index.html                   # ❌ Contains Lovable branding  - UPDATE
├── package.json                 # ❌ Contains lovable-tagger  - UPDATE
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts               # ❌ Imports lovable-tagger  - UPDATE
├── vitest.config.ts
├── README.md                    # ❌ Lovable documentation  - REPLACE
└── bun.lockb                    # Bun lockfile (from Lovable)  - can delete
```

---

## 4. Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Index` | Landing page (Hero, FeaturedCoaches, HowItWorks, etc.) |
| `/coach/:coachId` | `CoachProfile` | Individual coach profile with booking sidebar |
| `/become-a-coach` | `BecomeACoach` | Coach recruitment / info page |
| `/login` | `Login` | Student login (email/password toggle + Google OAuth placeholder) |
| `/signup` | `Signup` | Student signup |
| `/coach/signup` | `CoachSignup` | Coach signup |
| `/forgot-password` | `ForgotPassword` | Password reset |
| `/dashboard` | `DashboardLayout` → `DashboardOverview` | Student dashboard (overview with sessions, recommendations) |
| `/dashboard/bookings` | `DashboardBookings` | Upcoming / past bookings tabs |
| `/dashboard/saved` | `DashboardSaved` | Saved coaches list |
| `*` | `NotFound` | 404 catch-all |

---

## 5. Current State

**Frontend-only.** All data is **hardcoded mock data** in `src/data/`. There is no Supabase, Stripe, or any backend integration yet. Auth pages exist but don't actually authenticate. The dashboard renders dummy sessions, coaches, and bookings.

**What's built (design/UI):**
- ✅ Landing page (~80%)
- ✅ How It Works page
- ✅ Student auth flow (signup, login, forgot password)
- ✅ Coach auth pages (signup)
- ✅ Student dashboard (overview, bookings, saved coaches)
- ✅ Coach profile page with booking dialog
- ✅ Become a Coach page

**What's not built yet:**
- ❌ Supabase backend (schema, auth, RLS, APIs)
- ❌ Coach dashboard / settings / earnings
- ❌ Admin dashboard
- ❌ Stripe Connect integration
- ❌ Real authentication (currently mock)
- ❌ Messaging system
- ❌ Email automation
- ❌ Scheduling integration

---

## 6. Lovable Dependencies  - Complete Removal Checklist

Below is every Lovable-specific artifact in this project and how to remove it.

### Step 1: Delete the `.lovable/` directory

The `.lovable/` folder contains a `plan.md` used by Lovable's AI. It has no runtime or build significance.

```powershell
Remove-Item -Recurse -Force .lovable
```

### Step 2: Remove `lovable-tagger` from `vite.config.ts`

**Before:**
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

**After:**
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

### Step 3: Remove `lovable-tagger` from `package.json`

Remove this line from `devDependencies`:
```json
"lovable-tagger": "^1.1.13",
```

Also consider removing `bun.lockb` (Bun lockfile from Lovable's build pipeline). You'll use `package-lock.json` with npm instead.

### Step 4: Update `index.html`  - Replace Lovable branding

**Replace the entire `<head>` content with:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>EarlyEdge  - Peer Coaching for Students</title>
    <meta name="description" content="Book 1-on-1 coaching sessions with students and recent grads who just achieved what you're aiming for." />
    <meta name="author" content="EarlyEdge" />
    <meta property="og:title" content="EarlyEdge  - Peer Coaching for Students" />
    <meta property="og:description" content="Book 1-on-1 coaching sessions with students and recent grads who just achieved what you're aiming for." />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

> **Note:** The `og:image` and `twitter:image` meta tags pointed to `lovable.dev`  - removed. Add your own OG image once you have one.

### Step 5: Replace `README.md`

The current README is Lovable's template. Replace it entirely with your own project README. A minimal version:

```markdown
# EarlyEdge

Peer coaching marketplace for UK students. Book 1-on-1 sessions with coaches who recently achieved competitive outcomes.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:8080

## Tech Stack

- Vite + React 18 + TypeScript
- shadcn/ui + Tailwind CSS 3.4
- TanStack React Query
- Vitest for testing

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 8080) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
```

### Step 6: Delete `bun.lockb`

Lovable uses Bun internally. Since you'll use npm locally:

```powershell
Remove-Item bun.lockb
```

### Step 7: Reinstall dependencies

After all changes, do a clean install:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 7. Local Development Setup

### Prerequisites
- **Node.js** ≥ 18 (recommend v20 LTS)
- **npm** (comes with Node.js)
- **Git**

### Getting Started

```powershell
# 1. Navigate to the project
cd c:\Users\Dylan\.antigravity\peer-pathway-project

# 2. Complete all Lovable removal steps (Section 6 above)

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be available at **http://localhost:8080** with hot module replacement.

### Verification

After starting the dev server, verify these routes work:
- `http://localhost:8080`  - Landing page
- `http://localhost:8080/login`  - Login page
- `http://localhost:8080/signup`  - Signup page
- `http://localhost:8080/dashboard`  - Student dashboard (mock data)
- `http://localhost:8080/coach/1`  - Coach profile page
- `http://localhost:8080/become-a-coach`  - Coach recruitment page

### Running Tests

```powershell
npm run test        # Single run
npm run test:watch  # Watch mode
```

### Building for Production

```powershell
npm run build    # Output to dist/
npm run preview  # Preview the production build locally
```

---

## 8. Key Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build config, `@` path alias, dev server settings |
| `tailwind.config.ts` | Tailwind theme (fonts, colors, animations, spacing) |
| `tsconfig.json` | Root TS config, references app and node configs |
| `tsconfig.app.json` | App TS config with strict mode, path aliases |
| `components.json` | shadcn/ui config (component paths, style, aliases) |
| `postcss.config.js` | PostCSS plugins (tailwindcss, autoprefixer) |
| `vitest.config.ts` | Test runner config (jsdom, setup file, path alias) |
| `eslint.config.js` | ESLint flat config with React hooks + refresh plugins |

---

## 9. Design System Notes

The design system is defined in `src/index.css` (CSS variables) and `tailwind.config.ts` (theme extensions).

- **Fonts:** Inter (sans), Lora (serif), Space Mono (mono)  - loaded via `@fontsource` packages + Google Fonts
- **Color palette:** Primarily neutral/monochrome  - defined as HSL CSS variables (see `:root` in `index.css`)
- **Dark mode:** Supported via `.dark` class (CSS variables override)
- **Custom animations:** `float`, `float-reverse`, `fade-up`, `slide-in`, `shimmer`  - defined in both `index.css` and `tailwind.config.ts`
- **shadcn/ui:** 49 components available in `src/components/ui/`, configured via `components.json`

> **Note from `early.md`:** The intended design system uses DM Sans + Instrument Serif, strictly black-and-white. The current implementation uses Inter + Lora, which may need updating to match the spec.

---

## 10. Summary of Changes Needed

| # | Action | File(s) | Risk |
|---|--------|---------|------|
| 1 | Delete `.lovable/` directory | `.lovable/` | None |
| 2 | Remove `lovable-tagger` import + plugin | `vite.config.ts` | None |
| 3 | Remove `lovable-tagger` from deps | `package.json` | None |
| 4 | Replace Lovable branding | `index.html` | None |
| 5 | Replace Lovable README | `README.md` | None |
| 6 | Delete Bun lockfile | `bun.lockb` | None |
| 7 | Clean reinstall | `node_modules/`, `package-lock.json` | None |

**Total risk: Zero.** None of these changes affect any application code. The Lovable integration is entirely at the build/config layer and has no runtime coupling to your components or pages.
