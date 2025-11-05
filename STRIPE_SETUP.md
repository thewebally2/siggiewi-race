# Stripe Payment Integration Setup Guide

## Overview

This website uses Stripe for secure payment processing. Participants pay for race registrations using credit/debit cards, and payments are processed through Stripe Checkout.

---

## Prerequisites

1. A Stripe account ([Sign up here](https://dashboard.stripe.com/register))
2. Access to your website's environment variables
3. Basic understanding of test vs live modes

---

## Step-by-Step Setup

### 1. Create a Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Fill in your business information:
   - Business name: "Is-Siggiewi Local Council" (or your organization name)
   - Business type: Non-profit / Government
   - Country: Malta
3. Verify your email address
4. Complete the account setup wizard

### 2. Get Your API Keys

#### Test Mode Keys (For Testing)

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Go to **Developers → API keys**
4. You'll see:
   - **Publishable key**: Starts with `pk_test_...`
   - **Secret key**: Starts with `sk_test_...` (click "Reveal" to see it)
5. Copy both keys

#### Live Mode Keys (For Real Payments)

1. Complete Stripe account verification first
2. Switch to **Live Mode** (toggle in top right)
3. Go to **Developers → API keys**
4. You'll see:
   - **Publishable key**: Starts with `pk_live_...`
   - **Secret key**: Starts with `sk_live_...`
5. Copy both keys

### 3. Add Keys to Your Website

You need to add two environment variables:

```
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

**How to add them:**

1. Access your website's hosting dashboard
2. Find "Environment Variables" or "Settings"
3. Add the two variables above with your actual keys
4. Save and restart your application

**Security Note:** Never commit these keys to Git or share them publicly!

### 4. Test the Integration

#### Using Test Cards

Stripe provides test card numbers that simulate different scenarios:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Declined Payment:**
- Card: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

**More test cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

#### Testing Steps

1. Go to your registration page
2. Fill in the registration form
3. Select a paid race category (not the free 500M run)
4. Click "Continue to Payment"
5. You'll be redirected to Stripe Checkout
6. Use test card `4242 4242 4242 4242`
7. Complete the payment
8. You should be redirected back with success message

#### Verify in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in **Test Mode**
3. Go to **Payments**
4. You should see your test payment listed

### 5. Go Live

Once you've tested everything and are ready to accept real payments:

#### Complete Account Verification

1. Go to Stripe Dashboard
2. Complete all required verification steps:
   - Business details
   - Bank account information (for receiving payouts)
   - Identity verification
   - Tax information

This process can take 1-3 business days.

#### Switch to Live Keys

1. Get your live API keys (see Step 2 above)
2. Update your environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
   ```
3. Save and restart your application

#### Test with Real Payment

1. Make a small real payment (€1-2) to verify everything works
2. Check that the payment appears in your Stripe Dashboard (Live Mode)
3. Verify you receive the confirmation email
4. Refund the test payment if needed

---

## Understanding Stripe Fees

Stripe charges a fee for each successful payment:

- **EU cards**: 1.5% + €0.25 per transaction
- **Non-EU cards**: 2.9% + €0.25 per transaction

**Example:**
- Registration price: €10.00
- Stripe fee: €0.40 (for EU card)
- You receive: €9.60

**Note:** Consider including Stripe fees in your pricing or absorbing them.

---

## Receiving Payouts

### Setting Up Bank Account

1. Go to **Settings → Bank accounts and scheduling**
2. Add your bank account details
3. Verify the account (Stripe will make small test deposits)
4. Set payout schedule:
   - **Daily**: Automatic daily transfers
   - **Weekly**: Every Monday
   - **Monthly**: First day of month

### Payout Timeline

- Payments are held for 2-7 days (standard for new accounts)
- After verification, payouts typically arrive in 2 business days
- You can see pending and paid-out amounts in Dashboard

---

## Handling Refunds

### Full Refund

1. Go to **Payments** in Stripe Dashboard
2. Find the payment
3. Click **Refund**
4. Select **Full refund**
5. Add a reason (optional)
6. Click **Refund**

### Partial Refund

1. Follow steps above
2. Select **Partial refund**
3. Enter amount to refund
4. Click **Refund**

**Note:** Stripe fees are not refunded.

---

## Monitoring Payments

### Dashboard Overview

Your Stripe Dashboard shows:
- Total revenue
- Successful payments
- Failed payments
- Refunds
- Balance available for payout

### Email Notifications

Stripe sends emails for:
- Successful payments
- Failed payments
- Disputes/chargebacks
- Payouts

Configure notifications in **Settings → Notifications**

### Webhooks (Advanced)

Webhooks notify your website of payment events in real-time. This is already configured in your website code.

---

## Troubleshooting

### "Stripe is not configured" Error

**Problem:** API keys are missing or incorrect

**Solution:**
1. Check environment variables are set correctly
2. Verify keys start with `pk_` and `sk_`
3. Make sure you're using matching test/live keys
4. Restart your application after adding keys

### Payments Failing

**Problem:** Cards being declined

**Possible causes:**
1. Using test card in live mode (or vice versa)
2. Insufficient funds on card
3. Card expired
4. Bank blocking payment

**Solution:**
1. Verify you're in correct mode (test/live)
2. Try a different card
3. Contact participant to check with their bank

### Not Receiving Payouts

**Problem:** Money not arriving in bank account

**Solution:**
1. Check payout schedule in Stripe Dashboard
2. Verify bank account is correctly added
3. Check if account verification is complete
4. Look for any holds or issues in Dashboard

### Duplicate Charges

**Problem:** Participant charged twice

**Solution:**
1. Check Stripe Dashboard for duplicate payments
2. Refund the duplicate charge
3. Contact participant to confirm
4. Check your website's payment flow for bugs

---

## Security Best Practices

### Protecting API Keys

- ✅ Store keys in environment variables
- ✅ Never commit keys to Git
- ✅ Use different keys for test and live
- ✅ Rotate keys if compromised
- ❌ Never share keys publicly
- ❌ Don't hardcode keys in source code

### PCI Compliance

Good news! Since you're using Stripe Checkout:
- Stripe handles all card data
- You never see or store card numbers
- Stripe is PCI DSS Level 1 certified
- Your website is automatically compliant

### Monitoring for Fraud

1. Enable Stripe Radar (fraud detection)
2. Set up email alerts for suspicious activity
3. Review high-value transactions manually
4. Block payments from high-risk countries if needed

---

## Getting Help

### Stripe Support

- **Documentation**: [https://stripe.com/docs](https://stripe.com/docs)
- **Support**: [https://support.stripe.com](https://support.stripe.com)
- **Phone**: Available for verified accounts
- **Chat**: Available in Dashboard

### Common Resources

- [Testing Guide](https://stripe.com/docs/testing)
- [Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [API Reference](https://stripe.com/docs/api)
- [Security Best Practices](https://stripe.com/docs/security)

---

## Checklist

### Before Launch

- [ ] Stripe account created
- [ ] Test mode keys added to website
- [ ] Test registration completed successfully
- [ ] Test payment visible in Stripe Dashboard
- [ ] Account verification started
- [ ] Bank account added for payouts

### Going Live

- [ ] Account verification completed
- [ ] Live mode keys added to website
- [ ] Test payment with real card successful
- [ ] Payout schedule configured
- [ ] Email notifications enabled
- [ ] Refund policy documented

### Ongoing

- [ ] Monitor Dashboard weekly
- [ ] Review failed payments
- [ ] Process refunds promptly
- [ ] Check payout schedule
- [ ] Update keys if needed

---

## Quick Reference

### API Keys Location
Dashboard → Developers → API keys

### Test Card Numbers
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
```

### Support Links
- Dashboard: https://dashboard.stripe.com
- Docs: https://stripe.com/docs
- Support: https://support.stripe.com

---

*For technical issues with the website integration, contact your web developer.*

