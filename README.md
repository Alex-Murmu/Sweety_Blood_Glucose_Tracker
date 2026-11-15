# Sweety – Blood Glucose Tracker

Sweety is a small web app where a diabetes patient can record up to 4 blood glucose readings per day and view daily and monthly reports.

Built with:
- **API**: Node.js + Express + TypeScript (ESM) + Prisma ORM + PostgreSQL
- **Client**: React 19 + Vite
- **Auth**: JWT in httpOnly cookies, bcrypt password hashing

## Monorepo structure

```
apps/
  api/   # @sweety/api  — Express backend
  web/   # @sweety/web  — React frontend
```

Managed with **Turborepo** + **pnpm workspaces**.

## 1. Install

```bash
# Install dependencies for both workspace apps
pnpm install
```

## 2. Set up the database

Sweety uses **PostgreSQL**. You need a running PostgreSQL server at the `DATABASE_URL` (default `localhost:5432`).

1. Copy the example env file:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
2. Edit `apps/api/.env` and set your `DATABASE_URL` and `JWT_SECRET`.
3. Run the Prisma migration to create tables:
   ```bash
   cd apps/api
   pnpm prisma migrate dev --name init
   ```
4. Seed the database with a demo user and sample readings:
   ```bash
   pnpm seed
   ```

   Demo credentials: `demo@sweety.local` / `Password123`

> **Note:** PostgreSQL is not installed in this repository. You must have a PostgreSQL server running and reachable at the `DATABASE_URL` before running migrations or seeding.

## 3. Run the apps

From the repository root, run both apps in parallel (Turborepo):

```bash
pnpm dev
```

Or run them individually:

```bash
# API (http://localhost:5000)
cd apps/api
pnpm dev

# Client (http://localhost:5173)
cd apps/web
pnpm dev
```

## 4. Run tests

```bash
# API tests (Jest)
cd apps/api
pnpm test
```

## 5. Build

```bash
# Build both apps (TypeScript + Vite)
pnpm build
```

## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /health | Health check | No |
| POST | /auth/signup | Register user | No |
| POST | /auth/login | Login (sets JWT cookie) | No |
| POST | /auth/logout | Clear JWT cookie | No |
| GET | /auth/me | Get current user | Yes |
| GET | /readings?date= | List readings for a date | Yes |
| POST | /readings | Create a reading | Yes |
| GET | /readings/:id | Get a reading | Yes |
| PUT | /readings/:id | Update a reading | Yes |
| DELETE | /readings/:id | Delete a reading | Yes |
| GET | /reports/daily?date= | Daily report | Yes |
| GET | /reports/month-to-date?date= | Month-to-date report | Yes |
| GET | /reports/monthly?date= | Monthly (previous month) report | Yes |

## Reading validation rules

| Rule | Error message |
|------|---------------|
| Value is required | "Please enter a glucose value." |
| Value must be a whole number between 40 and 600 | "Value must be between 40 and 600 mg/dl." |
| Only one reading per slot per day | "You already have a {slot} reading for this date." |
| Maximum 4 readings per day | "You can add only 4 readings per day." |
| Date cannot be in the future | "Date cannot be in the future." |

Time slots: Morning (fasting), After breakfast, After lunch, After dinner.

## Reports

Each report shows highest, lowest, average (rounded to 1 decimal), and number of readings. Empty periods show a friendly empty state.

- **Daily**: readings for the selected date
- **Month-to-date**: 1st of the month → selected date
- **Monthly**: whole previous month

## Environment variables

See `apps/api/.env.example` for all required variables. Never commit real secrets.

## Seed script

`prisma/seed.ts` creates:
- User: `demo@sweety.local` / `Password123`
- 4 sample readings for today (one per slot)

Run with: `pnpm seed` (in `apps/api`)

## Notes / Assumptions

- Auth uses JWT stored in an **httpOnly cookie** (not localStorage).
- Dates are stored as UTC in PostgreSQL; the client sends the user's local date.
- PostgreSQL must be running locally (or remotely via `DATABASE_URL`) before migrations/seed.
- No Docker, Redis, charts, or pagination are included in the required scope (bonus items).
- The frontend is a single-page SPA without a routing library (auth-gated views render conditionally).
- With more time I would add: charts (Recharts), pagination, Redis caching for reports, Docker Compose, frontend tests, and a doctor role.

## License

MIT
