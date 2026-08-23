# Car Dealership Inventory System

A full-stack inventory management application for a car dealership. Authenticated users can browse, search, filter, and purchase vehicles; administrators can additionally add, edit, delete, and restock inventory. Built with React/TypeScript on the frontend and Node/Express/TypeScript/PostgreSQL on the backend, following TDD.

## Description

Ridgeline Motors' inventory team needed a small, reliable web app to replace an ad-hoc spreadsheet: staff should be able to see live stock, and shoppers (any registered user) should be able to search, filter, and "purchase" a vehicle, which decrements inventory. Admin staff manage the catalog. All business rules — auth, authorization, and inventory correctness — are enforced on the backend; the frontend is a thin, honest reflection of server state.

## Features

- User registration and login with hashed passwords (bcrypt) and JWT authentication
- Two roles — `USER` and `ADMIN` — enforced on every backend endpoint, not just hidden in the UI
- Vehicle inventory browsing with search (make/model/category, case-insensitive), category/availability filtering, and price/name sorting
- Purchase flow that atomically decrements stock and can never drive quantity negative, even under concurrent requests
- Admin inventory management: add, edit, delete (with confirmation), and restock vehicles
- Persistent PostgreSQL storage with schema constraints (`price > 0`, `quantity >= 0`, unique email, `role` enum)
- Loading / empty / error / success / validation / unauthorized UI states throughout
- Responsive, accessible layout (semantic HTML, labeled fields, visible focus states)

## Tech stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, lucide-react
**Backend:** Node.js, TypeScript, Express, JWT (`jsonwebtoken`), bcryptjs, Zod (validation)
**Database:** PostgreSQL (`pg`)
**Testing:** Vitest, Supertest (backend), Vitest + React Testing Library (frontend)

## Architecture

```
backend/src/
  routes/        Express routers — URL + HTTP method + middleware wiring only
  controllers/   Thin request/response glue; no business logic
  services/      Business logic and all SQL (auth.service.ts, vehicle.service.ts)
  middleware/    requireAuth, requireRole, validate (zod), centralized error handler
  db/            schema.sql, seed.sql, migrate.ts, seed.ts
  utils/         jwt.ts, AppError.ts, validation.ts (zod schemas)
  config/        env.ts, db.ts (pg Pool)

frontend/src/
  pages/         LoginPage, RegisterPage, DashboardPage
  components/    VehicleCard, SearchBar, Filters, VehicleFormModal, RestockModal,
                 ConfirmDeleteDialog, Toast, ProtectedRoute
  api/           client.ts (fetch wrapper + auth header + error normalization),
                 auth.ts, vehicles.ts
  context/       AuthContext.tsx (login/register/logout, persisted token)
  hooks/         useVehicles.ts
  types/         shared TypeScript types
```

Authorization is enforced with `requireAuth` (valid JWT) and `requireRole("ADMIN")` middleware on every mutating vehicle route; the frontend only uses role for UI convenience (hiding buttons), never as the actual security boundary.

## Database

**`users`** — `id, name, email (unique), password_hash, role (USER|ADMIN), created_at, updated_at`
**`vehicles`** — `id, make, model, category, price (>0), quantity (>=0), created_at, updated_at`

See `backend/src/db/schema.sql` for full constraints and triggers (auto-updating `updated_at`).

## API documentation

All responses follow `{ success: boolean, data?, message?, errors? }`. All `/api/vehicles*` routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Purpose | Body | Notes |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | none | Create a USER account | `{ name, email, password }` | 201; 409 on duplicate email; 400 on invalid input |
| POST | `/api/auth/login` | none | Authenticate | `{ email, password }` | 200 with `{ user, token }`; 401 on bad credentials |
| GET | `/api/vehicles` | user | List inventory | — | Query: `q`, `category`, `available`, `sort` |
| GET | `/api/vehicles/search` | user | Search inventory | — | Same query params as above |
| GET | `/api/vehicles/:id` | user | Get one vehicle | — | 404 if missing |
| POST | `/api/vehicles` | admin | Create vehicle | `{ make, model, category, price, quantity }` | 201; 403 for non-admin |
| PUT | `/api/vehicles/:id` | admin | Update vehicle | any subset of the above | 403 for non-admin; 404 if missing |
| DELETE | `/api/vehicles/:id` | admin | Delete vehicle | — | 403 for non-admin; 404 if missing |
| POST | `/api/vehicles/:id/purchase` | user | Buy one unit | — | 400 if out of stock; 404 if missing; atomic decrement |
| POST | `/api/vehicles/:id/restock` | admin | Add stock | `{ quantity }` (must be > 0) | 403 for non-admin; 400 on invalid quantity |

## Setup

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+ running locally, or Docker Desktop / Docker Engine

For the fastest local setup, this repository includes a development-only `docker-compose.yml` for PostgreSQL.

### 2. Clone the repository

```
git clone <your-repo-url>
cd car-dealership-inventory
```

### 3. Install backend dependencies

```
cd backend
npm install
```

### 4. Install frontend dependencies

```
cd ../frontend
npm install
```

### 5. Configure environment variables

```
cd ../backend
cp .env.example .env
# edit .env: set DATABASE_URL to your PostgreSQL connection string,
# and JWT_SECRET to a long random string
```

### 6. Set up PostgreSQL

#### Option A — Docker (recommended)

From the repository root:

```
docker compose up -d postgres
```

The included development database matches the default `DATABASE_URL` in `backend/.env.example`.

#### Option B — Local PostgreSQL

Create the database referenced in `DATABASE_URL`, e.g.:

```
createdb car_dealership
```

### 7. Run migrations

```
npm run migrate
```

### 8. Seed demo data

```
npm run seed
```

This creates ten demo vehicles (spanning normal/low/out-of-stock) and two **development-only** accounts:

- `admin@dealership.dev` / `Password123!` (ADMIN)
- `user@dealership.dev` / `Password123!` (USER)

Never use these credentials in a production deployment.

### 9. Start the backend

```
npm run dev
```

Runs on `http://localhost:4000` by default.

### 10. Start the frontend

In a new terminal:

```
cd frontend
npm run dev
```

Runs on `http://localhost:5173` by default. In development, Vite proxies `/api` requests to `http://localhost:4000`. For a separately hosted backend, set `VITE_API_URL` to the backend API base URL before building the frontend.

### 11. Run typechecks and builds

Backend:
```
cd backend
npm run typecheck
npm run build
```

Frontend:
```
cd frontend
npm run typecheck
npm run build
```

### 12. Run tests

Backend:
```
cd backend
cp .env.test.example .env.test   # point at a separate test database
npm test
npm run test:coverage
```

Frontend:
```
cd frontend
npm test
```

## Screenshots

<img width="560" height="560" alt="signin" src="https://github.com/user-attachments/assets/1f05bede-b8fd-4519-b4ce-294da6653018" />
<img width="560" height="560" alt="registration" src="https://github.com/user-attachments/assets/ed150e0b-2149-43d7-b8e3-ddd0b75152b9" />
<img width="1915" height="934" alt="dashboard" src="https://github.com/user-attachments/assets/b9cde11a-b0c9-4bea-a907-4f0879be601d" />
<img width="1919" height="901" alt="purchased" src="https://github.com/user-attachments/assets/72b6f4f9-44b3-4d93-80aa-f482fe7a3efe" />


## Testing

The backend suite uses Supertest to hit the real Express app and a real PostgreSQL test database — nothing is mocked at the database layer, so tests double as a check on schema constraints and the atomic purchase transaction. The frontend suite uses React Testing Library against user-visible behavior (what renders, what's enabled/disabled, what a click does), with the API layer mocked at the module boundary. See `TEST_REPORT.md` for the full scenario list and current execution status.

## My AI usage

This project was developed with ChatGPT (OpenAI) in a sandboxed development environment from a detailed master specification, followed by a repository audit/remediation pass (see `PROMPTS.md` for the AI-usage record).

- **What AI generated:** the initial backend, frontend, tests, and documentation directly from the project specification.
- **How outputs were reviewed:** the implementation was audited for authorization boundaries, validation, database constraints, atomic purchasing, UI states, and assignment coverage. Additional hardening was then applied to the generated project (including the development API proxy, production build configuration, session-expiry handling, JSON body-size limit, accessible dialogs, and build/typecheck configuration).
- **Verification status:** the execution environment used for this handoff does not have a running PostgreSQL instance and could not complete dependency installation, so **no test/build result is claimed as verified here**. `TEST_REPORT.md` deliberately records that limitation. The recipient should run the documented install, database, test, build, and manual UI verification steps before submission.

## Test report

See [`TEST_REPORT.md`](./TEST_REPORT.md).
