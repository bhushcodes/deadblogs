# Vercel Deployment Troubleshooting

## Admin Pages Not Opening / 404 Errors

If your admin pages are not loading on Vercel, follow these steps:

### 1. Check Environment Variables

Go to your Vercel project → **Settings** → **Environment Variables** and verify these are set:

```
✅ DATABASE_URL=postgresql://...
✅ ADMIN_EMAIL=your-email@example.com
✅ ADMIN_PASSWORD=your-secure-password
✅ NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
```

**After adding/changing environment variables, you MUST redeploy!**

### 2. Redeploy Your Application

After setting environment variables:

1. Go to **Deployments** tab
2. Click the **⋮** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger automatic deployment

### 3. Check Build Logs

If the deployment fails:

1. Go to your deployment in Vercel
2. Click on the failed deployment
3. Check the **Build Logs** for errors

Common errors:
- **Missing DATABASE_URL**: Add it in environment variables
- **Prisma client not generated**: The build command should include `prisma generate`
- **Module not found**: Check your imports and dependencies

### 4. Database Connection

Ensure your database is accessible:

```bash
# Test locally with production database
export DATABASE_URL="your-production-db-url"
npx prisma db push
```

If this fails, your database might not be accepting connections.

### 5. Admin Login Not Working

If `/admin/login` loads but login fails:

**Check Console Errors:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Try logging in
4. Look for errors

**Common Issues:**
- Cookies not being set (check HTTPS)
- Wrong credentials (verify ADMIN_EMAIL and ADMIN_PASSWORD in Vercel)
- Secure cookie issues (ensure you're using `https://`, not `http://`)

**Verify Environment Variables:**
```bash
# In Vercel dashboard
Settings → Environment Variables

ADMIN_EMAIL should match what you're typing
ADMIN_PASSWORD should match what you're typing
```

### 6. Pages Loading Blank/White Screen

Check browser console for JavaScript errors:

1. Press F12 to open DevTools
2. Check Console tab for red errors
3. Check Network tab to see if resources are loading

Common causes:
- Missing environment variables
- Build optimization issues
- Database connection failures

### 7. 500 Internal Server Error

This usually means a server-side error:

1. Check Vercel **Function Logs** (Runtime Logs)
2. Look for error messages
3. Common causes:
   - Database connection failed
   - Missing environment variables
   - Prisma client not generated

### 8. Specific Admin Routes Returning 404

If `/admin` works but `/admin/posts` returns 404:

This is likely a caching issue:
1. Go to Vercel **Settings** → **General**
2. Scroll to **Build & Development Settings**
3. Try changing **Output Directory** or **Install Command** (then change back)
4. Redeploy

Or clear Vercel cache:
```bash
vercel --prod --force
```

### 9. Database Migration Issues

If you see "Table doesn't exist" errors:

```bash
# Run migrations against production database
export DATABASE_URL="your-production-db-url"

# Option 1: Run migrations
npx prisma migrate deploy

# Option 2: Push schema directly (prototype mode)
npx prisma db push
```

### 10. Still Not Working?

**Full Reset Process:**

1. Delete all environment variables in Vercel
2. Re-add them one by one:
   ```
   DATABASE_URL
   ADMIN_EMAIL
   ADMIN_PASSWORD
   NEXT_PUBLIC_SITE_URL
   ```
3. Go to **Deployments** → Click latest → **Redeploy**
4. Wait for deployment to complete
5. Check Function Logs for any errors

**Test Locally First:**

```bash
# Clone production environment
export DATABASE_URL="your-production-db-url"
export ADMIN_EMAIL="your-admin-email"
export ADMIN_PASSWORD="your-admin-password"
export NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Build and run
npm run build
npm start

# Try accessing http://localhost:3000/admin/login
```

If it works locally but not on Vercel, the issue is with Vercel configuration.

## Quick Checklist

Run through this checklist:

- [ ] All environment variables are set in Vercel
- [ ] Environment variables are in all environments (Production, Preview, Development)
- [ ] Redeployed after setting environment variables
- [ ] Database is accessible from Vercel (check connection string)
- [ ] Prisma migrations have been run (`prisma db push` or `prisma migrate deploy`)
- [ ] Build completed successfully (check build logs)
- [ ] No errors in Function Logs (Runtime Logs)
- [ ] Accessing site via HTTPS (not HTTP)
- [ ] Browser cookies are enabled
- [ ] No ad-blockers interfering with requests

## Contact Support

If none of the above works:

1. Check Vercel Status: https://www.vercel-status.com/
2. Vercel Support: https://vercel.com/support
3. Create an issue in your repo with:
   - Deployment URL
   - Error messages from logs
   - Screenshots of the issue

---

**Most Common Fix:** Setting environment variables and redeploying! 🚀
