# MTN Analytics Portal

Modern analytics request management portal with OTP authentication, real-time updates, and Power BI integration.

## Tech Stack

Next.js 16 • TypeScript • SQLite + Prisma • NextAuth • Tailwind CSS • shadcn/ui

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your SMTP and auth credentials

# Initialize database
npx prisma generate
npx prisma migrate deploy

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Configuration

### 1. Environment Variables (.env.local)

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Gmail SMTP
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="MTN Portal <noreply@mtn.com>"
```

**Gmail Setup:** Enable 2FA → Generate App Password → Use as `EMAIL_PASS`

### 2. Configure Users (config/)

- **admins.json** - Users who can log in
- **analysts.json** - Users who can be assigned requests
- **departments.json** - Available departments
- **request-types.json** - Request categories

### 3. Power BI Dashboards (config/dashboards.json)

Replace placeholder URLs with your Power BI embed URLs.

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:studio    # Open Prisma Studio
```

## Usage

### Submit Request (Public)
Visit `/submit-request` → Fill form → Receive confirmation email

### Admin Login
Visit `/login` → Enter email → Get OTP → Enter code → Access dashboard

### Manage Requests (Admin)
Dashboard → View analytics
Requests → Assign, complete, edit, delete
Reports → Export CSV with date filters

### View Dashboards (Public)
Visit `/dashboards` → Select category → Browse Power BI reports

## Project Structure

```
mtn-analytics-portal/
├── app/                  # Next.js pages & API routes
│   ├── admin/           # Admin dashboard
│   ├── api/             # Backend endpoints
│   ├── dashboards/      # Power BI viewer
│   └── submit-request/  # Public form
├── components/          # React components
├── config/              # JSON configuration
├── lib/                 # Utilities (auth, email)
├── prisma/              # Database schema & migrations
└── public/              # Static assets
```

## Key Features

- 🔐 OTP authentication (5-min expiration)
- 📊 7 Power BI dashboard categories
- 📧 Automated email notifications
- 🔄 Real-time updates (SSE)
- 📈 CSV exports with date filtering
- 🌓 Dark/light mode
- 📱 Mobile responsive
- ♿ WCAG 2.1 AA accessible

## Troubleshooting

**Email not working:** Check SMTP credentials, use Gmail App Password
**OTP failing:** Verify email in `config/admins.json`
**Build errors:** Run `rm -rf .next && npm run build`
**Database issues:** Run `npx prisma migrate reset`

For production, use PostgreSQL instead of SQLite.

---

**Version:** 2.0

**Built with:** Next.js 16.1.1

**License:** © 2026 MTN. All rights reserved.
