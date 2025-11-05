# Deployment Guide for siggiewiendofyearrace.com

This guide will help you deploy the Is-Siggiewi End of Year Race website to your hosting provider with the custom domain **https://siggiewiendofyearrace.com**.

## Prerequisites

Your hosting provider must support:
- **Node.js** version 22.x or higher
- **MySQL** or **TiDB** database
- **Environment variables** configuration
- **HTTPS/SSL** certificates

## Deployment Steps

### 1. Domain Configuration

Update your DNS settings to point to your hosting provider:

```
A Record: siggiewiendofyearrace.com → Your server IP
CNAME: www.siggiewiendofyearrace.com → siggiewiendofyearrace.com
```

### 2. Upload Files

Upload all project files to your hosting server. The complete file structure should be:

```
siggiewi-race/
├── client/           # Frontend React application
├── server/           # Backend Express + tRPC API
├── drizzle/          # Database schema
├── shared/           # Shared constants and types
├── storage/          # S3 storage helpers
├── package.json      # Dependencies
└── ... (other config files)
```

### 3. Install Dependencies

SSH into your server and run:

```bash
cd /path/to/siggiewi-race
pnpm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database?ssl=true"

# Domain
VITE_APP_URL="https://siggiewiendofyearrace.com"

# App Branding
VITE_APP_TITLE="Is-Siggiewi End of Year Race"
VITE_APP_LOGO="/council-logo.png"

# Stripe Payment (Get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_live_..."
VITE_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Formspree Email (Get from https://formspree.io)
FORMSPREE_FORM_ID="your_form_id"

# JWT Secret (Generate a random 64-character string)
JWT_SECRET="your_secure_random_string_here"

# OAuth (Manus platform - can be replaced with your own auth)
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://auth.manus.im"
VITE_APP_ID="your_app_id"
OWNER_OPEN_ID="admin_user_id"
OWNER_NAME="Admin Name"

# S3 Storage (AWS S3 or compatible service)
S3_ENDPOINT="https://s3.amazonaws.com"
S3_REGION="us-east-1"
S3_BUCKET="your-bucket-name"
S3_ACCESS_KEY_ID="your_access_key"
S3_SECRET_ACCESS_KEY="your_secret_key"
```

### 5. Set Up Database

Create a MySQL database and run the schema migration:

```bash
pnpm db:push
```

This will create all necessary tables:
- `users` - User accounts
- `race_editions` - Race events by year
- `race_categories` - Race types (5KM, 1.5KM, 500M)
- `race_routes` - Route information with GPX files
- `registrations` - Race registrations
- `race_results` - Race results/rankings
- `race_photos` - Photo gallery
- `content_pages` - CMS content pages

### 6. Seed Initial Data

Populate the database with race categories and 2024 results:

```bash
npx tsx scripts/seed-data.mjs
npx tsx scripts/seed-2024-results.mjs
```

### 7. Build for Production

Build the optimized production bundle:

```bash
pnpm build
```

### 8. Start the Server

Start the production server:

```bash
NODE_ENV=production pnpm start
```

For production, use a process manager like **PM2**:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### 9. Configure SSL Certificate

Use **Let's Encrypt** for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d siggiewiendofyearrace.com -d www.siggiewiendofyearrace.com
```

Configure your web server (Nginx/Apache) to use the certificates.

### 10. Configure Reverse Proxy (Nginx Example)

Create an Nginx configuration:

```nginx
server {
    listen 80;
    server_name siggiewiendofyearrace.com www.siggiewiendofyearrace.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name siggiewiendofyearrace.com www.siggiewiendofyearrace.com;

    ssl_certificate /etc/letsencrypt/live/siggiewiendofyearrace.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/siggiewiendofyearrace.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Post-Deployment Configuration

### Update Logo via Settings

1. Access the admin panel at: https://siggiewiendofyearrace.com/admin
2. Go to **Settings** → **General**
3. Update **Website Logo** to: `/council-logo.png`
4. Save changes

### Configure Stripe

1. Log in to https://dashboard.stripe.com
2. Get your **Live API keys** (not test keys)
3. Add them to your environment variables
4. Test a registration to ensure payment works

### Configure Formspree

1. Create account at https://formspree.io
2. Create a new form
3. Copy the form ID
4. Add to `FORMSPREE_FORM_ID` environment variable

### Set Up Admin Account

The first user to log in with the `OWNER_OPEN_ID` will automatically become an admin.

## Backup Strategy

### Database Backup

```bash
# Daily backup script
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

### File Backup

```bash
# Backup uploaded files (GPX routes, photos)
tar -czf files_backup_$(date +%Y%m%d).tar.gz /path/to/uploads
```

## Monitoring

Monitor your application:
- **PM2 Logs**: `pm2 logs`
- **Server Status**: `pm2 status`
- **Restart**: `pm2 restart all`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database user has proper permissions
- Check if SSL is required by your database host

### Stripe Payment Failures
- Verify you're using **live** keys, not test keys
- Check Stripe dashboard for error logs
- Ensure webhook endpoints are configured (if using webhooks)

### Email Not Sending
- Verify `FORMSPREE_FORM_ID` is correct
- Check Formspree dashboard for submission logs
- Ensure form submissions aren't being blocked

## Support

For technical support:
- Check logs: `pm2 logs siggiewi-race`
- Review error messages in browser console
- Contact your hosting provider for server-specific issues

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] SSL certificate is installed and auto-renewing
- [ ] Database credentials are secure
- [ ] Stripe live keys are configured
- [ ] File upload directory has proper permissions
- [ ] Firewall rules are configured
- [ ] Regular backups are scheduled

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Server Details**: _____________

