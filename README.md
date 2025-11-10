# Siggiewi Race - Modified Files for Vercel Deployment

This package contains the updated configuration files needed to fix the Vercel deployment build errors.

## Files Included

1. **vercel.json** - Updated Vercel deployment configuration
2. **package.json** - Updated build scripts for Vercel
3. **vite.config.ts** - Vite configuration (for reference)

## Installation Instructions

### Step 1: Replace the files in your project

Copy these files to the root of your `siggiewi-race` project:

```bash
# From your project root directory
cp vercel.json ./
cp package.json ./
cp vite.config.ts ./
```

### Step 2: Test the build locally

Before pushing to GitHub, test the build locally:

```bash
# Install dependencies
pnpm install

# Run the build
pnpm build

# Check if the build succeeded
ls -la dist/public/  # Should show your frontend files
ls -la dist/api/    # Should show the bundled server
```

### Step 3: If build succeeds

Push to GitHub:

```bash
git add vercel.json package.json vite.config.ts
git commit -m "Fix Vercel deployment configuration"
git push origin main
```

Then import your repository into Vercel and set the environment variables.

## Key Changes Made

### vercel.json
- Fixed `outputDirectory` to point to `dist/public` (where Vite builds the frontend)
- Added proper routing configuration to handle both static files and API requests
- Configured serverless function for Express backend
- Set Node.js 20.x runtime

### package.json
- Updated `build` script to output backend to `dist/api` instead of `dist`
- Added `vercel-build` script for Vercel's build process
- Updated `start` script to reference correct output path

## Environment Variables Required

When you deploy to Vercel, you'll need to set these in the Vercel dashboard:

- `DATABASE_URL` - Your PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (optional, can be in code)
- `FORMSPREE_FORM_ID` - Formspree form ID for email notifications
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_LOGO` - Logo URL (optional)

## Troubleshooting

If you still encounter build errors:

1. Check the Vercel build logs for specific error messages
2. Ensure all dependencies are installed: `pnpm install`
3. Verify Node.js version locally: `node --version` (should be 18+)
4. Check that all environment variables are set correctly in Vercel dashboard

## Next Steps

1. Test the build locally using the commands above
2. Push to GitHub
3. Import repository into Vercel
4. Configure environment variables in Vercel dashboard
5. Deploy and test in production

For more detailed deployment instructions, see VERCEL_DEPLOYMENT_GUIDE.md in the main project.
