# 🚀 Deployment Workflow SOP

**Owner:** Don (deploys) - anyone can push to staging  
**Last updated:** April 2026

---

## The Rule

**NEVER push directly to `main`.** All changes go through `staging` first.

```
You write code
     │
     ▼
Push to `staging` branch
     │
     ▼
Vercel auto-builds a PREVIEW URL
(something like: peer-pathway-project-abc123.vercel.app)
     │
     ▼
You open the preview URL → review the changes
     │
     ├── Looks good? → Merge staging into main
     │                  → Vercel auto-deploys to PRODUCTION
     │                  (webinar.yourearlyedge.co.uk)
     │
     └── Broken? → Fix on staging, push again, new preview URL
```

---

## How To: Push Changes to Staging

```bash
# 1. Make sure you're on the staging branch
git checkout staging

# 2. Pull latest from main first (stay in sync)
git pull origin main

# 3. Make your changes...

# 4. Commit
git add .
git commit -m "describe what you changed"

# 5. Push to staging → Vercel auto-creates preview
git push origin staging
```

Vercel will print a preview URL in the GitHub commit. You can also find it at:
**vercel.com → peer-pathway-project → Deployments** (look for the `staging` branch deployment)

---

## How To: Deploy to Production

Once you've reviewed the staging preview and it looks good:

```bash
# 1. Switch to main
git checkout main

# 2. Merge staging into main
git merge staging

# 3. Push → Vercel auto-deploys to production
git push origin main

# 4. Go back to staging for your next change
git checkout staging
git pull origin main  # sync staging with what just deployed
```

---

## How To: Emergency Fix (Hotfix)

If production is broken and you need to fix NOW:

```bash
# 1. Create a hotfix branch from main
git checkout main
git checkout -b hotfix/fix-description

# 2. Make the minimal fix

# 3. Push to get a preview URL
git push origin hotfix/fix-description

# 4. Verify the preview works

# 5. Merge directly to main (skip staging for emergencies)
git checkout main
git merge hotfix/fix-description
git push origin main

# 6. Also merge the fix into staging so it stays in sync
git checkout staging
git merge main
git push origin staging

# 7. Clean up
git branch -d hotfix/fix-description
```

---

## Vercel Preview URLs

Every push to any non-main branch automatically gets a preview URL from Vercel:

- **Production:** `webinar.yourearlyedge.co.uk` (from `main` branch)
- **Staging preview:** Auto-generated URL (from `staging` branch)
- **PR previews:** Auto-generated URL (from any pull request)

No extra configuration needed - Vercel does this by default.

---

## Edge Function Deployments (Supabase)

Edge functions are deployed SEPARATELY from the frontend:

```bash
# Deploy a specific function
HOME=/Users/dongraham/Desktop/peer-pathway-project \
npm_config_cache=/Users/dongraham/Desktop/peer-pathway-project/.npm-cache \
npx -y supabase functions deploy [function-name] --no-verify-jwt \
--project-ref cidnbhphbmwvbozdxqhe

# Deploy ALL functions
HOME=/Users/dongraham/Desktop/peer-pathway-project \
npm_config_cache=/Users/dongraham/Desktop/peer-pathway-project/.npm-cache \
npx -y supabase functions deploy --no-verify-jwt \
--project-ref cidnbhphbmwvbozdxqhe
```

> ⚠️ **Edge functions go directly to production.** There's no staging for Supabase edge functions on the free tier. Test locally or test with curl before deploying.
