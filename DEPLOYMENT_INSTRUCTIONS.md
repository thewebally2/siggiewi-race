# Siggiewi Race - Deployment Instructions for Vercel

## Files Included

1. **vercel.json** - Vercel deployment configuration (FIXED)
2. **package.json** - Build scripts updated for Vercel

## What Was Fixed

The previous Vercel build was failing with: `"Function Runtimes must have a valid version"`

**Changes Made:**
- ✅ Removed invalid `functions` section from vercel.json
- ✅ Updated `routes` to properly point to built output files
- ✅ Changed package.json build script to output backend to `dist/api`
- ✅ Added `vercel-build` script for Vercel's build process

## Deployment Steps

### Step 1: Update Your Local Files

Copy the two files to your project root:

```bash
cd siggiewi-race
cp path/to/downloaded/vercel.json ./
cp path/to/downloaded/package.json ./
```

### Step 2: Test Locally (Recommended)

Before pushing to GitHub, test the build locally:

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Verify output directories
ls -la dist/public/   # Should contain index.html and other frontend files
ls -la dist/api/      # Should contain index.js (bundled server)

# Test the production build
pnpm start

# Visit http://localhost:3000 in your browser
# Verify homepage loads, navigation works, and no console errors
```

### Step 3: Push to GitHub

```bash
git add vercel.json package.json
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

### Step 4: Vercel Auto-Redeploy

- Vercel will automatically detect the push to GitHub
- Build should now succeed (no more runtime errors)
- Check Vercel Dashboard → Deployments for build status

### Step 5: Verify Deployment

Once Vercel build completes:

1. Visit your Vercel deployment URL
2. Check that:
   - ✅ Homepage loads correctly
   - ✅ Navigation menu works
   - ✅ Registration form loads
   - ✅ API endpoints respond (check browser console)
   - ✅ Database queries work
   - ✅ No JavaScript errors in console (F12)

## Expected Build Output

After `pnpm build`, you should see:

```
dist/
├── public/                    (Frontend - static files)
│   ├── index.html
│   ├── council-logo.png
│   └── assets/
│       ├── index-xxxxx.js
│       ├── index-xxxxx.css
│       └── ...
└── api/                       (Backend - serverless function)
    └── index.js
```

## Vercel Configuration

The corrected `vercel.json` now properly:

```json
{
  "version": 2,
  "buildCommand": "pnpm install && pnpm build",
  "outputDirectory": "dist/public",
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dist/api/index.js"      // API requests → backend
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"         // Everything else → frontend
    }
  ]
}
```

## Environment Variables

Make sure these are set in Vercel Dashboard (Project Settings → Environment Variables):

- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `FORMSPREE_FORM_ID` - Formspree form ID
- `JWT_SECRET` - Session signing secret

## Troubleshooting

### Build still fails?
1. Check Vercel build logs for specific error
2. Verify all environment variables are set
3. Ensure `pnpm install` completes successfully
4. Check that dist/public and dist/api exist after local build

### API endpoints return 404?
1. Verify routes in vercel.json are correct
2. Check that /dist/api/index.js exists after build
3. Ensure backend is properly bundled

### Database connection fails?
1. Verify DATABASE_URL is set in Vercel
2. Test connection string locally first
3. Check database is accessible from Vercel servers

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pnpm build` | Build frontend and backend |
| `pnpm start` | Start production server locally |
| `git push origin main` | Trigger Vercel auto-deploy |
| Check Vercel Dashboard | Monitor build progress and logs |

## Success Indicators

✅ Build completes without errors
✅ Frontend loads at your domain
✅ API endpoints work correctly
✅ Database queries succeed
✅ Stripe payments work
✅ Email notifications work

## Next Steps

1. Copy the two files to your project
2. Test locally with `pnpm build && pnpm start`
3. Push to GitHub
4. Monitor Vercel deployment
5. Verify everything works in production
6. Configure custom domain (siggiewiendofyearrace.com) in Vercel

Good luck with your deployment! 🚀
