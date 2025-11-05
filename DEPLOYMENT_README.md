# Is-Siggiewi End of Year Race - Deployment Package

## 📦 Package Contents

This deployment package contains the complete source code for the Is-Siggiewi End of Year Race website, ready to be deployed to **https://siggiewiendofyearrace.com**.

## 🚀 Quick Start

1. **Extract the package** on your server
2. **Install dependencies**: `pnpm install`
3. **Configure environment**: Copy `.env.production.example` to `.env` and fill in your values
4. **Set up database**: `pnpm db:push`
5. **Seed initial data**: `npx tsx scripts/seed-data.mjs`
6. **Build**: `pnpm build`
7. **Start**: `NODE_ENV=production pnpm start`

## 📚 Documentation

- **DEPLOYMENT_GUIDE.md** - Complete step-by-step deployment instructions
- **ADMIN_GUIDE.md** - How to manage content through the CMS
- **STRIPE_SETUP.md** - Stripe payment integration guide
- **FORMSPREE_SETUP.md** - Email notification setup guide

## 🔑 Required Environment Variables

### Essential (Must Configure)
- `DATABASE_URL` - MySQL database connection
- `STRIPE_SECRET_KEY` - Stripe payment processing
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `FORMSPREE_FORM_ID` - Email notifications
- `JWT_SECRET` - Session security
- `S3_*` - File storage (GPX routes, photos)

### Optional (Can use defaults)
- `VITE_APP_URL` - Your domain URL
- `VITE_APP_TITLE` - Website title
- `VITE_APP_LOGO` - Logo path

See `.env.production.example` for complete list with descriptions.

## 🏗️ System Requirements

- **Node.js**: 22.x or higher
- **Package Manager**: pnpm (recommended) or npm
- **Database**: MySQL 8.0+ or TiDB
- **Storage**: S3-compatible object storage
- **SSL**: HTTPS certificate (Let's Encrypt recommended)

## 📊 Database Schema

The application uses the following tables:
- `users` - User accounts and authentication
- `race_editions` - Annual race events
- `race_categories` - Race types (5KM, 1.5KM, 500M)
- `race_routes` - Route information with GPX files
- `registrations` - Participant registrations
- `race_results` - Race results and rankings
- `race_photos` - Photo gallery
- `content_pages` - CMS-managed pages

## 🎨 Features Included

### Public Website
- ✅ Homepage with race information
- ✅ Race categories (5KM Adult, 1.5KM Kids, 500M Family Fun)
- ✅ Interactive route maps with GPX downloads
- ✅ Online registration with Stripe payments
- ✅ Previous editions with results
- ✅ Contact page
- ✅ Terms & Conditions

### Admin CMS
- ✅ Dashboard with statistics
- ✅ Race edition management
- ✅ Registration management
- ✅ Results upload (CSV import)
- ✅ Route management with GPX uploads
- ✅ Photo gallery management
- ✅ Content page editor

### Integrations
- ✅ Stripe payment processing
- ✅ Formspree email notifications
- ✅ S3 file storage
- ✅ Age validation (16+ for adult races)
- ✅ Responsive design (mobile-friendly)

## 🔐 Security Features

- JWT-based authentication
- Secure password hashing
- HTTPS enforcement
- CSRF protection
- SQL injection prevention (Drizzle ORM)
- Input validation
- Role-based access control (admin/user)

## 📱 Mobile Responsive

The website is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For deployment assistance:
1. Read **DEPLOYMENT_GUIDE.md** thoroughly
2. Check environment variables in `.env`
3. Review application logs
4. Contact your hosting provider for server issues

## 📝 License

© 2025 Kunsill Lokali Is-Siġġiewi. All rights reserved.

Website by [TheWebAlly](https://www.thewebally.com)

---

**Package Version**: 1.0.0  
**Build Date**: November 2025  
**Domain**: https://siggiewiendofyearrace.com

