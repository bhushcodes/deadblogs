# DEADPOET – Vintage Poetry & Stories

A vintage-themed literary site featuring original Marathi, Hindi, and English writing. Readers can browse by language, like and share posts, subscribe to RSS, and (optionally) comment. A protected admin workspace handles content management, analytics, and theme controls.

## 1. Prerequisites

- Node.js ≥ 18.17  
- npm (bundled with Node)  
- PostgreSQL instance (local or hosted)

## 2. Clone & Install

```bash
git clone https://github.com/bhushcodes/deadblogs.git deadpoet
cd deadpoet
npm install
```

## 3. Prepare PostgreSQL (local example)

```bash
psql postgres
CREATE USER deadpoet WITH PASSWORD 'Deadpoet@123';
ALTER ROLE deadpoet WITH LOGIN;
CREATE DATABASE deadpoet_blog OWNER deadpoet;
```

Update `DATABASE_URL` to match your actual credentials and host. After the database is ready, create a `.env` file based on `.env.example` and fill in `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`. If you enable the built-in admin dashboard for yourself, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` here and keep them private—these values are not committed to Git and should never be shared.

## 4. Apply Prisma Schema

```bash
npx prisma migrate dev --name init
```

## 5. Seed Sample Data

```bash
npm run db:seed
```

This inserts sample content. If you provided `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, the seed will create that account for your personal use.

## 6. Run the App

Development:

```bash
npm run dev
```

Open `http://localhost:3000`. (If you enabled the admin dashboard, it lives at `/admin`, protected by the credentials you set in `.env`.)

Production preview:

```bash
npm run build
npm start
```

If port 3000 is in use, stop the conflicting process (`lsof -i :3000` → `kill <pid>`), or run with `PORT=3001 npm start`.

## 8. Keep Secrets Safe

- Do **not** commit `.env`; keep only `.env.example` in Git.
- If credentials get exposed, rotate them (change DB password, update `.env`, re-seed if necessary).
- The admin username/password live solely in `.env`; treat them like any other secret.

## 9. Useful Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Dev server with hot reload            |
| `npm run lint`    | ESLint                                |
| `npm run build`   | Production build (Turbopack)          |
| `npm run db:seed` | Seed or re-seed admin + sample posts  |

## 10. Deployment Notes

- Provide the same environment variables on your hosting platform.
- Ensure PostgreSQL is reachable from the deployed app.
- Run `npm run build` then `npm start`, or let your platform handle those steps.

You’re now ready to launch DEADPOET!
