# ADR 0004: Vitest + Testing Library

- Status: accepted
- Datum: 2026-02-15

## Context

We willen snelle unit tests voor domeinlogica (plaatsing/rotatie/collision) en optioneel enkele UI smoke tests.

## Decision

- `vitest` als test runner.
- Testing Library + `jest-dom` voor React tests waar nodig.
- Default focus: pure domain unit tests zonder canvas afhankelijkheden.

## Consequences

- Snelle feedback loop.
- Domeinlogica blijft los testbaar.

## Alternatives considered

- Jest: prima, maar trager en minder Vite-native.
- Cypress/Playwright-only: te zwaar als basis voor domeinregels.
