# Sweety – Blood Glucose Tracker

Sweety is a web application where diabetes patients record up to 4 blood glucose readings per day and view daily, month-to-date, and previous-month reports. Built with Node.js + Express API, PostgreSQL, and React.

- **API**: Node.js + Express + TypeScript (ESM) + Prisma ORM + PostgreSQL + Redis (ioredis) + BullMQ
- **Client**: React 19 + Vite + Tailwind CSS + shadcn/ui components + `react-icons` + Recharts
- **Auth**: JWT stored in secure `httpOnly` cookies + bcrypt password hashing

---

## Monorepo Structure

```
├── package.json        # Root package.json with unified workspace scripts
├── .env                # Local PostgreSQL and Redis configuration
├── .env.example        # Environment variable template
├── turbo.json          # Turborepo task pipeline
├── pnpm-workspace.yaml # pnpm workspace definition
├── docker-compose.yml  # Docker compose for PostgreSQL, Redis, API, and Web
└── apps/
    ├── api/            # @sweety/api  — Express backend
    └── web/            # @sweety/web  — React frontend
```

---

## 1. Installation

Run from the root directory:

```bash
# Install dependencies for both apps from root
pnpm install
```

---

## 2. Environment Variables & Database Setup

A local PostgreSQL server and local Redis instance (e.g. running on **Docker Desktop**) can be used directly:

- **Local PostgreSQL URL**: `postgresql://sweety:sweety@localhost:5432/sweety?schema=public`
- **Local Redis URL**: `redis://localhost:6379`

### Environment Configuration:
Both `.env` in root and `apps/api/.env` are configured for local Docker Desktop services.

### Prisma Migrations & Seed:
Run directly from root:

```bash
# 1. Run migrations to create PostgreSQL tables
pnpm prisma:migrate

# 2. Seed the database with demo patient and doctor accounts + sample readings
pnpm seed
```

**Demo accounts:**
- **Patient**: `demo@sweety.local` / `Password123`
- **Doctor**: `doctor@sweety.local` / `Password123`

---

## 3. Running the Apps

### A. Run Locally from Root (Turborepo)

Starts both the backend (http://localhost:5000) and frontend (http://localhost:5173) in parallel:

```bash
pnpm dev
```

### B. Or Run with Docker Compose

Starts PostgreSQL, Redis, API, and Web client together:

```bash
docker compose up --build
```

- Web client: <http://localhost:5173>
- API: <http://localhost:5000>
- Health check: <http://localhost:5000/health>

---

## 4. Running Tests

Run all test suites across the monorepo from the root:

```bash
pnpm test
```

Or run per package:
```bash
# API tests (Jest)
pnpm --filter @sweety/api test

# Frontend tests (Vitest + React Testing Library)
pnpm --filter @sweety/web test
```

---

## 5. Building

```bash
# Typecheck and build both apps
pnpm build
```

---

## API Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| `GET` | `/health` | Health check (shows DB connection status) | No |
| `POST` | `/auth/signup` | Register user (Patient or Doctor) | No |
| `POST` | `/auth/login` | Login (sets secure httpOnly JWT cookie) | No |
| `POST` | `/auth/logout` | Clear JWT cookie | No |
| `GET` | `/auth/me` | Get current authenticated user | Yes |
| `GET` | `/readings?date=&page=&limit=` | List readings for date with pagination | Yes |
| `POST` | `/readings` | Create a reading (40–600 mg/dl, 4 slots) | Yes |
| `GET` | `/readings/:id` | Get single reading | Yes |
| `PUT` | `/readings/:id` | Update a reading | Yes |
| `DELETE`| `/readings/:id` | Delete a reading | Yes |
| `GET` | `/reports/daily?date=&patientId=` | Daily statistics and readings list | Yes |
| `GET` | `/reports/month-to-date?date=&patientId=` | Month-to-date summary | Yes |
| `GET` | `/reports/monthly?date=&patientId=` | Full previous month report | Yes |
| `GET` | `/doctors/patients` | List assigned patients (Doctor role) | Yes (Doctor) |
| `POST` | `/doctors/patients` | Assign a patient by ID (Doctor role) | Yes (Doctor) |

---

## Reading Validation Rules

| Rule | Error message |
|------|---------------|
| Value is required | `"Please enter a glucose value."` |
| Value must be a whole number between 40 and 600 | `"Value must be between 40 and 600 mg/dl."` |
| Only one reading per slot per day | `"You already have an After lunch reading for this date."` |
| Maximum 4 readings per day | `"You can add only 4 readings per day."` |
| Date cannot be in the future | `"Date cannot be in the future."` |

**Slots**: Morning (fasting), After breakfast, After lunch, After dinner.

---

## Reports

Each report computes:
- **Highest reading**
- **Lowest reading**
- **Average reading** (rounded to 1 decimal place)
- **Count of readings**
- Empty period state when no readings exist

---

## Design & UI System

- **Hallmark Aesthetics**: Purposeful, warm dark health aesthetic (`#0b0d0a` olive base, `#a8e06c` lime accent).
- **Custom Sweety Logo**: Pure mathematical SVG emblem with droplet geometry and embedded heart/glucose rhythm waveform.
- **Icons**: `react-icons` (`react-icons/ri`) across all components.
- **shadcn/ui**: Modular components (`Button`, `Card`, `Input`, `Label`, `Select`, `Badge`).

---

## Notes & Assumptions

- Auth uses JWT stored in an **httpOnly cookie** (XSS-safe).
- Dates are stored as UTC in PostgreSQL; the client sends ISO timestamps for date ranges.
- Optional Redis caching (5 min TTL) caches reports and invalidates automatically when readings change.
- BullMQ runs a daily reminder schedule at 9:00 AM.
- Docker Compose includes automatic migration and database seeding on container start.
