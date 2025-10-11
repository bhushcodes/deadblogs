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

## 3. Run the App

Development:

```bash
npm run dev
```

Open `http://localhost:3000`.

Production preview:

```bash
npm run build
npm start
```

If port 3000 is in use, stop the conflicting process (`lsof -i :3000` → `kill <pid>`), or run with `PORT=3001 npm start`.

## 4. Keep Environment Variables Private

- Do **not** commit `.env`; keep only `.env.example` in Git.
- If secrets ever leak, rotate them immediately (change DB password, update `.env`, etc.).

> Any database and admin configuration stays local—update your `.env` privately with those values.

## 5. Useful Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Dev server with hot reload            |
| `npm run lint`    | ESLint                                |
| `npm run build`   | Production build (Turbopack)          |
| `npm run db:seed` | Seed or re-seed admin + sample posts  |

## 6. Deployment Notes

- Provide the same environment variables on your hosting platform.
- Ensure PostgreSQL is reachable from the deployed app.
- Run `npm run build` then `npm start`, or let your platform handle those steps.

You’re now ready to launch DEADPOET!
