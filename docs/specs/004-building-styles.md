# Spec: Building styles (House / Church / Office) on same footprint

## Context

We renderen shapes op een grid (orthogonaal domein) en projecteren dit in de UI naar isometrische 2.5D. Momenteel wordt elke bezette cell als een identieke “kolom” getekend. We willen dat de drie beschikbare vormpjes visueel als echte gebouw-types voelen, terwijl ze exact dezelfde footprint/collision behouden.

## Goals

- Drie building archetypes met herkenbare 3D structuur:
  - **House**: lager gebouw met “dak” gevoel (hoogte-variatie richting midden/ridge).
  - **Church**: basis + 1 duidelijke toren/steeple + spire detail.
  - **Office**: uniform hoger volume met flat roof.
- Footprint blijft 1-op-1: de set `cells` bepaalt nog steeds placement/collision en de renderer wijzigt dat niet.
- Building style is metadata per shape (UI/rendering-only), zodat domeinregels unchanged blijven.

## Non-goals

- Nieuwe domeinregels (rotatie/collision/bounds blijven gelijk).
- Spritesheets/asset pipeline; v1 blijft vector/polygon shapes in Konva.
- Per-cell “sub-grid” details (ramen etc.) behalve hele lichte suggestie via shading.

## UX / Interactie

- Ghost preview gebruikt dezelfde building style als de geselecteerde shape, maar met lagere opacity en rood bij invalid.
- Select/rotate/plaats behavior is ongewijzigd.

## Data model

- `HouseShape` (domein): ongewijzigd.
- `ShapeMeta` (UI): krijgt een extra `building` veld:
  - `kind: 'house' | 'church' | 'office'`
  - Render parameters (zoals basis hoogte schaal) zijn renderer-impl details.

### Invariants (wat mag nooit gebeuren)

- Renderer verandert nooit de daadwerkelijke bezette cells; alleen visualisatie.
- Placement validatie gebeurt uitsluitend via `canPlace` in `src/domain/`.
- Building styles zijn optioneel en hebben een sane default (fallback) zodat onbekende shapes nog renderen.

## Edge cases

- Pivot kan ontbreken: kerk-toren kiest dan “meest centrale” cell.
- Pivot kan buiten de shape liggen: toren kiest dichtstbijzijnde bezette cell.
- Rotaties: building details moeten mee roteren (door mee te liften op `absoluteCells` + absolute pivot mapping).

## Test plan

- Unit tests (domein): geen nieuwe domeinregels.
- Smoke:
  - `pnpm typecheck`
  - `pnpm test`
  - Handmatig: place/rotate alle 3 shapes en check dat ghost + placed consistent blijft.

