# Spec: Touch support + editing (select / move / delete)

## Context

De game ondersteunt nu placement via muis (hover + click) op een Konva `Stage`, maar werkt nog niet prettig op telefoon. Daarnaast missen editing-acties zoals selecteren, verplaatsen en verwijderen van geplaatste gebouwen.

We willen dit toevoegen zonder de architectuur te breken:

- Domeinregels (grid/placement/collision/rotatie) blijven pure functies in `src/domain/`.
- UI/canvas blijft “dumb”: het rendert state en vertaalt pointer→grid.

Zie ook:

- ADR 0002: Konva rendering layer
- Spec 001: Grid placement

## Goals

- Touch input werkt op mobiel (tap/drag) via pointer events.
- Een geplaatste building is **selecteerbaar** met tap/click.
- Een expliciete **Place** toggle (aan/uit):
  - **Aan**: taps plaatsen buildings (met ghost + `canPlace`).
  - **Uit**: taps selecteren buildings; drag = move.
- Toolbar-acties (ook op desktop):
  - **Delete**: geselecteerd item verwijderen (disabled by default).
- Bestaande placement flow blijft werken: ghost preview + snap + validatie via `canPlace`.

## Non-goals

- Pan/zoom camera controls (fixed view).
- Multi-touch gestures (pinch etc.).
- Nieuwe domeinregels; only editing/wiring.

## UX / Interactie

### Pointer model

- We behandelen “pointer” als **mouse + touch** (unified).
- Bij touch voorkomen we browser default gedrag op het canvas (scroll/zoom) via `touch-action: none`.

### Selecteren

- Alleen wanneer **Place uit** staat:
  - Tap/click op een tile die door een placement bezet is → selecteer die placement.
  - Tap/click op lege tile → deselect.
- Selectie blijft behouden totdat:
  - user op andere placement tapt/clickt, of
  - user `Delete` gebruikt, of
  - user `Clear` gebruikt (alles weg).

### Move

- Alleen wanneer **Place uit** staat:
  - Tap+drag (touch of mouse) op een geselecteerde building verplaatst die
  - Er verschijnt een ghost van de geselecteerde building op de candidate anchor
  - Release (pointer up) commit de move **alleen als** `canPlace.ok === true`
  - Bij invalid release: move wordt geannuleerd (state blijft zoals het was)
- Tijdens move wordt collision-check gedaan met occupied cells **exclusief** het item dat verplaatst wordt.

### Delete

- `Delete` knop verwijdert de geselecteerde placement (disabled by default).
- Na delete is er geen selectie.

## Data model

### Domein (pure)

- Nieuwe pure helper voor selectie/hit-test op grid-cell:
  - “placement onder cell \(x,y\)” → `placementId | null`
- Invariants:
  - UI gebruikt `absoluteCells(shape, placement)` als bron voor footprint.
  - `canPlace` blijft de enige autoriteit voor valid/invalid.

### UI / state

- Store houdt bij:
  - `placeEnabled`
  - `selectedPlacementId`
  - `interaction`/move state (armed/dragging/candidate)

## Edge cases

- Tap op tile-randen: pointer→cell mapping blijft stabiel (volgt bestaande `pointerToCellIso`).
- Move naar out-of-bounds of collision: ghost rood, commit faalt en move cancel.
- Shape ontbreekt: selectie helper negeert onbekende shapeId (veilig).

## Test plan

- Unit tests (pure domain):
  - “cell→placementId” helper vindt juiste placement voor footprint met rotatie.
  - helper return `null` bij lege cell.
- Smoke (handmatig):
  - mobiel: tap place, tap select, move drag/drop, delete
  - desktop: hover ghost blijft werken (Place aan), click place, Place uit: select/drag-to-move/delete

