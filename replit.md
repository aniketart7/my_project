# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## GitHub Sync & Branch Protection

Changes are automatically synced to https://github.com/aniketart7/MamaJourney after each merge via `scripts/sync-to-github.sh`, triggered by `scripts/post-merge.sh`.

**The `main` branch is protected:**
- Force-pushes to `main` are disabled on GitHub (branch protection rule enforced at the repository level).
- `scripts/sync-to-github.sh` also hard-blocks any force-push attempt targeting `main`, regardless of the `GITHUB_SYNC_FORCE` environment variable.
- `GITHUB_SYNC_FORCE` is set to `false` in the shared environment; it applies only to non-protected branches.

If the sync fails (e.g. due to a diverged history), the fix is to reconcile history locally — never force-push `main`.
