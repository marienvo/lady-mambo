# Spec: House shapes (cells + rotatie + pivot)

## Context

Een “huis” is een shape bestaande uit meerdere grid-cellen (“pixels”). Shapes moeten roteerbaar zijn en netjes snappen op het grid.

## Goals

- Shape definitie als set relatieve cellen.
- Rotatie in stappen van 90 graden.
- (Optioneel) pivot per shape voor intuïtieve rotatie.

## Non-goals

- Arbitrary rotation (geen 15° etc).
- Scaling/skew.

## Data model

- `HouseShape`:\n - `id: string`\n - `cells: Cell[]` (relatief)\n - `pivot?: Cell` (relatief)\n\n- `Placement`:\n - `shapeId`\n - `anchor`\n - `rotation: 0|90|180|270`

## Edge cases

- Shapes met negatieve cell coordinates (mag, zolang placement uiteindelijk binnen bounds valt).
- Pivot buiten shape (mag, maar moet expliciet zijn).

## Test plan

- Unit tests voor `rotateCells` met verschillende pivots.\n
