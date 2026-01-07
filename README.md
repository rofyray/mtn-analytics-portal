# MTN Analytics Portal

Modern analytics request management portal with OTP authentication, real-time updates, and Power BI integration.

## Tech Stack

Next.js 16 • TypeScript • PostgreSQL + Prisma • NextAuth • Tailwind CSS • shadcn/ui

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your database and SMTP credentials

# Initialize database (see Database Setup below)
npm run db:generate
npx prisma migrate deploy

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Setup

### Option A: Prisma Accelerate (Recommended for Serverless)

Uses Prisma's connection pooling proxy - ideal for Vercel, Netlify, etc.

1. Create a project at [Prisma Data Platform](https://console.prisma.io)
2. Get your Accelerate connection string
3. Set environment variables:
   ```env
   DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
   DATABASE_POSTGRES_URL="postgres://user:pass@host:5432/db"  # Direct URL for migrations
   ```
4. Generate client: `npm run db:generate`

### Option B: Direct PostgreSQL (or any SQL DB)

Connect directly to any PostgreSQL, MySQL, or SQLite database.

1. Update `lib/prisma.ts` - remove Accelerate extension:
   ```typescript
   // Change this:
   import { withAccelerate } from '@prisma/extension-accelerate'
   return new PrismaClient().$extends(withAccelerate())

   // To this:
   return new PrismaClient()
   ```

2. Update `package.json` scripts - remove `--no-engine`:
   ```json
   "build": "prisma generate && next build",
   "db:generate": "prisma generate",
   ```

3. Set environment variable:
   ```env
   DATABASE_URL="postgres://user:pass@host:5432/database"
   ```

4. For MySQL/SQLite, also update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"  // or "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

## Configuration

### Environment Variables (.env.local)

```env
# Database
DATABASE_URL="prisma+postgres://..."          # Accelerate URL (or direct postgres://)
DATABASE_POSTGRES_URL="postgres://..."        # Direct URL for migrations (Accelerate only)

# Auth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# SMTP (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="MTN Portal <noreply@mtn.com>"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Gmail Setup:** Enable 2FA → Generate App Password → Use as `SMTP_PASSWORD`

### Users & Settings (config/)

| File | Purpose | How to Update |
|------|---------|---------------|
| `admins.json` | Users who can log in | Edit JSON → run `npx prisma db seed` |
| `analysts.json` | Users assignable to requests | Edit JSON → run `npx prisma db seed` |
| `departments.json` | Department dropdown options | Edit JSON → redeploy |
| `request-types.json` | Request type dropdown options | Edit JSON → redeploy |
| `dashboards.json` | Power BI embed URLs | Edit JSON → redeploy |

**Note:** Admins and analysts are stored in the database (JSON is seed data). Other configs are read directly from JSON files.

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
npx prisma db seed   # Sync admins/analysts from config to database
```

## Usage

### Submit Request (Public)
Visit `/submit-request` → Fill form → Receive confirmation email

### Admin Login
Visit `/login` → Enter email → Get OTP → Enter code → Access dashboard

### Manage Requests (Admin)
Dashboard → View analytics | Requests → Assign, complete, edit | Reports → Export CSV

### View Dashboards (Public)
Visit `/dashboards` → Select category → Browse Power BI reports

## Project Structure

```
├── app/                  # Next.js pages & API routes
│   ├── admin/           # Admin dashboard
│   ├── api/             # Backend endpoints
│   └── submit-request/  # Public form
├── components/          # React components
├── config/              # JSON configuration
├── lib/                 # Utilities (auth, email, prisma)
└── prisma/              # Database schema
```

## Key Features

- OTP authentication (5-min expiration)
- 7 Power BI dashboard categories
- Automated email notifications
- Real-time updates (SSE)
- CSV exports with date filtering
- Dark/light mode
- Mobile responsive

## Troubleshooting

**Email not working:** Check SMTP credentials, use Gmail App Password
**OTP failing:** Verify email in `config/admins.json`
**Build errors:** Run `rm -rf .next && npm run build`
**Database issues:** Run `npx prisma migrate reset`
**Prisma Accelerate errors:** Ensure `DATABASE_URL` starts with `prisma+postgres://`

---

**Version:** 2.0 • **Built with:** Next.js 16.1.1 • **License:** © 2026 MTN
