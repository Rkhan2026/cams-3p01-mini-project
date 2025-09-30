# Project TODO

This file mirrors the tracked TODO list and is saved at the project root so it's visible in the editor.

- [ ] Report Generation for TPO Admin

  - Add report generation/export feature for TPO admins.
  - Create backend route to export CSV (and optionally PDF) of placements/approvals (suggest: `api/tpo/reports/route.js`).
  - Add UI in TPO dashboard to request and download reports (e.g., `app/(dashboards)/tpo/approvals/page.js` or a new `reports` page).
  - Acceptance criteria: ability to generate and download CSV (and optionally PDF) for a selected date range or filters.
  - Notes: prefer CSV first as low-risk and fast to implement. Use existing Prisma client in `lib/prisma.js`.

- [ ] Minor UI/UX fixes & consistency

  - Address small visual and UX issues across the app for consistent spacing, colors, labels and accessible controls.
  - Inspect `components/` and `ui/` primitives (`Button.jsx`, `Input.jsx`, `Label.jsx`, `Card.jsx`) and `globals.css`.
  - Fix inconsistent button sizes, label capitalization, form spacing, and provide ARIA where missing.
  - Acceptance criteria: a small batch of consistent style updates + short changelog entry listing files changed.

- [ ] Split long pages into components

  - Refactor long pages into smaller, reusable components for readability and reuse.
  - Targets: `app/auth/login/page.js`, `app/(dashboards)/recruiter/*/page.js`, `app/jobs/page.js`, `app/(dashboards)/student/*`.
  - Create new component files in `components/` or `components/<feature>/` and import them into pages.
  - Acceptance criteria: each refactor keeps behavior identical and reduces page file length; add one unit test for a refactored component where applicable.

- [ ] Add unit tests, integration, system & user acceptance testing
  - Add/expand tests

---
