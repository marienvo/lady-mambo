# ADR 0005: ESLint (flat config) + Prettier

- Status: accepted
- Datum: 2026-02-15

## Context

We willen consistente formatting en nuttige lint checks zonder bikeshedding. TypeScript code moet type-aware gelint worden.

## Decision

- ESLint met flat config (`eslint.config.js`).
- Type-aware linting via `typescript-eslint` en een dedicated `tsconfig.eslint.json`.
- Prettier is de enige formatter; ESLint conflicten worden uitgezet via `eslint-config-prettier`.

## Consequences

- Eenduidige style, kleine diff’s.
- Lint blijft snel en relevant.

## Alternatives considered

- Alleen Prettier: mist semantische checks.
- TSLint: deprecated.
