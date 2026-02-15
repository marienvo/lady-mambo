# Spec: Grid placement (snap + validatie + ghost)

## Context

De speler plaatst “huizen” op een grid. Een huis bestaat uit meerdere cellen (“pixels”) die exact op het grid moeten snappen. Half buiten het grid plaatsen mag niet.

Zie ook:

- ADR 0002: Konva rendering layer
- ADR 0003: Zustand state management
- ADR 0004: Vitest + Testing Library

## Goals

- Snap naar dichtstbijzijnde grid cell op hover/drag.
- Ghost preview toont direct valid/invalid.
- Commit placement alleen als valid.

## Non-goals

- Pathfinding, economy, saving/loading.

## UX / Interactie

- Pointer move: bereken `anchorCell` uit stage coord → grid coord.
- Ghost preview:
  - groen: `canPlace.ok === true`
  - rood: `canPlace.ok === false` (reason zichtbaar voor debug)
- Click / drop: alleen plaatsen als `canPlace.ok === true`.

## Data model

- `Grid` met `{ width, height }`
- `HouseShape` met relatieve `cells` en optionele `pivot`
- `Placement` met `{ shapeId, anchor, rotation }`

## Edge cases

- Buiten grid: invalid (ook als slechts 1 cell buiten valt).
- Overlap met bestaande placements: invalid.
- Rotatie rond pivot: blijft consistent.

## Test plan

- Unit tests:
  - `isWithinBounds` en `canPlace` (out_of_bounds).
  - collision detection.
  - rotatie + absolute mapping.
