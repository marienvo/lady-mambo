# ADR 0001: Vite + React + TypeScript + pnpm

- Status: accepted
- Datum: 2026-02-15

## Context

We bouwen een browser game met canvas rendering en veel iteratieve UI/interaction. We willen snelle dev-feedback, simpele deploy, en sterke type-safety.

## Decision

- Vite als bundler/dev server.
- React als UI framework.
- TypeScript als taal.
- pnpm als package manager.
- Node.js 24+ als runtime baseline.

## Consequences

- Snelle HMR en lage setup-complexiteit.
- Geen SSR by default (SPA); later kan routing/desync erbij als nodig.

## Alternatives considered

- Next.js (SSR/route conventions): meer complexiteit, nu niet nodig.
- npm/yarn: prima alternatieven, pnpm is sneller en space-efficient.
