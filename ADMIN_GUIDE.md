# Is-Siggiewi End of Year Race - Admin Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Managing Race Editions](#managing-race-editions)
3. [Managing Race Categories](#managing-race-categories)
4. [Managing Routes](#managing-routes)
5. [Viewing Registrations](#viewing-registrations)
6. [Uploading Race Results](#uploading-race-results)
7. [Managing Content Pages](#managing-content-pages)
8. [Stripe Payment Setup](#stripe-payment-setup)
9. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the Admin Panel

1. Navigate to your website URL
2. Click on "Admin" in the top navigation menu
3. Log in with your admin credentials
4. You'll see the admin dashboard with an overview of:
   - Total registrations
   - Pending payments
   - Active race editions
   - Recent registrations

---

## Managing Race Editions

Race editions represent each year's event. You can create multiple editions and manage them independently.

### Creating a New Race Edition

1. Go to **Admin → Editions**
2. Click **"Create New Edition"**
3. Fill in the details:
   - **Year**: The year of the race (e.g., 2025)
   - **Title**: Event title (e.g., "Is-Siggiewi End of Year Race 2025")
   - **Date**: Race date
   - **Description**: Brief description of the event
   - **Location**: Race location
   - **Start Time**: When the race starts
   - **Max Participants**: Maximum number of participants (optional)
   - **Registration Deadline**: Last date for registration
   - **Status**: 
     - **Draft**: Not visible to public
     - **Published**: Visible and open for registration
     - **Completed**: Past event, shown in Previous Editions
4. Click **"Create Edition"**

### Editing an Edition

1. Go to **Admin → Editions**
2. Find the edition you want to edit
3. Click the **Edit** button
4. Make your changes
5. Click **"Save Changes"**

### Changing Edition Status

- **Draft**: Use this while setting up a new race
- **Published**: Makes the race visible and allows registrations
- **Completed**: Moves the race to "Previous Editions" page

---

## Managing Race Categories

Each race edition can have multiple categories (e.g., 5KM Adult, 1.5KM Kids, 500M Family Fun).

### Adding a Category

1. Go to **Admin → Editions**
2. Select an edition
3. Scroll to the **Categories** section
4. Click **"Add Category"**
5. Fill in:
   - **Name**: Category name (e.g., "5KM Adult Race")
   - **Distance**: Distance in meters (e.g., 5000 for 5KM)
   - **Price**: Price in cents (e.g., 1000 for €10.00, or 0 for FREE)
   - **Min Age**: Minimum age requirement
   - **Max Age**: Maximum age (optional)
   - **Max Participants**: Category limit (optional)
   - **Description**: Additional details
6. Click **"Save"**

### Setting Prices

- Enter price in **cents** (100 cents = €1.00)
- Examples:
  - €10.00 = 1000 cents
  - €5.00 = 500 cents
  - FREE = 0 cents

---

## Managing Routes

Routes show participants the race path with GPX file downloads.

### Uploading a Route

1. Go to **Admin → Routes**
2. Click **"Upload Route"**
3. Select the **Category** this route belongs to
4. Upload the **GPX file** (from your GPS device or route planning tool)
5. Fill in route details:
   - **Distance**: Actual distance in meters
   - **Elevation Gain**: Total elevation gain in meters
   - **Description**: Route description and highlights
6. Click **"Upload"**

### Creating GPX Files

You can create GPX files using:
- **Strava**: Export your route as GPX
- **Garmin Connect**: Download route as GPX
- **Google Maps**: Use third-party tools to convert
- **AllTrails**: Export trail as GPX

---

## Viewing Registrations

### Accessing Registrations

1. Go to **Admin → Dashboard**
2. Scroll to **Recent Registrations** section
3. Or click **"View All Registrations"**

### Registration Information

Each registration shows:
- Participant name
- Email and phone
- Race category
- Payment status (Pending/Completed/Failed)
- Registration date
- Bib number (if assigned)

### Exporting Registrations

1. Go to registrations list
2. Click **"Export to CSV"**
3. Use the CSV file for:
   - Printing participant lists
   - Creating bib numbers
   - Email campaigns

---

## Uploading Race Results

After the race, upload results so participants can see their performance.

### Preparing the Results CSV

1. Go to **Admin → Results**
2. Click **"Download CSV Template"**
3. Open the template in Excel or Google Sheets
4. Fill in the columns:
   - **editionId**: The race edition ID (shown on the page)
   - **categoryId**: The category ID (shown on the page)
   - **position**: Finishing position (1, 2, 3, etc.)
   - **bibNumber**: Participant's bib number
   - **fullName**: Participant's full name
   - **time**: Finish time in format `HH:MM:SS` (e.g., `00:25:34`)
   - **gender**: `male`, `female`, or `other`
   - **ageCategory**: Age group (e.g., `16-29`, `30-39`, `40+`)

### Uploading Results

1. Save your completed CSV file
2. Go to **Admin → Results**
3. Select the **Race Edition**
4. Click **"Upload Results CSV"**
5. Choose your CSV file
6. Click **"Upload"**
7. Results will appear on the **Previous Editions** page

### Example CSV Format

```csv
editionId,categoryId,position,bibNumber,fullName,time,gender,ageCategory
1,1,1,101,John Doe,00:18:45,male,30-39
1,1,2,102,Jane Smith,00:19:12,female,30-39
1,1,3,103,Mike Johnson,00:19:45,male,40-49
```

---

## Managing Content Pages

Create custom pages for additional information.

### Creating a Page

1. Go to **Admin → Content**
2. Click **"Create Page"**
3. Fill in:
   - **Title**: Page title
   - **Slug**: URL-friendly name (e.g., `about-us`)
   - **Content**: Page content (supports Markdown)
   - **Published**: Check to make visible
4. Click **"Create"**

### Editing Pages

1. Find the page in the content list
2. Click **Edit**
3. Make changes
4. Click **"Save"**

### Linking to Pages

Pages are accessible at: `https://yoursite.com/page/[slug]`

Example: If slug is `about-us`, the URL is `https://yoursite.com/page/about-us`

---

## Stripe Payment Setup

### Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account if you don't have one
3. Navigate to **Developers → API Keys**
4. You'll see two keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

### Test vs Live Keys

- **Test keys** (`pk_test_...` and `sk_test_...`): For testing payments
- **Live keys** (`pk_live_...` and `sk_live_...`): For real payments

### Adding Keys to Your Website

1. Go to your website's admin dashboard
2. Navigate to **Settings → Environment Variables**
3. Add the following:
   - `STRIPE_SECRET_KEY`: Your secret key (sk_...)
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Your publishable key (pk_...)
4. Click **"Save"**
5. Restart your application

### Testing Payments

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- Use any future expiry date and any 3-digit CVC

### Going Live

1. Complete Stripe account verification
2. Replace test keys with live keys
3. Test with a small real transaction
4. Monitor payments in Stripe Dashboard

---

## Troubleshooting

### Common Issues

#### "Payment failed" error
- **Check**: Stripe keys are correctly configured
- **Check**: Using correct environment (test vs live)
- **Solution**: Verify keys in environment variables

#### Results not showing
- **Check**: Edition status is "completed"
- **Check**: CSV format matches template
- **Solution**: Re-upload CSV with correct format

#### Registration emails not sending
- **Check**: Email configuration in settings
- **Solution**: Contact hosting support for SMTP setup

#### GPX file won't upload
- **Check**: File is valid GPX format
- **Check**: File size is under 5MB
- **Solution**: Use GPX validation tool to check file

### Getting Help

For technical support:
1. Check this documentation first
2. Review error messages carefully
3. Contact your web developer
4. Email: [your-support-email]

---

## Best Practices

### Before Race Day

- [ ] Create new race edition
- [ ] Set up all categories with correct pricing
- [ ] Upload routes with GPX files
- [ ] Test registration process
- [ ] Test payment with Stripe test card
- [ ] Set registration deadline

### During Registration Period

- [ ] Monitor registrations daily
- [ ] Check for payment issues
- [ ] Export participant list weekly
- [ ] Send confirmation emails

### After the Race

- [ ] Collect race results
- [ ] Prepare results CSV
- [ ] Upload results
- [ ] Change edition status to "completed"
- [ ] Upload race photos to gallery

### For Next Year

- [ ] Review previous year's data
- [ ] Create new edition
- [ ] Update pricing if needed
- [ ] Update routes if changed
- [ ] Archive old registrations

---

## Quick Reference

### Admin URLs

- Dashboard: `/admin`
- Editions: `/admin/editions`
- Results: `/admin/results`
- Content: `/admin/content`

### Important Dates

- Open registration: 2-3 months before race
- Close registration: 1 week before race
- Upload results: Within 24 hours after race

### Contact Information

- Website: [your-website-url]
- Admin Email: [admin-email]
- Technical Support: [support-email]

---

*Last updated: October 2025*

