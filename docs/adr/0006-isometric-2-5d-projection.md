# ADR 0006: Isometrische 2.5D projectie (bovenop orthogonaal domein)

- Status: accepted
- Datum: 2026-02-15

## Context

We willen de game visueel upgraden: huizen moeten er uitzien als gebouwtjes, en het geheel moet een isometrische “2.5D” stijl krijgen. Tegelijk willen we de bestaande scheiding behouden:

- Domeinregels (grid/placement/collision/rotatie) zijn pure functions in `src/domain/`.
- UI/canvas is “dumb”: het projecteert coördinaten en rendert shapes.

We renderen al met Konva (`react-konva`), met layers voor grid, placed en ghost.

## Decision

We implementeren een isometrische 2.5D projectie als pure helpers (projectie + inverse + depth key), en passen de Konva renderer aan om:\n
- grid cells als diamond tiles te tekenen\n
- bezette cells als eenvoudige isometrische kolommen (“gebouwtjes”) te tekenen\n
- cell-level depth sorting toe te passen\n
- pointer hit-testing via inverse isometrie te doen\n

Het domein blijft orthogonaal; alleen de UI vertaalt grid→screen en screen→grid.

## Consequences

- We krijgen een duidelijk pad naar “gebouwtjes” zonder 3D engine.
- Input mapping wordt complexer dan `floor(x/cellSize)`: we hebben inverse transform + diamond hit-test/nearest-cell correctie nodig.
- Depth sorting gebeurt op cell-level om artefacts bij concave shapes te vermijden.
- Performance kan iets slechter worden door meer polygonen; mitigatie is later batching (1 `Shape` per placement) indien nodig.

## Alternatives considered

- Echte 3D engine (Three.js/Babylon.js): visueel krachtig, maar veel grotere refactor (scene graph, camera, assets, input).
- Spritesheet-only isometric tiles: goede look, maar vereist asset pipeline en minder flexibel voor prototyping.
- Orthogonaal blijven: laag risico, maar mist de gewenste “gaafheid”.

