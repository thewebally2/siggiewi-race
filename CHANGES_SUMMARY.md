# Summary of Changes for Vercel Deployment Fix

## Problem
The Vercel build was failing with "No Output Directory named dist found" error because the configuration was not properly set up for Vercel's serverless platform.

## Root Causes
1. Vite builds frontend to `dist/public` but vercel.json was looking for `dist`
2. Backend bundling output directory wasn't aligned with Vercel's expectations
3. Routes configuration was missing to properly handle API requests vs static files

## Solutions Implemented

### 1. vercel.json (NEW/UPDATED)
**Purpose:** Tells Vercel how to build and deploy your application

**Key Changes:**
```json
{
  "version": 2,
  "buildCommand": "pnpm install && pnpm build",
  "outputDirectory": "dist/public",  // ← Fixed: was pointing to wrong location
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/_core/index.ts"  // ← API requests go to Express server
    },
    {
      "src": "/(.*)",
      "dest": "dist/public/$1"  // ← Everything else goes to static files
    }
  ]
}
```

**Why:** 
- Vercel needs to know where to find the built frontend files
- Routes configuration ensures API calls go to the backend, not static files
- Proper routing prevents 404 errors on API endpoints

### 2. package.json (UPDATED)
**Changes to build script:**

Before:
```json
"build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

After:
```json
"build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/api"
```

**Why:** 
- Backend now bundles to `dist/api` instead of `dist`
- Keeps frontend and backend outputs separate and organized
- Aligns with Vercel's serverless function expectations

**Also updated:**
```json
"start": "NODE_ENV=production node dist/api/index.js"  // ← Updated path
"vercel-build": "pnpm build"  // ← Added for Vercel's build process
```

### 3. vite.config.ts (REFERENCE ONLY)
No changes needed - this file is already correctly configured:
```typescript
build: {
  outDir: path.resolve(import.meta.dirname, "dist/public"),  // ← Already correct
  emptyOutDir: true,
}
```

## How to Test Locally

```bash
# 1. Install dependencies
pnpm install

# 2. Run the build
pnpm build

# 3. Verify output directories exist
ls -la dist/public/   # Should contain index.html and other frontend files
ls -la dist/api/      # Should contain index.js (bundled server)

# 4. Start the production server
pnpm start

# 5. Test in browser
# Visit http://localhost:3000
# Check that pages load and API calls work
```

## Deployment Flow

1. **Local Build** (when you run `pnpm build`):
   - Vite builds React app → `dist/public/`
   - esbuild bundles Express server → `dist/api/index.js`

2. **Vercel Build** (when you push to GitHub):
   - Vercel runs `pnpm install && pnpm build`
   - Gets the same output: `dist/public/` and `dist/api/`
   - Uses `vercel.json` to configure routing

3. **Vercel Runtime**:
   - Static files from `dist/public/` served directly
   - API requests routed to serverless function (`dist/api/index.js`)

## Environment Variables

When deploying to Vercel, set these in the Vercel dashboard:

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `STRIPE_SECRET_KEY` | Stripe payments | `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe frontend | `pk_live_...` |
| `FORMSPREE_FORM_ID` | Email notifications | `f/xxxxx` |
| `JWT_SECRET` | Session signing | Any random string |
| `VITE_APP_LOGO` | Website logo | `/council-logo.png` |

## Next Steps

1. ✅ Copy these files to your project
2. ✅ Test build locally with `pnpm build`
3. ✅ Push to GitHub
4. ✅ Import repository into Vercel
5. ✅ Set environment variables in Vercel dashboard
6. ✅ Deploy and test

## Common Issues & Solutions

### Issue: "No Output Directory named dist found"
**Solution:** Ensure `outputDirectory` in vercel.json is `dist/public`

### Issue: API endpoints return 404
**Solution:** Check that routes in vercel.json are correctly configured

### Issue: Database connection fails in production
**Solution:** Verify `DATABASE_URL` is set in Vercel environment variables

### Issue: Stripe/Formspree not working
**Solution:** Check that `STRIPE_SECRET_KEY` and `FORMSPREE_FORM_ID` are set

## Questions?

Refer to:
- `VERCEL_DEPLOYMENT_GUIDE.md` - Step-by-step deployment guide
- `STRIPE_SETUP.md` - Stripe integration setup
- `FORMSPREE_SETUP.md` - Email notifications setup
