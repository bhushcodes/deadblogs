# DEADPOET Blog - Vercel Deployment Guide

This guide will walk you through deploying your DEADPOET blog to Vercel with the admin panel fully functional.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A PostgreSQL database (we recommend one of these options):
  - **Vercel Postgres** (easiest, integrated)
  - **Supabase** (free tier available)
  - **Neon** (serverless Postgres)
  - **Railway** (simple setup)

## Step 1: Set Up Your Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to **Storage** → **Create Database**
3. Select **Postgres**
4. Copy the `DATABASE_URL` connection string

### Option B: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **Database**
3. Copy the **Connection String** (Transaction mode)
4. Replace `[YOUR-PASSWORD]` with your database password

### Option C: Neon

1. Create a project at [neon.tech](https://neon.tech)
2. Copy the connection string from your project dashboard

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI if you haven't already:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd /Users/bhushan/Desktop/deadblogs
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts and configure your project

### Method 2: Using Vercel Dashboard

1. Push your code to GitHub (if not already done)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js - click **Deploy**

## Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string | From Step 1 |
| `ADMIN_EMAIL` | Your admin email | e.g., `admin@yourblog.com` |
| `ADMIN_PASSWORD` | Your admin password | Use a strong password |
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.vercel.app` | Your Vercel URL |

3. Click **Save** for each variable
4. **Redeploy** your application from the Deployments tab

## Step 4: Initialize Database

After your app is deployed, you need to run Prisma migrations:

### Option 1: Using Vercel CLI

```bash
# Set your database URL locally (temporarily)
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Or push schema directly (for prototyping)
npx prisma db push
```

### Option 2: Using your database provider's console

Run the SQL from your Prisma schema manually through your database provider's SQL editor.

## Step 5: Access Your Admin Panel

Your admin credentials are set via environment variables (from Step 3):
- **Admin URL**: `https://your-site.vercel.app/admin/login`
- **Email**: The `ADMIN_EMAIL` you set
- **Password**: The `ADMIN_PASSWORD` you set

**⚠️ IMPORTANT**: Make sure to use a strong password!

## Step 6: Access Your Blog

Your blog is now live! You can access:

- **Blog Homepage**: `https://your-site.vercel.app`
- **Admin Panel**: `https://your-site.vercel.app/admin`

## Admin Panel Features

- ✅ Create, edit, and delete posts
- ✅ Manage comments (approve/reject)
- ✅ View analytics (views, likes, shares)
- ✅ Publish/unpublish posts
- ✅ Feature posts on homepage
- ✅ Multi-language support (Marathi, Hindi, English)

## Troubleshooting

### Database Connection Issues

If you see "Can't reach database server" errors:

1. Check your `DATABASE_URL` format
2. Ensure your database allows connections from Vercel IPs
3. For Supabase, use **Transaction** mode connection string (not Session)

### Build Failures

If the build fails:

1. Check Vercel build logs
2. Ensure all environment variables are set
3. Run `npm run build` locally to test

### Prisma Client Not Generated

If you see "Cannot find module '@prisma/client'":

1. Ensure `postinstall` script is in package.json
2. Redeploy the application

### Admin Login Issues

If you can't log in:

1. Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in Vercel environment variables
2. Check that cookies are enabled in your browser
3. Ensure you're accessing the site via HTTPS (required for secure cookies)

## Post-Deployment Checklist

- [ ] Database is accessible
- [ ] Environment variables are set correctly (`DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`)
- [ ] Migrations have been run
- [ ] Admin login works at `/admin/login`
- [ ] Test creating a new post
- [ ] Test publishing a post
- [ ] Verify public pages load correctly
- [ ] Test comment submission and moderation

## Updating Your Site

To deploy updates:

```bash
# Commit your changes
git add .
git commit -m "Your update message"
git push

# Vercel will automatically deploy
```

Or manually trigger a deployment from the Vercel dashboard.

## Custom Domain

To add a custom domain:

1. Go to your Vercel project
2. Navigate to **Settings** → **Domains**
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` environment variable to your custom domain

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Congratulations! Your DEADPOET blog is now live on Vercel! 🎉**
