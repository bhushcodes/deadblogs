# Vercel Deployment Guide

This guide will help you deploy your DEADPOET blog to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A PostgreSQL database (use [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))
3. GitHub repository with your code

## Step 1: Set Up Database

### Option A: Vercel Postgres
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the `DATABASE_URL` connection string

### Option B: Neon (Recommended)
1. Sign up at [neon.tech](https://neon.tech/)
2. Create a new project
3. Copy the connection string (PostgreSQL format)

### Option C: Supabase
1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database → Connection string (Direct connection)
4. Copy the connection string

## Step 2: Prepare Your Repository

The following files have been configured for Vercel deployment:

- ✅ `package.json` - Added `postinstall` script to generate Prisma client
- ✅ `package.json` - Removed `--turbopack` flag from build script
- ✅ `.env.example` - Template for environment variables
- ✅ `.gitignore` - Updated to allow `.env.example`

Make sure to commit and push these changes:

```bash
git add .
git commit -m "Configure for Vercel deployment"
git push
```

## Step 3: Deploy to Vercel

### 3.1 Import Your Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the repository containing DEADPOET

### 3.2 Configure Environment Variables

Before deploying, add these environment variables in Vercel:

1. Click on "Environment Variables"
2. Add the following variables:

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `DATABASE_URL` | Your PostgreSQL connection string | From your database provider (Step 1) |
| `AUTH_SECRET` | A random 32+ character string | Generate using: `openssl rand -base64 32` |

**To generate AUTH_SECRET:**
```bash
# On Mac/Linux
openssl rand -base64 32

# Or use an online generator
# https://generate-secret.vercel.app/32
```

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Step 4: Initialize Database

After the first deployment, you need to set up the database schema:

### 4.1 Push Prisma Schema

Run this locally (make sure your local `.env` has the production `DATABASE_URL`):

```bash
npx prisma db push
```

Or use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
vercel link

# Run migration
vercel env pull .env.local
npx prisma db push
```

### 4.2 Create Admin Account

You need to create an admin account to access `/admin`:

**Option A: Using Prisma Studio**
```bash
# Pull production env vars
vercel env pull .env.local

# Open Prisma Studio connected to production DB
npx prisma studio
```

Then manually create a User record with:
- email: your-email@example.com
- passwordHash: (hash your password using bcrypt)
- role: admin

**Option B: Using a seed script (Recommended)**

Run the seed script to create an admin user:

```bash
# Make sure DATABASE_URL points to production
npm run db:seed
```

The default admin credentials will be printed in the console. **Change these immediately!**

## Step 5: Verify Deployment

1. Visit your site: `https://your-project.vercel.app`
2. Go to admin: `https://your-project.vercel.app/admin/login`
3. Log in with your admin credentials
4. Create your first post!

## Common Issues & Solutions

### Issue: "AUTH_SECRET is not configured"
**Solution:** Make sure you've added the `AUTH_SECRET` environment variable in Vercel settings and redeployed.

### Issue: "PrismaClient is unable to run in this browser environment"
**Solution:** This usually means Prisma client wasn't generated. The `postinstall` script should handle this automatically. Try redeploying.

### Issue: Database connection errors
**Solution:** 
- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from Vercel's IP ranges
- For Supabase/Neon, ensure you're using the connection pooler URL

### Issue: Admin page returns 404
**Solution:** 
- Check that the build completed successfully
- Verify all files in `src/app/(admin)/admin/` were deployed
- Check Vercel function logs for errors

### Issue: "cookies() expects to be awaited"
**Solution:** This is already handled in the auth.ts file. If you see this, you're likely using an older Next.js version. Update to 15.5.4+.

## Updating Your Site

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically rebuild and deploy your changes.

## Environment Variables Management

To add or update environment variables:

1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add/Edit variables
4. Redeploy (deployments don't automatically pick up new env vars)

## Database Migrations

When you update your Prisma schema:

```bash
# 1. Update schema.prisma locally
# 2. Generate new client
npx prisma generate

# 3. Push to production database
npx prisma db push

# 4. Commit and push changes
git add prisma/schema.prisma
git commit -m "Update database schema"
git push
```

## Monitoring

- **Logs:** Vercel Dashboard → Your Project → Deployments → [Latest] → View Function Logs
- **Analytics:** Vercel Dashboard → Your Project → Analytics
- **Database:** Use your database provider's dashboard (Neon, Supabase, etc.)

## Security Checklist

- ✅ Never commit `.env` file
- ✅ Use strong passwords for admin accounts
- ✅ Keep `AUTH_SECRET` secure (32+ characters)
- ✅ Enable HTTPS only (Vercel does this automatically)
- ✅ Regularly update dependencies: `npm update`

## Support

If you encounter issues:

1. Check Vercel function logs
2. Check browser console for client-side errors
3. Review this guide's "Common Issues" section
4. Check [Next.js docs](https://nextjs.org/docs)
5. Check [Vercel docs](https://vercel.com/docs)

---

**Your site is now live! 🎉**

Access your admin panel at: `https://your-project.vercel.app/admin`
