# ADR 0002: Konva (via react-konva) als rendering layer

- Status: accepted
- Datum: 2026-02-15

## Context

De game heeft een grid en veel “cells/pixels” per huis. We willen snelle rendering, eenvoudige hit-testing, en een duidelijke scheiding tussen domeinregels en rendering.

## Decision

We gebruiken `konva` met `react-konva` voor canvas rendering.

## Consequences

- Rendering blijft in React componenten, maar game-regels blijven in pure domain functies.
- We krijgen makkelijk layers (grid, placed, ghost), en pointer events op stage/layers.

## Alternatives considered

- Pure `<canvas>`: meer low-level boilerplate (events, transforms, redraw).
- SVG: minder geschikt voor grotere aantallen shapes/cells.
