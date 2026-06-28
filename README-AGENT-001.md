# Agent-001: Repository Audit - README

This directory contains a minimal MVP scaffold for Agent-001 (repository audit).

How to run (local dev assumptions):

- Node 18+ recommended
- Install dependencies: `npm install`
- Dev: `npm run dev` (Next.js)
- Typecheck: `npm run typecheck` (runs `tsc --noEmit`)
- Tests: `npm test`

API:
- POST /api/audit — body: { "rootPath": "./" } returns { reportId }
- View report: /reports/{reportId}

Notes:
- This is an initial scaffold. The scanner and dependency graph are conservative stubs
  intended to be replaced with robust AST-based parsing in future iterations.
