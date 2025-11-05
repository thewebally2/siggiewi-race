# Formspree Email Notifications Setup Guide

## Overview

This website uses Formspree to send email notifications when participants register for the race. You'll receive an email for each new registration with all the participant details.

---

## Step-by-Step Setup

### 1. Create a Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Click **"Sign Up"** (top right)
3. Create an account with your email
4. Verify your email address

### 2. Create a New Form

1. Log in to your Formspree dashboard
2. Click **"+ New Form"**
3. Give it a name: "Race Registrations"
4. Click **"Create Form"**

### 3. Get Your Form ID

After creating the form, you'll see a form endpoint that looks like:

```
https://formspree.io/f/YOUR_FORM_ID
```

The `YOUR_FORM_ID` part is what you need. It will look something like: `xyzabc123`

### 4. Configure Email Settings

1. In your form settings, go to **"Email"** tab
2. Set **"Send submissions to"**: Your email address (e.g., race@siggiewi.com)
3. Enable **"Send me an email for each submission"**
4. Optionally customize the email template

### 5. Add Form ID to Your Website

You need to add one environment variable:

```
FORMSPREE_FORM_ID=xyzabc123
```

**How to add it:**

1. Access your website's hosting dashboard
2. Find "Environment Variables" or "Settings"
3. Add the variable above with your actual Form ID
4. Save and restart your application

---

## What Emails Will You Receive?

### Registration Email

Sent immediately when someone registers:

```
Subject: New Race Registration: [Participant Name]

New race registration received!

Registration Details:
- Name: John Doe
- Email: john@example.com
- Phone: +356 1234 5678
- Race: Is-Siggiewi End of Year Race 2025
- Category: 5KM Adult Race
- Registration ID: 123
- Payment Status: pending

View all registrations in the admin panel.
```

### Payment Confirmation Email

Sent when payment is completed:

```
Subject: Payment Confirmed: [Participant Name]

Payment confirmation received!

Payment Details:
- Name: John Doe
- Email: john@example.com
- Race: Is-Siggiewi End of Year Race 2025
- Category: 5KM Adult Race
- Amount Paid: €10.00

The participant will receive their confirmation email shortly.
```

---

## Formspree Plans

### Free Plan
- **50 submissions/month**
- Perfect for small races
- Email notifications included
- No credit card required

### Paid Plans
If you expect more than 50 registrations:
- **Gold**: $10/month - 1,000 submissions
- **Platinum**: $40/month - 10,000 submissions

You can upgrade anytime from your Formspree dashboard.

---

## Testing Email Notifications

### Test Registration

1. Go to your registration page
2. Fill in the form with test data
3. Complete the registration
4. Check your email inbox
5. You should receive a registration notification

### Check Formspree Dashboard

1. Log in to Formspree
2. Go to your "Race Registrations" form
3. Click **"Submissions"**
4. You'll see all form submissions listed

---

## Customizing Email Templates

### Change Email Subject

1. Go to form settings in Formspree
2. Navigate to **"Email"** tab
3. Edit **"Email Subject"**
4. Use variables like `{{name}}` or `{{email}}`

### Add Auto-Reply to Participants

1. In form settings, go to **"Email"** tab
2. Enable **"Send confirmation email to submitter"**
3. Customize the message participants receive
4. This confirms their registration

Example auto-reply:

```
Thank you for registering for the Is-Siggiewi End of Year Race!

We've received your registration and will send you more details closer to race day.

Registration Details:
Name: {{name}}
Category: {{category}}
Registration ID: {{registrationId}}

If you have any questions, please contact us at race@siggiewi.com

See you at the race!
```

---

## Spam Protection

Formspree includes built-in spam protection:

- reCAPTCHA integration (optional)
- Honeypot fields
- Rate limiting
- IP blocking

### Enable reCAPTCHA

1. Go to form settings
2. Navigate to **"Spam Protection"**
3. Enable **"reCAPTCHA"**
4. Follow the setup instructions

---

## Troubleshooting

### Not Receiving Emails

**Check 1: Verify Form ID**
- Make sure `FORMSPREE_FORM_ID` is correctly set
- Check for typos in the Form ID
- Restart your application after adding the variable

**Check 2: Check Spam Folder**
- Formspree emails might go to spam
- Add `noreply@formspree.io` to your contacts

**Check 3: Verify Email Address**
- Log in to Formspree dashboard
- Check the "Send submissions to" email is correct
- Make sure the email is verified

**Check 4: Check Submission Limit**
- Free plan has 50 submissions/month
- Check if you've reached the limit
- Upgrade plan if needed

### Emails Going to Spam

**Solution 1: Whitelist Formspree**
- Add `noreply@formspree.io` to your email contacts
- Create a filter to never send to spam

**Solution 2: Use Custom Domain**
- Upgrade to paid plan
- Configure custom domain in Formspree
- Emails will come from your domain

### Form Not Working

**Check Server Logs**
- Look for `[Formspree]` messages in server logs
- Common errors:
  - "FORMSPREE_FORM_ID not configured"
  - "Failed to send email: 404"
  - "Failed to send email: 403"

**Verify Form ID**
```bash
# Check if environment variable is set
echo $FORMSPREE_FORM_ID
```

---

## Advanced Configuration

### Multiple Email Recipients

1. Go to Formspree dashboard
2. Form settings → **"Email"**
3. Add multiple emails separated by commas:
   ```
   admin@siggiewi.com, race@siggiewi.com, info@siggiewi.com
   ```

### Email Notifications for Specific Categories

You can create different forms for different race categories:

1. Create 3 forms in Formspree:
   - "5KM Adult Registrations"
   - "1.5KM Kids Registrations"
   - "500M Family Registrations"

2. Modify the code to use different Form IDs based on category

3. Each form can send to different email addresses

### Webhook Integration

For advanced users, Formspree supports webhooks:

1. Go to form settings → **"Webhooks"**
2. Add your webhook URL
3. Receive real-time notifications
4. Integrate with other services (Slack, Discord, etc.)

---

## Alternative: Multiple Forms

If you want separate notifications for different purposes:

### Registration Form
```
FORMSPREE_REGISTRATION_FORM_ID=abc123
```

### Contact Form
```
FORMSPREE_CONTACT_FORM_ID=def456
```

### Support Form
```
FORMSPREE_SUPPORT_FORM_ID=ghi789
```

Update the code to use the appropriate Form ID for each purpose.

---

## Getting Help

### Formspree Support

- **Documentation**: [https://help.formspree.io](https://help.formspree.io)
- **Email**: support@formspree.io
- **Response time**: Usually within 24 hours

### Common Resources

- [Getting Started Guide](https://help.formspree.io/hc/en-us/articles/360013580813)
- [Email Settings](https://help.formspree.io/hc/en-us/articles/360017735154)
- [Spam Protection](https://help.formspree.io/hc/en-us/articles/360022811154)

---

## Checklist

### Initial Setup

- [ ] Formspree account created
- [ ] New form created
- [ ] Form ID copied
- [ ] Form ID added to environment variables
- [ ] Application restarted
- [ ] Test registration completed
- [ ] Email received successfully

### Optional Enhancements

- [ ] Auto-reply to participants enabled
- [ ] Email template customized
- [ ] Multiple recipients added
- [ ] Spam protection enabled
- [ ] Submission limit checked

---

## Quick Reference

### Environment Variable
```bash
FORMSPREE_FORM_ID=your_form_id_here
```

### Form Endpoint Format
```
https://formspree.io/f/YOUR_FORM_ID
```

### Email Fields Sent
- subject
- message
- name
- email
- phone
- category
- edition
- registrationId
- paymentStatus
- amount (for payment confirmations)

---

*For technical issues with the website integration, contact your web developer.*

