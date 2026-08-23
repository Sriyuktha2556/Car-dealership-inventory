# TEST_REPORT.md

## Test frameworks

- **Backend:** Vitest + Supertest, running against a real PostgreSQL test database (no mocking of the database layer — tests exercise actual SQL, constraints, and transactions).
- **Frontend:** Vitest + React Testing Library + jsdom.

## Verification commands

Backend typecheck/build:
```
npm run typecheck
npm run build
```

Frontend typecheck/build:
```
npm run typecheck
npm run build
```

## Test execution commands

Backend (from `backend/`):
```
cp .env.test.example .env.test   # point at a dedicated test database
npm install
npm run migrate                  # or let tests/setup.ts apply schema.sql automatically
npm test                         # runs vitest with NODE_ENV=test
npm run test:coverage            # same, with v8 coverage report
```

Frontend (from `frontend/`):
```
npm install
npm test
```

## ⚠️ Execution status: not yet run

This report was generated in a sandboxed build environment **without outbound network access**, so `npm install` could not fetch dependencies, no PostgreSQL server was available to connect to, and the test commands above have **not actually been executed** by the AI assistant that generated this codebase.

In keeping with the project's explicit requirement to never fabricate test results, this document does **not** report invented pass/fail counts or coverage percentages. Once you run `npm test` in each package locally, replace the section below with the real output (most CI setups can paste the terminal summary directly).

```
<-- PASTE REAL "npm test" OUTPUT HERE AFTER RUNNING LOCALLY -->
```

## What the test suites cover (by file)

### Backend — `backend/tests/`

| File | Scenarios |
|---|---|
| `auth.test.ts` | Successful registration; duplicate email rejected (409); invalid registration data rejected (400) with field errors; successful login; invalid credentials rejected (401); password/password_hash never present in any auth response; protected route rejects missing token (401); protected route rejects invalid token (401) |
| `vehicles.test.ts` | Admin can create a vehicle; normal user is rejected (403); invalid data (negative price) rejected (400); authenticated user can list inventory; case-insensitive search by make; search with no matches returns an empty array (not an error); admin can update a vehicle; normal user rejected (403) on update; update on missing vehicle returns 404; admin can delete; normal user rejected (403) on delete |
| `purchase.test.ts` | Successful purchase decreases quantity by exactly one; purchase rejected when quantity is zero (400); purchase on missing vehicle returns 404; unauthenticated purchase rejected (401); **two concurrent purchase requests against a vehicle with quantity 1 — exactly one succeeds, the other is rejected, and final quantity is 0** (verifies the atomic `UPDATE ... WHERE quantity > 0` transaction) |
| `restock.test.ts` | Admin restock increases quantity by the requested amount; non-positive restock quantity rejected (400); restock on missing vehicle returns 404; normal user rejected (403) |

### Frontend — `frontend/tests/`

| File | Scenarios |
|---|---|
| `LoginPage.test.tsx` | Empty-field validation message shown; form submits credentials and surfaces a login error from the API |
| `RegisterPage.test.tsx` | Field-level validation errors shown for short name, invalid email, short password, and mismatched confirm-password |
| `VehicleCard.test.tsx` | Renders make/model/price/stock-status badge; purchase button enabled when quantity > 0; purchase button disabled and labeled "Out of Stock" when quantity = 0; `onPurchase` fires on click; admin-only controls (edit/delete/restock) hidden for normal users and shown for admins |
| `DashboardPage.test.tsx` | Loading indicator shown while inventory request is in flight; vehicles render once loaded; empty state shown when no vehicles match; error state with a retry affordance shown on request failure; "Add vehicle" button hidden for a normal (non-admin) user |

## Known limitations

- No end-to-end (browser-driven) tests are included; frontend tests are component/integration level against a mocked API layer, and backend tests are integration level against a real database.
- JWT expiration is configured and enforced by `jsonwebtoken`/`jwt.verify`, but no test artificially waits out a token's expiry (impractical without a fake clock); token *invalidity* (malformed/garbage token) is tested directly instead.
- Coverage numbers are not included in this document for the reason stated above — they must come from a real `--coverage` run.
