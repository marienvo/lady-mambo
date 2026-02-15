# ADR 0003: Zustand voor state management

- Status: accepted
- Datum: 2026-02-15

## Context

We hebben interactieve state (selected shape, hover/ghost placement, placed houses) en willen een kleine, voorspelbare store zonder boilerplate.

## Decision

We gebruiken `zustand` voor app/game state.

## Consequences

- Kleine API, weinig ceremony.
- We houden state serializable en laten validatie gebeuren via pure domain functies.

## Alternatives considered

- React Context + reducers: kan, maar groeit snel in boilerplate.
- Redux Toolkit: krachtig, maar voor deze scope zwaarder dan nodig.
