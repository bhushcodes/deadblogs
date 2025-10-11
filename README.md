# DEADPOET – Vintage Poetry & Stories

A vintage-themed literary site featuring original Marathi, Hindi, and English writing. Readers can browse by language, like and share posts, subscribe to RSS, and (optionally) comment. A protected admin workspace handles content management, analytics, and theme controls.

## 1. Prerequisites

- Node.js ≥ 18.17  
- npm (bundled with Node)  
- PostgreSQL instance (local or hosted)

## 2. Clone & Install

```bash
git clone <repo-url> deadpoet
cd deadpoet
npm install
```

## 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set:

- `DATABASE_URL` — e.g. `postgresql://user:pass@localhost:5432/deadpoet_blog?schema=public`
- `AUTH_SECRET` — long random string for session signing
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` — admin login credentials
- `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000`

> URL-encode special characters in the password (`@` → `%40`).

## 4. Prepare PostgreSQL (local example)

```bash
psql postgres
CREATE USER deadpoet WITH PASSWORD 'Deadpoet@123';
ALTER ROLE deadpoet WITH LOGIN;
CREATE DATABASE deadpoet_blog OWNER deadpoet;
```

Update `DATABASE_URL` in `.env` to match your actual credentials and host.

## 5. Apply Prisma Schema

```bash
npx prisma migrate dev --name init
```

## 6. Seed Sample Data

```bash
npm run db:seed
```

Creates the admin account (using `.env` values) and sample posts.

## 7. Run the App

Development:

```bash
npm run dev
```

Open `http://localhost:3000`, admin dashboard at `/admin`.

Production preview:

```bash
npm run build
npm start
```

If port 3000 is in use, stop the conflicting process (`lsof -i :3000` → `kill <pid>`), or run with `PORT=3001 npm start`.

## 8. Keep Secrets Safe

- Do **not** commit `.env`; keep only `.env.example` in Git.
- If credentials get exposed, rotate them (change DB password, update `.env`, re-seed if necessary).

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
