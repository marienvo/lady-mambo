# Spec: Isometric 2.5D rendering (Konva)

## Context

We renderen de game momenteel als orthogonaal grid met `Rect`s op een Konva `Stage`. We willen dat huizen er meer uitzien als gebouwtjes en het hele spel een isometrische 2.5D look krijgt, zonder echte 3D engine. Domeinregels (grid/placement/collision/rotatie) blijven orthogonaal en pure in `src/domain/`.

Zie ook:

- ADR 0002: Konva rendering layer
- ADR 0006: Isometric 2.5D projectie

## Goals

- Hele game renderen in isometrische 2.5D projectie (diamond tiles).
- Huizen renderen als “gebouwtjes”: per bezette cell een kleine isometrische kolom (top + 2 zijvlakken) in de shape-kleur.
- Correcte depth sorting zodat tiles/kolommen elkaar visueel juist overlappen.
- Pointer→grid mapping blijft intuïtief: hover/ghost/snapping werkt zoals voorheen.
- Domein blijft leidend: `canPlace`/collision/rotatie gedrag verandert niet.

## Non-goals

- Echte 3D (meshes, camera rotation, lights/shadows).
- Spritesheets/asset pipeline (kan later, maar v1 gebruikt vector/polygon shapes).
- Arbitrary rotation of scaling.

## UX / Interactie

- Pointer move:
  - Map stage pointer positie (screen/iso) terug naar een grid-cell met inverse isometrie.
  - Houd de bestaande pivot-correctie aan: cursor “staat” ongeveer op de shape pivot.
- Ghost preview:
  - Render de ghost in dezelfde isometrische stijl, met lagere opacity.
  - Kleur:
    - groen/blauw (shape kleur): `canPlace.ok === true`
    - rood: `canPlace.ok === false`
- Click:
  - Plaats alleen als `canPlace.ok === true` (ongewijzigd).

## Data model

Ongewijzigd (orthogonaal domein):

- `Grid`: `{ width, height }`
- `HouseShape`: `{ id, cells, pivot? }`
- `Placement`: `{ shapeId, anchor, rotation }`

Nieuwe (pure) projectie-helpers:

- `IsoMetrics`: tile breedte/hoogte + column hoogte
- `gridToIsoCenter(Cell, IsoMetrics) -> Point`
- `isoToGridFloat(Point, IsoMetrics) -> { x: number; y: number }`

### Invariants (wat mag nooit gebeuren)

- Rendering/UI bevat geen placement/collision regels (die blijven in `src/domain/`).
- `canPlace` resultaat bepaalt altijd de valid/invalid status (UI is “dumb”).
- Pointer mapping mag geen out-of-bounds cellen genereren door NaN/Infinity (clamp/guards).

## Edge cases

- Pointer op tile randen/hoeken:
  - afrondingspolicy moet stabiel zijn (geen “flikkeren” tussen buurcellen).
  - als de pointer net buiten een diamond valt, kies de best passende buurcell.
- Grid centering:
  - isometrische bounds verschillen van orthogonale bounds; offsets moeten op basis van projected bounds.
- Depth sorting:
  - concave shapes: sorteer op cell-level, niet alleen placement-level.

## Test plan

- Unit tests (pure domain):
  - `gridToIsoCenter` en `isoToGridFloat` roundtrip (met tolerantie) voor meerdere cellen.
  - Depth key order: monotone volgorde op `x+y`, tie-breaker consistent.
  - Diamond hit-test helper (als we die pure maken) voor randgevallen.
- UI smoke (optioneel):
  - `CanvasStage` rendert zonder crash en verwerkt hover update (jsdom + Konva beperkingen).

