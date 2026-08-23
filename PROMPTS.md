# PROMPTS.md

This file records the AI prompts that were actually used during development, as required by the assignment's AI documentation policy. Do not replace this file with fabricated prompts or invented chat history. Before final submission, preserve the exact raw AI conversation/export or public chat links required by the assignment alongside this record if the evaluator requires the complete transcript.

## Prompt 1 — Master build specification

**Tool:** ChatGPT / OpenAI
**Date:** 2026-08-22/23
**Purpose:** Initial full-stack implementation specification.

The master specification instructed the AI to build a complete Car Dealership Inventory System from scratch using React + TypeScript + Vite + Tailwind on the frontend, Node.js + TypeScript + Express on the backend, PostgreSQL for persistence, JWT + bcrypt for authentication, and Vitest/Supertest/React Testing Library for tests. It required the assignment's complete authentication, authorization, vehicle CRUD, search, purchase, restock, TDD, responsive UI, documentation, Git, and AI-usage requirements, while explicitly prohibiting unnecessary features such as payment, cart, chatbot, analytics, CRM, and similar scope expansion.

The exact master prompt was supplied in the preceding ChatGPT conversation. For the final submission, retain the raw conversation/export or public chat link rather than treating this summary as a substitute when the assignment explicitly asks for raw AI logs.

## Prompt 2 — Repository audit and remediation

**Tool:** ChatGPT / OpenAI
**Date:** 2026-08-23
**User prompt (verbatim):**

> can you edit the files as you said 
after that you give the zipfile 
take your time and make it perfect

This instruction asked for the generated repository to be audited and edited rather than rebuilt, with the goal of making it submission-ready while preserving the assignment requirements and the project's minimal scope.

## Changes made during the audit/remediation

The repository was reviewed file-by-file. The following concrete fixes were applied:

- Fixed the backend TypeScript build configuration so production builds compile `src` only, while a separate `tsconfig.test.json` typechecks tests without a `rootDir` conflict.
- Fixed development API routing by adding a Vite `/api` proxy to the Express backend and changing the frontend API default to same-origin `/api`.
- Added `frontend/src/vite-env.d.ts` so Vite's `import.meta.env` types are available to TypeScript.
- Added a frontend `.env.example` for optional `VITE_API_URL` configuration.
- Added automatic frontend session cleanup when the backend returns HTTP 401 for an authenticated request.
- Hardened persisted authentication-state parsing before restoring a session from localStorage.
- Added an Express JSON request-size limit.
- Fixed query validation so validated query data is updated in place instead of replacing Express's `req.query` getter property.
- Hardened registration against concurrent duplicate-email inserts by handling PostgreSQL unique-constraint error `23505` as HTTP 409.
- Whitelisted vehicle update fields before constructing dynamic SQL.
- Added semantic dialog roles/labels for vehicle, restock, and delete dialogs.
- Improved toast accessibility by using an assertive alert role for errors.
- Added a small global CSS baseline for mobile width, body margin/background, and form-control font inheritance.
- Added a development-only PostgreSQL Docker Compose service for faster local setup.
- Updated README setup instructions, development proxy behavior, verification commands, screenshots guidance, and AI-usage/verification wording.
- Updated `TEST_REPORT.md` to distinguish test coverage design from actual execution and added explicit typecheck/build verification commands.

## Verification limitation

This editing environment did not have a running PostgreSQL server and dependency installation could not complete because package-registry access was unavailable. Therefore this handoff intentionally does **not** claim that the test suite or production builds have passed. The repository documents the exact commands that must be run locally before submission.

Do not fabricate test counts, coverage percentages, screenshots, or Git history. The final evaluator-facing submission should contain the actual outputs from those checks.
